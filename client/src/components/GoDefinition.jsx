import { React, useState } from 'react';
import { TbChevronCompactDown, TbChevronCompactUp } from 'react-icons/tb';
import { IconContext } from 'react-icons';

export default function GoDefinition({ children }) {
    const [isOpen, setIsOpen] = useState(false);

    // Open and close the definition when clicked
    const handleShow = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <div>
            {/* Dropdown to toggle GO term definition display */}
            <div className="go-definition" onClick={handleShow}>
                <p>GO Term Definition: </p>
                <IconContext.Provider value={{ className: 'icon', size: '1.5em', color: '#7F95D1' }}>
                    {isOpen ? <TbChevronCompactUp className="icon-top-right" /> : <TbChevronCompactDown className="icon-top-right" />}
                </IconContext.Provider>
            </div>
            {/* Text content of GO term definition */}
            {isOpen && <div className="go-def-content">{children}</div>}
        </div>
    );
}