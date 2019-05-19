import DialogSession, { IDialogSession, DialogStatus } from "../../models/DialogSession";
import User from "../../models/User";

import validateMw from "../middleware/validate";
import dialogMw from "../middleware/dialog";
import randomIdMw from "../middleware/randomId";
import authMw from "../middleware/auth";

import { IWsApiRoute, ApiSocket } from "../middleware/api";
import DialogMessage, { IDialogMessage } from "../../models/DialogMessage";

import * as joi from "joi";
import Bot from "../../bot";

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
    success({ randomId: data.randomId, messages });
    // await User.findOneAndUpdate({ _id: id }, { dialogId: null }).exec();
    // success({ randomId: data.randomId });
  }
};

export const sendMessage: IWsApiRoute = {
  middlware: [authMw, randomIdMw, dialogMw, validateMw({ message: joi.string(), anonId: joi.number() })],
  execute: async ({ socket, error, success, data }) => {
    const { id, dialogId, bots } = socket.payload;
    const senderBot = bots.find((b: Bot) => b.info.user.id === data.anonId) as Bot;
    if (!senderBot) throw error(404, "incorrect anonId");
    // const messages = await DialogMessage.find({ dialogId: user.dialogId }).exec();

    await senderBot.sendMessage(data.message);

    const msg = await new DialogMessage({ userId: id as any, dialogId: dialogId as any, message: data.message, time: Date.now(), anonId: data.anonId }).save();

    success({ randomId: data.randomId, ...msg.toObject() });
    // await User.findOneAndUpdate({ _id: id }, { dialogId: null }).exec();
    // success({ randomId: data.randomId });
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
  execute: async ({ socket, error, success, data }) => {
    const { dialogId, bots } = socket.payload;

    const dialog = await DialogSession.findById(dialogId).exec();
    if (dialog.status !== DialogStatus.STOP) throw error(403, "you already in active dialog");

    await dialog.updateOne({ status: DialogStatus.SEARCH });
    success(dialog);

    for (let b of bots) await b.searchDialog(); //bots.map(b => b.searchDialog()));
    dialog.updateOne({ status: DialogStatus.DIALOG });
    socket.emit("dialog.founded");
  }
};

export const stop: IWsApiRoute = {
  middlware: [dialogMw, authMw],
  execute: async ({ socket, error, success, data }) => {
    const { dialogId, bots } = socket.payload;
    const dialog = await DialogSession.findById(dialogId).exec();
    if (dialog.status === DialogStatus.STOP) throw error(403, "dialog already stopped");

    await Promise.all([...bots.map(b => b.leaveDialog()), dialog.updateOne({ status: DialogStatus.STOP }).exec()]);
    // socket.to("dialog-" + dialogId).emit("dialog.stop");

    success({ ...dialog, status: DialogStatus.STOP });
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
    await dialog.updateOne({ anonIds: ids }).exec();

    socket.join("dialog-" + dialog.id);
    await User.findOneAndUpdate({ _id: id }, { dialogId: dialog.id }).exec();

    state.bots.set(dialog.id.toString(), { bots });

    success({ dialogId: dialog.id, randomId: data.randomId });
  }
};
// export  search;
