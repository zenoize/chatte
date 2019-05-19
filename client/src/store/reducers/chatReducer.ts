import { IReduxAction, ActionStatus } from "../types";
import { IMessage } from "../../components/ChatContent";
import { Reducer, IInitialState, createState } from "../store";
import { DialogStatus } from "../../components/Chat";

const defaultState = () =>
  createState({
    history: {
      actions: ["fetch"],
      entity: { messages: [] as IMessage[] }
    },
    account: {
      actions: ["auth"],
      entity: {}
      // actions
    },
    dialog: {
      actions: ["create", "search"],
      entity: {}
      // actions
    }
    // stat
  });

const initialState: IInitialState = defaultState();

export default (s = initialState, action: any) => {
  switch (action.type) {
    case "ACCOUNT_LOGOUT":
      return defaultState();
    case "ACCOUNT_AUTH_LOADING":
      return new Reducer(s).status("account", "auth", "LOADING").state;
    case "ACCOUNT_AUTH_ERROR":
      return new Reducer(s).status("account", "auth", "ERROR").error("account", "auth", action.payload).state;
    case "ACCOUNT_AUTH_SUCCESS":
      return new Reducer(s)
        .status("account", "auth", "SUCCESS")
        .entity("account", ".", action.payload.user)
        .entity("dialog", ".", action.payload.dialog || {}).state;

    case "DIALOG_SEARCH_LOADING":
      return new Reducer(s).status("dialog", "search", "LOADING").entity("dialog", "status", DialogStatus.SEARCH).state;
    case "DIALOG_SEARCH_ERROR":
      return new Reducer(s).status("dialog", "search", "ERROR").error("dialog", "search", action.payload).state;
    case "DIALOG_SEARCH_SUCCESS":
      return new Reducer(s).status("dialog", "search", "SUCCESS").entity("dialog", "status", DialogStatus.DIALOG).state;

    case "DIALOG_STOP_SUCCESS":
      return new Reducer(s).status("dialog", "stop", "SUCCESS").entity("dialog", "status", DialogStatus.STOP).state;

    case "DIALOG_CREATE_LOADING":
      return new Reducer(s).status("dialog", "create", "LOADING").state;
    case "DIALOG_CREATE_ERROR":
      return new Reducer(s).status("dialog", "create", "ERROR").error("dialog", "create", action.payload).state;
    case "DIALOG_CREATE_SUCCESS":
      return new Reducer(s).status("dialog", "create", "SUCCESS").entity("dialog", "status", action.payload.dialogId).state;

    case "DIALOG_MESSAGES_FETCH_SUCCESS":
      return new Reducer(s).status("history", "fetch", "SUCCESS").entity("history", "messages", action.payload).state;
    case "DIALOG_MESSAGES_FETCH_LOADING":
      return new Reducer(s).status("history", "fetch", "LOADING").state;

    case "DIALOG_MESSAGES_SEND_LOADING":
      return new Reducer(s).status("history", "send", "LOADING").state;
    case "DIALOG_MESSAGES_SEND_SUCCESS":
      return new Reducer(s).status("history", "send", "SUCCESS").custom(s => {
        return {
          ...s,
          history: {
            ...s.history,
            entity: {
              ...s.history.entity,
              messages: [...s.history.entity.messages, { ...action.payload, type: "USER" }]
            }
          }
        };
      }).state;

    case "DIALOG_MESSAGES_NEW":
      return new Reducer(s).status("history", "send", "SUCCESS").custom(s => {
        return {
          ...s,
          history: {
            ...s.history,
            entity: {
              ...s.history.entity,
              messages: [...s.history.entity.messages, { ...action.payload, type: "USER" }]
            }
          }
        };
      }).state;
    default:
      return s;
  }
};
