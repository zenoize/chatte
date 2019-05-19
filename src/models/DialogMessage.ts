import * as mongoose from "mongoose";

export interface IDialogMessage {
  //ID диалога
  dialogId: string;
  //ID анона, от лица которого отправляем
  anonId: number;
  //ID пользователя, если он отправил сообщение
  userId?: mongoose.Schema.Types.ObjectId;
  //Текст сообщения
  message: mongoose.Schema.Types.String;
  //Время
  time: number;
}

export interface IDialogMessageModel extends mongoose.Document, IDialogMessage {}

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
    type: Schema.Types.Number,
    required: true
  },
  message: {
    type: mongoose.Schema.Types.String,
    required: true
  },
  time: {
    type: Schema.Types.Number,
    default: Date.now()
  }
});

const DialogMessage: mongoose.Model<IDialogMessageModel> = mongoose.model<IDialogMessageModel>("DialogMessage", DialogMessageSchema);
export default DialogMessage;
