import React from "react";
import Feed from "../components/Feed/Feed";
import { Get } from "react-axios";

const Home = () => {
  return (
    <div>
      <Get url="http://localhost:5000/posts">
        {(error, response, isLoading, makeRequest, axios) => {
          if (error) {
            return <div>Something went wrong!: {error.message} </div>;
          } else if (isLoading) {
            return <div>Loading...</div>;
          } else if (response !== null) {
            return <Feed posts={response.data} />;
          }
          return <></>;
        }}
      </Get>

      {/* <Request method="get" url="/api/request"> */}
      {/* {this.renderResponse} */}
      {/* </Request> */}
    </div>
  );
};

export default Home;
