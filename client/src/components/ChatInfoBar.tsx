import React from "react";
import { connect } from "react-redux";
import ChatContent from "./ChatContent";
import { fetchMessages, sendMessage, searchDialog, stopDialog, logIn } from "../store/actions/chatActions";
import Chat from "./Chat";
import Input from "./Input";
import Auth from "./Auth";
import { Search, MessageCircle, ArrowRight, Play, Meh, Bookmark } from "react-feather";
import { Button, Spinner } from "reactstrap";
import ButtonGroup from "./ButtonGroup";

// const messages = []

export interface IChatInfoBarProps {
  className?: string;
}

export default class ChatInfoBar extends React.Component<IChatInfoBarProps> {
  render() {
    // const { account } = this.props
    return (
      <div className={"chat-info-bar " + (this.props.className || "")}>
        <div className="d-flex">
          <Input placeholder="Введите комнату" />
          <Button color="white" className="ml-1 rounded-pill p-1 my-auto text-primary">
            <Search />
          </Button>
        </div>
        <ButtonGroup className="d-flex w-100" radius="5px">
          <Button color="primary" className="p-2">
            <Spinner size="sm" className="mx-1" />
            {/* <Play size="1rem" strokeWidth="4px" /> */}
            {/* <Bookmark size="1.5rem" strokeWidth="2px" className='text-white' /> */}
            {/* <Meh size="2rem" strokeWidth="2px" /> */}
          </Button>
          <Button color="primary" className="w-100 d-flex">
            <div>
              <small className="float-left">5 человек</small>
              <br />
              Районные дебилы
            </div>
            {/* </span> */}

            <ArrowRight size="1rem" className="ml-auto my-auto d-none d-lg-block" />
          </Button>
        </ButtonGroup>
        {/* <Button color="primary" outline className="d-flex w-100 my-1">
          Районные дебилы
          <ArrowRight size="1rem" className="ml-auto my-auto" />
        </Button> */}
      </div>
    );
  }
}
