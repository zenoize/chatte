import * as mongoose from "mongoose";

export enum DialogStatus {
  SEARCH,
  STOP,
  DIALOG
}

export interface IDialogSession {
  time?: number;
  status: DialogStatus;
}

export interface IDialogSessionModel extends mongoose.Document, IDialogSession {}

const Schema = mongoose.Schema;
const DialogSessionSchema = new Schema({
  time: {
    type: Schema.Types.Number,
    default: Date.now()
  },
  status: {
    type: Schema.Types.String,
    default: "STOP",
    validate: v => {
      return DialogStatus[v.toUpperCase()] !== undefined;
    }
  }
});

const DialogSession: mongoose.Model<IDialogSessionModel> = mongoose.model<IDialogSessionModel>("DialogSession", DialogSessionSchema);
export default DialogSession;
