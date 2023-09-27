import React from "react";
import NavBar from "../components/NavBar";

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
