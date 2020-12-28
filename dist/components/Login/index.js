import React, {useContext, useState} from "../../../web_modules/react.js";
import {
  Grid,
  Header,
  Form,
  Segment,
  Button,
  Message
} from "../../../web_modules/semantic-ui-react.js";
import {WSContext} from "../../utils/context.js";
import {encrypt} from "../../utils/crypto.js";
import {Code} from "../../types/types.js";
const Login = () => {
  const {
    ws,
    passKey,
    setPassKey,
    error,
    loading,
    setLoading,
    setError,
    isReady
  } = useContext(WSContext);
  const [name, setName] = useState("");
  const handleNameChange = (event, {value}) => {
    setName(value);
  };
  const handlePassKeyChange = (event, {value}) => {
    setPassKey(value);
  };
  const handleSubmit = async () => {
    setError(null);
    if (isReady) {
      const event = {
        code: Code.JOIN,
        data: {
          name,
          groupName: await encrypt(passKey, passKey)
        }
      };
      ws.send(JSON.stringify(event));
      setLoading(true);
    }
  };
  return /* @__PURE__ */ React.createElement(Grid, {
    textAlign: "center",
    style: {height: "100vh"},
    verticalAlign: "middle"
  }, /* @__PURE__ */ React.createElement(Grid.Column, {
    style: {maxWidth: 450}
  }, /* @__PURE__ */ React.createElement(Header, {
    as: "h2",
    color: "red",
    textAlign: "center"
  }, "Choose a username and a secret key"), /* @__PURE__ */ React.createElement(Form, {
    size: "large",
    onSubmit: handleSubmit,
    error: !!error
  }, /* @__PURE__ */ React.createElement(Segment, null, /* @__PURE__ */ React.createElement(Form.Input, {
    value: name,
    onChange: handleNameChange,
    fluid: true,
    icon: "user",
    iconPosition: "left",
    placeholder: "Username",
    autoComplete: "chat-username",
    required: true,
    autoFocus: true
  }), /* @__PURE__ */ React.createElement(Form.Input, {
    value: passKey,
    onChange: handlePassKeyChange,
    type: "password",
    fluid: true,
    icon: "lock",
    iconPosition: "left",
    placeholder: "Secret key",
    autoComplete: "chat-passkey",
    required: true
  }), /* @__PURE__ */ React.createElement(Message, {
    error: true,
    content: error?.description
  }), /* @__PURE__ */ React.createElement(Button, {
    color: "red",
    fluid: true,
    size: "large",
    loading,
    disabled: !isReady
  }, "Enter")))));
};
export default Login;
