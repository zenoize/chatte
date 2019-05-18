import React from "react";
import { Spinner, Input, Button } from "reactstrap";
import ChatContentContainer from "./ChatContentContainer";
import ButtonGroup from "./ButtonGroup";

import { ArrowUp, Send, User, Settings } from "react-feather";
// import "../scss/chat.scss";

export interface IChatProps {
  loading?: boolean;
  sendMessage: (text: string) => void;
}

export default class Chat extends React.Component<IChatProps> {
  // renderChatContent() {
  //   const { loading } = this.props;
  //   if(loading)
  // }

  render() {
    const { loading } = this.props;
    return (
      // <div >
      loading ? (
        <Spinner />
      ) : (
        <div className="chat">
          <div className="chat-header">
            <Button size="sm" color="primary" className="rounded-pill p-1 my-auto">
              <Settings />
            </Button>
            <ButtonGroup className="ml-auto p-1">
              <Button color="danger" size="sm">
                Отключиться
              </Button>
              <Button color="primary" size="sm">
                Новый
              </Button>
            </ButtonGroup>
          </div>
          <ChatContentContainer />
          <div className="chat-footer">
            <Button className="rounded-pill mr-2 my-auto p-2" color="primary">
              <ArrowUp />
            </Button>
            <input className="input" placeholder="Введите сообщение" />
            <Button
              onClick={() => {
                this.props.sendMessage("hu");
              }}
              className="rounded-pill ml-2 my-auto p-2"
              color="primary"
            >
              <Send />
            </Button>
          </div>
        </div>
      )
      // </div>
    );
  }
}
