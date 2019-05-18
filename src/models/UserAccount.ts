import * as mongoose from "mongoose";

export interface IUserAccount {
  username: string;
  password: string;
  userId: mongoose.Schema.Types.ObjectId;
}

export interface IUserAccountModel extends mongoose.Document, IUserAccount {}

const Schema = mongoose.Schema;
const UserAccountSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const UserAccount: mongoose.Model<IUserAccountModel> = mongoose.model<IUserAccountModel>("UserAccount", UserAccountSchema);
export default UserAccount;
