import React from "react";
import { FaGithub } from "react-icons/fa";
import { BiSolidMessageAltError } from "react-icons/bi";
import { IconContext } from "react-icons";
import { Link } from "react-router-dom";
import { MdOutlineMenuBook } from "react-icons/md";


export default function Footer() {
  const githubLink = "https://github.com/Reed-CompBio/protein-weaver/";
  const githubIssuesLink = "https://github.com/Reed-CompBio/protein-weaver/issues/";
  const githuPagesDoc = "https://reed-compbio.github.io/protein-weaver/"

  return (
    <div className="footer-container">
      <footer className="footer">
        <p className="footer-title">ProteinWeaver © 2023</p>
        {/* Terms of Service */}
        <Link to={"/tos"}>TOS</Link>
        <p> | </p>
        {/* FAQs */}
        <Link to={"/faq"}>FAQ</Link>
        <p> | </p>
        <IconContext.Provider
          value={{
            size: "1.2em",
            align: "middle",
          }}
        >
          {/* GitHub */}
          <a href={githubLink} target="_blank" rel="noopener noreferrer">
            <FaGithub className="footer-icon" />
          </a>
          <p> | </p>
          {/* GitHub Issues */}
          <a href={githubIssuesLink} target="_blank" rel="noopener noreferrer">
            <BiSolidMessageAltError className="footer-icon" />
          </a>
          <p> | </p>
          {/* GitHub Issues */}
          <a href={githuPagesDoc} target="_blank" rel="noopener noreferrer">
            <MdOutlineMenuBook className="footer-icon" />
          </a>
        </IconContext.Provider>
      </footer>
    </div>
  );
}
