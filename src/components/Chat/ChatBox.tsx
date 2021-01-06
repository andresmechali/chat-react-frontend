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
import { encrypt } from "utils/crypto";

import { Code, Message as MessageType } from "types/types";
import Message from "./Message";

const ChatBox = () => {
  const [messageText, setMessageText] = useState("");
  const { ws, user, messages, password } = useContext(WSContext);
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
      new MutationObserver((mutations: MutationRecord[]) => {
        mutations.forEach((mutation: MutationRecord) => {
          const target: Node = mutation.target;
          // @ts-ignore
          target?.scroll({
            // @ts-ignore
            top: target?.scrollHeight,
            behavior: "smooth",
          });
        })

      }).observe(messagesRef.current, { childList: true });
    }
  }, []);

  if (!password) {
    return null;
  }

  return (
    <Card fluid className="message-wrapper">
      <Header as="h3" className="users-header">
        Messages
      </Header>
      <Ref innerRef={messagesRef}>
        <List className="message-list">
          {messages?.map((message: MessageType) => {
            const isOwn: boolean = user?.userId === message.user.userId;
            return (
              <Message
                key={message.messageId}
                message={message}
                isOwn={isOwn}
                password={password}
              />
            );
          })}
        </List>
      </Ref>
      <Card.Content extra>
        <Form
          onSubmit={(e: FormEvent) => {
            e.preventDefault();
            // Generate Message event and send to server
            if (messageText === "") {
              return;
            }
            
            encrypt(messageText, password).then(encryptedText => {
              const event = {
                code: Code.MESSAGE,
                data: {
                  message: {
                    text: encryptedText,
                    user: user,
                    timestamp: new Date().toISOString(),
                  },
                },
              };
              ws?.send(JSON.stringify(event));
              // Empty input string
              setMessageText("");
            }).catch(e => {
              setMessageText("");
            })


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
