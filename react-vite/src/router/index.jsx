import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import MenusPage from "../components/MenusPage";
import ItemsPage from "../components/ItemsPage";
import OrdersPage from "../components/OrdersPage";
import Layout from "./Layout";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <div>
            <h1>Welcome to 🦀 The Krusty Krab B.O.S.S.!</h1>
            <p>
              🦀 The Krusty Krab B.O.S.S.(Business Operations & Service System)
              is a restaurant management system tool designed to streamline
              operations for the Krusty Krab 🦀.
            </p>
            <p>
              Whether you're managing inventory, tracking orders, paying
              vendors, or handling employee timecards, this system has you
              covered.
            </p>
          </div>
        ),
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "menus",
        element: <MenusPage />,
      },
      {
        path: "items",
        element: <ItemsPage />,
      },
      {
        path: "orders",
        element: <OrdersPage />,
      },
    ],
  },
]);
