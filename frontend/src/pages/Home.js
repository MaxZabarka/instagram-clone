import React, { useEffect, useState } from "react";
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
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState(null);

  const getPosts = () => {
    console.log("GET POSTS");
    axios
      .get(process.env.REACT_APP_API_URL + "/posts", {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        console.log("response.data", response.data);
        setPosts(response.data);
      })
      .catch((error) => {
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

  useEffect(() => {
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  console.log("HERER");
  console.log('error,posts', error, posts);
  let main;
  if (error) {
    main = <ErrorBox errorTitle={error.title} errorMessage={error.message} />;
  } else if (posts) {
    main = <Feed posts={posts} />;
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
      {/* <Get
        url={process.env.REACT_APP_API_URL+"/posts"}
        config={{
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }}
      >
        {(error, response, isLoading, makeRequest, axios) => {
          if (error) {
            let errorMessage;
            if (response) {
              errorMessage = response.data.errorMessage;
            } else {
              errorMessage = error.message;
            }
            return <ErrorBox errorMessage={errorMessage} retry={makeRequest} />;
          } else if (isLoading) {
            return <Spinner />;
          } else if (response !== null) {
            return <Feed posts={response.data}  />;
          }
          return <></>;
        }}
      </Get> */}
    </div>
  );
};

export default Home;
