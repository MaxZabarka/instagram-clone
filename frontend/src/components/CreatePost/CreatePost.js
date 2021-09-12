import React, { useEffect, useRef, useState } from "react";
import Modal from "../Modal/Modal";
import "./CreatePost.scss";
import SelectImage from "./SelectImage/SelectImage";

const readImage = (file) => {
  return new Promise((resolve, reject) => {
    var fileReader = new FileReader();
    fileReader.onload = () => {
      resolve(fileReader.result);
    };
    fileReader.onerror = reject;
    fileReader.readAsDataURL(file);
  });
};

const CreatePost = (props) => {
  const inputRef = useRef(null);
  const [fileSelected, setFileSelected] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    console.log("123asd");
    console.log(inputRef.current);
    inputRef.current.click();
  }, []);

  useEffect(() => {
    setFileSelected(!!images.length);
  }, [images]);

  const onCloseHandler = () => {
    inputRef.current.value = null;
    setFileSelected(false);
    setImages([]);
    props.onClose();
  };

  return (
    <div className="CreatePost">
      <div
        className={fileSelected ? "backdrop" : ""}
        onClick={onCloseHandler}
      />
      <input
        onChange={() => {
          setFileSelected(true);
          const promiseArray = [];
          for (let i = 0; i < inputRef.current.files.length; i++) {
            promiseArray.push(readImage(inputRef.current.files[i]));
          }

          Promise.all(promiseArray).then((dataImages) => {
            setImages(dataImages);
          });
        }}
        ref={inputRef}
        type="file"
        style={{ display: "none" }}
        multiple
      />
      {fileSelected ? (
        <SelectImage images={images} onClose={onCloseHandler} />
      ) : null}
    </div>
    // </Modal>
  );
};

export default CreatePost;
