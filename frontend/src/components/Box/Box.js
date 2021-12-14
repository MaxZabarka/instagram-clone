import React from 'react';
import "./Box.scss"

const Box = (props) => {
    return (
        <div className="Box">
            {props.children}
        </div>
    );
};

export default Box;