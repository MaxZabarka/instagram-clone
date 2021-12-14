import React, { useState } from "react";
import Feed from "../components/Feed/Feed";
import { Get } from "react-axios";
import { useHistory } from "react-router";
import Spinner from "../components/Spinner/Spinner";
import ErrorBox from "../components/ErrorBox/ErrorBox";
import PostProgress from "../components/PostProgress/PostProgress";

const Home = (props) => {
  const history = useHistory();
  if (!localStorage.getItem("token")) {
    history.push("/login");
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
    <div>
      {props.uploadProgress !== null && (
        <PostProgress
          image={props.currentProgressImage}
          progress={props.uploadProgress / 2 + props.processProgress / 2}
          text={progressText}
        />
      )}
      <Get
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
      </Get>
    </div>
  );
};

export default Home;
