import { WsMiddleware, socketError } from "./api";
import * as joi from "joi";
import User from "../../models/User";

const middleware: WsMiddleware = async (socket, method, data) => {
  const user = await User.findById(socket.payload.id).exec();
  if (!user.dialogId) throw socketError(400, { method, msg: "you are not in dialog" });
  socket.payload.dialogId = user.dialogId;
  // socket.user.
  // const result = joi
  //   .object()
  //   .keys(schema)
  //   .validate(data, { allowUnknown: true, convert: true });
  // if (result.error) throw socketError(400, { method, msg: "invalid" });
};

export default middleware;

// const validate = async (data: any, schema: joi.SchemaLike, params: joi.ValidationOptions = { convert: true, allowUnknown: true }) => {
//   const result = joi.validate(joi.object().keys(data), schema, params);
//   if (result.error) throw socketError(400, result.error.details[0].message);
//   else return result.value;
// };
