import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";

import "./index.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <div className="navbar">
        <h1>Bio-Net-Viz</h1>
        <ul className="navbar-menu">
          <li>
            <Link to={`/testing`}>Testing</Link>
          </li>
          <li>
            <Link to={`/about`}>About</Link>
          </li>
        </ul>
      </div>
      <div id="detail">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
