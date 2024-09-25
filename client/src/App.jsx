import React from "react";
import { TbEyeCode } from "react-icons/tb";
import { PiHandTap } from "react-icons/pi";
import { GiFly } from "react-icons/gi";
import QueryImage from "./assets/query-img.png";
import { IconContext } from "react-icons";
import HomeVideo from "./components/HomeVideo";
import "./index.css";
import { Link } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

function App() {
    return (
        <div>
            <MainLayout>
                <div className="main-layout-body">
                    <div className="home-body">
                        <h2 className="home-title">Welcome to ProteinWeaver</h2>
                        <h4>
                            A tool for protein network exploration in the
                            context of The Gene Ontology (GO).
                            <br></br>
                            Free and open to all users with no login
                            requirement.
                            <br></br>
                            Learn more about ProteinWeaver{" "}
                            <Link className="home-link-about" to={"/about"}>
                                here.
                            </Link>
                        </h4>
                        <br></br>
                        <Link to={`/query`}>
                            <div className="button-align">
                                {" "}
                                <button className="home-button">
                                    Start exploring networks!
                                </button>
                            </div>
                        </Link>
                        <div className="home-body-container">
                            <div className="home-feature-container">
                                <IconContext.Provider
                                    value={{ className: "home-icon", size: 70 }}
                                >
                                    <TbEyeCode />
                                </IconContext.Provider>
                                <h4 className="home-feature-text">
                                    Visualize networks with Cytoscape.js
                                </h4>
                            </div>
                            <div className="home-feature-container">
                                <IconContext.Provider
                                    value={{ className: "home-icon", size: 70 }}
                                >
                                    <PiHandTap />
                                </IconContext.Provider>
                                <h4 className="home-feature-text">
                                    Explore interactive graphs
                                </h4>
                            </div>
                            <div className="home-feature-container">
                                <IconContext.Provider
                                    value={{ className: "home-icon", size: 70 }}
                                >
                                    <GiFly />
                                </IconContext.Provider>
                                <h4 className="home-feature-text">
                                    Hosts multiple non-human model organisms
                                </h4>
                            </div>
                        </div>
                        <HomeVideo></HomeVideo>
                    </div>
                </div>
            </MainLayout>
        </div>
    );
}

export default App;
