import * as mongoose from "mongoose";

export interface IUser {
  dialogId?: mongoose.Schema.Types.ObjectId;
}

export interface IUserModel extends mongoose.Document, IUser {}

const Schema = mongoose.Schema;
const UserAccountSchema = new Schema({
  dialogId: {
    type: Schema.Types.ObjectId
  }
});

const User: mongoose.Model<IUserModel> = mongoose.model<IUserModel>("User", UserAccountSchema);
export default User;
