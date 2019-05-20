import * as mongoose from "mongoose";

export enum DialogMessageType {
  USER,
  ANON,
  SYSTEM
}

export interface IDialogMessage {
  //ID диалога
  dialogId: string;
  //ID анона, от лица которого отправляем
  anonId?: number;
  //ID пользователя, если он отправил сообщение
  userId?: mongoose.Schema.Types.ObjectId;
  //Текст сообщения
  message: string;
  //Время
  time: number;
  type: DialogMessageType;
}

export interface IDialogMessageModel extends mongoose.Document, IDialogMessage {
  to: any;
}

const Schema = mongoose.Schema;
const DialogMessageSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  dialogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "DialogSession",
    required: true
  },
  anonId: {
    type: Schema.Types.Number
  },
  message: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  time: {
    type: Schema.Types.Number,
    default: Date.now()
  },
  type: {
    type: Schema.Types.Number,
    required: true
  }
});

const DialogMessage: mongoose.Model<IDialogMessageModel> = mongoose.model<IDialogMessageModel>("DialogMessage", DialogMessageSchema);
export default DialogMessage;
