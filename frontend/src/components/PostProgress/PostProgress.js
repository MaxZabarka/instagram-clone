import React from "react";
import Box from "../Box/Box";
import "./PostProgress.scss";

const PostProgress = (props) => {

  return (
    <div className="PostProgress">
      <Box>
        <div className="content">
          <div className="status">
            <img src={props.image} alt="" />
            <h2>{props.text}</h2>
          </div>
          <div className="progress">
            <div
              className="progress-filled"
              style={{ width: props.progress + "%" }}
            ></div>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default PostProgress;
