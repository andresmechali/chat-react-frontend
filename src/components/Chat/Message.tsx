import React from "react";
import type { Message as MessageType, User } from "types/types";
import { Label, List } from "semantic-ui-react";
import { parseTime } from "utils/helpers";

interface MessageProps {
  message: MessageType;
  isOwn: boolean;
}

const Message = ({ message, isOwn }: MessageProps) => {
  const { messageId, timestamp, text, user } = message;
  const { name, color } = user;
  return (
    <List.Item key={messageId} className="message-item">
      <List.Content className={isOwn ? "align-right" : "align-left"}>
        {!isOwn && (
          <Label color={color} horizontal>
            {name}
          </Label>
        )}
        <span className="message-text">{text}</span>
        <List.Description className="message-time">
          {parseTime(new Date(timestamp))}
        </List.Description>
      </List.Content>
    </List.Item>
  );
};

export default Message;
