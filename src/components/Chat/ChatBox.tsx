import React, {
  useState,
  useContext,
  FormEvent,
  ChangeEvent,
  useEffect,
} from "react";
import {
  List,
  Card,
  Input,
  Form,
  InputOnChangeData,
  Ref,
  Header,
} from "semantic-ui-react";
import { WSContext } from "utils/context";
import { encrypt, decrypt } from "utils/crypto";

import { Code, Message as MessageType } from "types/types";
import Message from "./Message";

const ChatBox = () => {
  const [messageText, setMessageText] = useState("");
  const { ws, user, messages, passKey } = useContext(WSContext);
  const messagesRef = React.useRef<HTMLDivElement>(null);

  const handleMessageChange = (
    event: ChangeEvent<HTMLInputElement>,
    { value }: InputOnChangeData
  ): void => {
    setMessageText(value);
  };

  /**
   * When new message is received, scroll to bottom of messages list
   */
  useEffect(() => {
    if (messagesRef.current) {
      new MutationObserver((mutation: MutationRecord[]) => {
        const { target } = mutation[0];
        target?.scroll({
          top: target?.scrollHeight,
          behavior: "smooth",
        });
      }).observe(messagesRef.current, { childList: true });
    }
  }, []);

  return (
    <Card fluid className="message-wrapper">
      <Header as="h3" className="users-header">
        Messages
      </Header>
      <Ref innerRef={messagesRef}>
        <List className="message-list">
          {messages.map((message: MessageType) => {
            const isOwn: boolean = user.userId === message.user.userId;
            return (
              <Message
                key={message.messageId}
                message={message}
                isOwn={isOwn}
              />
            );
          })}
        </List>
      </Ref>
      <Card.Content extra>
        <Form
          onSubmit={async (e: FormEvent) => {
            e.preventDefault();
            // Generate Message event and send to server
            if (messageText === "") {
              return;
            }

            const event = {
              code: Code.MESSAGE,
              data: {
                message: {
                  text: await encrypt(messageText, passKey),
                  user: user,
                  timestamp: new Date().toISOString(),
                },
              },
            };
            ws.send(JSON.stringify(event));
            // Empty input string
            setMessageText("");
          }}
        >
          <Form.Field required>
            <Input
              id="messageText"
              value={messageText}
              placeholder="Message"
              onChange={handleMessageChange}
              autoFocus
              fluid
              autoComplete="off"
            />
          </Form.Field>
        </Form>
      </Card.Content>
    </Card>
  );
};

export default ChatBox;