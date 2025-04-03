import { createBrowserRouter } from "react-router-dom";
import LoginFormPage from "../components/LoginFormPage";
import SignupFormPage from "../components/SignupFormPage";
import MenusPage from "../components/MenusPage";
import ItemsPage from "../components/ItemsPage";
import OrdersPage from "../components/OrdersPage";
import Layout from "./Layout";
import LandingPage from "../components/LandingPage";
import SuppliesPage from "../components/SuppliesPage";
import ExpensesPage from "../components/ExpensesPage";

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
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
        path: "items/:orderId?",
        element: <ItemsPage />,
      },
      {
        path: "items/breakfast/:orderId?",
        element: <ItemsPage category="Breakfast" />,
      },
      {
        path: "items/lunch/:orderId?",
        element: <ItemsPage category="Lunch" />,
      },
      {
        path: "items/dinner/:orderId?",
        element: <ItemsPage category="Dinner" />,
      },
      {
        path: "items/desserts/:orderId?",
        element: <ItemsPage category="Desserts" />,
      },
      {
        path: "items/specials/:orderId?",
        element: <ItemsPage category="Specials" />,
      },
      {
        path: "orders",
        element: <OrdersPage />,
      },
      {
        path: "supplies",
        element: <SuppliesPage />,
      },
      {
        path: "expenses",
        element: <ExpensesPage />,
      },
    ],
  },
]);
