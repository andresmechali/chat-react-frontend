import React from "react";
import type { ContextType } from "types/types";

export const WSContext = React.createContext<Partial<ContextType>>({
  ws: null,
  user: null,
  users: [],
  messages: [],
  error: null,
  loading: false,
  isReady: false,
  password: "",
  setError: (error) => {},
  setLoading: (value) => {},
  setPassword: () => {},
});
