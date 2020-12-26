import type { Provider } from "react";
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
  REQUEST_MESSAGES = 4003,
  RETURN_MESSAGES = 4004,
  USERS = 4101,
  ERROR = 4300,
}
