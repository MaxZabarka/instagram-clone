import React from "react";
import { Get } from "react-axios";
import ErrorBox from "../components/ErrorBox/ErrorBox";
import FeedPost from "../components/FeedPost/FeedPost";
import Spinner from "../components/Spinner/Spinner";

const PostPage = (props) => {
  const postId = props.match.params.postId;
  console.log("POST PAGE");
  console.log(props.match);
  console.log(`postId`, postId);
  console.log(`process.env.REACT_APP_API_URL`, process.env.REACT_APP_API_URL);
  return (
    <div className="Page">
      <Get
        url={process.env.REACT_APP_API_URL + "/posts/" + postId}
        config={{
          headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        }}
      >
        {(error, response, isLoading, makeRequest, axios) => {
          console.log(`error, response, isLoading`, error, response, isLoading);

          if (error) {
            let errorMessage;
            if (response) {
              if (response.status === 404) {
                return (
                  <ErrorBox
                    errorTitle="Sorry, this page isn't available.
                "
                    errorMessage="The link you followed may be broken, or the page may have been removed."
                  />
                );
              }
              errorMessage = response.data.errorMessage;
            } else {
              errorMessage = error.message;
            }
            return <ErrorBox errorMessage={errorMessage} retry={makeRequest} />;
          } else if (isLoading || !response) {
            return <Spinner />;
          } else if (response !== null) {
            console.log(`test response.data`, response.data);
            return <FeedPost {...response.data} fullPage />;
          }
        }}
      </Get>
    </div>
  );
};

export default PostPage;
