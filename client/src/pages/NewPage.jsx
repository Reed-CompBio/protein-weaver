import React from "react";
import MainLayout from "../layout/MainLayout";
import NewQuery from "../components/NewQuery.jsx";


export default function NewPage() {
    return (
        <div>
            <MainLayout>
                <div className="main-layout-body">
                    <NewQuery />
                </div>
            </MainLayout>
        </div>
    );
}
