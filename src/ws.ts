import * as socketIO from "socket.io";
import * as socketioJwt from "socketio-jwt";

import auth from "./http/middleware/auth";
import User from "./models/User";
import DialogSession, { IDialogSession, DialogStatus } from "./models/DialogSession";
import * as joi from "joi";
import { socketError, sendError, IWsApi, createMiddleware } from "./ws/middleware/api";
// import validate from "./middleware/ws/validate";

import { search, leave, fetchMessages, sendMessage } from "./ws/routes/dialog";

// import dialog from "./middleware/ws/dialog";

const api: IWsApi = {
  "dialog.search": search,
  "dialog.leave": leave,
  "dialog.messages.fetch": fetchMessages,
  "dialog.messages.send": sendMessage
};

export default function ws(io: socketIO.Server) {
  // io.sockets.on("connection", s => {
  //   s.on("message", () => {
  //     console.log("message!");
  //   });
  // });
  // return io;
  io.sockets
    .on(
      "connection",
      socketioJwt.authorize({
        decodedPropertyName: "payload",
        secret: process.env.JWT_SECRET
      })
    )
    .on("authenticated", async socket => {
      const user = await User.findById(socket.payload.id).exec();
      if (!user) return sendError(socket, socketError(401, { msg: "user deleted" }));
      const apiMiddlware = createMiddleware(api, socket);
      socket.use(apiMiddlware);
      socket.on('dialog.search', () => {
        console.log('wuat');
      })
      // return handleWsApi(socket);
    });
}

const handleWsApi = (socket: socketIO.Socket & { userId: string }) => {
  // const { userId } = socket;
  // socket.use(packet => {
  //   packet.forEach(p => {});
  // });
  // try {
  //   socket.use()
  //   socket.on("dialog.search", async data => {
  //     const dialogDoc: IDialogSession = { status: DialogStatus.SEARCH };
  //     const dialog = await DialogSession.create(dialogDoc);
  //     socket.join("dialog-" + dialog.id);
  //     await User.findByIdAndUpdate(userId, { dialogId: dialog.id });
  //     return { dialogId: dialog.id };
  //   });
  //   socket.on("dialog.sendMessage", async data => {
  //     await validate(data, { message: joi.string() });
  //     // await inDialog()
  //   });
  // } catch (err) {
  //   sendError(socket, err && err.message && { msg: err.message, code: err.code || 400 });
  // }
  // });
};

//   socket.on("messages_send", async data => {
//     // const user = (await ChatUser.findById(socket.userId).exec()) as any;
//     // const docs = (await Promise.all(
//     //   data.map(msg => new ChatMessage({ sessionId: user.sessionId, type: "USER_MESSAGE", time: Date.now(), text: msg.text, author: msg.author, randomId: msg.randomId }).save())
//     // )) as any;
//     // const messages = (await ChatMessage.create(docs)) as any;
//     // io.sockets.emit("messages_new", messages.map(m => m.toObject()));
//   });

//   socket.on("messages_fetch", async data => {
//     // Model.populate?
//     // const user = await ChatUser.findById(socket.userId).exec();
//     // const messages = await ChatMessage.find({ sessionId: user.sessionId });
//     // socket.emit("messages_fetch", messages);
//   });
// });
// }
