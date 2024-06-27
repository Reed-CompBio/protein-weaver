import React, { useState, useEffect } from "react";

// create component
export default function Degree(id) {
    // create empty object to store query results
    // create empty object to store query results
    const [Degree, setDegree] = useState([]);
    useEffect(() => {
        fetch("/api/Degree", {
            // change to YOUR API call's URL
            method: "POST", // Change to GET if your call is a get request
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // Example of json body request. need to match your POST request's parameters
                id: id
            }),
        })
            .then(response => response.json())
            .then(data => {
                // console.log("Degree:", data[0]._fields[0]["low"])
                const Degree = data[0]._fields[0]["low"];
                setDegree(Degree);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [id]);


    return (
        <div>
            Protein Degree: {Degree}
        </div>
    )
}