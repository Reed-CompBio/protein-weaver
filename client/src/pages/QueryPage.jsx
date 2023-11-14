import React from "react";
import MainLayout from "../layout/MainLayout";
import Query from "../components/Query.jsx";

export default function QueryPage() {
    return (
        <div>
            <MainLayout>
                <div className="main-layout-body">
                    <Query />
                </div>
            </MainLayout>
        </div>
    );
};