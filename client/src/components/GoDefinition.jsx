import { React, useState } from 'react';
import { TbChevronCompactDown, TbChevronCompactUp } from 'react-icons/tb';
import { IconContext } from 'react-icons';

export default function GoDefinition({ open, children }) {
    const [isOpen, setIsOpen] = useState(open);

    const handleShow = () => {
        setIsOpen((prev) => !prev);
    };

    return (
        <>
            <div>
                <div>
                    <div className="go-definition" onClick={handleShow}>
                        <p>GO term definition: </p>
                        {!isOpen ? (
                            <IconContext.Provider value={{
                                className: 'icon', size: '1.5em', color: '#7F95D1'
                            }} >
                                <TbChevronCompactDown className="icon-top-right" />
                            </ IconContext.Provider>
                        ) : (
                            <IconContext.Provider value={{
                                className: 'icon', size: '1.5em', color: '#7F95D1'
                            }} >
                                <TbChevronCompactUp className="icon-top-right" />
                            </ IconContext.Provider>
                        )}
                    </div>
                </div>

                <div className="go-def-content">
                    <div>{isOpen && <div>{children}</div>}</div>
                </div>
            </div >
        </>
    );
}