import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Get } from "react-axios";
import Avatar from "../components/Avatar/Avatar";
import ErrorBox from "../components/ErrorBox/ErrorBox";
import PostGrid from "../components/PostGrid/PostGrid";
import Spinner from "../components/Spinner/Spinner";
import "./User.scss";
import { Link } from "react-router-dom";

const User = (props) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [newImage, setNewImage] = useState(null);

  const [bio, setBio] = useState("");
  const avatarInputRef = useRef(null)

  const username = props.match.params.username;

  const avatarClickHandler = () => {
    avatarInputRef.current.click()
  };
  useEffect(() => {
    if (response) {
      setBio(response.bio)
    }
  }, [response])

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
          <input
            type="file"
            style={{ display: "none" }}
            ref={avatarInputRef}
            accept=".jpg,.png,.jpeg"
            onChange={(e) => {
              const file = e.target.files[0];
              const reader = new FileReader();

              reader.readAsDataURL(file);
              
              reader.onload = function (e) {
                setNewImage(e.target.result);
              };
            }}
          />
          <div className="avatar-wrapper">
            <Avatar
              noRelative={newImage}
              noClick={!editing}
              onClick={avatarClickHandler}
              size="100%"
              imageUrl={newImage || response.avatarUrl}
            />
            {editing ? <button className="edit-photo" onClick={avatarClickHandler}>Change Profile Photo</button> : null}
          </div>
          <div className="right">
            <div className="username">
              <h1>{username}</h1>

              {username === localStorage.getItem("username") ? (
                <button
                  onClick={() => {
                    if (editing) {
                      axios.put(
                        process.env.REACT_APP_API_URL +
                        "/update-bio/",
                        { bio },
                        {
                          headers: {
                            Authorization:
                              "Bearer " + localStorage.getItem("token"),
                          },
                        }
                      )

                      const imageFile = avatarInputRef.current.files[0]
                      const config = {
                        headers: {
                          'Content-Type': 'multipart/form-data',
                          Authorization:
                            "Bearer " + localStorage.getItem("token")
                        }
                      }
                      const fd = new FormData()
                      fd.append('file', imageFile)
                      axios.put(process.env.REACT_APP_API_URL +
                        "/update-profile/", fd, config
                      ).then((response) => {
                        localStorage.setItem("avatarUrl", response.data.path)
                      })
                    }
                    setEditing(!editing);
                  }}
                  className={editing ? "" : "secondary"}
                >
                  {editing ? "Save" : "Edit Profile"}
                </button>
              ) : response.following ? (
                <button
                  className="secondary"
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
            {editing ? (
              <div className="bio">
                <textarea placeholder="Write your bio here..." value={bio} onChange={(e) => {
                  setBio(e.target.value)
                }} />
              </div>
            ) : (
              <p className="bio">{bio}</p>
            )}
          </div>
        </div>
        {response.posts.length ? (
          <PostGrid border posts={response.posts} />
        ) : (
          <div className="no-posts">
            <h1> No Posts Yet</h1>
            <h2>
              When {username} posts, you'll see their photos and videos here.
            </h2>
          </div>
        )}
      </>
    );
  } else {
    main = <Spinner />;
  }
  return <div className="Page">{main}</div>;
};

export default User;
