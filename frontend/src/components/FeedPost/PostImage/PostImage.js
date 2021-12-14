import React from "react";
import "./PostImage.scss";

const PostImage = (props) => {
  return (
    <div
      className="PostImage"
      style={{
        backgroundImage:
          "url(" + process.env.REACT_APP_API_URL + "/" + props.imageUrl + ")",
      }}
    >
      <img
        onLoad={props.onLoad}
        src={process.env.REACT_APP_API_URL + "/" + props.imageUrl}
        className="image"
        alt=""
      />
    </div>
  );
};

export default PostImage;
