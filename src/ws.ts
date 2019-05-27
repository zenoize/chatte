import * as socketIO from "socket.io";

import { IWsApi, createMiddleware, ApiSocket } from "./ws/middleware/api";

import { create, leave, fetchMessages, sendMessage, search, stop } from "./ws/routes/dialog";
import { auth } from "./ws/routes/account";
import Bot from "./bot";
import User from "./models/User";
import DialogMessage, { IDialogMessage, DialogMessageType } from "./models/DialogMessage";
import DialogSession, { DialogStatus } from "./models/DialogSession";

// import dialog from "./middleware/ws/dialog";

const api: IWsApi = {
  "dialog.create": create,
  "dialog.search": search,
  "dialog.stop": stop,
  "dialog.leave": leave,
  "dialog.messages.fetch": fetchMessages,
  "dialog.messages.send": sendMessage,
  "account.auth": auth
};

export default async function ws(io: socketIO.Server) {
  const state = {
    io: io,
    bots: new Map<string, { bots: Bot[] }>(),
    bindBot: async (token: string[], dialogId: string) => {
      const bots = await Promise.all(
        token.map(async t => {
          const b = new Bot();
          await b.auth(t);

          // if (b.info.dialog.id) await DialogSession.findByIdAndUpdate(dialogId, { status: DialogStatus.DIALOG }).exec();
          // else await DialogSession.findByIdAndUpdate(dialogId, { status: DialogStatus.STOP }).exec();

          return b;
        })
      );

      if (bots.find(b => !b.info.dialog.id)) {
        await Promise.all(bots.map(b => b.leaveDialog()));
        await DialogSession.findById(dialogId)
          .update({ status: DialogStatus.STOP })
          .exec();
        io.to("dialog-" + dialogId).emit("dialog.stop");
      }

      // let dialog = false;

      bots.forEach(async (b, i) => {
        const pair = bots.find(bot => bot !== b);
        await b.leaveDialog().catch(() => {});
        b.chat.on("dialog.typing", e => {
          io.to("dialog-" + dialogId).emit("dialog.typing", { anonId: b.info.user.id });
          pair.setTyping(e.data.typing);
        });
        b.chat.on("messages.new", async e => {
          if (e.data.senderId !== b.info.user.id) {
            const msg = await pair.sendMessage(e.data.message);
          } else {
            if (!e.data.randomId.endsWith("lol"))
              io.to("dialog-" + dialogId).emit(
                "dialog.messages.new",
                await DialogMessage.create({
                  time: Date.now(),
                  anonId: e.data.senderId,
                  // user
                  dialogId,
                  message: e.data.message,
                  type: DialogMessageType.ANON
                } as IDialogMessage)
              );
          }
        });
        // b.chat.on("dialog.opened", () => {});
        b.chat.on("dialog.closed", async e => {
          await DialogSession.findById(dialogId)
            .update({ status: DialogStatus.STOP })
            .exec();
          await Promise.all(bots.map(b => b.leaveDialog().catch(() => {})));
          const msg: IDialogMessage = {
            anonId: b.info.user.id,
            dialogId,
            message: "Дебилы самоуничтожились.",
            type: DialogMessageType.SYSTEM,
            time: Date.now()
          };
          if (pair.info.dialog.id) io.to("dialog-" + dialogId).emit("dialog.messages.new", (await new DialogMessage(msg).save()).toObject());
          io.to("dialog-" + dialogId).emit("dialog.stop");
          // setTimeout(() => {
          //   if (bots.find(b => b.info.dialog.id)) return;
          //   io.emit("dialog.search");
          // }, 5000);
          // socket.leave("dialog-" + dialogId);
          // io.sockets.clients((err, clients) => {
          //   if (err) throw err;
          //   clients.forEach(c => io.sockets.sockets[c].leave("dialog-" + dialogId));
          // });
        });
      });
      return bots;
    }
  };

  const dialogs = await DialogSession.find().exec();

  const dialogBots = await Promise.all(
    dialogs.map(async (d: any, i) => {
      return [
        d._id.toString(),
        {
          bots: await state.bindBot(d.anonTokens, d._id.toString())
        }
      ];
    })
  );

  // io.em

  state.bots = new Map(dialogBots as any);

  io.on("connection", async (socket: ApiSocket) => {
    const apiMiddlware = createMiddleware(api, socket, state);
    socket.use(apiMiddlware);
  });
  // users.map(async (u:any) => {
  //   const bots = await u.dialogId.anonTokens.map(async t => {})
  //     // state.addBot(u.dialogId._id);

  //     // const bot = new Bot();
  //     // await bot.auth(t);
  //     // return bot;
  //   });
  // });

  // const botUsers = await Promise.all(
  //   users.map(async (u: any, i) => {
  //     return [
  //       u.dialogId._id,
  //       {
  //         bots: await Promise.all(
  //           u.dialogId.anonTokens.map(async t => {
  //             state.addBot(u.dialogId._id)

  //             // const bot = new Bot();
  //             // await bot.auth(t);
  //             // return bot;
  //           })
  //         )
  //       }
  //     ];
  //   })
  // );

  // state.bots = new Map(botUsers as any);
  // state.bots.forEach((bot, dialogId) => {
  //   bot.bots.forEach(async (b, i) => {
  //     await b.leaveDialog().catch(() => {});
  //     b.chat.on("messages.new", async e => {
  //       if (e.data.senderId !== b.info.user.id) {
  //         const msg = await bot.bots.find(bot => b !== bot).sendMessage(e.data.message);
  //       } else {
  //         io.to("dialog-" + dialogId).emit(
  //           "dialog.messages.new",
  //           await DialogMessage.create({ time: Date.now(), anonId: e.data.senderId, dialogId, message: e.data.message } as IDialogMessage)
  //           // await createMessage({
  //           //   anonId: e.data.senderId,
  //           //   time: Date.now(),
  //           //   dialogId: dialogId as any,
  //           //   message: e.data.message
  //           // })
  //         );
  //         // sendMessage.execute({ socket, error, success, data: { message: e.data.message, anonId: e.data.senderId } });
  //       }
  //     });
  //     b.chat.on("dialog.closed", async e => {
  //       await DialogSession.findByIdAndUpdate(dialogId, { status: DialogStatus.STOP });
  //       await Promise.all(bot.bots.map(b => b.leaveDialog().catch(() => {})));
  //       io.to("dialog-" + dialogId).emit("dialog.stop");
  //     });
  //   });
  // });

  // bindBot(socket);

  // socket.on('disconnected')

  // socket.payload.

  // users
}
