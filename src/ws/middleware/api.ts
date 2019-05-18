import * as socketIO from "socket.io";
import * as parser from "socket.io-parser";

type SocketError = {
  code: number;
  method?: string;
  msg?: string;
};

export const socketError: (code, err?: { method?: string; msg?: string }) => SocketError = (code, err) => ({ code, method: err && err.method, msg: err && err.msg });

export const sendError = (socket: socketIO.Socket, error?: SocketError) => {
  socket.emit("api_error", error);
};

export type ApiSocket = socketIO.Socket & { payload: { id: string; [key: string]: any } };
export type WsMiddleware<T = any> = (socket: ApiSocket, method: string, data: T) => Promise<any>;
export type SocketIOMiddleware = (packet: socketIO.Packet, next: (err?: any) => void) => void;

export interface IWsApi {
  [method: string]: IWsApiRoute;
}

export interface IWsApiRouteParams {
  data: any;
  socket: ApiSocket;
  error: (code: number, msg?: string) => SocketError;
  success: (data?: any) => void;
}

export interface IWsApiRoute {
  middlware: WsMiddleware[];
  execute: (params: IWsApiRouteParams) => Promise<any>;
}

const decoder = new parser.Decoder();

export const createMiddleware: (wsApi: IWsApi, socket: socketIO.Socket) => SocketIOMiddleware = (wsApi, socket) => async packet => {
  // decoder.
  try {
    const methodName = packet[0];
    const query = packet[1];
    const method = wsApi[methodName];
    if (!method) throw socketError(405, { msg: "method not defined", method: methodName });
    await Promise.all(method.middlware.map(m => m(socket as ApiSocket, methodName, query)));
    await method.execute({
      data: packet[1],
      socket: socket as any,
      error: (code, msg) => socketError(code, { msg, method: methodName }),
      success: data => socket.emit(methodName, data)
    });
    //     await method.execute(JSON.parse(p.data), socket);
  } catch (err) {
    sendError(socket, err && err.code ? err : { code: 400 });
  }
  // packet.forEach(async p => {
  //   try {
  //     const method = wsApi[p.type];
  //     if (!method) ;
  //     await Promise.all(method.middlware);
  //     await method.execute(JSON.parse(p.data), socket);
  //   } catch (err) {
  //     sendError(socket, err && err.code ? err : { code: 400 });
  //   }
  // });
};
