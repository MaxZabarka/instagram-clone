import React, { useState } from "react";
import Avatar from "../Avatar/Avatar";
import Icon from "../Icon/Icon";
import Dots from "../Dots/Dots";
import "./FeedPost.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import PostImage from "./PostImage/PostImage";
import NavArrow from "./NavArrow/NavArrow";

const FeedPost = (props) => {
  const [imagesLoaded, setImagesLoaded] = useState(0);
  const [activePost, setActivePost] = useState(0);
  const [captionExpanded, setCaptionExpanded] = useState(
    props.caption.length < 100
  );
  const [swiper, setSwiper] = useState(null);

  const onImageLoadHandler = () => {
    setImagesLoaded(imagesLoaded + 1);
  };
  console.log(`activePost`, activePost)
  return (
    <div
      className="FeedPost"
      style={{
        display: imagesLoaded === props.imageUrls.length ? "block" : "none",
      }}
    >
      <div className="post-header">
        <div className="post-header-creator">
          <Avatar size="35rem" imageUrl={props.avatarUrl} />
          <h2>{props.creator}</h2>
        </div>
        <div className="post-header-options">
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
              {activePost !== 0 ? <NavArrow onClick={
                  () => {
                    swiper.slidePrev()
                  }}/> : <div/>}
              {activePost !== props.imageUrls.length-1 ? (
                <NavArrow right onClick={
                  () => {
                    swiper.slideNext()
                  }
                }/>
              ) : <div/>}
            </div>
            {props.imageUrls.map((imageUrl) => {
              return (
                <SwiperSlide>
                  <PostImage imageUrl={imageUrl} onLoad={onImageLoadHandler} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </>
      ) : (
        <PostImage imageUrl={props.imageUrls[0]} onLoad={onImageLoadHandler} />
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
    </div>
  );
};

export default FeedPost;
