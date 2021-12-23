import React, { forwardRef } from "react";
import "./Avatar.scss";

const Avatar = forwardRef((props, ref) => {
  const size = props.size || "25rem";

  return (
    <img
      ref={ref}
      onClick={props.onClick}
      src={props.imageUrl}
      alt=""
      width={size}
      height={size}
      className="Avatar"
    />
  );
});

export default Avatar;
