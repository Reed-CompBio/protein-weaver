import React from "react";
import { Link } from "react-router-dom";

export default function NavBar() {
  return (
    <div>
      <div className="navbar">
        <h1>Bio-Net-Viz</h1>
        <ul className="navbar-menu">
          <li>
            <Link to={`/`}>Home</Link>
          </li>
          <li>
            <Link to={`/testing`}>Testing</Link>
          </li>
          <li>
            <Link to={`/about`}>About</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
