import React from "react";
import { Link } from "react-router-dom";
import formatDate from "../../../util/image-processing/formatDate";
import Avatar from "../../Avatar/Avatar";
import Icon from "../../Icon/Icon";
import "./Comment.scss";

const Comment = (props) => {
  console.log(` asdsd props`, props);
  return (
    <div className="Comment">
      <Link to={"/users/" + props.creator.username}>
        <Avatar size="35rem" imageUrl={props.creator.avatarUrl} />
      </Link>

      <div className="comment-inner">
        <div className="comment-content">
          <Link to={"/users/" + props.creator.username}>
            {props.creator.username}
          </Link>
          &nbsp;
          <p>{props.content}</p>
        </div>
        <div className="comment-meta">
          <p className="date">{formatDate(props.dateAdded)}</p>
          <p className="likes">0 likes</p>
        </div>
      </div>
      <Icon size="15rem" type="like" />
    </div>
  );
};

export default Comment;
