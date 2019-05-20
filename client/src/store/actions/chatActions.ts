// import { IReduxAction, ActionStatus } from "../types";

import axios from "axios";
import { IMessage } from "../../components/ChatContent";
import { DialogMessageType } from "../reducers/chatReducer";

export const sendMessage = (message: string, anonId: number) => (dispatch: any, getState: any, emit: any) => {
  const msg: IMessage = {
    anonId,
    message,
    time: Date.now(),
    type: DialogMessageType.USER
  };
  const randomId = Date.now();
  dispatch({ type: "DIALOG_MESSAGES_SEND_LOADING", payload: { ...msg, randomId } });
  emit("dialog.messages.send", { ...msg, randomId });
};

export const setToken = (token: string) => {
  sessionStorage.setItem("auth-token", token);
  return { type: "ACCOUNT_AUTH_SUCCESS", payload: token };
};

export const logIn = (username: string, password: string) => async (dispatch: any, getState: any, emit: any) => {
  try {
    dispatch({ type: "ACCOUNT_AUTH_LOADING" });
    const res = await axios.get("/api/account/auth", { params: { username, password } });
    sessionStorage.setItem("auth-token", res.data.token);
    emit("account.auth", {
      token: res.data.token
    });
    // dispatch({ type: "ACCOUNT_AUTH_SUCCESS", payload: res.data });
  } catch (err) {
    dispatch({ type: "ACCOUNT_AUTH_ERROR", payload: { status: err.response.status, ...err.response.data } });
    console.log("action error:", err);
  }
};
// export const fetchMessages = () => (dispatch: any, getState: any, emit: any) => {
//   dispatch({ type: "DIALOG_MESSAGES_FETCH" });
//   emit("dialog.messages.send", { randomId: Math.random() });
// };

export const searchDialog = () => (dispatch: any, getState: any, emit: any) => {
  dispatch({ type: "DIALOG_SEARCH_LOADING" });
  emit("dialog.search", { randomId: Math.random() });
};

export const createDialog = () => (dispatch: any, getState: any, emit: any) => {
  dispatch({ type: "DIALOG_CREATE_LOADING" });
  emit("dialog.create", { randomId: Math.random() });
};

export const leaveDialog = () => (dispatch: any, getState: any, emit: any) => {
  dispatch({ type: "DIALOG_STOP_LOADING" });
  emit("dialog.stop", { randomId: Math.random() });
};

export const fetchMessages = () => (dispatch: any, getState: any, emit: any) => {
  dispatch({ type: "DIALOG_MESSAGES_FETCH_LOADING" });
  // dispatch({
  //   type: "DIALOG_HISTORY_FETCH_SUCCESS",
  //   payload: [
  //     {
  //       author: 110,
  //       content: "Я СООБщеНЯ СООБщеНие один!Я СООБщеНие один!Я СООБщеНие один!Я СООБщеНие один!ие один!",
  //       time: Date.now(),
  //       type: "USER"
  //     },
  //     { author: 111, content: "Я СООБщеНие два!", time: Date.now(), type: "SYSTEM" }
  //   ] as IMessage[]
  // });
  // setTimeout(() => {
  //   dispatch({ type: "DIALOG_HISTORY_FETCH_SUCCESS", payload: [{ author: "D", content: "Я СООБщеНие!", time: Date.now() }] as IMessage[] });
  // }, 2000);
  emit("dialog.messages.fetch", { randomId: Math.random() });
  // const state = getState();
  // dispatch({ type: "MESSAGES_FETCH_SUCCESS", payload: testMessages });
};

// export type MessageAuthor = "LEFT" | "RIGHT";

// export type ChatMessageType = "USER_MESSAGE" | "SYSTEM_MESSAGE";

// export interface ISendedMessage {
//   author: MessageAuthor;
//   text: string;
//   // time: number;
//   // type: ChatMessageType;
// }

// export interface IMessage extends ISendedMessage {
//   // author: MessageAuthor;
//   // text: string;
//   _id: string;
//   time: number;
//   type: ChatMessageType;
//   randomId: string;
//   status: ActionStatus;
// }

// // export interface ISystemMessage {
// //   type: ChatMess
// // }

// // const testMessages: IMessage[] = [
// //   {
// //     author: "LEFT",
// //     text: "Йо!",
// //     time: 0
// //   }
// // ];

// export const loadMessages = () => (dispatch: any, getState: any, emit: any) => {
//   dispatch({ type: "MESSAGES_FETCH" });
//   emit("messages_fetch");
//   // const state = getState();
//   // dispatch({ type: "MESSAGES_FETCH_SUCCESS", payload: testMessages });
// };

// export const sendMessages = (messages: ISendedMessage[]) => (dispatch: any, getState: any, emit: any) => {
//   emit(
//     "messages_send",
//     messages.map(m => {
//       const msg: any = { ...m, randomId: Math.random().toString() };
//       dispatch({ type: "MESSAGES_SEND", payload: msg });
//       return msg;
//     })
//   );
//   // dispatch({ type: "MESSAGES_SEND_SUCCESS", payload: messages });
// };

// export const changeAuthor = (newAuthor: MessageAuthor) => ({ type: "DIALOG_CHANGE_AUTHOR", payload: newAuthor });
