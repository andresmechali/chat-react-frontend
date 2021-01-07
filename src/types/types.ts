import type { SemanticCOLORS } from "semantic-ui-react";

export interface User {
  userId: string;
  name: string;
  groupName: string;
  color: SemanticCOLORS;
}

export interface Message {
  messageId: string;
  text: string;
  user: User;
  timestamp: Date;
}

export enum ErrorCode {
  NAME_USED = 1,
  CLOSED = 2,
}

export interface Error {
  code: ErrorCode;
  description: string;
  information?: {
    name?: string;
    color?: SemanticCOLORS;
  };
}

export interface ContextType {
  ws: WebSocket | null;
  user: User | null;
  users: User[];
  password: string | "";
  setPassword: (value: string) => void;
  secret: string | "";
  setSecret: (value: string) => void;
  messages: Message[];
  error: Error | null;
  loading: boolean;
  setLoading: (value: boolean) => void;
  setError: (error: Error | null) => void;
  isReady: boolean;
}

export enum Code {
  PING = 4000,
  JOIN = 4001,
  MESSAGE = 4002,
  REQUEST_MESSAGES = 4003,
  RETURN_MESSAGES = 4004,
  USERS = 4101,
  ERROR = 4300,
}
