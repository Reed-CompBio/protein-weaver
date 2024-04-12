import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { FaInfo, FaHome, FaSearch } from "react-icons/fa";
import { IconContext } from "react-icons";
import { guideConfig } from "../assets/GuideConfig";
import SearchBar from "./SearchBar";
import Joyride, { STATUS } from "react-joyride";
import QueryError from "./QueryError";

export default function NavBar() {
  // constants for queries
  const [query, setQuery] = useState({
    mode: "",
    species: "",
    protein: "",
    goTerm: "",
    k: [],
  });
  const [searchParams, setSearchParams] = useSearchParams({
    mode: "",
    species: "",
    protein: "",
    goTerm: "",
    k: "",
  });
  const [activeModeButton, setActiveModeButton] = useState("");
  const submitRef = useRef();
  const [queryCount, setQueryCount] = useState(0);

  // constants for error messages
  const [dataParsingStatus, setDataParsingStatus] = useState(false);
  const [pageState, setPageState] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // constants for autocomplete options
  const [proteinOptions, setProteinOptions] = useState([]);
  const [goTermOptions, setGoTermOptions] = useState([]);

  // constants for guide
  const [startGuide, setStartGuide] = useState(0);
  const [guide, setGuide] = useState(guideConfig);

  // Set the query and set default if blank
  useEffect(() => {
    if (searchParams.get("species") === "") {
      setQuery({
        mode: "path",
        species: "txid7227",
        protein: searchParams.get("protein"),
        goTerm: searchParams.get("goTerm"),
        k: searchParams.get("k"),
      });
      setActiveModeButton("path");
    } else {
      setQuery({
        mode: "path",
        species: searchParams.get("species"),
        protein: searchParams.get("protein"),
        goTerm: searchParams.get("goTerm"),
        k: searchParams.get("k"),
      });
      setActiveModeButton("path");
    }
  }, []);

  // Get the search params from the URL
  useEffect(() => {
    if (
      searchParams.get("mode") != "" &&
      searchParams.get("species") != "" &&
      searchParams.get("protein") != "" &&
      searchParams.get("goTerm") != "" &&
      searchParams.get("k") != ""
    ) {
      setQuery({
        mode: searchParams.get("mode"),
        species: searchParams.get("species"),
        protein: searchParams.get("protein"),
        goTerm: searchParams.get("goTerm"),
        k: searchParams.get("k"),
      });
      setActiveModeButton(searchParams.get("mode"));
    }
  }, []);

  // Get autocomplete options for Proteins
  useEffect(() => {
    fetch("/api/getProteinOptions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // You can add any other headers if needed
      },
      body: JSON.stringify(query),
    })
      .then((res) => res.json())
      .then((data) => {
        const proteinNames = data.map((item) => item.name);
        const proteinIds = data.map((item) => item.id);
        const proteinMerged = [
          ...new Set(proteinNames.concat(proteinIds)),
        ].filter((item) => item !== undefined);
        setProteinOptions(proteinMerged);
      })
      .catch((error) => {
        console.error("Error fetching protein options:", error);
      });
  }, [query.species]);

  // Get autocomplete options for GO Terms
  useEffect(() => {
    fetch("/api/getGoTermOptions")
      .then((res) => res.json())
      .then((data) => {
        const goTermNames = data.map((item) => item.name);
        const goTermIds = data.map((item) => item.id);
        const goTermMerged = [...new Set(goTermNames.concat(goTermIds))].filter(
          (item) => item !== undefined
        );
        setGoTermOptions(goTermMerged);
      })
      .catch((error) => {
        console.error("Error fetching GO term options:", error);
      });
  }, []);

  // Open user guide
  useEffect(() => {
    if (startGuide != 0) {
      submitRef.current.click();
    }
  }, [startGuide]);

  // Set loading status
  useEffect(() => {
    if (dataParsingStatus) {
      setShowResults(true);
      setIsLoading(false);
    }
  }, [dataParsingStatus]);

  // Function for submitting the query
  async function handleSubmit(e) {
    setSidebarNode(null);
    setNetworkResult({});
    setHasError(false);
    setQueryCount(queryCount + 1);
    setIsLoading(true);
    setShowResults(false);
    setDataParsingStatus(false);
    setErrorMessage("");

    setSearchParams({
      mode: query.mode,
      species: query.species,
      protein: query.protein,
      goTerm: query.goTerm,
      k: query.k,
    });

    // get the k shortest paths for the query
    e.preventDefault();
    let network = null;
    if (query.mode == "path") {
      try {
        network = await fetch("/api/getQuery", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(query),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else if (response.status === 404) {
              return response.json().then((data) => {
                throw new Error(data.error); // Throw an error with the statusText from the response body
              });
            } else {
              return Promise.reject(
                new Error(`${response.status} ${response.statusText}`)
              );
            }
          })
          .then((data) => {
            setNetworkResult(
              NetworkParserPath(data, query.protein, query.goTerm)
            );
            return NetworkParserPath(data, query.protein, query.goTerm);
          });
      } catch (error) {
        console.error("Error getting the network:", error.message);
        setErrorMessage(error.message);
        setHasError(true);
      }
    } else if (query.mode == "node") {
      try {
        network = await fetch("/api/getQueryByNode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(query),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else if (response.status === 404) {
              return response.json().then((data) => {
                throw new Error(data.error); // Throw an error with the statusText from the response body
              });
            } else {
              return Promise.reject(
                new Error(`${response.status} ${response.statusText}`)
              );
            }
          })
          .then((data) => {
            setNetworkResult(NetworkParserNode(data, query.protein, query.k));
            return NetworkParserNode(data, query.protein, query.k);
          });
      } catch (error) {
        console.error("Error getting the network:", error.message);
        setErrorMessage(error.message);
        setHasError(true);
      }
    }

    // get induced subgraph
    if (network != null) {
      let nodeList = { nodeList: network.nodeList };
      nodeList.nodeList.push(network.goTerm.id);
      setSourceNode(network.nodes[0].data);
      setGoTerm(network.goTerm);

      let edgeData = null;
      try {
        edgeData = await fetch("/api/getEdgeData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(nodeList),
        })
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else if (response.status === 404) {
              return Promise.reject("error 404");
            } else {
              return Promise.reject("some other error: " + response.status);
            }
          })
          .then((edgeData) => {
            setNetworkResult(EdgeDataParser(network, edgeData));
            setDataParsingStatus(true);
            return EdgeDataParser(network, edgeData);
          });
      } catch (error) {
        console.error("Error getting the network:", error);
        setHasError(true);
      }
    }
    setIsLoading(false);
  }

  // Function for setting the active protein or GO term
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuery((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function for setting the active species
  const handleSpeciesChange = (e) => {
    setQuery((prevData) => ({
      ...prevData,
      species: e.target.value,
    }));
  };

  // Function for setting the query mode
  const handleQueryMode = (e) => {
    if (e.target.value == "Paths") {
      setQuery((prevState) => ({
        ...prevState,
        mode: "path",
      }));
      setActiveModeButton("path");
      setSearchParams({
        mode: "path",
        species: query.species,
        protein: query.protein,
        goTerm: query.goTerm,
        k: query.k,
      });
    } else {
      setQuery((prevState) => ({
        ...prevState,
        mode: "node",
      }));
      setActiveModeButton("node");
      setSearchParams({
        mode: "node",
        species: query.species,
        protein: query.protein,
        goTerm: query.goTerm,
        k: query.k,
      });
    }
  };

  // Function for performing an example PW query
  // May want to add species-specific ones
  const getExample = (i) => {
    switch (i) {
      case 1:
        setQuery({
          mode: "path",
          species: "txid7227",
          protein: "egfr",
          goTerm: "Wnt signaling pathway",
          k: "4",
        });
        setActiveModeButton("path");
        break;
      case 2:
        setQuery({
          mode: "node",
          species: "txid7227",
          protein: "flw",
          goTerm: "apical constriction",
          k: "7",
        });
        setActiveModeButton("node");
        break;
      case 3:
        setQuery({
          mode: "path",
          species: "txid7227",
          protein: "flw",
          goTerm: "myosin II binding",
          k: "3",
        });
        setActiveModeButton("path");
        break;
    }
  };

  // Function for showing user guide
  const handleGuide = (e) => {
    e.preventDefault();
    // getExample(1);
    setStartGuide(startGuide + 1);
    setGuide({ run: true, steps: guide.steps });
  };

  const handleJoyrideCallback = (data) => {
    const { status } = data;
    const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setGuide({ run: false, steps: guide.steps });
    }
  };

  return (
    <div>
      <div className="navbar">
        <h1 className="website-title">ProteinWeaver</h1>
        <Joyride
          callback={handleJoyrideCallback}
          continuous
          hideCloseButton
          run={guide.run}
          scrollToFirstStep
          showProgress={true}
          showSkipButton
          disableOverlayClose
          steps={guide.steps}
          styles={{
            options: {
              zIndex: 10000,
            },
          }}
        />
        <SearchBar
          handleSubmit={handleSubmit}
          submitRef={submitRef}
          query={query}
          handleInputChange={handleInputChange}
          getExample={getExample}
          proteinOptions={proteinOptions}
          goTermOptions={goTermOptions}
          handleGuide={handleGuide}
          handleSpeciesChange={handleSpeciesChange}
          handleQueryMode={handleQueryMode}
          activeModeButton={activeModeButton}
        />
        <ul className="navbar-menu">
          <li>
            <Link to={`/`}>
              <button className="navbar-menu-button">
                <IconContext.Provider
                  value={{
                    size: "1.5em",
                  }}
                >
                  <FaHome />
                </IconContext.Provider>
                <div>Home</div>
              </button>
            </Link>
          </li>
          {/* <li>
            <Link to={`/testing`}>Testing</Link>
          </li> */}
          <li>
            <Link to={`/query`}>
              <button className="navbar-menu-button">
                <IconContext.Provider
                  value={{
                    size: "1.5em",
                  }}
                >
                  <FaSearch />
                </IconContext.Provider>
                <div>Query</div>
              </button>
            </Link>
          </li>
          <li>
            <Link to={`/about`}>
              <button className="navbar-menu-button">
                <IconContext.Provider
                  value={{
                    size: "1.5em",
                  }}
                >
                  <FaInfo />
                </IconContext.Provider>
                <div>About</div>
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
