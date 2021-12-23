import React from "react";
import "./PostGrid.scss";
import PostThumb from "./PostThumb/PostThumb";

const PostGrid = (props) => {
  return (
    <div className="PostGrid">
      {props.posts.map((post) => {
          console.log(`post`, post)
        return (
          <PostThumb
            image={post.imageUrls[0]}
            likesAmount={post.likesAmount}
            commentsAmount={post.commentsAmount}
            id={post._id}
          />
        );
      })}
    </div>
  );
};

export default PostGrid;
