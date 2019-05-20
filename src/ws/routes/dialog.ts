import DialogSession, { IDialogSession, DialogStatus } from "../../models/DialogSession";
import User from "../../models/User";

import validateMw from "../middleware/validate";
import dialogMw from "../middleware/dialog";
import randomIdMw from "../middleware/randomId";
import authMw from "../middleware/auth";

import { IWsApiRoute, ApiSocket } from "../middleware/api";
import DialogMessage, { IDialogMessage, DialogMessageType } from "../../models/DialogMessage";

import * as joi from "joi";
import Bot from "../../bot";
import UserAccount from "../../models/UserAccount";

export const leave: IWsApiRoute = {
  middlware: [authMw, randomIdMw, dialogMw],
  execute: async ({ socket, error, success, data }) => {
    const { id } = socket.payload;
    await Promise.all(socket.payload.bots.map(b => b.leaveDialog()));
    await User.findOneAndUpdate({ _id: id }, { dialogId: null }).exec();
    success({ randomId: data.randomId });
  }
};

// export const stop: IWsApiRoute = {
//   middlware: [authMw, dialogMw],
//   execute: async ({ socket, error, success, data, state }) => {
//     await Promise.all(state.bots.map(b => b.leaveDialog()));
//     success();

//     // const { id, dialogId } = socket.payload;
//     // const messages = await DialogMessage.find({ dialogId }).exec();
//     // success({ randomId: data.randomId, messages });
//     // await User.findOneAndUpdate({ _id: id }, { dialogId: null }).exec();
//     // success({ randomId: data.randomId });
//   }
// };

export const fetchMessages: IWsApiRoute = {
  middlware: [authMw, randomIdMw, dialogMw],
  execute: async ({ socket, error, success, data }) => {
    const { id, dialogId } = socket.payload;
    const messages = await DialogMessage.find({ dialogId }).exec();
    // const
    success({
      randomId: data.randomId,
      messages: await Promise.all(
        messages.map(async m => {
          return m.userId ? { ...m.toObject(), username: (await UserAccount.findOne({ userId: m.userId }).exec()).username } : m;
        })
      )
    });
    // await User.findOneAndUpdate({ _id: id }, { dialogId: null }).exec();
    // success({ randomId: data.randomId });
  }
};

export const sendMessage: IWsApiRoute = {
  middlware: [authMw, randomIdMw, dialogMw, validateMw({ message: joi.string(), anonId: joi.number() })],
  execute: async ({ socket, error, success, data, state }) => {
    const { id, dialogId, bots } = socket.payload;
    const { randomId } = data;
    const { io } = state;
    const senderBot = bots.find((b: Bot) => b.info.user.id === data.anonId) as Bot;
    if (!senderBot) throw error(404, "incorrect anonId");
    // const messages = await DialogMessage.find({ dialogId: user.dialogId }).exec();

    const dialog = await DialogSession.findById(dialogId).exec();

    if (dialog.status === DialogStatus.DIALOG) await senderBot.sendMessage(data.message, randomId.toString() + "lol");

    const msgDoc: IDialogMessage = { userId: id as any, dialogId: dialogId as any, message: data.message, time: Date.now(), anonId: data.anonId, type: DialogMessageType.USER };
    const msg = await new DialogMessage(msgDoc).save();

    // success({ randomId: data.randomId, ...msg.toObject() });
    // await User.findOneAndUpdate({ _id: id }, { dialogId: null }).exec();
    // success({ randomId: data.randomId });

    io.to("dialog-" + dialogId).emit("dialog.messages.send", { randomId: data.randomId, msg: { ...msg.toObject(), username: socket.payload.username } });
  }
};

// export const initBots = async (tokens: string[], dialogId: string, socket: ApiSocket) => {
//   const bots = await Promise.all(
//     tokens.map(async t => {
//       const b = new Bot(t);
//       await b.auth(t);
//       // if(!b.info.dialog)
//       return b;
//     })
//   );

//   if (bots.find(b => !b.info.dialog.id)) {
//     await DialogSession.findByIdAndUpdate(dialogId, { status: DialogStatus.STOP });
//     await Promise.all(bots.map(b => b.leaveDialog().catch(() => {})));
//     socket.to("dialog-" + dialogId).emit("dialog.stop");
//   }

