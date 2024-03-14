import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import {
  Navigate,
  Outlet,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import DataPesertaPage from "./pages/DataPesertaPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UndianPage from "./pages/UndianPage";
import FormRegistrasiPage from "./pages/FormRegistrasiPage";
import LoginPage from "./pages/LoginPage";
import _ from "lodash";
import QRRegistrasiPage from "./pages/QRRegistrasiPage";

const ProtectedRoute = ({ redirectPath = "/login" }) => {
  const user = JSON.parse(localStorage.getItem("doorprize_app_user") ?? "{}");

  if (_.isEmpty(user)) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};
const Root = () => {
  const user = JSON.parse(localStorage.getItem("doorprize_app_user") ?? "{}");

  if (_.isEmpty(user)) {
    return <Navigate to="/login" replace />;
  } else {
    return <Navigate to="/admin/data-peserta" replace />;
  }

  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        path: "data-peserta",
        element: <DataPesertaPage />,
      },
      {
        path: "undian",
        element: <UndianPage />,
      },
    ],
  },
  {
    path: "/registration",
    element: <FormRegistrasiPage />,
  },
  {
    path: "/link-registrasi",
    element: <QRRegistrasiPage />,
  },
]);

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} />
  </QueryClientProvider>
);
