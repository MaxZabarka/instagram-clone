import React from 'react';
import "./Spinner.scss"
import spinnerImage from "./spinner.png"

const Spinner = () => {
    return (
        <div className="Spinner">
            <img src={spinnerImage} alt="loading spinner"/>
        </div>
    );
};

export default Spinner;