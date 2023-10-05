import React from 'react';

export default function ExportLogJSON({ log }) {
    const downloadFile = ({ data, fileName, fileType }) => {
        // Create a blob with the data we want to download as a file
        const blob = new Blob([data], { type: fileType })
        // Create an anchor element and dispatch a click event on it
        // to trigger a download
        const a = document.createElement('a')
        a.download = fileName
        a.href = window.URL.createObjectURL(blob)
        const clickEvt = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true,
        })
        a.dispatchEvent(clickEvt)
        a.remove()
      };

    const exportToJson = e => {
        e.preventDefault()
        downloadFile({
          data: JSON.stringify({ log }),
          fileName: 'log.json',
          fileType: 'text/json',
        })
      };

    return(
        <div>
            <a
            className="export"
            onClick={exportToJson}
            >
            Export Log to JSON
            </a>
        </div>
    );
      
};