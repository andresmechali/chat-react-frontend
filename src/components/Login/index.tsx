import React, { ChangeEvent, useContext, useEffect, useState } from "react";
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
import { Code } from "types/types";

const Login = () => {
  const { ws, error, loading, setLoading, setError } = useContext(WSContext);

  const [name, setName] = useState("");
  const [passKey, setPassKey] = useState("");

  const handleNameChange = (
    event: ChangeEvent<HTMLInputElement>,
    { value }: InputOnChangeData
  ) => {
    setName(value);
  };

  const handlePassKeyChange = (
    event: ChangeEvent<HTMLInputElement>,
    { value }: InputOnChangeData
  ) => {
    setPassKey(value);
  };

  const handleSubmit = () => {
    // Reset error
    setError(null);

    // Create JOIN event
    const event = {
      code: Code.JOIN,
      data: {
        name,
        groupName: passKey,
      },
    };

    // Send event to server
    ws.send(JSON.stringify(event));

    // Set state to loading
    setLoading(true);

    // Reset input values
    setName("");
    setPassKey("");
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
              value={passKey}
              onChange={handlePassKeyChange}
              type="password"
              fluid
              icon="lock"
              iconPosition="left"
              placeholder="Secret key"
              autoComplete="chat-passkey"
              required
            />

            <Message error content={error?.description} />
            <Button color="red" fluid size="large" loading={loading}>
              Enter
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default Login;
