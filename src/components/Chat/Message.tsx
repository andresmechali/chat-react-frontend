import React, { useEffect, useState } from "react";
import type { Message as MessageType } from "types/types";
import { Label, List, Placeholder } from "semantic-ui-react";
import { parseTime } from "utils/helpers";
import { decrypt } from "utils/crypto";

interface MessageProps {
  /**
   * encrypted message object
   */
  message: MessageType;
  /**
   * true if message belongs to this user
   */
  isOwn: boolean;
  /**
   * password for decrypting message
   */
  password: string
}

/**
 * Renders a message with user name and time
 */
const Message = ({ message, isOwn, password }: MessageProps) => {
  const { messageId, timestamp, text, user } = message;
  const { name, color } = user;
  const [decryptedText, setDecryptedText] = useState<string | null>(null);
  const [show, setShow] = useState<boolean>(false);

  /**
   * Decrypt message
   */
  useEffect(() => {
    decrypt(text, password).then((msg) => {
      setDecryptedText(msg);
      setShow(true);
    });
  }, []);

  /**
   * For a short period of time, hide the message instead of rendering
   * a loading placeholder. This allows avoiding a short flash while the
   * message is being decrypted.
   */
  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    },200)
  }, [])

  if (!show) {
    return null;
  }

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
