import React from "react";
import { Spinner, Input, Button } from "reactstrap";
import ChatContentContainer from "./ChatContentContainer";
import ButtonGroup from "./ButtonGroup";

import { ArrowUp, Send, User, Settings } from "react-feather";
import { CSSTransition } from "react-transition-group";
// import "../scss/chat.scss";

export interface IAuthProps {
  loading: boolean;
  logIn: () => void;
}

export default class Auth extends React.Component<IAuthProps> {
  state = {};

  onChange = (e: any) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { loading } = this.props;
    return (
      <div className="auth-panel position-relative">
        <div>
          <span className="px-2">Никнейм</span>
          <div className="overflow-hidden">
            <input className="input" placeholder="Пупочкин" />
          </div>
          <span className="px-2">Пароль</span>
          <div className="overflow-hidden">
            <input className="input" placeholder="q*er*y" />
          </div>
        </div>
        <CSSTransition classNames="fade" in={loading} mountOnEnter unmountOnExit timeout={200} appear>
          <div className={"position-absolute w-100 h-100 d-flex"} style={{ top: 0, left: 0 }}>
            <Spinner color="primary" className="m-auto" style={{ zIndex: 1 }} />
          </div>
        </CSSTransition>

        <ButtonGroup className="d-flex justify-content-center">
          <Button onClick={this.props.logIn} className="d-flex py-2" color="primary">
            Войти
          </Button>
          <Button className="d-flex py-2" color="primary">
            Регистрация
          </Button>
        </ButtonGroup>
      </div>
    );
  }
}
