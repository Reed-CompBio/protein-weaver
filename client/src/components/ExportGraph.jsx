import React from "react";

export default function ExportGraph({ log, exportPNG, exportJSON, nodeList }) {
  // Function to download the file as JSON
  const downloadFile = ({ data, fileName, fileType }) => {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: fileType });
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement("a");
    a.download = fileName;
    a.href = window.URL.createObjectURL(blob);
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    a.dispatchEvent(clickEvt);
    a.remove();
  };

  // Convert the logs to JSON
  const exportLogJson = (e) => {
    e.preventDefault();
    downloadFile({
      data: JSON.stringify({ log }, null, 2),
      fileName: "PW-log.json",
      fileType: "application/json",
    });
  };

  const exportNodeListJson = (e) => {
    e.preventDefault();
    const timestamp = new Date().toISOString(); // Get the current timestamp
    downloadFile({
      data: JSON.stringify({ nodeList, timestamp }, null, 2), // Add the timestamp to the JSON
      fileName: "PW-nodes.json",
      fileType: "application/json",
    });
  };

  return (
    // display the download text
    <div className="exports-container">
      <a className="export" onClick={exportLogJson}>
        Export Log to JSON
      </a>
      <a className="export" onClick={exportPNG}>
        Export Graph to PNG
      </a>
      <a className="export" onClick={exportJSON}>
        Export Graph to JSON
      </a>
      <a className="export" onClick={exportNodeListJson}>
        Export Node List to JSON
      </a>
    </div>
  );
}
