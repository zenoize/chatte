import { WsMiddleware, socketError } from "./api";
import * as joi from "joi";
import User from "../../models/User";

const middleware: WsMiddleware = async (socket, method, data, state) => {
  const user = await User.findById(socket.payload.id).exec();
  if (!user.dialogId) throw socketError(400, { method, msg: "you are not in dialog" });
  const bots = state.bots.get(user.dialogId.toString());

  socket.payload.bots = bots.bots;
  socket.payload.dialogId = user.dialogId.toString();
};

export default middleware;

// const validate = async (data: any, schema: joi.SchemaLike, params: joi.ValidationOptions = { convert: true, allowUnknown: true }) => {
//   const result = joi.validate(joi.object().keys(data), schema, params);
//   if (result.error) throw socketError(400, result.error.details[0].message);
//   else return result.value;
// };
