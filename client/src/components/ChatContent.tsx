import React from "react";
import { Spinner } from "reactstrap";
import { DialogMessageType } from "../store/reducers/chatReducer";
import Scrollbars from "react-custom-scrollbars";
import { TransitionGroup, CSSTransition } from "react-transition-group";

export interface IMessage {
  type: DialogMessageType;
  message: string;
  anonId: number;
  time: number;
}

export interface IChatContentProps {
  _id?: string;
  messages: IMessage[];
  loading?: boolean;
  anonIds: number[];
  typing: number[];
}

export default class ChatContent extends React.Component<IChatContentProps> {
  scroll = React.createRef<any>();

  componentDidUpdate(prev: any) {
    const { messages } = this.props;
    if (prev.messages.length !== messages.length) {
      // const maxHeight = this.scroll.current.getScrollHeight();
      const { scrollHeight, scrollTop } = this.scroll.current.getValues();

      // const height = this.scroll.current.getScrollTop();
      if (scrollHeight - scrollTop <= 1000) this.scroll.current.scrollToBottom();
    }
    if (prev.loading && !this.props.loading) this.scroll.current.scrollToBottom();
  }

  componentDidMount() {}

  render() {
    const { messages, anonIds, loading, typing } = this.props;
    // loading = true;
    const maxId = anonIds.sort((a, b) => (a > b ? 1 : -1))[0];
    return (
      <Scrollbars ref={this.scroll} autoHide autoHideTimeout={300} autoHideDuration={300}>
        <div className="chat-content" style={{ minHeight: "100%" }}>
          {loading ? (
            <Spinner color="primary" className="m-auto" />
          ) : (
            <TransitionGroup>
              {messages.map((m, i) => (
                <CSSTransition key={m.time} timeout={300} classNames="bump">
                  {m.type === DialogMessageType.SYSTEM ? (
                    <ChatSystemMessage key={i} from={m.anonId === maxId} message={m} />
                  ) : (
                    <ChatUserMessage key={i} from={m.anonId === maxId} message={m} />
                  )}
                </CSSTransition>
              ))}
            </TransitionGroup>
          )}

          <div className={(loading ? "d-none" : "d-flex") + " mt-auto"}>
            <small className={"text-muted p-1 " + (!typing.includes(maxId) ? "invisible" : "")}>Пишет..</small>
            <small className={"text-muted p-1 ml-auto " + (!typing.includes(anonIds.find(i => i !== maxId) || NaN) ? "invisible" : "")}>Пишет..</small>
          </div>
        </div>
      </Scrollbars>
    );
  }
}

const ChatUserMessage = (props: { message: IMessage & { loading?: boolean; username?: string }; from: boolean }) => (
  <div className={"chat-message chat-message-" + (props.from ? "from" : "to")}>
    <span className="chat-message-content">{props.message.message}</span>
    <small className="chat-message-time">
      <CSSTransition in={!props.message.loading} timeout={100} classNames="bump">
        <div>
          {props.message.loading ? (
            <Spinner color="primary" size="sm" />
          ) : (
            new Date(props.message.time).toTimeString().split(/:..\s+/)[0] +
            (props.message.type === DialogMessageType.USER ? ` (${props.message.username ? props.message.username : "рофл"})` : "")
          )}
        </div>
      </CSSTransition>
    </small>
  </div>
);

const ChatSystemMessage = (props: { message: IMessage; from: boolean }) => (
  <CSSTransition timeout={300} classNames="bump">
    <div className="chat-system-message">
      <small className="mx-auto justify-self-center">{props.message.message}</small>
      <hr className="w-100 my-1" />
      <small className="mx-auto">{new Date(props.message.time).toTimeString().split(/:..\s+/)[0]}</small>
    </div>
  </CSSTransition>
);
