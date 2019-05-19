import React from "react";
import { connect } from "react-redux";
import ChatContent from "./ChatContent";
import { fetchMessages } from "../store/actions/chatActions";

class ChatContentContainer extends React.Component<any> {
  componentDidUpdate(prev: any) {
    const prevHistoryStatus = prev.history.status.fetch;
    const historyStatus = this.props.history.status.fetch;
    const prevAccountStatus = prev.account.status.auth;
    const accountStatus = this.props.account.status.auth;
    if (accountStatus === "SUCCESS" && prevAccountStatus !== "SUCCESS" && historyStatus !== "SUCCESS") this.props.fetchMessages();
  }
  render() {
    const { history, dialog } = this.props;
    return <ChatContent users={dialog.anonIds || []} messages={history.entity.messages} loading={history.status.fetch !== "SUCCESS"} />;
  }
}

const mapDispatchToProps = {
  fetchMessages
};
const mapStateToProps = (state: any) => ({
  history: state.chat.history,
  account: state.chat.account,
  dialog: state.chat.dialog
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatContentContainer);
