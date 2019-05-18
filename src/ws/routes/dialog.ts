import DialogSession, { IDialogSession, DialogStatus } from "../../models/DialogSession";
import User from "../../models/User";

import validateMw from "../middleware/validate";
import dialogMw from "../middleware/dialog";
import randomIdMw from "../middleware/randomId";

import { IWsApiRoute } from "../middleware/api";
import DialogMessage, { IDialogMessage } from "../../models/DialogMessage";

import * as joi from "joi";

export const leave: IWsApiRoute = {
  middlware: [randomIdMw, dialogMw],
  execute: async ({ socket, error, success, data }) => {
    const { id } = socket.payload;
    await User.findOneAndUpdate({ _id: id }, { dialogId: null }).exec();
    // socket.to("dialog-" + id).emit('dialog.messages.new');
    socket.leaveAll();
    success({ randomId: data.randomId });
  }
};

export const fetchMessages: IWsApiRoute = {
  middlware: [randomIdMw, dialogMw],
  execute: async ({ socket, error, success, data }) => {
    const { id, dialogId } = socket.payload;
    const messages = await DialogMessage.find({ dialogId }).exec();
    success({ randomId: data.randomId, messages });
    // await User.findOneAndUpdate({ _id: id }, { dialogId: null }).exec();
    // success({ randomId: data.randomId });
  }
};

export const sendMessage: IWsApiRoute = {
  middlware: [randomIdMw, dialogMw, validateMw({ message: joi.string() })],
  execute: async ({ socket, error, success, data }) => {
    const { id, dialogId } = socket.payload;
    const messageDoc: IDialogMessage = {
      dialogId: dialogId,
      message: data.message,
      time: Date.now(),
      userId: id as any,
      anonId: 110
    };
    const msg = await DialogMessage.create(messageDoc);
    // const messages = await DialogMessage.find({ dialogId: user.dialogId }).exec();
    success({ randomId: data.randomId, ...msg.toObject() });
    // await User.findOneAndUpdate({ _id: id }, { dialogId: null }).exec();
    // success({ randomId: data.randomId });
  }
};

export const search: IWsApiRoute = {
  middlware: [randomIdMw],
  execute: async ({ socket, error, success, data }) => {
    const { id } = socket.payload;
    const user = await User.findById(id).exec();
    // throw "tst";
    if (user.dialogId) throw error(403, "already in dialog");

    const dialogDoc: IDialogSession = { status: DialogStatus.SEARCH };
    const dialog = await DialogSession.create(dialogDoc);
    socket.join("dialog-" + dialog.id);
    await User.findOneAndUpdate({ _id: id }, { dialogId: dialog.id }).exec();

    success({ dialogId: dialog.id, randomId: data.randomId });
  }
};
// export  search;
