import React, { useState, useEffect } from "react";

// create component
export default function Motif({ nodeList }) {
    // create empty object to store query results
    const [MotifCount, setMotifCount] = useState([]);
    useEffect(() => {
        fetch("/api/Motif", {
            // change to YOUR API call's URL
            method: "POST", // Change to GET if your call is a get request
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // Example of json body request. need to match your POST request's parameters
                nodeList: nodeList
            }),
        })
            .then(response => response.json())

            .then(data => {
                const count = [];
                for (let i = 0; i < data.length; i++) {
                    count.push(data[i]._fields[0].low)
                }
                setMotifCount(count);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }, []);

    return (
        <div>
            <br />
            <b>Motif Counts:</b>
            <p>
                Protein clique: {MotifCount[0]} <br /><br />
                Interacting transcription factors that coregulate a third gene: {MotifCount[1]} <br /><br />
                Feed forward loop: {MotifCount[2]} <br /><br />
                Coregulating interacting proteins: {MotifCount[3]} <br /><br />
                Mixed feedback loop between transcription factors coregulating a third gene: {MotifCount[4]}
            </p>
        </div>
    )
}