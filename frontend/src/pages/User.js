import React, { useEffect, useState } from "react";
import axios from "axios";
import { Get } from "react-axios";
import Avatar from "../components/Avatar/Avatar";
import ErrorBox from "../components/ErrorBox/ErrorBox";
import PostGrid from "../components/PostGrid/PostGrid";
import Spinner from "../components/Spinner/Spinner";
import "./User.scss";

const User = (props) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const username = props.match.params.username;

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_API_URL + "/users/" + username, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .then((response) => {
        setResponse(response.data);
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
          } else {
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
  }, [username]);

  let main;
  if (error) {
    main = <ErrorBox errorTitle={error.title} errorMessage={error.message} />;
  } else if (response) {
    console.log(`response`, response);
    main = (
      <>
        <div className="User">
          <div className="avatar-wrapper">
            <Avatar size="100%" imageUrl={localStorage.getItem("avatarUrl")} />
          </div>
          <div className="right">
            <div className="username">
              <h1>{username}</h1>
              {username ===
              localStorage.getItem("username") ? null : response.following ? (
                <button
                  className="unfollow"
                  onClick={() => {
                    axios
                      .post(
                        process.env.REACT_APP_API_URL +
                          "/unfollow/" +
                          response._id,
                        null,
                        {
                          headers: {
                            Authorization:
                              "Bearer " + localStorage.getItem("token"),
                          },
                        }
                      )
                      .then(() => {
                        setResponse({ ...response, following: false });
                      });
                  }}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  onClick={() => {
                    axios
                      .post(
                        process.env.REACT_APP_API_URL +
                          "/follow/" +
                          response._id,
                        null,
                        {
                          headers: {
                            Authorization:
                              "Bearer " + localStorage.getItem("token"),
                          },
                        }
                      )
                      .then(() => {
                        setResponse({ ...response, following: true });
                      });
                  }}
                >
                  Follow
                </button>
              )}
            </div>
            <div className="stats">
              <div>
                <h2>{response.posts.length}</h2>
                <p>posts</p>
              </div>
              <div>
                <h2>{response.followersAmount}</h2>
                <p>followers</p>
              </div>
              <div>
                <h2>{response.followingAmount}</h2>
                <p>following</p>
              </div>
            </div>
            <p className="bio">{response.bio}</p>
          </div>
        </div>
        <PostGrid posts={response.posts} />
      </>
    );
  } else {
    main = <Spinner />;
  }
  return <div className="Page">{main}</div>;
};

export default User;
