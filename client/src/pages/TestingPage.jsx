import React from "react";
import MainLayout from "../layout/MainLayout";
import TestParser from "../components/TestParser";

export default function TestingPage() {
  return (
    <div>
      <MainLayout>
        <div className="main-layout-body">
          <h2>Testing Page Page</h2>
          {/* <Movie></Movie> */}
          {/* <Cytoscape /> */}
          <TestParser />
        </div>
      </MainLayout>
    </div>
  );
}
