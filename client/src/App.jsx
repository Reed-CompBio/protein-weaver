import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import { TbEyeCode } from "react-icons/tb";
import { PiHandTap } from "react-icons/pi";
import { GiFly } from "react-icons/gi";
import QueryImage from "./assets/query-img.png";
import { IconContext } from "react-icons";

import "./index.css";
import { Link } from "react-router-dom";
import MainLayout from "./layout/MainLayout";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <MainLayout>
        <div className="main-layout-body">
          <div className="home-body">
            <h2 className="home-title">Welcome to ProteinWeaver</h2>
            <h4>
              A tool for biological network exploration. <br></br>Learn more about this
              tool <Link className="home-link-about"to={"/about"}>here.</Link>
            </h4>
            <Link to={`/query`}>
              <button className="home-button">
                Start exploring networks with our tool!
              </button>
            </Link>
            <div className="home-body-container">
              <div>
                <div className="home-feature-container">
                  <IconContext.Provider
                    value={{ className: "home-icon", size: 70 }}
                  >
                    <TbEyeCode />
                  </IconContext.Provider>
                  <h4 className="home-feature-text">
                    Graph visualization through cytoscape.js
                  </h4>
                </div>
                <div className="home-feature-container">
                  <IconContext.Provider
                    value={{ className: "home-icon", size: 70 }}
                  >
                    <PiHandTap />
                  </IconContext.Provider>
                  <h4 className="home-feature-text">
                    Interactive graph exploration
                  </h4>
                </div>
                <div className="home-feature-container">
                  <IconContext.Provider
                    value={{ className: "home-icon", size: 70 }}
                  >
                    <GiFly />
                  </IconContext.Provider>
                  <h4 className="home-feature-text">
                    Support for multiple species interactome
                  </h4>
                </div>
              </div>
              <img
                className="home-query-img"
                src={QueryImage}
                alt="Query-Image"
              />
            </div>
          </div>
        </div>
      </MainLayout>
    </div>
  );
}

export default App;
