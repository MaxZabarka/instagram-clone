import React from "react";
import "./PostImage.scss"

const PostImage = (props) => {
  return (
    <div
      className="PostImage"
      style={{
        backgroundImage: "url(" + "http://192.168.1.77:5000/" + props.imageUrl + ")",
      }}
    >
      <img
        onLoad={props.onLoad}
        src={"http://192.168.1.77:5000/" + props.imageUrl}
        className="image"
        alt=""
      />
    </div>
  );
};

export default PostImage;
