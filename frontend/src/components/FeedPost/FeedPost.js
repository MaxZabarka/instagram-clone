import React, { useState } from "react";
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

const FeedPost = (props) => {
  const [deleted, setDeleted] = useState(false);

  const [modalMessage, setModalMessage] = useState("");
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [activePost, setActivePost] = useState(0);

  const [captionExpanded, setCaptionExpanded] = useState(
    props.caption.length < 100
  );
  const [showOptions, setShowOptions] = useState(false);
  const [swiper, setSwiper] = useState(null);
  
  if (deleted) {
    return (null)
  }
  const onImageLoadHandler = () => {
    setImagesLoaded(imagesLoaded + 1);
  };
  console.log(`activePost`, activePost);
  const options = [
    { text: "Unfollow", type: "danger" },
    { text: "Go to post" },
    { text: "Share to..." },
    { text: "Copy link" },
    {
      text: "Cancel",
      action: () => {
        setShowOptions(false);
      },
    },
  ];
  if (localStorage.getItem("username") === props.creator) {
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
          ).then(() => {
            setDeleted(true)
          })
          .catch((error) => {
            if (error.response) {
              setModalMessage(error.response.data.errorMessage);
            } else {
              setModalMessage("Something went wrong");
            }
          });
      },
    });
  }
  return (
    <div
      className="FeedPost"
      style={{
        display: imagesLoaded === props.imageUrls.length ? "block" : "none",
      }}
    >
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
        title="Could not delete post"
        message={modalMessage}
        show={modalMessage}
        onClose={() => {
          setModalMessage("");
        }}
      />
      <Modal
        show={showOptions}
        onClose={() => {
          setShowOptions(false);
        }}
        options={options}
      />
      <Box>
        <div className="post-header">
          <div className="post-header-creator">
            <Avatar size="35rem" imageUrl={props.avatarUrl} />
            <h2>{props.creator}</h2>
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
        {props.imageUrls.length !== 1 ? (
          <>
            <Swiper
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
                    <PostImage
                      imageUrl={imageUrl}
                      onLoad={onImageLoadHandler}
                    />
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </>
        ) : (
          <PostImage
            imageUrl={props.imageUrls[0]}
            onLoad={onImageLoadHandler}
          />
        )}
        <div className="post-footer">
          <div className="post-footer-actions">
            <div className="like-comment-send">
              <Icon type="like" />
              <Icon type="comment" />
              <Icon type="send" />
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
          {props.caption ? (
            <div className="post-footer-caption">
              <a href={"/" + props.creator}>{props.creator} </a>
              {captionExpanded ? (
                <p>{props.caption}</p>
              ) : (
                <>
                  <p>{props.caption.slice(0, 100) + "... "}</p>
                  <p
                    className="more"
                    onClick={() => {
                      setCaptionExpanded(true);
                    }}
                  >
                    more
                  </p>
                </>
              )}
            </div>
          ) : null}
        </div>
      </Box>
    </div>
  );
};

export default FeedPost;
