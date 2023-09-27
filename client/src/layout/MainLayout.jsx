import React from "react";
import NavBar from "../components/NavBar";
import Sidebar from "../components/Sidebar";

export default function MainLayout({ children }) {

  return (
    <div>
      <NavBar />
      <div>
        {children}
      </div>
    </div>
  );
};
