import React, { useEffect } from "react";
import FeedPost from "../FeedPost/FeedPost";
import "./Feed.scss";
import { useInView } from "react-intersection-observer";
import { Link } from "react-router-dom";
import Box from "../Box/Box";
import Spinner from "../Spinner/Spinner";

const Feed = (props) => {
  const { ref, inView } = useInView();
  useEffect(() => {
    console.log("inView", inView);
    if (inView) {
      props.onLoadMore();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);
  return (
    <div className="Feed">
      {!props.noPosts ? <>
        {props.posts.map((post, index) => {
          console.log("post", post);
          return <FeedPost key={index} {...post} />;
        })}
        {props.finished ? (
          <Box className="bottom">
            <h2>You're all caught up!</h2>
            <p>You've seen all the posts from users you are following.</p>
            <Link to="/explore">Find more creators to follow</Link>
          </Box>
        ) : (
          <div className="scroll-bottom">
            <Spinner />
            <div ref={ref} className="intersection-observer">Hello</div>
          </div>
        )}
      </> : <Box className="bottom"><h2>You're not following anybody!</h2>
        <Link to="/explore">Find creators to follow</Link>
      </Box>}

    </div>
  );
};

export default Feed;
