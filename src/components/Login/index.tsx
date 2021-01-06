import React, { ChangeEvent, useContext, useState } from "react";
import {
  Grid,
  Header,
  Form,
  Segment,
  Button,
  InputOnChangeData,
  Message,
} from "semantic-ui-react";

import { WSContext } from "utils/context";
import { encrypt } from "utils/crypto";
import { Code } from "types/types";

const Login = () => {
  const {
    ws,
    password,
    setPassword,
    error,
    loading,
    setLoading,
    setError,
    isReady,
  } = useContext(WSContext);

  const [name, setName] = useState("");

  const handleNameChange = (
    event: ChangeEvent<HTMLInputElement>,
    { value }: InputOnChangeData
  ) => {
    setName(value);
  };

  const handlePasswordChange = (
    event: ChangeEvent<HTMLInputElement>,
    { value }: InputOnChangeData
  ) => {
    setPassword(value);
  };

  const handleSubmit = async () => {
    // Reset error
    setError(null);

    if (isReady) {
      // Create JOIN event
      const event = {
        code: Code.JOIN,
        data: {
          name,
          groupName: await encrypt(password, password),
        },
      };

      // Send event to server
      ws.send(JSON.stringify(event));

      // Set state to loading
      setLoading(true);

      // Reset input values
      /*setName("");
      setPassword("");*/
    }
  };

  return (
    <Grid textAlign="center" style={{ height: "100vh" }} verticalAlign="middle">
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as="h2" color="red" textAlign="center">
          Choose a username and a secret key
        </Header>
        <Form size="large" onSubmit={handleSubmit} error={!!error}>
          <Segment>
            <Form.Input
              value={name}
              onChange={handleNameChange}
              fluid
              icon="user"
              iconPosition="left"
              placeholder="Username"
              autoComplete="chat-username"
              required
              autoFocus
            />
            <Form.Input
              value={password}
              onChange={handlePasswordChange}
              type="password"
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Secret key"
              autoComplete="chat-password"
              required
            />

            <Message error content={error?.description} />
            <Button
              color="red"
              fluid
              size="large"
              loading={loading}
              disabled={!isReady}
            >
              Enter
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
