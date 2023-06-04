/**
 * STK-UI {@link https://github.com/qoala101/stk_ui}
 * @author Volodymyr Hromakov <4y5t6r@gmail.com>
 * @copyright Copyright (c) 2023, MIT License
 */

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
