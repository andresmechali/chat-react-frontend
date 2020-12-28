import React from "../../../web_modules/react.js";
import SplitPane, {Pane} from "../../../web_modules/react-split-pane.js";
import "./styles.css.proxy.js";
import Users2 from "./Users.js";
import ChatBox2 from "./ChatBox.js";
const Chat = () => {
  return /* @__PURE__ */ React.createElement(SplitPane, {
    split: "vertical",
    defaultSize: 200,
    minSize: 150,
    primary: "first"
  }, /* @__PURE__ */ React.createElement(Pane, {
    className: "",
    style: {backgroundColor: "#fff"}
  }, /* @__PURE__ */ React.createElement(Users2, null)), /* @__PURE__ */ React.createElement(Pane, {
    className: ""
  }, /* @__PURE__ */ React.createElement(ChatBox2, null)));
};
export default Chat;
