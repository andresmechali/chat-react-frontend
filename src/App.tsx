import React, { useState, useEffect, useCallback, useRef } from "react";

import Home from "containers/Home";

import { WSContext } from "utils/context";
import { Code, Message, User, Error, ErrorCode } from "types/types";

// @ts-ignore
const { NODE_ENV, SNOWPACK_PUBLIC_API_URL } = import.meta.env;

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [secret, setSecret] = useState<string>("");

  const socket = useRef<WebSocket | null>(null);
  const reconnecting = useRef<NodeJS.Timeout | null>(null);
  const ping = useRef<NodeJS.Timeout | null>(null);
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
    socket?.current?.send(
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
      NODE_ENV === "production"
        ? SNOWPACK_PUBLIC_API_URL
        : "95.216.158.81:8080";
    socket.current = new WebSocket(`ws://${socketUrl}`);

    socket.current.onopen = () => {
      setIsReady(true);
      setError(null);
      setTryingToReconnect(false);
      ping.current = setInterval(() => {
        const event = {
          code: Code.PING,
        };
        socket?.current?.send(JSON.stringify(event));
      }, 30 * 1000);
    };
  }, []);

  /**
   * On every rerender, update socket's onmessage handler.
   * This allows the handler to have the latest state, and not
   * the initial one.
   */
  useEffect(() => {
    if (socket?.current) {
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
    }
  });

  useEffect(() => {
    connectWs();

    if (socket.current) {
      socket.current.onclose = () => {
        setUser(null);
        setError({
          code: ErrorCode.CLOSED,
          description: "There seems to be a problem on the server",
        });
        setIsReady(false);
        setTryingToReconnect(true);
        if (ping.current) {
          clearInterval(ping.current);
        }
      };
    }
  }, []);

  useEffect(() => {
    if (tryingToReconnect) {
      reconnecting.current = setInterval(connectWs, 1000);
    } else if (reconnecting.current) {
      clearInterval(reconnecting.current);
    }
  }, [tryingToReconnect]);

  return (
    <WSContext.Provider
      value={{
        ws: socket.current,
        user,
        users,
        password,
        setPassword,
        secret,
        setSecret,
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
