import React from "react";
import { Spinner, Button } from "reactstrap";
import ChatContentContainer from "./ChatContentContainer";
import ButtonGroup from "./ButtonGroup";

import { ArrowUp, Send, User, Settings } from "react-feather";
import { CSSTransition } from "react-transition-group";
import Input from "./Input";
import { ActionStatus } from "../store/types";
// import "../scss/chat.scss";

export interface IAuthProps {
  error: any;
  status: ActionStatus;
  logIn: (username: string, password: string) => void;
}

export default class Auth extends React.Component<IAuthProps> {
  state = {
    password: "",
    username: "",
    errorMsg: null
  };

  timeout?: NodeJS.Timeout;

  componentDidUpdate(prev: any) {
    const { status } = this.props;
    if (prev.status !== "ERROR" && status === "ERROR") {
      this.setState({ errorMsg: "Долой неверных!" });
      this.timeout = setTimeout(() => {
        this.setState({ errorMsg: null });
      }, 1000);
    }
  }

  componentWillUnmount() {
    if (this.timeout) clearTimeout(this.timeout);
  }

  onChange = (e: any) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { status } = this.props;
    const { username, password, errorMsg } = this.state;
    return (
      <div className="auth-panel position-relative">
        <div>
          <span className="px-2">Никнейм</span>
          <Input type="username" onChange={this.onChange} value={username} name="username" placeholder="Пупочкин" />
          <span className="px-2">Пароль</span>
          <Input type="password" onChange={this.onChange} value={password} name="password" placeholder="qwery" />
        </div>
        <CSSTransition timeout={300} classNames="shrink" in={errorMsg !== null}>
          {/* <ButtonGroup className="d-flex justify-content-center"> */}
          <Button onClick={() => this.props.logIn(username, password)} className="d-flex py-2 px-5 rounded-pill mx-auto" color={errorMsg ? "danger" : "primary"}>
            {errorMsg ? errorMsg : "Войти"}
          </Button>
          {/* </ButtonGroup> */}
        </CSSTransition>
        <CSSTransition classNames="fade" in={status === "LOADING"} mountOnEnter unmountOnExit timeout={200} appear>
          <div className={"position-absolute w-100 h-100 d-flex"} style={{ top: 0, left: 0 }}>
            <Spinner color="primary" className="m-auto" style={{ zIndex: 1 }} />
          </div>
        </CSSTransition>
      </div>
    );
  }
}
