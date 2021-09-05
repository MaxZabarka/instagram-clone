import React from "react";
import "./Avatar.scss";

const Avatar = (props) => {
  const size = props.size || "25rem";

  return (
    <img
      src={props.imageUrl}
      alt=""
      width={size}
      height={size}
      className="Avatar"
    />
  );
};

export default Avatar;
