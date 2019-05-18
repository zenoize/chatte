import { WsMiddleware, socketError } from "./api";
import * as joi from "joi";

const middleware: WsMiddleware = async (socket, method, data) => {
  if (!data.randomId) throw socketError(400, { method, msg: "random id required" });
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
