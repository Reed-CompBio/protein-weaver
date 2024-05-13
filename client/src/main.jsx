import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage.jsx";
import TestingPage from "./pages/TestingPage.jsx";
import AboutPage from "./pages/AboutPage.jsx";
import QueryPage from "./pages/QueryPage.jsx";
import TOSPage from "./pages/TOSPage.jsx";
import FAQPage from "./pages/FAQPage.jsx";
import NewPage from "./pages/NewPage.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/testing",
    element: <TestingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/newpage",
    element: <NewPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/about",
    element: <AboutPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/query",
    element: <QueryPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/tos",
    element: <TOSPage />,
    errorElement: <ErrorPage />,
  }
  ,
  {
    path: "/faq",
    element: <FAQPage />,
    errorElement: <ErrorPage />,
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <RouterProvider router={router} />
  </>
);
