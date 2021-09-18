import React, { useEffect, useState } from "react";
import SelectImage from "./SelectImage/SelectImage";
import "./CreatePost.scss";
import { withAxios } from "react-axios";
import cropImage from "../../util/image-processing/cropImage";
import dataURItoBlob from "../../util/image-processing/dataURItoBlob";
import io from "socket.io-client";

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

const readAndCropImage = (file) => {
  return new Promise((resolve, reject) => {
    readImage(file)
      .then((image) => {
        return cropImage(image);
      })
      .then((image) => {
        resolve(image);
      });
  });
};

const uploadPost = (axios, images, description) => {
  const formData = new FormData();
  const jsonData = JSON.stringify({
    description,
  });

  for (const image of images) {
    formData.append("images", dataURItoBlob(image));
  }
  formData.append("document", jsonData);
  const socket = io("127.0.0.1:4000");
  socket.on('hello', function(data){
    console.log(data)
  })
  axios.post("http://192.168.1.77:5000/posts", formData);
  console.log(formData);
};

const CreatePost = withAxios((props) => {
  const [images, setImages] = useState([]);

  useEffect(() => {
    const readPromiseArray = [];
    for (let i = 0; i < props.files.length; i++) {
      readPromiseArray.push(readAndCropImage(props.files[i]));
    }

    Promise.all(readPromiseArray).then((dataImages) => {
      setImages(dataImages);
    });
  }, [props.files]);

  return (
    <>
      <div
        className={images.length !== 0 ? "backdrop" : ""}
        onClick={props.onClose}
      />
      <div className="CreatePost">
        {props.files.length !== 0 ? (
          <SelectImage
            images={images}
            onClose={props.onClose}
            onNext={(imageOrder, description) => {
              const orderedImages = [];
              for (let i = 0; i < imageOrder.length; i++) {
                if (imageOrder[i] !== null) {
                  orderedImages[imageOrder[i]] = images[i];
                }
              }
              uploadPost(props.axios, orderedImages, description);
              props.onClose();
            }}
          />
        ) : null}
      </div>
    </>
  );
});

export default CreatePost;
