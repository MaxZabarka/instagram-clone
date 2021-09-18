import React from "react";
import "./Icon.scss";
import likeImage from "./images/like.png";
import commentImage from "./images/comment.png";
import saveImage from "./images/save.png";
import sendImage from "./images/send.png";
import addImage from "./images/add.png";
import compassImage from "./images/compass.png";
import homeImage from "./images/home.png";
import closeImage from "./images/close.png";
import arrowImage from "./images/arrow.png";
import sendImageFilled from "./images/send_filled.png"
import homeImageFilled from "./images/home_filled.png"
import compassImageFilled from "./images/compass_filled.png"

const images = {
  likeImage,
  commentImage,
  saveImage,
  sendImage,
  addImage,
  homeImage,
  compassImage,
  closeImage,
  arrowImage,
  sendImageFilled,
  homeImageFilled,
  compassImageFilled
};

const Icon = (props) => {
  const size = props.size || "25rem";
  return (
    <img
      className="Icon"
      src={images[props.type + "Image" + (props.filled ? "Filled" : "")]}
      alt={props.type}
      width={size}
      height={size}
      onClick={props.onClick}
    />
  );
};

export default Icon;
