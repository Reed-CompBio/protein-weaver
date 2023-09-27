import { React, useState } from "react";

export default function Sidebar() {

    const [showSidebar, setShowSidebar] = useState(false);

    const openSidebar = () => {
        setShowSidebar(true);
    }

    const closeSidebar = () => {
        setShowSidebar(false);
    }


    return (
    <div>
        <button onClick={openSidebar}>Open Sidebar</button>
        {showSidebar && (
            <div 
            id="sidebarContent"
            >
                <button onClick={closeSidebar}>Close Sidebar</button>
                <h2>Sidebar Title</h2>
                <p>Main content goes here...</p>
            </div>
        )} 
    </div>
    );
};
