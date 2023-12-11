import React from "react"

export default function QueryError() {
    return (
        <div className="query-error">
            <h3>
                We encountered an error while retrieving the network.
                Please double-check the Protein, GO Term, and/or Species to ensure accuracy.
                Alternatively, the queried subnetwork might not exist within ProteinWeaver.
            </h3>
        </div>
    )
}