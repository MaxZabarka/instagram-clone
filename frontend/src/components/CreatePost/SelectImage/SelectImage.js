import React, { useState } from "react";
import Icon from "../../Icon/Icon";
import DescriptionPicker from "./DescriptionPicker/DescriptionPicker";
import ImagePicker from "./ImagePicker/ImagePicker";
import "./SelectImage.scss";

const SelectImage = (props) => {
  const [imageOrder, setImageOrder] = useState([]);
  const [description, setDescription] = useState("");
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
    rv = (
      <DescriptionPicker
        previewImage={props.images[imageOrder.indexOf(0)]}
        onDescriptionChange={(newDescription) => {
          console.log(newDescription)
          setDescription(newDescription)
        }}
      />
    );
  }

  return (
    <div className="SelectImage">
      <div className="header">
        <div className="exit-and-title">
          <Icon
            type="close"
            size="25rem"
            onClick={() => {
              if (page === 0) {
                props.onClose();
              } else {
                setPage(page - 1);
              }
            }}
          />
          <h1>New post</h1>
        </div>
        <div className="next">
          <Icon
            type="arrow"
            size="30rem"
            onClick={() => {
              console.log(imageOrder);
              if (
                page === 0 &&
                !imageOrder.every((element) => {
                  return element === null;
                })
              ) {
                setPage(1);
              } else {
                props.onNext(imageOrder, description);
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
