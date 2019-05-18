import { IReduxAction, ActionStatus } from "../types";

import axios from "axios";

export type MessageAuthor = "LEFT" | "RIGHT";

export type ChatMessageType = "USER_MESSAGE" | "SYSTEM_MESSAGE";

export interface ISendedMessage {
  author: MessageAuthor;
  text: string;
  // time: number;
  // type: ChatMessageType;
}

export interface IMessage extends ISendedMessage {
  // author: MessageAuthor;
  // text: string;
  _id: string;
  time: number;
  type: ChatMessageType;
  randomId: string;
  status: ActionStatus;
}

// export interface ISystemMessage {
//   type: ChatMess
// }

// const testMessages: IMessage[] = [
//   {
//     author: "LEFT",
//     text: "Йо!",
//     time: 0
//   }
// ];

export const loadMessages = () => (dispatch: any, getState: any, emit: any) => {
  dispatch({ type: "MESSAGES_FETCH" });
  emit("messages_fetch");
  // const state = getState();
  // dispatch({ type: "MESSAGES_FETCH_SUCCESS", payload: testMessages });
};

export const sendMessages = (messages: ISendedMessage[]) => (dispatch: any, getState: any, emit: any) => {
  emit(
    "messages_send",
    messages.map(m => {
      const msg: any = { ...m, randomId: Math.random().toString() };
      dispatch({ type: "MESSAGES_SEND", payload: msg });
      return msg;
    })
  );
  // dispatch({ type: "MESSAGES_SEND_SUCCESS", payload: messages });
};

export const changeAuthor = (newAuthor: MessageAuthor) => ({ type: "DIALOG_CHANGE_AUTHOR", payload: newAuthor });
