import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import dialogReducer from "./dialogReducer";
// import userReducer from "./userReducer";

export default (history: any) =>
  combineReducers({
    router: connectRouter(history) as any,
    dialog: dialogReducer
    // user: userReducer as any
  });
