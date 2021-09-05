import React from "react";
import FeedPost from "../FeedPost/FeedPost";
import "./Feed.scss";

const Feed = (props) => {
  return (
    <div className="Feed">
      {props.posts.map((post) => {
        return <FeedPost {...post}/>;
      })}
    </div>
  );
};

export default Feed;
