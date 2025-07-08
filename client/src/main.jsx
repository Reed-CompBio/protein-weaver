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
import DownloadPage from "./pages/DownloadPage.jsx"

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
  ,
  {
    path: "/download",
    element: <DownloadPage />,
    errorElement: <ErrorPage />,
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <RouterProvider router={router} />
  </>
);
