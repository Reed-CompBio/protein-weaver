import React from "react";
import MainLayout from "../layout/MainLayout";
import TestParser from "../components/TestParser";
import Sidebar from "../components/Sidebar.jsx";

export default function TestingPage() {
  return (
    <div>
      <MainLayout>
        <div className="main-layout-body">
          <h2>Testing Page</h2>
          {/* <Movie></Movie> */}
          {/* <Cytoscape /> */}
          {/* <TestParser /> */}
          <Sidebar />
        </div>
      </MainLayout>
    </div>
  );
}
