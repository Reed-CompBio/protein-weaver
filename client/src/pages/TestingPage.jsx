import React from "react";
import MainLayout from "../layout/MainLayout";
import Testing from "../components/Testing";

export default function TestingPage() {
  return (
    <div>
      <MainLayout>
        <div className="main-layout-body">
          <Testing />
        </div>
      </MainLayout>
    </div>
  );
}
