import React from "react";
import chevronImage from "./chevron.png";
import "./NavArrow.scss";

const NavArrow = (props) => {
  return (
    <div className="NavArrow" onClick={props.onClick}>
      <img
        src={chevronImage}
        chevronImage
        alt="next/previous post"
        style={props.right ? { transform: "scaleX(-1)" } : {}}
      />
    </div>
  );
};

export default NavArrow;
