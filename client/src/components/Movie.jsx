import React from "react";
import { useState, useEffect } from "react";

export default function Movie() {
  const [backendData, setBackendData] = useState([{}]);
  const [movieData, setMovieData] = useState();
  const [showResponse, setShowResponse] = useState(0);

  const getApiStatus = () => {
    fetch("/api/test")
      .then((response) => response.json())
      .then((data) => {
        setBackendData(data);
      });
  };

  useEffect(() => {
    getApiStatus();
  }, []);

  const getMovieApi = () => {
    fetch("/api/getMovie")
      .then((response) => response.json())
      .then((response) => {
        setMovieData(response);
      });
  };

  return (
    <div>
      {typeof backendData.message === "undefined" ? (
        <p>Loading...</p>
      ) : (
        <p> {backendData.message}</p>
      )}
      <button
        onClick={() => {
          getMovieApi();
          setShowResponse(1);
        }}
      >
        Click to do getMovie API call
      </button>
      {showResponse === 1 && (
        <div>
          <p>Showing Response Data</p>
          <p>{JSON.stringify(movieData)}</p>
        </div>
      )}
    </div>
  );
}
