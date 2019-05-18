import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import chatReducer from "./chatReducer";
// import userReducer from "./userReducer";

export default (history: any) =>
  combineReducers({
    router: connectRouter(history) as any,
    chat: chatReducer
    // user: userReducer as any
  });
