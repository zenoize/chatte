import React from "react";
import { connect } from "react-redux";
import ChatContent from "./ChatContent";
import { fetchMessages, sendMessage, searchDialog, leaveDialog } from "../store/actions/dialogActions";
import Chat from "./Chat";
import { Input } from "reactstrap";

// const messages = []

class ChatContainer extends React.Component<any> {
  // componentDidMount() {
  //   this.props.fetchMessages();
  // }
  render() {
    const { chat } = this.props;
    return (
      // <div className="h-100">
      <Chat sendMessage={this.props.sendMessage} searchDialog={this.props.searchDialog} leaveDialog={this.props.leaveDialog} />
      // </div>
    );
  }
}

const mapDispatchToProps = {
  sendMessage,
  searchDialog,
  leaveDialog
};
const mapStateToProps = (state: any) => ({
  chat: state.chat
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatContainer);
