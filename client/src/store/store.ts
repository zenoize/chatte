import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import createRootReducer from "./reducers";

import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { createBrowserHistory, Action } from "history";
import { routerMiddleware } from "connected-react-router";
import { IReduxAction, ActionType, ActionStatus } from "./types";

import { emit } from "./ws";

const initialState = {};

const composeEnchanters = composeWithDevTools({ trace: true, traceLimit: 25 });

export const history = createBrowserHistory();
const middleware = [thunk.withExtraArgument(emit), routerMiddleware(history)];

const store = createStore(createRootReducer(history), initialState, composeEnchanters(applyMiddleware(...middleware)));

export default store;

export function handleActionError(dispatch: any, action: string, err: any) {
  const error = err.response ? err.response.data : err;
  dispatch({ type: action, payload: error });

  console.log(`Action Error:`, error);
}

export interface IInitialState {
  [entity: string]: {
    entity: {
      [key: string]: any;
    };
    status: {
      [action: string]: ActionStatus;
    };
    error: {
      [action: string]: any;
    };
  };
}

export interface IStateSchema {
  [key: string]: { entity: any; actions: string[] };
}

export function createState(schema: IStateSchema): IInitialState {
  const initialState = {} as any;
  for (let e in schema) {
    initialState[e] = {
      entity: schema[e].entity
    };
    for (let p of schema[e].actions) {
      initialState[e].error = { ...initialState[e].error, [p]: null };
      initialState[e].status = { ...initialState[e].status, [p]: "IDLE" };
    }
  }
  return initialState;
}

function getActionName(actionName: string) {
  const type = /[^_]+$/.exec(actionName);
  if (type) return type[0];
}

export class Reducer {
  private _state: IInitialState = createState({});
  public get state() {
    return this._state;
  }
  constructor(state?: IInitialState) {
    if (state) this._state = state;
  }
  // handle(action: ActionType) {

  // }
  status(entity: string, action: string, status: ActionStatus) {
    const { _state: s } = this;
    this._state = { ...s, [entity]: { ...s[entity], status: { ...s[entity].status, [action]: status } } };
    return this;
  }
  error(entity: string, action: string, error: any) {
    const { _state: s } = this;
    this._state = { ...s, [entity]: { ...s.entity, error: { ...s[entity].error, [action]: error } } };
    return this;
  }
  entity(entity: string, path: string, data: any) {
    const { _state: s } = this;
    const e = s[entity].entity || {};
    let root = e;
    path.split(".").forEach((p, i, a) => {
      if (i === a.length - 1) return (root[p] = data);
      if (root[p] === undefined) root[p] = {};
      else root[p] = { ...root[p] };
      root = root[p];
    });
    this._state = { ...s, [entity]: { ...s[entity], entity: e } };
    return this;
  }
  custom(handle: (state: IInitialState) => IInitialState) {
    this._state = handle(this._state);
    return this;
  }
}
