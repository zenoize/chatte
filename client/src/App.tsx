import React from "react";
import ChatContent from "./components/ChatContent";
import ChatContentContainer from "./components/ChatContentContainer";
import ChatContainer from "./components/ChatContainer";
import AuthContainer from "./components/AuthContainer";
import { Switch, Route, Redirect } from "react-router";
import { connect } from "react-redux";
import { history } from "./store/store";
import ChatInfoBarContainer from "./components/ChatInfoBarContainer";
// import { Switch, Route, Redirect } from "react-router";
// import { connect } from "react-redux";
// // import { userAccountCheckToken } from "./store/actions/userActions

class App extends React.Component<any> {
  renderChatPage = () => {
    return (
      <div className="app">
        {/* <div className="d-flex"> */}
        <div className="row h-100 py-md-5">
          <ChatInfoBarContainer />
          <ChatContainer />
        </div>

        {/* </div> */}
      </div>
    );
  };

  renderAuthPage = () => {
    return (
      <div className="app">
        <AuthContainer />
      </div>
    );
  };

  render() {
    const { account } = this.props;
    return (
      <Switch>
        {/* <ChatContainer /> */}
        <Route
          path="/chat"
          component={() => {
            // this.withToken(ChatContainer);
            // const { account } = this.props;
            if (account.status.auth !== "SUCCESS") {
              history.push("/auth");
              return <div />;
            } else return this.renderChatPage();
          }}
        />
        <Route
          path="/auth"
          component={
            account.status.auth !== "SUCCESS"
              ? this.renderAuthPage
              : () => {
                  history.push("/chat");
                  return <div />;
                }
          }
        />
        <Route
          path="*"
          component={() => {
            return <Redirect to="/chat" />;
          }}
        />
        {/* <Route path="/auth" component={AuthContainer} /> */}
      </Switch>
    );
  }
  withToken(redirect: any) {
    const { account } = this.props;
    if (account.status.auth !== "SUCCESS") return () => <Redirect to="/auth" />;
    // history.push("/auth");
    return redirect;
  }
}

// const redirectIf = () => <Redi

// const redire

const mapStateToProps = (state: any) => ({
  account: state.chat.account
});

export default connect(mapStateToProps)(App);

// import querystring from "query-string";
// import axios from "axios";
// import { Spinner } from "reactstrap";
// // import Chat from "./components/Chat";

// // const baseUrl = process.env.PUBLIC_URL;

// class App extends React.Component<any> {
//   constructor(props: any) {
//     super(props);

//     // const token = sessionStorage.getItem("authToken");
//     // if (token) this.props.userAccountCheckToken(token);
//     // console.log("check");
//   }

//   componentDidUpdate(prevProps: any) {
//     // console.log("what");
//     // const { user } = this.props;
//     // if (user.statuses.account.auth === "SUCCESS") {
//     //   if (user.statuses.account.fetch === "IDLE") this.props.userAccountDataFetch();
//     //   if (user.statuses.profile.fetch === "IDLE") this.props.userProfileFetch();
//     //   if (user.statuses.data.fetch === "IDLE") this.props.userDataFetch();
//     // }

//     // console.log("OH NO");
//     // }
//   }
//   render() {
//     // const { user, router } = this.props;
//     // const accountStatus = user.statuses.account.auth;
//     // const { location } = router;
//     // const path = location.pathname + location.search;
//     // const query = querystring.parse(location.search);
//     return (
//       <div className="app align-items-stretch d-flex flex-column" style={{ minHeight: "100vh" }}>
//         <Switch>
//           <Route path="/" component={Chat}/>
//           {/* <Route path="/account/settings" component={accountStatus === "SUCCESS" ? UserProfilePage : AuthRequired(path)} />
//           <Route path="/account/verify" component={accountStatus === "SUCCESS" ? UserProfilePage : VerifyAccount(query, this.props.userAccountCheckToken)} />
//           <Route path="/user/responds" component={accountStatus === "SUCCESS" ? UserRespondList : AuthRequired(path)} />
//           <Route path="/account/auth" component={AuthPage} />
//           <Route path="/user/jobs" component={accountStatus === "SUCCESS" ? UserJobList : AuthRequired(path)} />
//           <Route path="/jobs" component={accountStatus === "SUCCESS" ? JobListPage : AuthRequired(path)} />
//           <Route path="/main" component={StartPage} /> */}
//           {/* <Route path="/" component={InvalidPage} /> */}
//         </Switch>
//         {/* <Footer /> */}
//       </div>
//     );
//   }
// }

// const InvalidPage = () => <Redirect to="/" />;

// const mapDispatchToProps = {
//   // userProfileFetch,
//   // userDataFetch,
//   // userAccountCheckToken,
//   // userAccountDataFetch
// };
// const mapStateToProps = (state: any) => ({
//   // user: state.user,
//   // router: state.router
// });

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(App);
