import React from "react";
import Box from "../Box/Box";
import "./ErrorBox.scss";

const ErrorBox = (props) => {
  return (
    <div className="ErrorBox">
      <Box>
        <h1>Something went wrong!</h1>
        <p>{props.errorMessage}</p>
        <button onClick={props.retry}>Try again</button>
      </Box>
    </div>
  );
};

export default ErrorBox;
