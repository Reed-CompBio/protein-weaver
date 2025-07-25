import React, { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { saveAs } from "file-saver";
import {
    NetworkParserPath,
    EdgeDataParser,
    NetworkParserNode,
} from "../tools/Parser";

// cytoscape imports
import CytoscapeComponent from "react-cytoscapejs";
import cytoscape from "cytoscape";
import { cytoscapeStyle, layout } from "../assets/CytoscapeConfig";
import cola from "cytoscape-cola";

// component imports
import QueryError from "./QueryError";
import Joyride, { STATUS } from "react-joyride";
import { guideConfig } from "../assets/GuideConfig";
import SearchBar from "./SearchBar";
import Legend from "./Legend";
import GraphExploration from "./GraphExploration";
import GraphSummary from "./GraphSummary";
import StatisticsTab from "./StatisticsTab";

// panel imports
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { fetchAvgDegree, getBasicStatistics } from "../tools/Statistics";

export default function Query() {
    const [query, setQuery] = useState({
        mode: "",
        species: "",
        protein: "",
        goTerm: "",
        k: [],
        ppi: false,
        regulatory: false,
    });
    const [networkResult, setNetworkResult] = useState({});
    const cyRef = useRef(cytoscape.Core | undefined);
    const [sidebarNode, setSidebarNode] = useState("");
    const [sourceNode, setSourceNode] = useState("");
    const [selectedNode, setSelectedNode] = useState("");
    const [predictionValue, setPredictionValue] = useState("");
    const [predictionDict, setPredictionDict] = useState(null);
    const [goTerm, setGoTerm] = useState("");
    const [edgeEvidence, setEdgeEvidence] = useState("");
    const [edgeSource, setEdgeSource] = useState("");
    const [edgeTarget, setEdgeTarget] = useState("");
    const [edgeType, setEdgeType] = useState("");
    const [regType, setRegType] = useState("");
    const [dataSource, setDataSource] = useState("");
    const [hasError, setHasError] = useState(false);
    const [queryCount, setQueryCount] = useState(0);
    const submitRef = useRef();
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [startGuide, setStartGuide] = useState(0);
    const [proteinOptions, setProteinOptions] = useState([]);
    const [goTermOptions, setGoTermOptions] = useState([]);
    const [ancestorsOptions, setAncestorsOptions] = useState([]);
    const [descendantsOptions, setDescendantsOptions] = useState([]);
    const [showSharedEdges, setShowSharedEdges] = useState(true);
    const [tempGoTermValue, setTempGoTermValue] = useState("");
    const [searchParams, setSearchParams] = useSearchParams({
        mode: "",
        species: "",
        protein: "",
        goTerm: "",
        k: "",
        ppi: "",
        regulatory: "",
    });
    const [guide, setGuide] = useState(guideConfig);
    const [activeModeButton, setActiveModeButton] = useState("");
    const [dataParsingStatus, setDataParsingStatus] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [rawData, setRawData] = useState("");
    const [networkStatistics, setNetworkStatistics] = useState({
        nodeCount: null,
        edgeCount: null,
        pathCount: null,
        avgNodeDegree: null,
    });
    const [queryComplete, setQueryComplete] = useState(false);
    const [pageState, setPageState] = useState(0);
    const [exState, setExState] = useState("");
    const [formValid, setFormValid] = useState(true);

    cytoscape.use(cola);

    useEffect(() => {
        const currentPPI = searchParams.get("ppi");
        const currentRegulatory = searchParams.get("regulatory");

        const ppiBoolean = currentPPI === "true";
        const regulatoryBoolean = currentRegulatory === "true";
        if (searchParams.get("species") === "") {
            setQuery({
                mode: "path",
                species: "txid7227",
                protein: searchParams.get("protein"),
                goTerm: searchParams.get("goTerm"),
                k: searchParams.get("k"),
                ppi: ppiBoolean,
                regulatory: regulatoryBoolean,
            });
            setActiveModeButton("path");
        } else {
            setQuery({
                mode: "path",
                species: searchParams.get("species"),
                protein: searchParams.get("protein"),
                goTerm: searchParams.get("goTerm"),
                k: searchParams.get("k"),
                ppi: ppiBoolean,
                regulatory: regulatoryBoolean,
            });
            setActiveModeButton("path");
        }
    }, []);

    // Get the search params from the URL
    useEffect(() => {
        const currentPPI = searchParams.get("ppi");
        const currentRegulatory = searchParams.get("regulatory");

        const ppiBoolean = currentPPI === "true";
        const regulatoryBoolean = currentRegulatory === "true";
        if (
            searchParams.get("mode") != "" &&
            searchParams.get("species") != "" &&
            searchParams.get("protein") != "" &&
            searchParams.get("goTerm") != "" &&
            searchParams.get("k") != "" &&
            searchParams.get("ppi") != "" &&
            searchParams.get("reg") != ""
        ) {
            setQuery({
                mode: searchParams.get("mode"),
                species: searchParams.get("species"),
                protein: searchParams.get("protein"),
                goTerm: searchParams.get("goTerm"),
                k: searchParams.get("k"),
                ppi: ppiBoolean,
                regulatory: regulatoryBoolean,
            });
            setActiveModeButton(searchParams.get("mode"));
        }
    }, []);

    // Open user guide
    useEffect(() => {
        if (startGuide != 0) {
            submitRef.current.click();
        }
    }, [startGuide]);

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
                const proteinAltNames = data.map((item) => item.alt_name);
                const proteinAltIds = data.map((item) => item.alt_id);
                const geneAltIds = data.map((item) => item.gene_alt_id);
                const geneNames = data.map((item) => item.gene_name);
                const proteinMerged = [
                    ...new Set(
                        proteinNames.concat(proteinIds).concat(proteinAltNames).concat(geneNames).concat(proteinAltIds).concat(geneAltIds)
                    ),
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
                const goTermMerged = [
                    ...new Set(goTermNames.concat(goTermIds)),
                ].filter((item) => item !== undefined);
                setGoTermOptions(goTermMerged);
            })
            .catch((error) => {
                console.error("Error fetching GO term options:", error);
            });
    }, []);

    // Show results if done loading
    useEffect(() => {
        if (dataParsingStatus) {
            setIsLoading(false);
        }
    }, [dataParsingStatus]);

    // need to rerun the graph layout whenever we have a new network result.
    useEffect(() => {
        if (pageState == 1) {
            const cy = cyRef.current;
            cy.layout(layout).run();
        }
    }, [networkResult]);

    //Once the network parsing has completed, get all the stats information of the subnetwork.
    useEffect(() => {
        if (dataParsingStatus) {
            //asyc function to get the average degree of subnetwork
            const getAvgDegree = async () => {
                try {
                    const avgNodeDegree = await fetchAvgDegree(
                        networkResult,
                        query.species
                    );
                    if (avgNodeDegree != null) {
                        setNetworkStatistics((prevState) => ({
                            ...prevState,
                            avgNodeDegree: avgNodeDegree.toFixed(1),
                        }));
                    } else {
                        setNetworkStatistics((prevState) => ({
                            ...prevState,
                            avgNodeDegree: 0,
                        }));
                    }
                } catch (error) {
                    return Promise.reject(
                        new Error(`${response.status} ${response.statusText}`)
                    );
                }
            };
            setNetworkStatistics(
                getBasicStatistics(networkResult, rawData, query)
            );
            getAvgDegree();
        }
    }, [dataParsingStatus]);

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;

        setQuery((prevData) => ({
            ...prevData,
            [name]: checked,
        }));

        // Check if the form is valid
        setFormValid(checked || query.ppi || query.regulatory);
    };

    // Function for submitting the query
    async function handleSubmit(e) {
        setQueryComplete(false);
        setSidebarNode(null);
        setNetworkResult({});
        setHasError(false);
        setQueryCount(queryCount + 1);
        setIsLoading(true);
        setDataParsingStatus(false);
        setErrorMessage("");
        setPredictionValue({ value: "Loading", rank: "Loading" });
        setEdgeEvidence("");
        setEdgeSource("");
        setEdgeTarget("");
        setEdgeType("");
        setRegType("");

        // get the k shortest paths for the query
        e.preventDefault();
        let network = null;
        let rawData = null;
        if (query.mode == "path") {
            try {
                const requestBody = Object.assign(query);
                network = await fetch("/api/getQueryByPath", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
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
                                new Error(
                                    `${response.status} ${response.statusText}`
                                )
                            );
                        }
                    })
                    .then((data) => {
                        rawData = data;
                        return NetworkParserPath(data);
                    });
            } catch (error) {
                console.error("Error getting the network:", error.message);
                setErrorMessage(error.message);
                setHasError(true);
                setPageState(0);
                setIsLoading(false);
                return;
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
                                new Error(
                                    `${response.status} ${response.statusText}`
                                )
                            );
                        }
                    })
                    .then((data) => {
                        rawData = data;
                        return NetworkParserNode(data, query.k);
                    });
            } catch (error) {
                console.error("Error getting the network:", error.message);
                setErrorMessage(error.message);
                setHasError(true);
                setPageState(0);
                setIsLoading(false);
                return;
            }
        }
        // get induced subgraph
        let tempNetwork = JSON.parse(JSON.stringify(network));
        if (tempNetwork != null) {
            let nodeList = { nodeList: tempNetwork.nodeList };
            nodeList.nodeList.push(tempNetwork.goTerm.id);
            setSourceNode(tempNetwork.nodes[0].data);
            setGoTerm(tempNetwork.goTerm);
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
                            return Promise.reject(
                                "some other error: " + response.status
                            );
                        }
                    })
                    .then((data) => {
                        setRawData(rawData);
                        setDataParsingStatus(true);
                        setQueryComplete(true);
                        return EdgeDataParser(
                            network,
                            data,
                            query.ppi,
                            query.regulatory
                        );
                    });
            } catch (error) {
                console.error("Error getting the network:", error);
                setHasError(true);
                setPageState(0);
                setIsLoading(false);
                return;
            }
            setNetworkResult(edgeData);
            setSearchParams({
                mode: query.mode,
                species: query.species,
                protein: network.nodes[0].data.id,
                goTerm: network.goTerm.id,
                k: query.k,
                ppi: query.ppi,
                regulatory: query.regulatory,
            });
        }
        setIsLoading(false);
        setPageState(1);
    }

    // when we have successfully queried something, we want to get the predicted values for all nodes in the network
    useEffect(() => {
        if (Object.keys(networkResult).length !== 0) {
            //getting prediction values for all nodes
            fetch("api/getPageRank", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    protein: selectedNode.id,
                    goTerm: searchParams.get("goTerm"),
                    species: searchParams.get("species"),
                }),
            })
                .then((response) => response.json())
                .then((data) => {
                    setPredictionDict(data.prediction_dict);
                })
                .catch((error) => console.error("Error:", error));
        }
    }, [networkResult]);

    //Scale node sizes to their degree
    useEffect(() => {
        if (networkResult != null && queryComplete == true) {
            let proteinDegree = {};
            const nodeLst = networkResult.nodes;
            const cy = cyRef.current;
            if (cy) {
                for (let i = 0; i < nodeLst.length; i++) {
                    proteinDegree[nodeLst[i].data.id] = nodeLst[i].data.degree;
                }
                let values = Object.values(proteinDegree);
                var pdMax = Math.max(...values),
                    pdMin = Math.min(...values);
                if (pdMax != pdMin) {
                    for (const [key, value] of Object.entries(proteinDegree)) {
                        let scaledValue =
                            ((value - pdMin) * 10) / (pdMax - pdMin);
                        if (scaledValue > 7) {
                            scaledValue = 7;
                        }
                        if (scaledValue < 2) {
                            scaledValue = 2;
                        }
                        cy.style()
                            .selector("node[id='" + key + "']")
                            .style({
                                width: scaledValue * 10,
                                height: scaledValue * 10,
                            })
                            .update();
                    }
                }
            }
        }
    }, [queryComplete]);

    // Get descendants for queried GO term
    useEffect(() => {
        if (networkResult.goTerm != null) {
            const requestBody = Object.assign(networkResult, {
                species: query.species,
            });
            fetch("/api/getDescendants", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            })
                .then((res) => res.json())
                .then((data) => {
                    const childNames = data
                        .map((item) => item.name)
                        .filter((item) => item !== undefined);
                    setDescendantsOptions(childNames);
                })
                .catch((error) => {
                    console.error("Error fetching GO term descendants:", error);
                });
        }
    }, [networkResult.goTerm]);

    // Get ancestors for queried GO term
    useEffect(() => {
        if (networkResult.goTerm != null) {
            const requestBody = Object.assign(networkResult, {
                species: query.species,
            });
            fetch("/api/getAncestors", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            })
                .then((res) => res.json())
                .then((data) => {
                    const ancestorNames = data
                        .map((item) => item.name)
                        .filter((item) => item !== undefined);
                    setAncestorsOptions(ancestorNames);
                })
                .catch((error) => {
                    console.error("Error fetching GO term ancestors:", error);
                });
        }
    }, [networkResult.goTerm]);

    // Hide/Show induced subgraph edges
    const handleSharedEdgesToggle = (e) => {
        setShowSharedEdges(!showSharedEdges);

        const cy = cyRef.current;
        if (cy) {
            if (showSharedEdges) {
                cy.style()
                    .selector("edge[type='shared']")
                    .style({
                        visibility: "hidden",
                    })
                    .update();
            } else {
                cy.style()
                    .selector("edge[type='shared']")
                    .style({
                        visibility: "visible",
                    })
                    .update();
            }
        }
    };

    // Allow users to change layout
    const handleLayoutChange = (layoutInput, e) => {
        const randomLayout = {
            name: "random",
            padding: 30,
            fit: true,
        };

        const gridLayout = {
            name: "grid",
            padding: 30,
            fit: true,
            avoidOverlap: true,
            avoidOverlapPadding: 10,
        };

        const cy = cyRef.current;
        if (cy) {
            if (layoutInput === "cola") {
                cy.layout(layout).run();
            }
            if (layoutInput === "random") {
                cy.layout(randomLayout).run();
            }
            if (layoutInput === "grid") {
                cy.layout(gridLayout).run();
            }
        }
    };

    // Allow users to change protein/GO term input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQuery((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Allow users to change species value
    const handleSpeciesChange = (e) => {
        setQuery({
            mode: query.mode,
            protein: "",
            goTerm: "",
            k: [],
            species: e.target.value,
            ppi: false,
            regulatory: false,
        });
    };

    // Store GO term value temporarily for new GO term selection when moving through hierarchy
    const storeGoTermValue = (e) => {
        setTempGoTermValue(e.target.value);
    };

    // Change GO term value when traversing hierarchy
    const handleGoTermChange = (e) => {
        setQuery((prevData) => ({
            ...prevData,
            goTerm: tempGoTermValue,
        }));
    };

    // Change protein value to the user selected protein
    const handleSourceNode = (e) => {
        const newSource = e.target.getAttribute("new-source-node");

        if (newSource) {
            setQuery((prevData) => ({
                ...prevData,
                protein: newSource,
            }));
        }
    };

    // Get current node data for summary panel
    const getSidePanelData = (node) => {
        let currentNode = node.target.data();
        setSidebarNode(currentNode);
    };

    // Set example queries in SearchBar
    const getExample = (i) => {
        if (query.species == "txid7227") {
            switch (i) {
                case 1:
                    setQuery({
                        mode: "path",
                        species: "txid7227",
                        protein: "egfr",
                        goTerm: "Wnt signaling pathway",
                        k: "4",
                        ppi: true,
                        regulatory: true,
                    });
                    setActiveModeButton("path");
                    setExState(String(i));
                    break;
                case 2:
                    setQuery({
                        mode: "node",
                        species: "txid7227",
                        protein: "flw",
                        goTerm: "apical constriction",
                        k: "7",
                        ppi: true,
                        regulatory: true,
                    });
                    setActiveModeButton("node");
                    setExState(String(i));
                    break;
                case 3:
                    setQuery({
                        mode: "path",
                        species: "txid7227",
                        protein: "flw",
                        goTerm: "myosin II binding",
                        k: "3",
                        ppi: true,
                        regulatory: true,
                    });
                    setActiveModeButton("path");
                    setExState(String(i));
                    break;
            }
        } else if (query.species == "txid7955") {
            switch (i) {
                case 1:
                    setQuery({
                        mode: "node",
                        species: "txid7955",
                        protein: "smad2",
                        goTerm: "DNA damage response",
                        k: "4",
                        ppi: true,
                        regulatory: true,
                    });
                    setActiveModeButton("node");
                    setExState(String(i));
                    break;
                case 2:
                    setQuery({
                        mode: "node",
                        species: "txid7955",
                        protein: "smad1",
                        goTerm: "positive regulation of cell development",
                        k: "4",
                        ppi: true,
                        regulatory: true,
                    });
                    setActiveModeButton("node");
                    setExState(String(i));
                    break;
                case 3:
                    setQuery({
                        mode: "node",
                        species: "txid7955",
                        protein: "smad5",
                        goTerm: "neural plate pattern specification",
                        k: "7",
                        ppi: true,
                        regulatory: true,
                    });
                    setActiveModeButton("node");
                    setExState(String(i));
                    break;
            }
        } else if (query.species == "txid224308") {
            switch (i) {
                case 1:
                    setQuery({
                        mode: "path",
                        species: "txid224308",
                        protein: "GanP",
                        goTerm: "ABC-type carbohydrate transporter activity",
                        k: "7",
                        ppi: true,
                        regulatory: true,
                    });
                    setActiveModeButton("path");
                    setExState(String(i));
                    break;
                case 2:
                    setQuery({
                        mode: "node",
                        species: "txid224308",
                        protein: "MrpD",
                        goTerm: "monoatomic cation transmembrane transporter activity",
                        k: "6",
                        ppi: true,
                        regulatory: true,
                    });
                    setActiveModeButton("node");
                    setExState(String(i));
                    break;
                case 3:
                    setQuery({
                        mode: "node",
                        species: "txid224308",
                        protein: "OppC",
                        goTerm: "sporulation",
                        k: "10",
                        ppi: true,
                        regulatory: true,
                    });
                    setActiveModeButton("node");
                    setExState(String(i));
                    break;
            }
        } else if (query.species == "txid559292") {
            switch (i) {
                case 1:
                    setQuery({
                        mode: "node",
                        species: "txid559292",
                        protein: "P32657",
                        goTerm: "DNA binding",
                        k: "10",
                        ppi: true,
                        regulatory: true,
                    });
                    setActiveModeButton("path");
                    setExState(String(i));
                    break;
                case 2:
                    setQuery({
                        mode: "path",
                        species: "txid559292",
                        protein: "p43639",
                        goTerm: "membrane-bounded organelle",
                        k: "10",
                        ppi: true,
                        regulatory: true,
                    });
                    setActiveModeButton("node");
                    setExState(String(i));
                    break;
                case 3:
                    setQuery({
                        mode: "node",
                        species: "txid559292",
                        protein: "p03069",
                        goTerm: "cellular macromolecule localization",
                        k: "10",
                        ppi: true,
                        regulatory: true,
                    });
                    setActiveModeButton("node");
                    setExState(String(i));
                    break;
            }
        } else if (query.species == "txid6239") {
            switch (i) {
                case 1:
                    setQuery({
                        mode: "path",
                        species: "txid6239",
                        protein: "rnt-1",
                        goTerm: "negative regulation of stem cell differentiation",
                        k: "7",
                        ppi: true,
                        regulatory: true,
                    });
                    setActiveModeButton("path");
                    setExState(String(i));
                    break;
                case 2:
                    setQuery({
                        mode: "node",
                        species: "txid6239",
                        protein: "gck-3",
                        goTerm: "hyperosmotic response",
                        k: "10",
                        ppi: true,
                        regulatory: true,
                    });
                    setActiveModeButton("node");
                    setExState(String(i));
                    break;
                case 3:
                    setQuery({
                        mode: "node",
                        species: "txid6239",
                        protein: "tac-1",
                        goTerm: "cytoskeleton organization",
                        k: "10",
                        ppi: true,
                        regulatory: true,
                    });
                    setActiveModeButton("node");
                    setExState(String(i));
                    break;
            }
        } else if (query.species == "txid3702") {
            switch (i) {
                case 1:
                    setQuery({
                        mode: "path",
                        species: "txid3702",
                        protein: "NPR1",
                        goTerm: "immune response",
                        k: "7",
                        ppi: true,
                        regulatory: true,
                    });
                    setActiveModeButton("path");
                    setExState(String(i));
                    break;
                case 2:
                    setQuery({
                        mode: "node",
                        species: "txid3702",
                        protein: "TGA3",
                        goTerm: "response to stimulus",
                        k: "10",
                        ppi: true,
                        regulatory: true,
                    });
                    setActiveModeButton("node");
                    setExState(String(i));
                    break;
                case 3:
                    setQuery({
                        mode: "node",
                        species: "txid3702",
                        protein: "RAD51",
                        goTerm: "homologous recombination",
                        k: "6",
                        ppi: true,
                        regulatory: true,
                    });
                    setActiveModeButton("node");
                    setExState(String(i));
                    break;
            }
        } else if (query.species == "txid511145") {
            switch (i) {
                case 1:
                    setQuery({
                        mode: "path",
                        species: "txid511145",
                        protein: "OxyR",
                        goTerm: "regulation of RNA metabolic process",
                        k: "7",
                        ppi: true,
                        regulatory: true,
                    });
                    setActiveModeButton("path");
                    setExState(String(i));
                    break;
                case 2:
                    setQuery({
                        mode: "node",
                        species: "txid511145",
                        protein: "ZntR",
                        goTerm: "zinc ion transmembrane transporter activity",
                        k: "10",
                        ppi: true,
                        regulatory: true,
                    });
                    setActiveModeButton("node");
                    setExState(String(i));
                    break;
                case 3:
                    setQuery({
                        mode: "node",
                        species: "txid511145",
                        protein: "Crp",
                        goTerm: "regulation of growth",
                        k: "6",
                        ppi: true,
                        regulatory: true,
                    });
                    setActiveModeButton("node");
                    setExState(String(i));
                    break;
            }
        }
    };

    //Resets highlighted example when switching species
    useEffect(() => {
        setExState("");
    }, [query.species]);

    // Allow users to export network as PNG
    const exportPNG = () => {
        const cy = cyRef.current;
        if (cy) {
            const pngBlob = cy.png({
                output: "base64uri",
                full: true,
                bg: "white",
            });
            saveAs(pngBlob, "PW-network.png");
        }
    };

    // Allow users to export network as JSON object
    const exportJSON = () => {
        const cy = cyRef.current;
        if (cy) {
            const elements = cy.json();
            const date = new Date().toLocaleDateString();
            const time = new Date().toLocaleTimeString([], { hour12: false });
            const fileName = `PW-network-${date}-${time}`;
            const jsonBlob = new Blob([JSON.stringify(elements, null, 2)], { type: "application/json" });
            saveAs(jsonBlob, fileName);
        }
    };

    // Track user interaction with the graph/queries
    const handleLog = (entry) => {
        setLogs((logs) => [...logs, entry]);
    };

    // Show/hide guide
    const handleGuide = (e) => {
        e.preventDefault();
        getExample(1);
        setStartGuide(startGuide + 1);
        setGuide({ run: true, steps: guide.steps });
    };

    // Hide guide when finished
    const handleJoyrideCallback = (data) => {
        const { status } = data;
        const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setGuide({ run: false, steps: guide.steps });
        }
    };

    // Allow users to change query mode
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
                ppi: query.ppi,
                regulatory: query.regulatory,
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
                ppi: query.ppi,
                regulatory: query.regulatory,
            });
        }
    };

    // when a user selects a node or if the prediction dict changes, set the the currently selected prediction values
    useEffect(() => {
        if (
            selectedNode.id != null &&
            predictionDict != null &&
            selectedNode.id in predictionDict &&
            predictionDict[selectedNode.id].value != undefined &&
            predictionDict[selectedNode.id].rank != undefined
        ) {
            setPredictionValue({
                value: predictionDict[selectedNode.id].value,
                rank: predictionDict[selectedNode.id].rank,
            });
        }
    }, [selectedNode, predictionDict]);

    return (
        <div>
            {/* pageState is responsible for handling if we are in query search only page or query w/ results page */}
            {pageState == 0 && (
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
                    <SearchBar // SearchBar component
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
                        exState={exState}
                        handleCheckboxChange={handleCheckboxChange}
                    />
                    {hasError && <QueryError errorMessage={errorMessage} />}

                    {isLoading && <div className="loader"></div>}
                </div>
            )}

            {pageState == 1 && (
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
                    <div className="search-bar-container">
                        <SearchBar // SearchBar component
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
                            exState={exState}
                            handleCheckboxChange={handleCheckboxChange}
                        />

                        {hasError && <QueryError errorMessage={errorMessage} />}

                        {isLoading && <div className="loader"></div>}
                    </div>
                    {/* Render response to user input */}
                    <div className="panel-container">
                        <PanelGroup direction="horizontal">
                            <Panel
                                className="panel"
                                defaultSize={60}
                                minSize={60}
                            >
                                <PanelGroup
                                    direction="vertical"
                                    className="left-panel-container"
                                >
                                    <Panel defaultSize={70} minSize={20}>
                                        <div className="graph-panel-container">
                                            <CytoscapeComponent // Render Cytoscape visualization
                                                className="cytoscape-graph"
                                                elements={CytoscapeComponent.normalizeElements(
                                                    networkResult
                                                )}
                                                style={{
                                                    cursor: "pointer",
                                                }}
                                                stylesheet={cytoscapeStyle}
                                                layout={layout}
                                                cy={(cy) => {
                                                    cyRef.current = cy;
                                                    cy.on(
                                                        "tap",
                                                        "node",
                                                        (evt) => {
                                                            getSidePanelData(
                                                                evt
                                                            );
                                                            setSelectedNode(
                                                                evt.target
                                                                    ._private
                                                                    .data
                                                            );
                                                        }
                                                    );
                                                    cy.on(
                                                        "tap",
                                                        "edge",
                                                        (evt) => {
                                                            setEdgeEvidence(
                                                                evt.target
                                                                    ._private
                                                                    .data
                                                                    .evidence
                                                            );
                                                            setEdgeSource(
                                                                evt.target
                                                                    ._private
                                                                    .data.source
                                                            );
                                                            setEdgeTarget(
                                                                evt.target
                                                                    ._private
                                                                    .data.target
                                                            );
                                                            setEdgeType(
                                                                evt.target
                                                                    ._private
                                                                    .data
                                                                    .relType
                                                            );
                                                            setRegType(
                                                                evt.target
                                                                    ._private
                                                                    .data
                                                                    .regType
                                                            );
                                                            setDataSource(
                                                                evt.target
                                                                    ._private
                                                                    .data
                                                                    .dataSource
                                                            );
                                                        }
                                                    );
                                                }}
                                            />
                                            <Legend // Render legend within Cytoscape visualization
                                                handleSharedEdgesToggle={
                                                    handleSharedEdgesToggle
                                                }
                                                showSharedEdges={
                                                    showSharedEdges
                                                }
                                            />
                                        </div>
                                    </Panel>
                                    <PanelResizeHandle className="panel-resize-handle" />
                                    <Panel
                                        defaultSize={30}
                                        minSize={10}
                                        maxSize={30}
                                    >
                                        <div className="graph-exploration-panel-container">
                                            <GraphExploration // Render graph exploration panel
                                                currentNode={sidebarNode}
                                                handleSourceNode={
                                                    handleSourceNode
                                                }
                                                handleLayoutChange={
                                                    handleLayoutChange
                                                }
                                                handleSubmit={handleSubmit}
                                                parentGoTerms={ancestorsOptions}
                                                childrenGoTerms={
                                                    descendantsOptions
                                                }
                                                storeGoTermValue={
                                                    storeGoTermValue
                                                }
                                                handleGoTermChange={
                                                    handleGoTermChange
                                                }
                                            />
                                        </div>
                                    </Panel>
                                </PanelGroup>
                            </Panel>
                            <PanelResizeHandle className="panel-resize-handle" />
                            <Panel
                                className="panel"
                                defaultSize={40}
                                minSize={20}
                            >
                                <PanelGroup
                                    direction="vertical"
                                    className="right-panel-container"
                                >
                                    <Panel defaultSize={60} minSize={10}>
                                        <div className="summary-panel-container">
                                            <GraphSummary
                                                currentNode={sidebarNode}
                                                sourceNode={sourceNode}
                                                query={query}
                                                goTerm={goTerm}
                                                predictionValue={predictionValue}
                                                exportPNG={exportPNG}
                                                exportJSON={exportJSON}
                                                searchExecuted={searchParams}
                                                queryCount={queryCount}
                                                logs={logs}
                                                handleLog={handleLog}
                                                networkStatistics={networkStatistics}
                                                nodeList={networkResult.nodeList}
                                            />
                                        </div>
                                    </Panel>
                                    <PanelResizeHandle className="panel-resize-handle" />
                                    <Panel defaultSize={40} minSize={10}>
                                        <StatisticsTab
                                            nodeList={networkResult.nodeList}
                                            edgeEvidence={edgeEvidence}
                                            edgeSource={edgeSource}
                                            edgeTarget={edgeTarget}
                                            edgeType={edgeType}
                                            regType={regType}
                                            dataSource={dataSource}
                                            currentNode={sidebarNode}
                                            query={query}
                                            goTerm={goTerm}
                                            predictionValue={predictionValue}
                                            searchExecuted={searchParams}
                                            networkResult={networkResult}
                                        ></StatisticsTab>
                                    </Panel>
                                </PanelGroup>
                            </Panel>
                        </PanelGroup>
                    </div>
                </div>
            )}
        </div>
    );
}
