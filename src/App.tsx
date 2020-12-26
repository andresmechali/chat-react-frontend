import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    ws.onopen = () => {
      console.log("connected");
    };

    ws.onmessage = (e) => {
      const event = JSON.parse(e.data);
      switch (event.code) {
        case Code.JOIN: {
          setUser(event.data.user);
          setLoading(false);
          break;
        }
        case Code.USERS: {
          setUsers(event.data.users);
          break;
        }
        case Code.MESSAGE: {
          setMessages((prevMessages: Message[]) =>
            prevMessages.concat(event.data.message)
          );
          break;
        }
        case Code.ERROR: {
          setError(event.data.error);
          setLoading(false);
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
  }, []);

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
