import React from "react";
import { connect } from "react-redux";
import ChatContent from "./ChatContent";
import { fetchMessages, sendMessage, searchDialog, leaveDialog, logIn } from "../store/actions/chatActions";
import Chat from "./Chat";
import { Input } from "reactstrap";
import Auth from "./Auth";

// const messages = []

class AuthContainer extends React.Component<any> {
  // componentDidMount() {
  //   this.props.fetchMessages();
  // }

  logIn = () => {
    this.props.logIn("test", "test");
    // this.setState({ loading: true });
    // setTimeout(() => {
    //   this.setState({ loading: false });
    // }, 3000);
  };

  render() {
    const { account } = this.props;
    // const { loading } = this.state;
    return <Auth loading={account.status.auth === "LOADING"} logIn={this.logIn} />;
    // <div className="h-100">
    // <Chat sendMessage={this.props.sendMessage} searchDialog={this.props.searchDialog} leaveDialog={this.props.leaveDialog} />
    // </div>
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
)(AuthContainer);
