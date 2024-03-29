import { WsMiddleware, socketError } from "./api";
import * as joi from "joi";
import User from "../../models/User";
import * as jwt from "jsonwebtoken";

const middleware: WsMiddleware = async (socket, method, data) => {
  const payload = (socket.payload && socket.payload.token) || null;
  const token = (data && data.token) || payload;
  if (!token) throw socketError(403, { method, msg: "token required" });
  else
    try {
      const data = await new Promise((res, rej) => jwt.verify(token, process.env.JWT_SECRET, (err, data) => (err ? rej(err) : res(data))));
      socket.payload = { ...socket.payload, ...data, token: token };
    } catch (err) {
      throw socketError(400, { method, msg: "invalid token" });
    }

  // const user = await User.findById(socket.payload.id).exec();
  // if (!user.dialogId) throw socketError(400, { method, msg: "you are not in dialog" });
  // socket.payload.dialogId = user.dialogId;
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
