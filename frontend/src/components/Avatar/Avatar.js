import React, { forwardRef } from "react";
import "./Avatar.scss";
import defaultImage from "./default.jpg";

const Avatar = forwardRef((props, ref) => {
  const size = props.size || "25rem";
  console.log("props.imageUrl", props.imageUrl);
  console.log('props', props);
  return (
    <div style={{ position: "relative" }}>
      <img
        style={props.noClick ? { pointerEvents: "none" } : {}}
        ref={ref}
        onClick={props.onClick}
        src={props.imageUrl ? ((props.noRelative ? "" : process.env.REACT_APP_API_URL + "/") + props.imageUrl) : defaultImage}
        alt=""
        width={size}
        height={size}
        className="Avatar"
      />
    </div>
  );
});

export default Avatar;
