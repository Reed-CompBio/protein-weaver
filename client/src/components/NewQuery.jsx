import React, { useState, useEffect } from "react";

export default function NewQuery() {
    const [nodeNames, setNodeNames] = useState([]);

    async function handleNewQuery(e) {
        setNodeNames([]);
        e.preventDefault();

        fetch("/api/newQuery")
            .then((res) => res.json())
            .then((data) => {
                const names = data.map((item) => item.properties.name);
                setNodeNames(names);
            })
            .catch((error) => {
                console.error("Error fetching network data:", error);
            });

        return;
    }

    console.log(nodeNames);

    return (
        <div>
            <button onClick={handleNewQuery}>New Query</button>
            {nodeNames.map((name, index) => (
                <p key={index}>{index + 1}: {name}</p>
            ))}
        </div>
    );
}
