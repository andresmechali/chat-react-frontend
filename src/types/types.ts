import type { Provider } from "react";

export interface User {
  userId: string;
  name: string;
  groupName: string;
}

export interface Message {
  messageId: string;
  userId: string;
  name: string;
  text: string;
  timestamp: Date;
}

export enum ErrorCode {
  NAME_USED = 1,
}

export interface Error {
  code: ErrorCode;
  description: string;
}

export interface ContextType {
  Provider: Provider<any>;
  ws: WebSocket | null;
  user: User | null;
  users: User[];
  messages: Message[];
  error: Error | null;
  loading: boolean;
  setLoading: (value: boolean) => void;
  setError: (error: Error) => void;
}

export enum Code {
  JOIN = 4001,
  MESSAGE = 4002,
  USERS = 4101,
  ERROR = 4300,
}
