import React from "react";
import { Spinner, Input, Button } from "reactstrap";
import ChatContentContainer from "./ChatContentContainer";
import ButtonGroup from "./ButtonGroup";

import { ArrowUp, Send, User, Settings } from "react-feather";
// import "../scss/chat.scss";

export interface IChatProps {
  loading?: boolean;
  sendMessage: (text: string) => void;
  searchDialog: () => void;
  leaveDialog: () => void;
}

export default class Chat extends React.Component<IChatProps> {
  // renderChatContent() {
  //   const { loading } = this.props;
  //   if(loading)
  // }
  state = {
    message: "",
    author: false
  };

  onChange = (e: any) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  sendMessage = () => {
    const { message } = this.state;
    this.setState({ message: "" });
    this.props.sendMessage(message);
  };

  changeAuthor = () => {
    const { author } = this.state;
    this.setState({ author: !author });
  };

  render() {
    const { loading } = this.props;
    const { message, author } = this.state;
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
              <Button onClick={this.props.leaveDialog} color="danger" size="sm">
                Отключиться
              </Button>
              <Button onClick={this.props.searchDialog} color="primary" size="sm">
                Новый
              </Button>
            </ButtonGroup>
          </div>
          <ChatContentContainer />
          <div className="chat-footer">
            <Button onClick={this.changeAuthor} className="rounded-pill mr-2 my-auto p-2" color="primary">
              <ArrowUp style={{ transition: "transform 200ms ease", transform: `rotate(${author ? 90 : -90}deg)` }} />
            </Button>
            <input
              name="message"
              onKeyDown={e => {
                if (e.key === "Enter") this.sendMessage();
                if (e.key === "Tab") {
                  e.preventDefault();
                  this.changeAuthor();
                }
              }}
              value={message}
              onChange={this.onChange}
              className="input"
              placeholder="Введите сообщение"
            />
            <Button onClick={this.sendMessage} className="rounded-pill ml-2 my-auto p-2" color="primary">
              <Send />
            </Button>
          </div>
        </div>
      )
      // </div>
    );
  }
}
