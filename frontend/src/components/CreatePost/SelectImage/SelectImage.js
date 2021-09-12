import React, { useState } from "react";
import { useEffect } from "react/cjs/react.development";
import Icon from "../../Icon/Icon";
import Spinner from "../../Spinner/Spinner";
import ImageIcon from "../ImageIcon/ImageIcon";
import "./SelectImage.scss";

const SelectImage = (props) => {
  const [imageOrder, setImageOrder] = useState([
    ...Array(props.images.length).keys(),
  ]);

  useEffect(() => {
    setImageOrder([...Array(props.images.length).keys()]);
  }, [props.images.length]);

  const [activeImage, setActiveImage] = useState(0);
  return (
    <div className="SelectImage">
      <div className="header">
        <div className="exit-and-title">
          <Icon type="close" size="25rem" onClick={props.onClose} />
          <h1>New post</h1>
        </div>
        <div className="next">
          <Icon
            type="arrow"
            size="30rem"
            onClick={() => {
              console.log(imageOrder)
              if (
                !imageOrder.every((element) => {
                  return element === null;
                })
              ) {
                props.onNext(imageOrder);
              }
            }}
          ></Icon>
        </div>
      </div>
      {props.images.length !== 0 ? (
        <>
          <div className="preview">
            <img key={activeImage} src={props.images[activeImage]} alt="" />
          </div>
          <div className="images">
            {props.images.map((image, index) => {
              return (
                <ImageIcon
                  index={imageOrder[index]}
                  image={image}
                  selected={activeImage === index}
                  onClick={() => {
                    setActiveImage(index);
                  }}
                  onIndexClick={() => {
                    const newOrder = [...imageOrder];
                    if (newOrder[index] !== null) {
                      for (let i = 0; i < props.images.length; i++) {
                        if (newOrder[index] < newOrder[i]) {
                          newOrder[i] = newOrder[i] - 1;
                        }
                      }
                      newOrder[index] = null;
                    } else {
                      //Array contains only null (no images are selected)
                      if (
                        newOrder.every((element) => {
                          return element === null;
                        })
                      ) {
                        newOrder[index] = 0;
                      } else {
                        newOrder[index] = Math.max(...newOrder) + 1;
                      }
                    }

                    setImageOrder(newOrder);
                  }}
                />
              );
            })}
          </div>
        </>
      ) : (
        <Spinner />
      )}
    </div>
  );
};

export default SelectImage;
