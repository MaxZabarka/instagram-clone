import React, { useState, useEffect } from "react";
import ImageIcon from "../../ImageIcon/ImageIcon";
import Spinner from "../../../Spinner/Spinner";
import "./ImagePicker.scss";

const ImagePicker = (props) => {
  const [activeImage, setActiveImage] = useState(0);
  const [imageOrder, setImageOrder] = useState([
    ...Array(props.images.length).keys(),
  ]);

  useEffect(() => {
    setImageOrder([...Array(props.images.length).keys()]);
  }, [props.images.length]);

  const onOrderChange = props.onOrderChange;
  useEffect(() => {
    onOrderChange(imageOrder);
  }, [imageOrder, onOrderChange]);

  return props.images.length !== 0 ? (
    <div className="ImagePicker">
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
    </div>
  ) : (
    <Spinner />
  );
};

export default ImagePicker;
