import React from "react";
import "./styles.css";

// export type MessageAuthor = "LEFT" | "RIGHT";

export interface IInfoProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  // author: MessageAuthor;
  info: string;
  time: number;
}

class Info extends React.Component<IInfoProps> {
  render() {
    const { info, time } = this.props;
    let date = new Date(time);
    let hours = date.getHours().toString();
    hours = hours.length === 1 ? "0" + hours : hours;
    let minutes = date.getMinutes().toString();
    minutes = minutes.length === 1 ? "0" + minutes : minutes;

    return (
      <div {...this.props} className={`chat-info ${this.props.className || ""}`}>
        {/* <span className={`chat-message-content ${author === "LEFT" ? "chat-message-left" : "chat-message-right"}`}>{this.props.children}</span> */}
        <span className="chat-message-muted">{info}</span>
        <hr className="chat-info-division" />
        <span className="chat-message-muted">{`${hours}:${minutes}`}</span>
      </div>
    );
  }
}

export default Info;
