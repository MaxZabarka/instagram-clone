import React from "react";
import FeedPost from "../FeedPost/FeedPost";
import "./Feed.scss";

const Feed = (props) => {
  return (
    <div className="Feed">
      {props.posts.map((post, index) => {
        return <FeedPost key={index} {...post}/>;
      })}
    </div>
  );
};

export default Feed;
