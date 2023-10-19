import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { saveAs } from "file-saver";
import { NetworkParser, EdgeDataParser } from "../tools/Parser";
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import { cytoscapeStyle, layout } from "../assets/CytoscapeConfig";
import Sidebar from "./Sidebar";
import QueryError from "./QueryError";
import Joyride, { STATUS } from "react-joyride";
import SearchBar from "./SearchBar";
import { guideConfig } from "../assets/GuideConfig";

export default function FlyQuery() {
  const [query, setQuery] = useState({ protein: "", goTerm: "", k: [] });
  const [showResults, setShowResults] = useState(false);
  const [networkResult, setNetworkResult] = useState({});
  const cyRef = useRef(cytoscape.Core | undefined);
  const [sidebarNode, setSidebarNode] = useState("");
  const [sourceNode, setSourceNode] = useState("");
  const [goTerm, setGoTerm] = useState("");
  const [hasError, setHasError] = useState(false);
  const [queryCount, setQueryCount] = useState(0);
  const submitRef = useRef();
  const [logs, setLogs] = useState([]);
  const [startGuide, setStartGuide] = useState(0);
  const [proteinOptions, setProteinOptions] = useState([]);
  const [goTermOptions, setGoTermOptions] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams({
    species: "txid7227",
    protein: "",
    goTerm: "",
    k: "",
  });
  const [guide, setGuide] = useState(guideConfig);

  useEffect(() => {
    if (
      searchParams.get("protein") != "" &&
      searchParams.get("goTerm") != "" &&
      searchParams.get("k") != ""
    ) {
      setQuery({
        protein: searchParams.get("protein"),
        goTerm: searchParams.get("goTerm"),
        k: searchParams.get("k"),
      });
    }
  }, []);

  useEffect(() => {
    if (startGuide != 0) {
      submitRef.current.click();
    }
  }, [startGuide]);

  useEffect(() => {
    fetch("/api/getProteinOptions")
      .then((res) => res.json())
      .then((data) => {
        const proteinNames = data.map((item) => item.name);
        const proteinIds = data.map((item) => item.id);
        const proteinMerged = [...new Set(proteinNames.concat(proteinIds))].filter(item => item !== undefined);
        setProteinOptions(proteinMerged);
      })
      .catch((error) => {
        console.error("Error fetching protein options:", error);
      });
  }, []);

  useEffect(() => {
    fetch("/api/getGoTermOptions")
      .then((res) => res.json())
      .then((data) => {
        const goTermNames = data.map((item) => item.name);
        const goTermIds = data.map((item) => item.id);
        const goTermMerged = [...new Set(goTermNames.concat(goTermIds))].filter(item => item !== undefined);
        setGoTermOptions(goTermMerged);
      })
      .catch((error) => {
        console.error("Error fetching GO term options:", error);
      });
  }, []);

  async function handleSubmit(e) {
    setSidebarNode(null);
    setNetworkResult({});
    setHasError(false);
    setQueryCount(queryCount + 1);

    setSearchParams({
      species: "txid7227",
      protein: query.protein,
      goTerm: query.goTerm,
      k: query.k,
    });

    e.preventDefault();
    let network = null;
    try {
      network = await fetch("/api/getFlyBase", {
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
            return Promise.reject("error 404");
          } else {
            return Promise.reject("some other error: " + response.status);
          }
        })
        .then((data) => {
          setNetworkResult(NetworkParser(data, query.protein, query.goTerm));
          return NetworkParser(data, query.protein, query.goTerm);
        });
    } catch (error) {
      console.error(
        "Error getting the network:",
        error,
        ". Protein or GO term may not exist"
      );
      setHasError(true);
    }

    if (network != null) {
      let nodeList = { nodeList: network.nodeList };
      // need to change this logic from using the query.goTerm to accessing properties of go_term nodes
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
            return EdgeDataParser(network, edgeData);
          });

        setShowResults(true);
      } catch (error) {
        console.error("Error getting the network:", error);
        setHasError(true);
      }
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setQuery((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSourceNode = (e) => {
    const newSource = e.target.getAttribute("new-source-node");

    if (newSource) {
      setQuery((prevData) => ({
        ...prevData,
        protein: newSource,
      }));
    }
  };

  const getSidePanelData = (node) => {
    let currentNode = node.target.data();
    setSidebarNode(currentNode);
  };

  const getExample = (i) => {
    switch (i) {
      case 1:
        setQuery({ protein: "egfr", goTerm: "GO:0016055", k: "4" });
        break;
      case 2:
        setQuery({ protein: "flw", goTerm: "GO:0003383", k: "3" });
        break;
      case 3:
        setQuery({ protein: "flw", goTerm: "GO:0045159", k: "7" });
        break;
    }
  };

  const exportPNG = () => {
    const cy = cyRef.current;
    if (cy) {
      const pngBlob = cy.png({ output: "base64uri", full: true, bg: "white" });
      saveAs(pngBlob, "graph.png");
    }
  };

  const handleLog = (entry) => {
    setLogs((logs) => [...logs, entry]);
  };

  const handleGuide = (e) => {
    console.log("handleGuide")
    e.preventDefault();
    getExample(1);
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
      <div className="search-box-align">
        <SearchBar
          handleSubmit={handleSubmit}
          submitRef={submitRef}
          query={query}
          handleInputChange={handleInputChange}
          getExample={getExample}
          proteinOptions={proteinOptions}
          goTermOptions={goTermOptions}
          handleGuide={handleGuide}
        />

        {hasError && <QueryError />}

        {showResults && JSON.stringify(networkResult) != "{}" && (
          <div className="sidebar-align">
            <CytoscapeComponent
              className="cytoscape-graph"
              elements={CytoscapeComponent.normalizeElements(networkResult)}
              style={{
                width: "800px",
                height: "500px",
              }}
              stylesheet={cytoscapeStyle}
              layout={layout}
              cy={(cy) => {
                cyRef.current = cy;
                cy.on("click", "node", (evt) => {
                  getSidePanelData(evt);
                });
              }}
            />
            <Sidebar
              currentNode={sidebarNode}
              sourceNode={sourceNode}
              query={query}
              goTerm={goTerm}
              newSourceNode={handleSourceNode}
              handleSubmit={handleSubmit}
              exportPNG={exportPNG}
              searchExecuted={searchParams}
              queryCount={queryCount}
              logs={logs}
              handleLog={handleLog}
            />
          </div>
        )}
      </div>
    </div>
  );
}
