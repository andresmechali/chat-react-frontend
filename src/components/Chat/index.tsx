import React from "react";
import SplitPane, { Pane } from "react-split-pane";

import "./styles.scss";

import Users from "./Users";
import ChatBox from "./ChatBox";

const Chat = () => {
  return (
    <SplitPane split="vertical" defaultSize={200} minSize={150} primary="first">
      <Pane className="" style={{ backgroundColor: "#fff" }}>
        <Users />
      </Pane>
      <Pane className="">
        <ChatBox />
      </Pane>
    </SplitPane>
  );
};

export default Chat;
