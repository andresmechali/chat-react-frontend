import React, {useContext} from "../../../web_modules/react.js";
import Login2 from "../../components/Login/index.js";
import Chat2 from "../../components/Chat/index.js";
import {WSContext} from "../../utils/context.js";
const Home = () => {
  const {user} = useContext(WSContext);
  if (user) {
    return /* @__PURE__ */ React.createElement(Chat2, null);
  }
  return /* @__PURE__ */ React.createElement(Login2, null);
};
export default Home;
