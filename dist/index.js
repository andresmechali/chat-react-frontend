import __SNOWPACK_ENV__ from '../__snowpack__/env.js';
import.meta.env = __SNOWPACK_ENV__;

import React from "../web_modules/react.js";
import ReactDOM from "../web_modules/react-dom.js";
import "../web_modules/semantic-ui-css/semantic.min.css.proxy.js";
import App2 from "./App.js";
const root = document.getElementById("root");
ReactDOM.render(/* @__PURE__ */ React.createElement(App2, null), root);
console.log(import.meta);
if (import.meta.hot) {
  import.meta.hot.accept();
}
