import React, { useState, useRef } from "react";
import Avatar from "../Avatar/Avatar";
import Icon from "../Icon/Icon";
import Dots from "../Dots/Dots";
import "./FeedPost.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import PostImage from "./PostImage/PostImage";
import NavArrow from "./NavArrow/NavArrow";
import Box from "../Box/Box";
import Modal from "../Modal/Modal";
import axios from "axios";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Comment from "./Comment/Comment";
import { Get } from "react-axios";
import Spinner from "../Spinner/Spinner";
import formatDate from "../../util/image-processing/formatDate";

const FeedPost = (props) => {
  const history = useHistory();
  const inputRef = useRef(null);

  const [deleted, setDeleted] = useState(false);
  const [commentContent, setCommentContent] = useState("");

  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [activePost, setActivePost] = useState(0);

  const lastClick = useRef(performance.now());

  const [likesAmount, setLikesAmount] = useState(props.likesAmount);
  const [liked, setLiked] = useState(props.userLiked);

  const [firstLike, setFirstLike] = useState(true);

  const [createdComments, setCreatedComments] = useState([]);

  const [captionExpanded, setCaptionExpanded] = useState(
    props.caption.length < 101 && props.caption.split("\n").length - 1 < 3
  );
  console.log("props.caption", props.caption);
  // console.log(
  //   'props.caption.split("\n")',
  //   props.caption.split("\n").length - 1 < 3
  // );
  console.log(
    'props.caption.length < 100 || props.caption.split("\n").length - 1 < 3',
    props.caption.length < 100 || props.caption.split("\n").length - 1 < 3
  );
  const [showOptions, setShowOptions] = useState(false);
  const [swiper, setSwiper] = useState(null);

  const postUrl = window.location.origin + "/posts/" + props._id;

  if (deleted) {
    return null;
  }

  const onImageLoadHandler = () => {
    setImagesLoaded(imagesLoaded + 1);
  };

  const onPostClickHandler = (e) => {
    const currentTime = performance.now();
    const timeInBetweenClicks = currentTime - lastClick.current;
    if (timeInBetweenClicks < 500) {
      console.log("double click");
      onLikeHandler(true);
      lastClick.current = 0;
    } else {
      lastClick.current = currentTime;
    }
  };

  const onLikeHandler = (forceLike) => {
    let path = liked ? "/unlike/" : "/like/";

    if (forceLike === true) {
      path = "/like/";
      if (!liked) {
        setLikesAmount(likesAmount + 1);
      }
      setLiked(true);
    } else {
      if (liked) {
        setLikesAmount(likesAmount - 1);
      } else {
        setLikesAmount(likesAmount + 1);
      }

      setLiked(!liked);
      setFirstLike(false);
    }

    axios
      .post(process.env.REACT_APP_API_URL + path + props._id, null, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .catch((error) => {
        setModalTitle("Could not like post");
        if (error.response) {
          setModalMessage(error.response.data.errorMessage);
        } else {
          setModalMessage("Something went wrong");
        }
      });
  };

  console.log(`activePost`, activePost);
  const options = [
    {
      text: "Copy link",
      action: () => {
        navigator.clipboard.writeText(postUrl);
        setShowOptions(false);
      },
    },
    {
      text: "Cancel",
      action: () => {
        setShowOptions(false);
      },
    },
  ];
  if (navigator.share !== undefined) {
    options.splice(2, 0, {
      text: "Share to...",
      action: () => {
        setShowOptions(false);
        navigator.share(postUrl);
      },
    });
  }
  if (window.location.pathname.split("/")[1] !== "posts") {
    options.unshift({
      text: "Go to post",
      action: () => {
        history.push("/posts/" + props._id);
        setShowOptions(false);
      },
    });
  }
  if (localStorage.getItem("username") === props.creator.username) {
    options.unshift({
      text: "Delete",
      type: "danger",
      action: () => {
        setShowOptions(false);
        axios
          .delete(
            process.env.REACT_APP_API_URL + "/posts/delete/" + props._id,
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          )
          .then(() => {
            setDeleted(true);
          })
          .catch((error) => {
            setModalTitle("Could not delete post");
            if (error.response) {
              setModalMessage(error.response.data.errorMessage);
            } else {
              setModalMessage("Something went wrong");
            }
          });
      },
    });
  } else if (window.location.pathname.split("/")[1] !== "posts") {
    options.unshift({
      text: "Unfollow",
      type: "danger",
      action: () => {
        axios
          .post(
            process.env.REACT_APP_API_URL + "/unfollow/" + props.creator._id,
            null,
            {
              headers: {
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
            }
          )
          .then(() => {
            setShowOptions(false);
          });
      },
    });
  }

  const postMain = (
    <>
      {props.imageUrls.length !== 1 ? (
        <Swiper
          onClick={onPostClickHandler}
          observer={true}
          observeParents={true}
          onSlideChange={() => {
            setActivePost(swiper.activeIndex);
          }}
          onSwiper={(swiper) => {
            setSwiper(swiper);
            swiper.wrapperEl.style.alignItems = "center";
          }}
        >
          <div className="navigation">
            {activePost !== 0 ? (
              <NavArrow
                onClick={() => {
                  swiper.slidePrev();
                }}
              />
            ) : (
              <div />
            )}
            {activePost !== props.imageUrls.length - 1 ? (
              <NavArrow
                right
                onClick={() => {
                  swiper.slideNext();
                }}
              />
            ) : (
              <div />
            )}
          </div>
          {props.imageUrls.map((imageUrl) => {
            return (
              <SwiperSlide>
                <PostImage imageUrl={imageUrl} onLoad={onImageLoadHandler} />
              </SwiperSlide>
            );
          })}
        </Swiper>
      ) : (
        <PostImage
          onClick={onPostClickHandler}
          imageUrl={props.imageUrls[0]}
          onLoad={onImageLoadHandler}
        />
      )}
    </>
  );

  const modalError = (
    <Modal
      options={[
        {
          text: "OK",
          type: "primary",
          action: () => {
            setModalMessage("");
          },
        },
      ]}
      title={modalTitle}
      message={modalMessage}
      show={modalMessage}
      onClose={() => {
        setModalMessage("");
      }}
    />
  );

  const modalOptions = (
    <Modal
      show={showOptions}
      onClose={() => {
        setShowOptions(false);
      }}
      options={options}
    />
  );
  return (
    <div
      className="FeedPost"
      style={{
        display: imagesLoaded === props.imageUrls.length ? "block" : "none",
      }}
    >
      {modalError}
      {modalOptions}
      <Box>
        <div className="post-header">
          <div className="post-header-creator">
            <Link to={"/users/" + props.creator.username}>
              <Avatar size="35rem" imageUrl={props.avatarUrl} />
            </Link>
            <Link to={"/users/" + props.creator.username}>
              {" "}
              <h2>{props.creator.username}</h2>
            </Link>
          </div>
          <div
            className="post-header-options"
            onClick={() => {
              setShowOptions(true);
            }}
          >
            <Dots amount={3} color="black" size="0.2rem" />
          </div>
        </div>
        {postMain}
        <div className="post-footer">
          <div className="post-footer-actions">
            <div className="like-comment-send">
              <Icon
                className={liked && !firstLike ? "like-animation" : ""}
                type="like"
                filled={liked}
                onClick={onLikeHandler}
              />
              <Link to={"/posts/" + props._id}>
                <Icon
                  onClick={() => {
                    if (inputRef && inputRef.current) {
                      inputRef.current.focus();
                    }
                  }}
                  type="comment"
                />
              </Link>
              {/* <Icon type="send" /> */}
            </div>

            {props.imageUrls.length > 1 ? (
              <div className="pagination">
                <Dots amount={props.imageUrls.length} active={activePost} />
              </div>
            ) : null}
            <div className="save">
              <Icon type="save" />
            </div>
          </div>
          <div className="post-footer-likes">
            <p>
              {likesAmount} like{likesAmount === 1 ? "" : "s"}
            </p>
          </div>
          {props.caption ? (
            <div className="post-footer-caption">
              <Link to={"/users/" + props.creator.username}>
                {props.creator.username}
              </Link>
              &nbsp;
              {captionExpanded ? (
                <p>{props.caption}</p>
              ) : (
                <>
                  <p>
                    {props.caption.split("\n").length - 1 < 3
                      ? props.caption.slice(0, 100)
                      : props.caption.split("\n").slice(0, 3).join("\n")}
                  </p>
                  <p
                    className="more"
                    onClick={() => {
                      setCaptionExpanded(true);
                    }}
                  >
                    {props.caption.split("\n").length - 1 < 3 ? null : <br />}
                    {" "}more
                  </p>
                </>
              )}
            </div>
          ) : null}
          <div className="post-footer-date">
            <p>{formatDate(props.dateAdded, true)}</p>
          </div>
          {props.fullPage ? (
            <>
              <div className="post-footer-add-comment">
                <textarea
                  autoFocus
                  value={commentContent}
                  maxLength="2200"
                  placeholder="Add a comment..."
                  ref={inputRef}
                  onChange={() => {
                    inputRef.current.style.height = ""; /* Reset the height*/
                    inputRef.current.style.height =
                      inputRef.current.scrollHeight + "px";
                    setCommentContent(inputRef.current.value);
                  }}
                />{" "}
                <button
                  disabled={commentContent === ""}
                  onClick={() => {
                    setCreatedComments((createdComments) => [
                      <Comment
                        creator={{
                          avatarUrl: localStorage.getItem("avatarUrl"),
                          username: localStorage.getItem("username"),
                        }}
                        content={commentContent}
                        dateAdded={new Date()}
                      />,
                      ...createdComments,
                    ]);
                    setCommentContent("");

                    axios
                      .post(
                        process.env.REACT_APP_API_URL +
                          "/comments/" +
                          props._id,
                        { content: commentContent },
                        {
                          headers: {
                            Authorization:
                              "Bearer " + localStorage.getItem("token"),
                          },
                        }
                      )
                      .catch((error) => {
                        setModalTitle("Could not post comment");
                        if (error.response) {
                          setModalMessage(error.response.data.errorMessage);
                        } else {
                          setModalMessage("Something went wrong");
                        }
                      });
                  }}
                >
                  Post
                </button>
              </div>
              <div className="post-footer-comments">
                {createdComments}
                <Get
                  url={process.env.REACT_APP_API_URL + "/comments/" + props._id}
                  config={{
                    headers: {
                      Authorization: "Bearer " + localStorage.getItem("token"),
                    },
                  }}
                >
                  {(error, response, isLoading, makeRequest, axios) => {
                    console.log(
                      `error, response, isLoading`,
                      error,
                      response,
                      isLoading
                    );

                    if (error) {
                      let errorMessage;
                      if (response) {
                        errorMessage = response.data.errorMessage;
                      } else {
                        errorMessage = error.message;
                      }
                      return <p>{errorMessage}</p>;
                    } else if (isLoading || !response) {
                      return <Spinner />;
                    } else if (response !== null) {
                      console.log(`response.data`, response.data);
                      if (
                        response.data.length === 0 &&
                        createdComments.length === 0
                      ) {
                        return (
                          <div className="no-comments">
                            <h1>No Comments Yet</h1>
                            <p>Start the conversation</p>
                          </div>
                        );
                      } else {
                        return response.data.map((comment) => {
                          return <Comment {...comment.comments} />;
                        });
                      }

                      // return <p>{JSON.stringify(response.data)}</p>;
                      // return <FeedPost {...response.data} fullPage />;
                    }
                  }}
                </Get>
                {/* <Comment avatarUrl={props.avatarUrl} />
                <Comment avatarUrl={props.avatarUrl} /> */}
              </div>
            </>
          ) : null}
        </div>
      </Box>
    </div>
  );
};

export default FeedPost;
