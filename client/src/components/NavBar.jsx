import React from "react";
import { Link } from "react-router-dom";
import { FaInfo, FaHome, FaSearch } from 'react-icons/fa';
import { IconContext } from 'react-icons';

export default function NavBar() {
  return (
    <div>
      <div className="navbar">
        <h1>ProteinWeaver</h1>
        <ul className="navbar-menu">
          <li>
            <Link to={`/`}>
              <IconContext.Provider value={{
                size: '1.5em'
              }} >
                <FaHome />
              </IconContext.Provider>
            </Link>
          </li>
          {/* <li>
            <Link to={`/testing`}>Testing</Link>
          </li> */}
          <li>
            <Link to={`/about`}>
              <IconContext.Provider value={{
                size: '1.5em'
              }} >
                <FaInfo />
              </IconContext.Provider>
            </Link>
          </li>
          {/* <li>
            <Link to={`/flybase`}>Query Fly Interactome</Link>
          </li> */}
          <li>
            <Link to={`/query`}>
              <IconContext.Provider value={{
                size: '1.5em'
              }} >
                <FaSearch />
              </IconContext.Provider>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};