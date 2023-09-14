import { useState, useEffect } from "react";
import { Outlet, Link } from "react-router-dom";
import NavBar from "./components/NavBar";

import "./index.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <NavBar />
      <div className="main-layout-body">
        <h2>Home Page</h2>
        <p>Welcome to the Bio-Net-Viz Website</p>
      </div>
    </div>
  );
}

export default App;
