import React from "react";
import MainLayout from "../layout/MainLayout";
import Movie from "../components/Movie.jsx";
import Cytoscape from "../components/Cytoscape";

export default function TestingPage() {
  return (
    <div>
      <MainLayout>
        <div className="main-layout-body">
          <h2>Testing Page</h2>
          <Movie></Movie>
          <Cytoscape />
        </div>
      </MainLayout>
    </div>
  );
}
