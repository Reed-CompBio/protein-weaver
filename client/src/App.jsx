import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";

import "./index.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <NavBar />
      <div className="main-layout-body">
        <h2>Home Page</h2>
        <p>Welcome to ProteinWeaver</p>
      </div>
    </div>
  );
}

export default App;
