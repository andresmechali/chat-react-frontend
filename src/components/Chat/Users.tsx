import React, { useContext } from "react";
import { List, Transition, Header } from "semantic-ui-react";
import { WSContext } from "utils/context";
import type { User } from "types/types";
import "./styles.scss";

const Users = () => {
  const { users } = useContext(WSContext);

  return (
    <Transition.Group
      as={List}
      duration={200}
      divided
      size="huge"
      verticalAlign="middle"
      celled
    >
      <Header as="h3" className="users-header">
        Users
      </Header>
      {users.map(({ name }: User) => (
        <List.Item key={name} className="user-name">
          <List.Content>
            <List.Description>{name}</List.Description>
          </List.Content>
        </List.Item>
      ))}
    </Transition.Group>
  );
};

export default Users;
