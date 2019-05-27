import React from "react";
import { connect } from "react-redux";
import ChatContent from "./ChatContent";
import { fetchMessages, sendMessage, searchDialog, stopDialog, createDialog } from "../store/actions/chatActions";
import Chat from "./Chat";
import { Input } from "reactstrap";

// const messages = []

class ChatContainer extends React.Component<any> {
  componentDidUpdate(prev: any) {
    const { chat } = this.props;
    if (chat.account.entity.dialogId && chat.history.status.fetch === "IDLE") this.props.fetchMessages();
  }
  componentDidMount() {
    const { chat } = this.props;
    if (chat.account.entity.dialogId && chat.history.status.fetch === "IDLE") this.props.fetchMessages();
  }
  render() {
    const { chat } = this.props;
    return (
      // <div className="h-100">
      // <div className="position-relative flex-g">
        <Chat
          // className=
          anonIds={chat.dialog.entity.anonIds}
          dialogStatus={chat.dialog.entity.status}
          sendMessage={this.props.sendMessage}
          searchDialog={this.props.searchDialog}
          createDialog={this.props.createDialog}
          stopDialog={this.props.leaveDialog}
        />
        
      // </div>
    );
  }
}

const mapDispatchToProps = {
  sendMessage,
  searchDialog,
  leaveDialog: stopDialog,
  fetchMessages,
  createDialog
};
const mapStateToProps = (state: any) => ({
  chat: state.chat
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatContainer);
