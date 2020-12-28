import React, { useEffect, useState } from "react";
import type { Message as MessageType } from "types/types";
import { Label, List, Placeholder } from "semantic-ui-react";
import { parseTime } from "utils/helpers";
import { decrypt } from "utils/crypto";

interface MessageProps {
  message: MessageType;
  isOwn: boolean;
}

const Message = ({ message, isOwn }: MessageProps) => {
  const { messageId, timestamp, text, user } = message;
  const { name, color } = user;
  const [decryptedText, setDecryptedText] = useState<string | null>(null);

  useEffect(() => {
    setTimeout(() => {
      decrypt(text, "asd").then((msg) => {
        setDecryptedText(msg);
      });
    }, 1000);
  }, []);

  return (
    <List.Item
      key={messageId}
      className={`message-item ${isOwn ? "align-right" : "align-left"}`}
    >
      <List.Content className="message-content">
        {!isOwn && (
          <Label color={color} horizontal>
            {name}
          </Label>
        )}
        <span className="message-text">
          {decryptedText || (
            <Placeholder>
              <Placeholder.Paragraph>
                <Placeholder.Line length="medium" />
              </Placeholder.Paragraph>
            </Placeholder>
          )}
        </span>
      </List.Content>
      <List.Description className="message-time">
        {parseTime(new Date(timestamp))}
      </List.Description>
    </List.Item>
  );
};

export default Message;
