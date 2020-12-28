import __SNOWPACK_ENV__ from '../__snowpack__/env.js';
import.meta.env = __SNOWPACK_ENV__;

import React, {useState, useEffect, useCallback, useRef} from "../web_modules/react.js";
import Home2 from "./containers/Home/index.js";
import {WSContext} from "./utils/context.js";
import {Code, ErrorCode} from "./types/types.js";
const {NODE_ENV, SNOWPACK_PUBLIC_API_URL} = import.meta.env;
const App = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [passKey, setPassKey] = useState("");
  const socket = useRef(null);
  const reconnecting = useRef(null);
  const ping = useRef(null);
  const [tryingToReconnect, setTryingToReconnect] = useState(false);
  const handleJoin = (event) => {
    setUser(event.data.user);
    setLoading(false);
  };
  const handleNewUser = (event) => {
    setUsers(event.data.users);
  };
  const handleNewMessage = (event) => {
    setMessages((prevMessages) => prevMessages.concat(event.data.message));
  };
  const handleError = (event) => {
    setError(event.data.error);
    setLoading(false);
  };
  const handleRequestMessages = (event) => {
    socket.current.send(JSON.stringify({
      code: Code.RETURN_MESSAGES,
      data: {
        messages,
        requestedUserId: event.data.requestedUserId
      }
    }));
  };
  const handleReturnMessages = (event) => {
    setMessages(event.data.messages);
  };
  const connectWs = useCallback(() => {
    const socketUrl = NODE_ENV === "production" ? SNOWPACK_PUBLIC_API_URL : "localhost:8080";
    socket.current = new WebSocket(`ws://${socketUrl}`);
    socket.current.onopen = () => {
      setIsReady(true);
      setError(null);
      setTryingToReconnect(false);
      ping.current = setInterval(() => {
        const event = {
          code: Code.PING
        };
        socket.current.send(JSON.stringify(event));
      }, 30 * 1e3);
    };
    socket.current.onmessage = onmessage = (e) => {
      const event = JSON.parse(e.data);
      switch (event.code) {
        case Code.JOIN: {
          handleJoin(event);
          break;
        }
        case Code.USERS: {
          handleNewUser(event);
          break;
        }
        case Code.MESSAGE: {
          handleNewMessage(event);
          break;
        }
        case Code.ERROR: {
          handleError(event);
          break;
        }
        case Code.REQUEST_MESSAGES: {
          handleRequestMessages(event);
          break;
        }
        case Code.RETURN_MESSAGES: {
          handleReturnMessages(event);
          break;
        }
        default: {
          break;
        }
      }
    };
  }, []);
  useEffect(() => {
    connectWs();
    socket.current.onclose = () => {
      setUser(null);
      setError({
        code: ErrorCode.CLOSED,
        description: "There seems to be a problem on the server"
      });
      setIsReady(false);
      setTryingToReconnect(true);
      clearInterval(ping.current);
    };
  }, []);
  useEffect(() => {
    if (tryingToReconnect) {
      reconnecting.current = setInterval(connectWs, 1e3);
    } else {
      clearInterval(reconnecting.current);
    }
  }, [tryingToReconnect]);
  return /* @__PURE__ */ React.createElement(WSContext.Provider, {
    value: {
      ws: socket.current,
      user,
      users,
      passKey,
      setPassKey,
      messages,
      error,
      loading,
      setLoading,
      setError,
      isReady
    }
  }, /* @__PURE__ */ React.createElement(Home2, null), ";");
};
export default App;
