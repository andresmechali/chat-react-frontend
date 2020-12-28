import React, {
  useState,
  useContext,
  useEffect
} from "../../../web_modules/react.js";
import {
  List,
  Card,
  Input,
  Form,
  Ref,
  Header
} from "../../../web_modules/semantic-ui-react.js";
import {WSContext} from "../../utils/context.js";
import {encrypt} from "../../utils/crypto.js";
import {Code} from "../../types/types.js";
import Message2 from "./Message.js";
const ChatBox = () => {
  const [messageText, setMessageText] = useState("");
  const {ws, user, messages, passKey} = useContext(WSContext);
  const messagesRef = React.useRef(null);
  const handleMessageChange = (event, {value}) => {
    setMessageText(value);
  };
  useEffect(() => {
    if (messagesRef.current) {
      new MutationObserver((mutation) => {
        const {target} = mutation[0];
        target?.scroll({
          top: target?.scrollHeight,
          behavior: "smooth"
        });
      }).observe(messagesRef.current, {childList: true});
    }
  }, []);
  return /* @__PURE__ */ React.createElement(Card, {
    fluid: true,
    className: "message-wrapper"
  }, /* @__PURE__ */ React.createElement(Header, {
    as: "h3",
    className: "users-header"
  }, "Messages"), /* @__PURE__ */ React.createElement(Ref, {
    innerRef: messagesRef
  }, /* @__PURE__ */ React.createElement(List, {
    className: "message-list"
  }, messages.map((message) => {
    const isOwn = user.userId === message.user.userId;
    return /* @__PURE__ */ React.createElement(Message2, {
      key: message.messageId,
      message,
      isOwn
    });
  }))), /* @__PURE__ */ React.createElement(Card.Content, {
    extra: true
  }, /* @__PURE__ */ React.createElement(Form, {
    onSubmit: async (e) => {
      e.preventDefault();
      if (messageText === "") {
        return;
      }
      const event = {
        code: Code.MESSAGE,
        data: {
          message: {
            text: await encrypt(messageText, passKey),
            user,
            timestamp: new Date().toISOString()
          }
        }
      };
      ws.send(JSON.stringify(event));
      setMessageText("");
    }
  }, /* @__PURE__ */ React.createElement(Form.Field, {
    required: true
  }, /* @__PURE__ */ React.createElement(Input, {
    id: "messageText",
    value: messageText,
    placeholder: "Message",
    onChange: handleMessageChange,
    autoFocus: true,
    fluid: true,
    autoComplete: "off"
  })))));
};
export default ChatBox;
