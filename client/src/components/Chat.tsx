import React from "react";
import { Spinner, Button } from "reactstrap";
import ChatContentContainer from "./ChatContentContainer";
import ButtonGroup from "./ButtonGroup";

import { ArrowUp, Send, User, Settings } from "react-feather";
import Input from "./Input";
import { ActionStatus } from "../store/types";
// import "../scss/chat.scss";

export enum DialogStatus {
  SEARCH,
  STOP,
  DIALOG
}

export interface IChatProps {
  loading?: boolean;
  dialogStatus?: DialogStatus;
  anonIds: number[];
  sendMessage: (text: string, anonId: number) => void;
  searchDialog: () => void;
  leaveDialog: () => void;
  createDialog: () => void;
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
    const { message, author } = this.state;
    const { anonIds } = this.props;
    if (/^\s*$/.test(message)) return;
    this.setState({ message: "" });
    this.props.sendMessage(message, anonIds[Number(author)]);
  };

  input = React.createRef<any>();

  changeAuthor = () => {
    const { author } = this.state;
    this.setState({ author: !author });
  };

  render() {
    const { loading, dialogStatus } = this.props;
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
            <Button
              size="sm"
              disabled={dialogStatus === DialogStatus.SEARCH}
              color={dialogStatus === DialogStatus.DIALOG ? "danger" : "primary"}
              className="rounded-pill ml-auto  my-1"
              onClick={dialogStatus === DialogStatus.DIALOG ? this.props.leaveDialog : this.props.searchDialog}
            >
              {(() => {
                switch (dialogStatus) {
                  case DialogStatus.SEARCH:
                    return (
                      <span>
                        Ищем.. <Spinner size="sm" />
                      </span>
                    );
                  case DialogStatus.DIALOG:
                    return "Отключиться";
                  case DialogStatus.STOP:
                    return "Новый";
                }
              })()}
            </Button>
            {/* <ButtonGroup className="ml-auto p-1">
              {dialogStatus &&
                (dialogStatus === DialogStatus.DIALOG && (
                  <Button onClick={this.props.leaveDialog} color="danger" size="sm">
                    Отключиться
                  </Button>
                ))}
              {/*  ( */}
            {/* {!dialogStatus ||
                (dialogStatus === DialogStatus.STOP && (
                  <Button
                    disabled={!dialogStatus && dialogStatus === DialogStatus.SEARCH}
                    onClick={dialogStatus ? this.props.searchDialog : this.props.createDialog}
                    color="primary"
                    size="sm"
                  >
                    )
                    {(() => {
                      switch (dialogStatus) {
                        case DialogStatus.SEARCH:
                          return (
                            <span>
                              Ищем.. <Spinner size="sm" />
                            </span>
                          );
                        default:
                          return "Новый";
                      }
                    })()}
                  </Button> */}
            {/* ))} */}
            {/* </ButtonGroup> */}
          </div>
          <ChatContentContainer />

          <div className="chat-footer">
            <Button
              onClick={e => {
                e.preventDefault();
                this.input.current.focus();
                this.changeAuthor();
              }}
              className="rounded-0 mr-2 text-primary"
              color="white"
              // color="primary"
            >
              <ArrowUp style={{ transition: "transform 200ms ease", transform: `rotate(${author ? 90 : -90}deg)` }} />
            </Button>
            <Input
              ref={this.input}
              name="message"
              onKeyDown={(e: any) => {
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
            {/* <input
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
            /> */}
            <Button
              onClick={() => {
                this.sendMessage();
                this.input.current.focus();
              }}
              className="rounded-0 ml-2 text-primary"
              color="white"
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
