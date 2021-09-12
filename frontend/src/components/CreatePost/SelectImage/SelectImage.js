import React, { useState } from "react";
import Icon from "../../Icon/Icon";
import DescriptionPicker from "./DescriptionPicker/DescriptionPicker";
import ImagePicker from "./ImagePicker/ImagePicker";
import "./SelectImage.scss";

const SelectImage = (props) => {
  const [imageOrder, setImageOrder] = useState([]);
  const [page, setPage] = useState(0);

  let rv = null;
  if (page === 0) {
    rv = (
      <ImagePicker
        onOrderChange={(newOrder) => {
          setImageOrder(newOrder);
        }}
        images={props.images}
      />
    );
  } else if (page === 1) {
    rv = <DescriptionPicker />;
  }

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
              console.log(imageOrder);
              if (
                !imageOrder.every((element) => {
                  return element === null;
                })
              ) {
                setPage(1);
                // props.onNext(imageOrder);
              }
            }}
          ></Icon>
        </div>
      </div>
      {rv}
    </div>
  );
};

export default SelectImage;
