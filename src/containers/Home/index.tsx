import React, { useContext, useState } from "react";

import Login from "components/Login";
import Chat from "components/Chat";
import { WSContext } from "utils/context";

const Home = () => {
  const { user } = useContext(WSContext);

  if (user) {
    return <Chat />;
  }

  return <Login />;
};

export default Home;
