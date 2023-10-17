import React from 'react';
import { FaGithub } from 'react-icons/fa';
import { BiSolidMessageAltError } from 'react-icons/bi';
import { IconContext } from 'react-icons';

export default function Footer() {
    const githubLink = 'https://github.com/Reed-CompBio/protein-weaver/';
    const githubIssuesLink = 'https://github.com/Reed-CompBio/protein-weaver/issues/';

    return (
        <footer className="footer">
            <IconContext.Provider value={{
                className: 'icon', size: '1.5em'
            }} >
                <a href={githubLink} target="_blank" rel="noopener noreferrer">
                    <FaGithub className="footer-icon" />
                </a>
                <a href={githubIssuesLink} target="_blank" rel="noopener noreferrer">
                    <BiSolidMessageAltError className="footer-icon" />
                </a>
            </ IconContext.Provider>
        </footer>
    );
};