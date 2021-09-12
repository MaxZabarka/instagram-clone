import React from "react";
import "./ImageIcon.scss";

const ImageIcon = (props) => {
  console.log(`props.index`, props.index);
  return (
    <div className="ImageIcon" onClick={props.onClick}>
      <div
        className={props.index || props.index === 0 ? "active" : ""}
        onClick={props.onIndexClick}
      >
        {props.index || props.index === 0 ? props.index + 1 : null}
      </div>
      <img className={props.selected ? "selected" : ""} src={props.image} alt="" />
    </div>
  );
};

export default ImageIcon;
