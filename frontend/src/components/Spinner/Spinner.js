import React from 'react';
import "./Spinner.scss"
import spinnerImage from "./spinner.png"

const Spinner = (props) => {
    return (
        <div className="Spinner">
            <img src={spinnerImage} style={{ width: props.size }} alt="loading spinner" />
        </div>
    );
};

export default Spinner;