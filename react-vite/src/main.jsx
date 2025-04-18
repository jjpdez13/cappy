import React from "react";
import ReactDOM from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";
import { RouterProvider } from "react-router-dom";
import configureStore from "./redux/store";
import { router } from "./router";
import * as sessionActions from "./redux/session";
import * as userActions from "./redux/users";
import * as menuActions from "./redux/menus";
import * as itemActions from "./redux/items";
import * as orderActions from "./redux/orders";
import * as supplyActions from "./redux/supplies";
import * as expenseActions from "./redux/expenses";

import "./index.css";

const store = configureStore();

if (import.meta.env.MODE !== "production") {
  window.store = store;
  window.sessionActions = sessionActions;
  window.userActions = userActions;
  window.menuActions = menuActions;
  window.itemActions = itemActions;
  window.orderActions = orderActions;
  window.supplyActions = supplyActions;
  window.expenseActions = expenseActions;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <RouterProvider router={router} />
    </ReduxProvider>
  </React.StrictMode>
);
