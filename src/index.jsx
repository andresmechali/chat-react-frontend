import React from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";

import App from "./App";

const root = document.getElementById("root");

ReactDOM.render(<App />, root);

// Hot Module Replacement (HMR)
if (import.meta.hot) {
  import.meta.hot.accept();
}
