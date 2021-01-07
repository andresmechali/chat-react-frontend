import React, { ChangeEvent, useContext, useMemo, useState } from "react";
import {
  Button,
  Form,
  Grid,
  Header,
  InputOnChangeData,
  Message,
  Segment,
  Label,
} from "semantic-ui-react";

import { WSContext } from "utils/context";
import { encrypt } from "utils/crypto";
import { Code, ErrorCode } from "types/types";

import "./styles.scss";

const Login = () => {
  const {
    ws,
    password,
    setPassword,
    setSecret,
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
    if (setPassword) {
      setPassword(value);
    }
  };

  const errorMessage = useMemo(() => {
    if (!error) {
      return null;
    }
    switch (error.code) {
      case ErrorCode.NAME_USED: {
        const _name = error.information.name;
        const color = error.information.color;
        return (
          <>
            Name
            <Label color={color} horizontal className="user-label">
              {_name}
            </Label>
            already exists.
          </>
        );
      }
      default: {
        return error.description;
      }
    }
  }, [error]);

  const handleSubmit = async () => {
    // Reset error
    setError(null);

    if (isReady) {
      // Store secret
      setSecret(password);

      // Create JOIN event
      const event = {
        code: Code.JOIN,
        data: {
          name,
          groupName: await encrypt(password, password),
        },
      };

      // Send event to server
      ws?.send(JSON.stringify(event));

      // Set state to loading
      if (setLoading) {
        setLoading(true);
      }

      // Reset input values
      setName("");
      setPassword("");
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

            <Message error content={errorMessage} />
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
