import React from "react";
import "./styles.css";
import { ActionStatus } from "../../store/types";
import { IMessage } from "../../store/actions/dialogActions";
import { Spinner } from "react-bootstrap";
import { CSSTransition } from "react-transition-group";

export type MessageAuthor = "LEFT" | "RIGHT";

export interface IMessageProps extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, IMessage {
  author: MessageAuthor;
  status: ActionStatus;
  time: number;
  // type: any;
}

class Message extends React.Component<IMessageProps> {
  state = {
    mount: false
  };

  componentDidMount() {
    this.setState({ mount: true });
  }

  render() {
    const { status, author, time } = this.props;
    const { mount } = this.state;
    let date = new Date(time);
    let hours = date.getHours().toString();
    hours = hours.length === 1 ? "0" + hours : hours;
    let minutes = date.getMinutes().toString();
    minutes = minutes.length === 1 ? "0" + minutes : minutes;

    const sended = status === "SUCCESS";
    const loading = status === "LOADING";

    return (
      // <TransitionGroup className="chat-message">
      // <div cla ></div>

      <div {...this.props} className={`chat-message ${author === "LEFT" ? "chat-message-left" : "chat-message-right"} ${this.props.className || ""}`}>
        <span className={`chat-message-content ${author === "LEFT" ? "chat-message-left" : "chat-message-right"}`}>{this.props.children}</span>
        {/* <div className="bg-primary" >sdfsdf </div> */}
        {/* <Spinner animation="border" variant="primary" /> */}
        {/* {!sended && } */}
        <CSSTransition classNames="chat-message-status" in={sended} timeout={300}>
          <span className={"chat-message-muted"}>{sended ? `${new Date(time).toTimeString().split(/:..\s+/)[0]}` : <Spinner animation="border" size="sm" variant="primary" />}</span>
        </CSSTransition>
      </div>
      // </CSSTransition>
      // </TransitionGroup>
    );
  }
}

export default Message;
