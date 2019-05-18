import DialogSession, { IDialogSession, DialogStatus } from "../../models/DialogSession";
import User from "../../models/User";

import validate from "../middleware/validate";
import { IWsApiRoute } from "../middleware/api";

export const leave: IWsApiRoute = {
  middlware: [],
  execute: async ({ socket, error, success }) => {
    const { id } = socket.user;
    const user = await User.findById(id).exec();
    if (!user.dialogId) throw error(403, "you are not in dialog");
    await User.findOneAndUpdate({ _id: id }, { dialogId: null }).exec();
    socket.emit("dialog.closed");
    success();
    // const { id } = socket.user;
    // const user = await User.findById(id).exec();
    // // throw "tst";
    // if (user.dialogId) throw error(403, "already in dialog");

    // const dialogDoc: IDialogSession = { status: DialogStatus.SEARCH };
    // const dialog = await DialogSession.create(dialogDoc);
    // socket.join("dialog-" + dialog.id);
    // await User.findOneAndUpdate({ _id: id }, { dialogId: dialog.id }).exec();

    // return { dialogId: dialog.id };
  }
};

export const search: IWsApiRoute = {
  middlware: [validate({ key: "test" })],
  execute: async ({ socket, error, success }) => {
    const { id } = socket.user;
    const user = await User.findById(id).exec();
    // throw "tst";
    if (user.dialogId) throw error(403, "already in dialog");

    const dialogDoc: IDialogSession = { status: DialogStatus.SEARCH };
    const dialog = await DialogSession.create(dialogDoc);
    socket.join("dialog-" + dialog.id);
    await User.findOneAndUpdate({ _id: id }, { dialogId: dialog.id }).exec();

    success({ dialogId: dialog.id });
  }
};
// export  search;
