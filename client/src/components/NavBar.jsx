import React from "react";
import { Link } from "react-router-dom";
import { FaInfo, FaHome, FaSearch, FaCloudDownloadAlt} from "react-icons/fa";
import { IconContext } from "react-icons";

export default function NavBar() {
  return (
    <div className="navbar">
      <h1 className="website-title">ProteinWeaver</h1>
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
        <li>
          <Link to={`/download`}>
            <button className="navbar-menu-button">
              <IconContext.Provider
                value={{
                  size: "1.5em",
                }}
              >
                <FaCloudDownloadAlt />
              </IconContext.Provider>
              <div>Data</div>
            </button>
          </Link>
        </li>
      </ul>
    </div>
  );
}
