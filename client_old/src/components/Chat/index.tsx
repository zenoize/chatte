import React from "react";
import "./styles.css";

import { User, ArrowRight, Send } from "react-feather";
import ButtonGroup from "../ButtonGroup";
import Button from "../Button";
import InputField from "../InputField";
import Message, { MessageAuthor } from "../Message";
import Info from "../Info";

import { connect } from "react-redux";
import { loadMessages, sendMessages, changeAuthor, IMessage, ISendedMessage } from "../../store/actions/dialogActions";
import ReactDOM from "react-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Scrollbars from "react-custom-scrollbars";

class TopBar extends React.Component {
  render() {
    const buttonStyle = {
      fontSize: "0.7em",
      // marginTop: "1.2em",
      // marginBottom: "1.2em"
      padding: "0.4em 1em 0.4em 1em"
      // maxHeight: "10opx"
    };

    return (
      <div className="chat-top-bar">
        <div className="chat-user">
          <User className="chat-user-icon" size={18} />
        </div>
        <ButtonGroup style={{ margin: "auto 0 auto auto" }}>
          <Button style={buttonStyle}>Новый</Button>
          {/* <Button style={buttonStyle}>Hello</Button> */}
          <Button style={buttonStyle}>Отключиться</Button>
        </ButtonGroup>
      </div>
    );
  }
}

interface IBottomBarProps {
  sendMessages: (message: ISendedMessage[]) => void;
  changeAuthor: (author: MessageAuthor) => void;
  author: MessageAuthor;
}

class BottomBar extends React.PureComponent<IBottomBarProps> {
  state = {
    input: ""
  };

  sendMessage = () => {
    const { input } = this.state;
    const { author } = this.props;

    if (!input || /^\s*$/.test(input)) return;

    this.props.sendMessages([{ author: author, text: input }]);
    this.setState({ input: "" });
  };

  changeAuthor = () => {
    const { author } = this.props;

    this.props.changeAuthor(author === "LEFT" ? "RIGHT" : "LEFT");
  };

  onChange = (e: any) => {
    // console.log("what");
    e.preventDefault();
    this.setState({ [e.target.name]: e.target.value });
  };

  render() {
    const { input } = this.state;
    const { author } = this.props;
    return (
      <div className="chat-bottom-bar">
        <Button
          onClick={e => {
            // e.preventDefault();
            // console.log(e.pre)
            this.changeAuthor();
          }}
          style={{ margin: "auto" }}
        >
          <ArrowRight style={{ display: "block", transition: "all 0.3s ease", transform: `rotate(${author === "RIGHT" ? 180 : 0}deg)` }} />
        </Button>
        {/* <form> */}
        <InputField
          // autocomplete="false"
          // ref={(e: any) => (this.inputField = e)}
          onKeyDown={e => {
            // console.log(key.keyCode);
            if (e.key === "Enter") this.sendMessage();
            if (e.key === "Tab") {
              e.preventDefault();
              this.changeAuthor();
            }
          }}
          name="input"
          value={input}
          onChange={this.onChange}
          placeholder="Введите сообщение"
          style={{ width: "100%" }}
          // autoFocus
        />
        <Button onClick={this.sendMessage} type="submit" style={{ margin: "auto" }}>
          <Send style={{ display: "block" }} />
        </Button>
        {/* </form> */}
      </div>
    );
  }
}

interface IChatContentProps {
  messages: IMessage[];
  author: MessageAuthor;
}

class ChatContent extends React.Component<IChatContentProps> {
  scroll = React.createRef<any>() as any;

  componentDidUpdate(prevProps: any) {
    // if (this.props.messages.length === prevProps.messages.length) return;
    // let lastMessage = this.lastMessage as any;
    // const node = ReactDOM.findDOMNode(lastMessage) as any;
    // if (node) node.scrollIntoView();
    if (this.scroll) this.scroll.scrollToBottom();
  }

  render() {
    const { messages, author } = this.props;
    // const { lastMessage } = this.state;
    // const messageList =
    return (
      // <div className="chat-content">
      <Scrollbars ref={e => (this.scroll = e as any)} autoHide autoHideTimeout={100} className="flex-grow-1 area">
        <TransitionGroup className="chat-content flex-grow-1" style={{ overflowX: "hidden" }}>
          {messages
            .sort((a, b) => (a.time > b.time ? 1 : -1))
            .map((m, i) => {
              // console.log(lastMessage);
              return (
                <CSSTransition
                  // classNames="chat-message"
                  key={i}
                  timeout={100}
                  classNames={{
                    enter: `chat-message-${m.author.toLowerCase()}-enter`,
                    enterActive: `chat-message-enter-active`
                  }}
                >
                  {m.type === "SYSTEM_MESSAGE" ? (
                    <Info time={m.time} info={m.text} key={i} />
                  ) : (
                    <Message status={m.status} type={m.type} text={m.text} randomId={m.randomId} time={m.time} author={m.author} _id={m._id}>
                      {m.text}
                    </Message>
                  )}
                </CSSTransition>
              );
            })}

          <div style={{ padding: "4px 10px 4px 10px", minHeight: "1em", display: "flex" }}>
            <span style={{ margin: "auto", marginLeft: "0", display: `${author === "RIGHT" ? "block" : "none"}` }} className="chat-message-muted chat-typing  chat-message-right">
              Пишет...
            </span>
            <span style={{ margin: "auto", marginRight: "0", display: `${author === "LEFT" ? "block" : "none"}` }} className="chat-message-muted chat-typing  chat-message-left">
              Пишет...
            </span>
          </div>
          {(() => {
            // if (this.lastMessage.current) {
            //   const node = ReactDOM.findDOMNode(this.lastMessage as any) as any;
            //   if (node) node.scrollIntoView();
            // }
            // return "";
          })()}
        </TransitionGroup>
      </Scrollbars>
      // </div>
    );
  }
}

class Chat extends React.Component<any> {
  componentDidMount() {
    const { loadMessages } = this.props;
    loadMessages();
  }
  render() {
    return (
      <div className="chat">
        <TopBar />
        <ChatContent author={this.props.author} messages={this.props.history.messages} />
        <BottomBar changeAuthor={this.props.changeAuthor} author={this.props.author} sendMessages={this.props.sendMessages} />
      </div>
    );
  }
}

const mapActionsToProps = { loadMessages, sendMessages, changeAuthor };
const mapStateToProps = (store: any) => ({ history: store.dialog.history, author: store.dialog.author });

export default connect(
  mapStateToProps,
  mapActionsToProps
)(Chat);
