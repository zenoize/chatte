import React from "react";
import { Spinner } from "reactstrap";

export interface IMessage {
  type: "USER" | "SYSTEM";
  message: string;
  author: number;
  time: number;
}

export interface IChatContentProps {
  messages: IMessage[];
  loading?: boolean;
  users: number[];
}

export default class ChatContent extends React.Component<IChatContentProps> {
  render() {
    const { messages, users, loading } = this.props;
    const maxId = users.sort((a, b) => (a > b ? 1 : -1))[0];
    return (
      <div className="chat-content">
        {loading ? (
          <Spinner color="primary" className="m-auto" />
        ) : (
          messages.map((m, i) =>
            m.type === "SYSTEM" ? <ChatSystemMessage key={i} from={m.author === maxId} message={m} /> : <ChatUserMessage key={i} from={m.author === maxId} message={m} />
          )
        )}
      </div>
    );
  }
}

const ChatUserMessage = (props: { message: IMessage; from: boolean }) => (
  <div className={"chat-message chat-message-" + (props.from ? "from" : "to")}>
    <span className="chat-message-content">{props.message.message}</span>{" "}
    <small className="chat-message-time">{new Date(props.message.time).toTimeString().split(/:..\s+/)[0]}</small>
  </div>
);

const ChatSystemMessage = (props: { message: IMessage; from: boolean }) => (
  <div className="chat-system-message">
    <small className="mx-auto justify-self-center">{props.message.message}</small>
    <hr className="w-100 my-1" />
    <small className="mx-auto">{new Date(props.message.time).toTimeString().split(/:..\s+/)[0]}</small>
  </div>
);
