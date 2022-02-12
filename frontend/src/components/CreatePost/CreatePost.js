import React, { useEffect, useRef, useState } from "react";
import SelectImage from "./SelectImage/SelectImage";
import "./CreatePost.scss";
import { withAxios } from "react-axios";
import cropImage from "../../util/image-processing/cropImage";
import dataURItoBlob from "../../util/image-processing/dataURItoBlob";
import io from "socket.io-client";
import Modal from "../Modal/Modal";
import { useHistory } from "react-router-dom";

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

const uploadPost = (
  axios,
  images,
  description,
  setModalMessage,
  onUploadProgressChange,
  onProcessProgressChange,
  selfRef
) => {
  const formData = new FormData();
  const jsonData = JSON.stringify({
    description,
  });

  for (const image of images) {
    formData.append("images", dataURItoBlob(image));
  }
  formData.append("document", jsonData);
  const socket = io.connect(process.env.REACT_APP_API_URL, {
    reconnection: false,
    transports: ["websocket"],
    query: {
      token: localStorage.getItem("token"),
    },
  });
  selfRef.current.imagesProcessed = 0;
  socket.on("connect", () => {
    axios
      .post(process.env.REACT_APP_API_URL + "/posts", formData, {
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      })
      .catch((error) => {
        if (error.response) {
          setModalMessage(error.response.data.errorMessage);
        } else {
          setModalMessage("Something went wrong");
        }
      });
  });
  socket.on("file_upload", (data) => {
    console.log("file_upload", data);
    onUploadProgressChange(data.percentage, images[0]);
    console.log(`data.percentage`, data.percentage);
  });
  socket.on("image_processed", (data) => {
    selfRef.current.imagesProcessed++;
    onProcessProgressChange(
      (selfRef.current.imagesProcessed / images.length) * 100,
      images[data.index]
    );
  });
  socket.on("connect_error", (err) => {
    console.log(
      `error`,
      JSON.parse(JSON.stringify(err, Object.getOwnPropertyNames(err)))
    );
    setModalMessage(
      "Unable to connect. Check your internet connection and try again."
    );
  });
  socket.on("error", (error) => {
    setModalMessage(error.errorMessage);
  });
  socket.io.on("reconnect_failed", () => {
    console.log("FAILED FAILED FAILEd");
    setModalMessage(
      "Unable to connect. Check your internet connection and try again."
    );
  });

  console.log(formData);
};

const CreatePost = withAxios((props) => {
  const history = useHistory();
  const [images, setImages] = useState([]);
  const [modalMessage, setModalMessage] = useState("");
  const selfRef = useRef(null);

  useEffect(() => {
    if (props.files.length > 0) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [props.files.length]);

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
        title="Could not create post"
        message={modalMessage}
        show={modalMessage}
        onClose={() => {
          setModalMessage("");
        }}
      />
      <div
        className={props.files.length > 0 ? "backdrop" : ""}
        onClick={props.onClose}
      />
      <div ref={selfRef} className="CreatePost">
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
              history.push("/");
              uploadPost(
                props.axios,
                orderedImages,
                description,
                setModalMessage,
                props.onUploadProgressChange,
                props.onProcessProgressChange,
                selfRef
              );
              props.onClose();
            }}
          />
        ) : null}
      </div>
    </>
  );
});

export default CreatePost;
