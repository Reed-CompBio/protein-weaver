import React from "react";
import MainLayout from "../layout/MainLayout";
import Movie from "../components/Movie.jsx";

export default function TestingPage() {
  return (
    <div>
      <MainLayout>
        <div className="main-layout-body">
          <h2>Testing Page Page</h2>
          <Movie></Movie>
        </div>
      </MainLayout>
    </div>
  );
}
