import React from "react";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

export default function MainLayout({ children }) {
  return (
    <div className="page-container">
      <div className="content-wrap">
        <NavBar />
        <div>{children}</div>
      </div>
      <Footer />
    </div>
  );
}
