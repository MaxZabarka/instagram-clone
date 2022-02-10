import React, { useEffect, useRef, useState } from "react";
import Feed from "../components/Feed/Feed";
import { Get } from "react-axios";
import { useHistory } from "react-router";
import Spinner from "../components/Spinner/Spinner";
import ErrorBox from "../components/ErrorBox/ErrorBox";
import PostProgress from "../components/PostProgress/PostProgress";
import PostGrid from "../components/PostGrid/PostGrid";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroller";

const Home = (props) => {
  const history = useHistory();
  if (!localStorage.getItem("token")) {
    history.push("/login");
  }
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [finished, setFinished] = useState(false);
  const [noPosts, setNoPosts] = useState(false)

  const pageIndex = useRef(0)
  const loading = useRef(false)


  const getPosts = () => {
    if (loading.current) return;
    loading.current = true;
    console.log("GET POSTS");
    axios
      .get(process.env.REACT_APP_API_URL + "/posts?page=" + pageIndex.current, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        if (response.data.length === 0) {
          setFinished(true)
        }
        loading.current = false
        pageIndex.current = pageIndex.current + 1
        if (posts.length === 0 && response.data.length === 0) {
          setNoPosts(true)
        }
        setPosts([...posts, ...response.data]);
      
      })
      .catch((error) => {
        loading.current = false
        if (error.response) {
          // Request made and server responded
          if (error.response.status === 404) {
            setError({
              message:
                "The link you followed may be broken, or the page may have been removed.",
              title: "Sorry, this page isn't available.",
            });
          } else if (error.response.status === 401) {
            localStorage.clear()
            history.push("/login");
          }
          else {
            setError({
              title: null,
              message: error.response.errorMessage,
            });
          }
        } else if (error.request) {
          // The request was made but no response was received
          setError({
            message: "Check your network connection.",
            title: "We couldn't reach maxgram.",
          });
        } else {
          // Something happened in setting up the request that triggered an Error
          setError({
            message: "Please try again.",
            title: null,
          });
        }
      });
  };



  let main;
  if (error) {
    main = <ErrorBox errorTitle={error.title} errorMessage={error.message} />;
  } else if (posts) {
    main = <Feed noPosts={noPosts} finished={finished} posts={posts} onLoadMore={getPosts} />;
  } else {
    console.log("HELICOPETERs");
    main = <Spinner />;
  }

  let progressText;
  if (props.processProgress === 100 && props.uploadProgress === 100) {
    progressText = "Post created!";
  } else if (props.processProgress) {
    progressText = "Finishing up...";
  } else {
    progressText = "Uploading...";
  }

  return (
    <div className="Page">
      {props.uploadProgress !== null && (
        <PostProgress
          image={props.currentProgressImage}
          progress={props.uploadProgress / 2 + props.processProgress / 2}
          text={progressText}
        />
      )}

      {main}
    </div>
  );
};

export default Home;
