import React, { useState, useEffect, useCallback } from "react";
import Home from "containers/Home";

import { WSContext } from "utils/context";
import { Code, Message, User, Error } from "types/types";

const ws = new WebSocket("ws://localhost:8080");

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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
    ws.send(
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

  useEffect(() => {
    ws.onopen = () => {
      console.log("connected");
    };

    ws.onmessage = (e: MessageEvent) => {
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

    ws.onclose = (e) => {
      console.log("close");
      ws.send(JSON.stringify({ code: 4999, x: 1 }));
    };

    ws.onerror = (e) => {
      console.log("error");
      ws.send(JSON.stringify({ code: 4500, x: 9 }));
    };
  });

  return (
    <WSContext.Provider
      value={{
        ws,
        user,
        users,
        messages,
        error,
        loading,
        setLoading,
        setError,
      }}
    >
      <Home />;
    </WSContext.Provider>
  );
};

export default App;
