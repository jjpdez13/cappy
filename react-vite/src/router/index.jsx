import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import MenusPage from '../components/MenusPage';
import ItemsPage from '../components/ItemsPage';
import Layout from './Layout';

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <h1>Welcome to 🦀 The Krusty Krab B.O.S.S.!</h1>,
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
    ],
  },
]);