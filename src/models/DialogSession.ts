import * as mongoose from "mongoose";

export enum DialogStatus {
  SEARCH,
  STOP,
  DIALOG
}

export interface IDialogSession {
  time?: number;
  status: DialogStatus;
  // userId?: mongoose.Schema.Types.ObjectId;
}

export interface IDialogSessionModel extends mongoose.Document, IDialogSession {}

const Schema = mongoose.Schema;
const DialogSessionSchema = new Schema({
  time: {
    type: Schema.Types.Number,
    default: Date.now()
  },
  status: {
    type: Schema.Types.Number,
    default: DialogStatus.STOP,

  }
  // userId: {
  //   type: Schema.Types.ObjectId,
  //   ref: "User",
  //   required: true
  // }
});

const DialogSession: mongoose.Model<IDialogSessionModel> = mongoose.model<IDialogSessionModel>("DialogSession", DialogSessionSchema);
export default DialogSession;
