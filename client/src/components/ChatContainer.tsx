import React from "react";
import { connect } from "react-redux";
import ChatContent from "./ChatContent";
import { fetchMessages, sendMessage } from "../store/actions/dialogActions";
import Chat from "./Chat";
import { Input } from "reactstrap";

// const messages = []

class ChatContainer extends React.Component<any> {
  // componentDidMount() {
  //   this.props.fetchMessages();
  // }
  render() {
    // const { dialog } = this.props;
    return (
      // <div className="h-100">
      <Chat sendMessage={this.props.sendMessage} />
      // </div>
    );
  }
}

const mapDispatchToProps = {
  sendMessage
};
const mapStateToProps = (state: any) => ({
  // dialog: state.dialog
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatContainer);
