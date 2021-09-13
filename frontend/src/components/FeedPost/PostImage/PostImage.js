import React from "react";
import "./PostImage.scss"

const PostImage = (props) => {
  return (
    <div
      className="PostImage"
      style={{
        backgroundImage: "url(" + "http://localhost:5000/" + props.imageUrl + ")",
      }}
    >
      <img
        onLoad={props.onLoad}
        src={"http://localhost:5000/" + props.imageUrl}
        className="image"
        alt=""
      />
    </div>
  );
};

export default PostImage;
