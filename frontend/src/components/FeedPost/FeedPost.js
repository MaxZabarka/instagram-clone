import React, { useState } from "react";
import Avatar from "../Avatar/Avatar";
import Icon from "../Icon/Icon";
import Dots from "../Dots/Dots";
import "./FeedPost.scss";

const FeedPost = (props) => {
  const [loaded, setLoaded] = useState(false);
  const [captionExpanded, setCaptionExpanded] = useState(
    props.caption.length < 100
  );

  return (
    <div className="FeedPost" style={{ display: loaded ? "block" : "none" }}>
      <div className="post-header">
        <div className="post-header-creator">
          <Avatar size="35rem" imageUrl={props.avatarUrl} />
          <h2>{props.creator}</h2>
        </div>
        <div className="post-header-options">
          <Dots amount={3} color="black" size="0.2rem" />
        </div>
      </div>
      <div
        className="post-image"
        style={{ backgroundImage: "url(" + props.imageUrl + ")" }}
      >
        <img
          onLoad={() => {
            setLoaded(true);
          }}
          src={props.imageUrl}
          className="image"
          alt=""
        />
      </div>
      <div className="post-footer">
        <div className="post-footer-actions">
          <div className="like-comment-send">
            <Icon type="like" />
            <Icon type="comment" />
            <Icon type="send" />
          </div>
          <div className="pagination">
            <Dots amount={3} active={1} />
          </div>
          <div className="save">
            <Icon type="save" />
          </div>
        </div>
        <div className="post-footer-caption">
          <a href={"/" + props.creator}>{props.creator} </a>
          {
              captionExpanded ? 
              <p>{props.caption}</p> :
              <>
              <p>{props.caption.slice(0,100)+"... "}</p>
              <p className="more" onClick={() => {setCaptionExpanded(true)}}>more</p>
              </>
          }
        </div>
      </div>
    </div>
  );
};

export default FeedPost;
