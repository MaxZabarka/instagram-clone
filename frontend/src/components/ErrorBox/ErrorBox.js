import React from "react";
import Box from "../Box/Box";
import "./ErrorBox.scss";

const ErrorBox = (props) => {
  return (
    <div className="ErrorBox">
      <Box>
        <h1>{props.errorTitle || "Something went wrong!"}</h1>
        <p>{props.errorMessage}</p>
        {props.retry ? <button onClick={props.retry}>Try again</button> : null}
      </Box>
    </div>
  );
};

export default ErrorBox;
