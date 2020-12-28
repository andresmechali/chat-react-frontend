import React, {useContext} from "../../../web_modules/react.js";
import {List, Transition, Header} from "../../../web_modules/semantic-ui-react.js";
import {WSContext} from "../../utils/context.js";
import "./styles.css.proxy.js";
const Users = () => {
  const {users} = useContext(WSContext);
  return /* @__PURE__ */ React.createElement(Transition.Group, {
    as: List,
    duration: 200,
    divided: true,
    size: "huge",
    verticalAlign: "middle",
    celled: true,
    selection: true
  }, /* @__PURE__ */ React.createElement(Header, {
    as: "h3",
    className: "users-header"
  }, "Users"), users.map(({name}) => /* @__PURE__ */ React.createElement(List.Item, {
    key: name,
    className: "user-name"
  }, /* @__PURE__ */ React.createElement(List.Content, null, /* @__PURE__ */ React.createElement(List.Description, null, name)))));
};
export default Users;
