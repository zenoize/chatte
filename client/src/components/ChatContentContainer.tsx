import React from "react";
import { connect } from "react-redux";
import ChatContent from "./ChatContent";
import { fetchMessages } from "../store/actions/dialogActions";

class ChatContentContainer extends React.Component<any> {
  componentDidMount() {
    this.props.fetchMessages();
  }
  render() {
    const { history } = this.props;
    return <ChatContent users={[110, 111]} messages={history.entity.messages} loading={history.status.messagesFetch === "LOADING"} />;
  }
}

const mapDispatchToProps = {
  fetchMessages
};
const mapStateToProps = (state: any) => ({
  history: state.dialog.history
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChatContentContainer);
