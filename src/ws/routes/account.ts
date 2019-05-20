import DialogSession, { IDialogSession, DialogStatus } from "../../models/DialogSession";
import User from "../../models/User";

import validateMw from "../middleware/validate";
import dialogMw from "../middleware/dialog";
import randomIdMw from "../middleware/randomId";
import authMw from "../middleware/auth";

import { IWsApiRoute } from "../middleware/api";
import DialogMessage, { IDialogMessage } from "../../models/DialogMessage";

import * as joi from "joi";
import Bot from "../../bot";
import UserAccount from "../../models/UserAccount";
// import { initBots } from "./dialog";

export const auth: IWsApiRoute = {
  middlware: [authMw],
  execute: async ({ socket, error, success, data, state }) => {
    const { id } = socket.payload;
    const user = await User.findById(id).exec();
    const account = UserAccount.findOne({ userId: id }).exec();

    // const tokens = ["99d259ba5236818074ebb85e436785b9d37bda765b39511004c44acb8d9ce213", "091788aeaddc9a9a3b055d110710ca99e138e6331d3ddef3099d7096e5390cce"];
    if (user.dialogId) {
      socket.join("dialog-" + user.dialogId.toString());
      var dialog = await DialogSession.findById(user.dialogId).exec();

      // const bots = state.bots.get(user.dialogId.toString());
      // if(bots.bots.find(b => b.))
      // socket.payload.bots = state
    }

    // // socket.to("dialog-" + id).emit('dialog.messages.new');
    // socket.leaveAll();

    const accountData = await account;
    socket.payload.username = accountData.username;
    success({
      user: { ...user.toObject(), username: accountData.username },
      dialog: { ...(dialog && dialog.toObject()), anonIds: dialog && state.bots.get(dialog.id.toString()).bots.map((b: Bot) => b.info.user.id) }
    });
  }
};

// export  search;
