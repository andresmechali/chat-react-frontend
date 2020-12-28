import React, { useState, useEffect, useCallback, useRef } from "react";

import Home from "containers/Home";

import { WSContext } from "utils/context";
import { Code, Message, User, Error, ErrorCode } from "types/types";

const { NODE_ENV, SNOWPACK_PUBLIC_API_URL } = import.meta.env;

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [passKey, setPassKey] = useState<string>("");

  const socket = useRef<WebSocket | null>(null);
  const reconnecting = useRef<NodeJS.Timeout>(null);
  const ping = useRef<NodeJS.Timeout>(null);
  const [tryingToReconnect, setTryingToReconnect] = useState<boolean>(false);

  const handleJoin = (event: MessageEvent) => {
    setUser(event.data.user);
    setLoading(false);
  };

  const handleNewUser = (event: MessageEvent) => {
    setUsers(event.data.users);
  };

  const handleNewMessage = (event: MessageEvent) => {
    setMessages((prevMessages: Message[]) =>
      prevMessages.concat(event.data.message)
    );
  };

  const handleError = (event: MessageEvent) => {
    setError(event.data.error);
    setLoading(false);
  };

  const handleRequestMessages = (event: MessageEvent) => {
    socket.current.send(
      JSON.stringify({
        code: Code.RETURN_MESSAGES,
        data: {
          messages,
          requestedUserId: event.data.requestedUserId,
        },
      })
    );
  };

  const handleReturnMessages = (event: MessageEvent) => {
    setMessages(event.data.messages);
  };

  const connectWs = useCallback(() => {
    const socketUrl =
      NODE_ENV === "production" ? SNOWPACK_PUBLIC_API_URL : "localhost:8080";
    socket.current = new WebSocket(`ws://${socketUrl}`);

    socket.current.onopen = () => {
      setIsReady(true);
      setError(null);
      setTryingToReconnect(false);
      ping.current = setInterval(() => {
        const event = {
          code: Code.PING,
        };
        socket.current.send(JSON.stringify(event));
      }, 30 * 1000);
    };

    socket.current.onmessage = onmessage = (e: MessageEvent) => {
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
        description: "There seems to be a problem on the server",
      });
      setIsReady(false);
      setTryingToReconnect(true);
      clearInterval(ping.current);
    };
  }, []);

  useEffect(() => {
    if (tryingToReconnect) {
      reconnecting.current = setInterval(connectWs, 1000);
    } else {
      clearInterval(reconnecting.current);
    }
  }, [tryingToReconnect]);

  return (
    <WSContext.Provider
      value={{
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
        isReady,
      }}
    >
      <Home />;
    </WSContext.Provider>
  );
};

export default App;
