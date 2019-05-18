import React from "react";
import ChatContent from "./components/ChatContent";
import ChatContentContainer from "./components/ChatContentContainer";
import ChatContainer from "./components/ChatContainer";
// import { Switch, Route, Redirect } from "react-router";
// import { connect } from "react-redux";
// // import { userAccountCheckToken } from "./store/actions/userActions



export default class App extends React.Component {
  
  render() {
    return (
      <div className="app">
        <ChatContainer />
      </div>
    );
  }
}

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
