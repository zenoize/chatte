import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import createRootReducer from "./reducers";

import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import { IReduxAction } from "./types";

import { init, emit } from "./websockets";

const initialState = {};

const composeEnchanters = composeWithDevTools({ trace: true, traceLimit: 25 });

export const history = createBrowserHistory();
const middleware = [thunk.withExtraArgument(emit), routerMiddleware(history)];

const store = createStore(createRootReducer(history), initialState, composeEnchanters(applyMiddleware(...middleware)));

// const store = createStore(createRootReducer(history), initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;

export function handleActionError(dispatch: any, action: string, err: any) {
  const error = err.response ? err.response.data : err;
  dispatch({ type: action, payload: error });

  console.log(`Action Error:`, error);
}

export interface IInitialState {
  statuses: {
    [key: string]: { [key: string]: "LOADING" | "SUCCESS" | "ERROR" | "IDLE" };
  };
  errors: {
    [key: string]: any | null;
  };
  entities: {
    [key: string]: any;
  };
}

export interface IStateSchema {
  [key: string]: string[];
}

export function createState(schema: IStateSchema): IInitialState {
  const initialState = {
    statuses: {} as any,
    errors: {} as any,
    entities: {} as any
  };
  for (let e in schema) {
    initialState.entities[e] = {};
    initialState.statuses[e] = {};
    initialState.errors[e] = {};
    for (let p of schema[e]) {
      initialState.errors[e][p] = null;
      initialState.statuses[e][p] = "IDLE";
    }
  }
  return initialState;
}

function getActionName(actionName: string) {
  const type = /[^_]+$/.exec(actionName);
  // console.log("ACTION", type);
  if (type) return type[0];
}

export function handleEntityReducer(state: any, action: IReduxAction, entityName: string, actionName: string) {
  switch (getActionName(action.type)) {
    case "ERROR":
      return handleErrorReducer(state, action.payload, entityName, actionName);
    case "SUCCESS":
      return {
        ...state,
        statuses: {
          ...state.statuses,
          [entityName]: {
            ...state.statuses[entityName],
            [actionName]: "SUCCESS"
          }
        },
        entities: {
          ...state.entities,
          [entityName]: action.payload
        }
      };
    case "LOADING":
      return handleLoadingReducer(state, entityName, actionName);
    default:
      return state;
  }
}

export function handleFetchReducer(state: any, action: IReduxAction, entityName: string) {
  return handleEntityReducer(state, action, entityName, "fetch");
}

export function handleErrorReducer(state: any, error: any, entityName: string, actionName: string) {
  return {
    ...state,
    statuses: {
      ...state.statuses,
      [entityName]: { ...state.statuses[entityName], [actionName]: "ERROR" }
    },
    errors: {
      ...state.errors,
      [entityName]: { ...state.errors[entityName], [actionName]: error }
    }
  };
}

export function handleLoadingReducer(state: any, entityName: string, actionName: string) {
  return {
    ...state,
    statuses: {
      ...state.statuses,
      [entityName]: {
        ...state.statuses[entityName],
        [actionName]: "LOADING"
      }
    }
  };
}
