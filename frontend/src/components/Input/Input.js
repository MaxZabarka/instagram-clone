import React from "react";
import "./Input.scss";

const Input = (props) => {
  return (
    <div>
      <input type={props.type} name={props.name} />
    </div>
  );
};

export default Input;
