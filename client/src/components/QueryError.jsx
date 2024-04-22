import { React, useState } from "react";
import { MdError, MdBugReport } from "react-icons/md";
import { IconContext } from "react-icons";

export default function QueryError({ errorMessage }) {
  const [showBugReportMessage, setShowBugReportMessage] = useState(false);

  return (
    <div className="query-error">
      <IconContext.Provider
        value={{
          size: "3em",
          color: "black"
        }}
      >
        {" "}
        <MdError className="error-icon" />
      </IconContext.Provider>
      <h3>
        We encountered an error while retrieving the network. <br></br> Reason:{" "}
        {errorMessage}
      </h3>
      <IconContext.Provider
        value={{
          size: "2em",
          color: showBugReportMessage ? "grey" : "black",
        }}
      >
        <div
          className="bug-report"
          onMouseEnter={() => setShowBugReportMessage(true)}
          onMouseLeave={() => setShowBugReportMessage(false)}
        >
          <a
            href="https://github.com/Reed-CompBio/protein-weaver/issues/new"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MdBugReport />
          </a>
          {showBugReportMessage &&
            <div className="bug-report-message">
              File a GitHub issue! (opens new tab)
            </div>
          }
        </div>
      </IconContext.Provider>
    </div >
  );
}
