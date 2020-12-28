import React, {useEffect, useState} from "../../../web_modules/react.js";
import {Label, List, Placeholder} from "../../../web_modules/semantic-ui-react.js";
import {parseTime} from "../../utils/helpers.js";
import {decrypt} from "../../utils/crypto.js";
const Message = ({message, isOwn}) => {
  const {messageId, timestamp, text, user} = message;
  const {name, color} = user;
  const [decryptedText, setDecryptedText] = useState(null);
  useEffect(() => {
    setTimeout(() => {
      decrypt(text, "asd").then((msg) => {
        setDecryptedText(msg);
      });
    }, 1e3);
  }, []);
  return /* @__PURE__ */ React.createElement(List.Item, {
    key: messageId,
    className: `message-item ${isOwn ? "align-right" : "align-left"}`
  }, /* @__PURE__ */ React.createElement(List.Content, {
    className: "message-content"
  }, !isOwn && /* @__PURE__ */ React.createElement(Label, {
    color,
    horizontal: true
  }, name), /* @__PURE__ */ React.createElement("span", {
    className: "message-text"
  }, decryptedText || /* @__PURE__ */ React.createElement(Placeholder, null, /* @__PURE__ */ React.createElement(Placeholder.Paragraph, null, /* @__PURE__ */ React.createElement(Placeholder.Line, {
    length: "medium"
  }))))), /* @__PURE__ */ React.createElement(List.Description, {
    className: "message-time"
  }, parseTime(new Date(timestamp))));
};
export default Message;
