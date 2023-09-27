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
            className="sidebar"
            >
                <button className="close-button" onClick={closeSidebar}>&#x2715;</button>
                <h2>Sidebar Title</h2>
                <p>Main content goes here...</p>
            </div>
        )} 
    </div>
    );
};
