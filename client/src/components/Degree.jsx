import React, { useState, useEffect } from "react";

// create component
export default function Degree(id) {
    // create empty object to store query results
    const [physDegree, setPhysDegree] = useState([]);
    const [outDegree, setOutDegree] = useState([]);
    const [inDegree, setInDegree] = useState([]);

    useEffect(() => {
        fetch("/api/getPhysicalDegree", {
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
                const physDegree = data[0]._fields[0]["low"];
                setPhysDegree(physDegree);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [id]);

    useEffect(() => {
        fetch("/api/getRegulatoryDegree", {
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
                const outDegree = data[0]._fields[0]["low"];
                setOutDegree(outDegree);
                const inDegree = data[0]._fields[1]["low"];
                setInDegree(inDegree);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, [id]);


    return (
        <div>
            <h5 className="node-tab-text">Physical Degree: {physDegree}</h5>
            <h5 className="node-tab-text">Outward Regulatory Degree: {outDegree}</h5>
            <h5 className="node-tab-text">Inward Regulatory Degree: {inDegree}</h5>
        </div>
    )
}