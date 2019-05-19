import * as socketIO from "socket.io";
import * as parser from "socket.io-parser";
import * as colors from "colors";
import Bot from "../../bot";

type SocketError = {
  code: number;
  method?: string;
  msg?: string;
};

export const socketError: (code, err?: { method?: string; msg?: string }) => SocketError = (code, err) => ({ code, method: err && err.method, msg: err && err.msg });

export const sendError = (socket: socketIO.Socket, error?: SocketError) => {
  socket.emit("api_error", error);
};

export type ApiSocket = socketIO.Socket & { payload: { bots?: Bot[]; dialogId?: string; id?: string; token?: string; [key: string]: any } };
export type WsMiddleware<T = any> = (socket: ApiSocket, method: string, data: T, state: any) => Promise<any>;
export type SocketIOMiddleware = (packet: socketIO.Packet, next: (err?: any) => void) => void;

export interface IWsApi {
  [method: string]: IWsApiRoute;
}

export interface IWsApiRouteParams {
  state: any;
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

export const createMiddleware: (wsApi: IWsApi, socket: ApiSocket, state: any) => SocketIOMiddleware = (wsApi, socket, state) => async packet => {
  const methodName = packet[0];
  const query = packet[1];
  const method = wsApi[methodName];

  const logError = (name: string, data: any) => {
    console.log(`${name}`, `--- ${methodName}\n`, data, "\n");
  };

  logError(colors.yellow("WS_METHOD"), query);
  try {
    if (!method) throw socketError(405, { msg: "method not defined", method: methodName });

    // socket.payload = {};

    await Promise.all(method.middlware.map(m => m(socket as ApiSocket, methodName, query, state)));
    await method.execute({
      state: state,
      data: packet[1],
      socket: socket as any,
      error: (code, msg) => socketError(code, { msg, method: methodName }),
      success: data => {
        logError(colors.green("WS_RESPONSE"), data);
        // console.log(`${colors.green("WS_RESPONSE")}`, `--- ${methodName}\n`, data, "\n");
        socket.emit(methodName, data);
      }
    });
    //     await method.execute(JSON.parse(p.data), socket);
  } catch (err) {
    logError(colors.red("WS_ERROR"), err);
    // console.log(`${colors.red("WS_ERROR")}`, `--- ${methodName}\n`, err, "\n");
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
