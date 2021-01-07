import React, { Provider } from "react";
import type { ContextType } from "types/types";

export const WSContext = React.createContext<ContextType>({
  ws: null,
  user: null,
  users: [],
  messages: [],
  error: null,
  loading: false,
  isReady: false,
  password: "",
  secret: "",
  setError: (error) => {},
  setLoading: (value) => {},
  setPassword: () => {},
  setSecret: () => {},
});
