import React from "react";
import { MdError } from "react-icons/md";
import { IconContext } from "react-icons";

export default function QueryError({ errorMessage }) {
  return (
    <div className="query-error">
      <IconContext.Provider
        value={{
          className: "icon",
          size: "3em",
          color:"black"
        }}
      >
        {" "}
        <MdError className="error-icon" />
      </IconContext.Provider>
      <h3>
        We encountered an error while retrieving the network. <br></br> Reason:{" "}
        {errorMessage}
      </h3>
    </div>
  );
}