//   bots.forEach(async (b, i) => {
//     await b.leaveDialog().catch(() => {});
//     b.chat.on("messages.new", async e => {
//       if (e.data.senderId !== b.info.user.id) {
//         const msg = await bots.find(bot => b !== bot).sendMessage(e.data.message);
//       } else {
//         socket.to("dialog-" + dialogId).emit(
//           "dialog.messages.new",
//           await createMessage({
//             anonId: e.data.senderId,
//             time: Date.now(),
//             dialogId: dialogId as any,
//             message: e.data.message
//           })
//         );
//         // sendMessage.execute({ socket, error, success, data: { message: e.data.message, anonId: e.data.senderId } });
//       }
//     });
//     b.chat.on("dialog.closed", async e => {
//       await DialogSession.findByIdAndUpdate(dialogId, { status: DialogStatus.STOP });
//       await Promise.all(bots.map(b => b.leaveDialog().catch(() => {})));
//       socket.to("dialog-" + dialogId).emit("dialog.stop");
//     });
//   });

//   // await DialogSession.findByIdAndUpdate(dialogId, { status: DialogStatus.STOP });

//   socket.payload.bots = bots;

//   return bots;
// };

export const search: IWsApiRoute = {
  middlware: [dialogMw, authMw],
  execute: async ({ socket, error, success, data, state }) => {
    const { dialogId, bots } = socket.payload;
    const { io } = state;

    const dialog = await DialogSession.findById(dialogId).exec();
    if (dialog.status !== DialogStatus.STOP) throw error(403, "you already in active dialog");

    await dialog.updateOne({ status: DialogStatus.SEARCH });

    io.to("dialog-" + dialogId).emit("dialog.search", dialog.toObject());

    // success(dialog);

    const search = async () => {
      await Promise.all(bots.map(b => b.leaveDialog().catch(() => {})));
      for (let b of bots) {
        await b.searchDialog().catch(() => {});
      }
      if (bots.find(b => !b.info.dialog.id)) await search(); //bots.map(b => b.searchDialog()));
    };
    await search();
    io.to("dialog-" + dialogId).emit("dialog.founded");
    dialog.updateOne({ status: DialogStatus.DIALOG }).exec();
    const searchCompleteMsg: IDialogMessage = {
      dialogId,
      message: "Дебилы найдены",
      type: DialogMessageType.SYSTEM,
      time: Date.now()
    };
    new DialogMessage(searchCompleteMsg).save().then(msg => {
      io.to("dialog-" + dialogId).emit("dialog.messages.new", msg.toObject());
    });
  }
};

export const stop: IWsApiRoute = {
  middlware: [dialogMw, authMw],
  execute: async ({ socket, error, success, data, state }) => {
    const { io } = state;
    const { dialogId, bots } = socket.payload;
    const dialog = await DialogSession.findById(dialogId).exec();
    if (dialog.status === DialogStatus.STOP) throw error(403, "dialog already stopped");

    await Promise.all([...bots.map(b => b.leaveDialog()), dialog.updateOne({ status: DialogStatus.STOP }).exec()]);

    const systemMsg: IDialogMessage = {
      dialogId,
      message: "Дебилы уничтожены.",
      type: DialogMessageType.SYSTEM,
      time: Date.now()
    };

    const msg = await new DialogMessage(systemMsg).save();
    io.to("dialog-" + dialogId).emit("dialog.messages.new", msg.toObject());

    // socket.to("dialog-" + dialogId).emit("dialog.stop");

    io.to("dialog-" + dialogId).emit("dialog.stop", { ...dialog.toObject(), status: DialogStatus.STOP });

    // success({ ...dialog.toObject(), status: DialogStatus.STOP });
  }
};

export const create: IWsApiRoute = {
  middlware: [authMw, randomIdMw],
  execute: async ({ socket, error, success, data, state }) => {
    const { id } = socket.payload;
    const user = await User.findById(id).exec();
    // throw "tst";
    if (user.dialogId) throw error(403, "you already in dialog");
    const tokens = ["6cb78450788e7f76d0ef33c5edf7e5393afed7634707d3844e51cb457a6429fd", "eed74ef374a50aed4c2abc9be63ea69f1307dc8b3742727209c9198620e574d4"];
    const dialogDoc: IDialogSession = {
      status: DialogStatus.STOP,
      anonTokens: tokens,
      anonIds: []
    };

    const dialog = await DialogSession.create(dialogDoc);

    socket.join("dialog-" + dialog.id);
    const bots = await state.bindBot(tokens, dialog.id);

    // const bots = await initBots(tokens, dialog.id, socket);
    const ids = bots.map(b => b.info.user.id);
    // await dialog.updateOne({ anonIds: ids }).exec();

    // socket.join("dialog-" + dialog.id);
    await User.findById(id)
      .update({ dialogId: dialog.id })
      .exec();

    state.bots.set(dialog.id.toString(), { bots });

    success({ dialog: { ...dialog.toObject(), anonIds: ids }, randomId: data.randomId });
  }
};
// export  search;
