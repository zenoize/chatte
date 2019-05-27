import React from "react";
import { connect } from "react-redux";
import ChatContent from "./ChatContent";
import { fetchMessages, sendMessage, searchDialog, stopDialog, logIn } from "../store/actions/chatActions";
import Chat from "./Chat";
import { Input } from "reactstrap";
import Auth from "./Auth";
import ChatInfoBar from "./ChatInfoBar";

// const messages = []

class ChatInfoBarContainer extends React.Component<any> {
  // componentDidMount() {
  //   this.props.fetchMessages();
  // }

  logIn = (username: string, password: string) => {
    this.props.logIn(username, password);
    // this.setState({ loading: true });
    // setTimeout(() => {
    //   this.setState({ loading: false });
    // }, 3000);
  };

  render() {
    const { account } = this.props;
    return <ChatInfoBar />;
  }
}

const mapDispatchToProps = {
  // sendMessage,
  // searchDialog,
  // leaveDialog
  logIn
};
const mapStateToProps = (state: any) => ({
  // chat: state.chat,
  account: state.chat.account
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatInfoBarContainer);
