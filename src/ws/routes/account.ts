import DialogSession, { IDialogSession, DialogStatus } from "../../models/DialogSession";
import User from "../../models/User";

import validateMw from "../middleware/validate";
import dialogMw from "../middleware/dialog";
import randomIdMw from "../middleware/randomId";
import authMw from "../middleware/auth";

import { IWsApiRoute } from "../middleware/api";
import DialogMessage, { IDialogMessage } from "../../models/DialogMessage";

import * as joi from "joi";

export const auth: IWsApiRoute = {
  middlware: [authMw],
  execute: async ({ socket, error, success, data }) => {
    const { id } = socket.payload;
    // await User
    const user = await User.findById(id).exec();
    // // socket.to("dialog-" + id).emit('dialog.messages.new');
    // socket.leaveAll();
    success(user.toObject());
  }
};

// export  search;
