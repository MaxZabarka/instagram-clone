import React from "react";
import { Link } from "react-router-dom";
import Icon from "../../Icon/Icon";
import "./PostThumb.scss";

const PostThumb = (props) => {
  console.log(`props`, props);
  return (
      <Link to={"/posts/"+props.id}>
    <div
      style={{
        backgroundImage:
          "url(" + process.env.REACT_APP_API_URL + "/" + props.image + ")",
      }}
      className="PostThumb"
    >
      <div className="hover-overlay">
        <div className="likes">
          <Icon size="20rem" type="like" filled />
          <h1>{props.likesAmount}</h1>
        </div>
        <div className="comments">
          <Icon size="20rem" type="comment" filled />
          <h1>{props.commentsAmount}</h1>
        </div>
      </div>
    </div>
    </Link>
  );
};

export default PostThumb;
