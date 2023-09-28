import React from "react";

export default function Sidebar({props}) {


    return (
    <div>
        <div 
        id="sidebarContent"
        className="sidebar"
        >
            <h2>Sidebar Title</h2>
            <p>Protein: {props.label}</p>
            <p>Type of node: {props.type}</p>
            <p>Associated GO Terms: </p>
            <p></p>
        </div>
    </div>
    );
};