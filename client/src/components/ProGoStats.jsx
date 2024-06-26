import React, { useState, useEffect } from "react";

// create component
export default function PGStats({ name, txid }) {
    // create empty object to store query results
    const [count, setCount] = useState([]);
    useEffect(() => {
        fetch("/api/getProGoStats", {
            // change to YOUR API call's URL
            method: "POST", // Change to GET if your call is a get request
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // Example of json body request. need to match your POST request's parameters
                GoName: name,
                txid: txid
            }),
        })
            .then(response => response.json())

            .then(data => {
                const count = data[0]._fields[0]["low"];
                setCount(count);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [name]);

    return (
        <div>
            &nbsp;&nbsp;&nbsp;Species Specific GO Term Annotations: {count}
        </div>
    )
}