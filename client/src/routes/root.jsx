import { Outlet, Link } from "react-router-dom";

export default function Root() {
    return (
      <>
          <h1>Bio-Net-Viz</h1>
          <nav>
            <ul>
              <li>
                <Link to={`/testing`}>Testing</Link>
              </li>
              <li>
                <Link to={`/about`}>About</Link>
              </li>
            </ul>
          </nav>
        <div id="detail">
            <Outlet />
        </div>
      </>
    );
  }