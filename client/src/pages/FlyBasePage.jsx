import React from "react";
import MainLayout from "../layout/MainLayout";
// import FlyQuery from "../components/FlyQuery.jsx";
// import Cytoscape from "../components/Cytoscape";

export default function FlyBasePage() {
    return (
        <div>
          <MainLayout>
            <div className="main-layout-body">
              <h2>Query FlyBase</h2>
            </div>
          </MainLayout>
        </div>
      );
}