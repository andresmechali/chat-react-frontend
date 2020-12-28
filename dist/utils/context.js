import React from "../../web_modules/react.js";
export const WSContext = React.createContext({
  ws: null,
  user: null,
  users: [],
  messages: [],
  error: null,
  loading: false,
  isReady: false,
  passKey: null,
  setError: (error) => {
  },
  setLoading: (value) => {
  }
});
