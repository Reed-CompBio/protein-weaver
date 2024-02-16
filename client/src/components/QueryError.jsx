import React from "react"

export default function QueryError({errorMessage}) {
    return (
        <div className="query-error">
            <h3>
                We encountered an error while retrieving the network. Reason: {errorMessage}
            </h3>
        </div>
    )
}