import React, { useEffect, useState } from "react";
import SelectImage from "./SelectImage/SelectImage";
import "./CreatePost.scss";
import { withAxios } from "react-axios";

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

const uploadPost = (axios, images, description) => {
  const formData = new FormData();
  const jsonData = JSON.stringify({
    description:"lorem ipsum blah blah blah"
  })

  for (const image of images) {
    console.log(image);
    formData.append("images", image);
  }
  formData.append("document", jsonData);

  axios.post("http://localhost:5000/posts", formData);
  console.log(formData);
};

const CreatePost = withAxios((props) => {
  const [images, setImages] = useState([]);
  const [orderedImages, setOrderedImages] = useState([]);
  const [createPostPage, setCreatePostPage] = useState(0)

  useEffect(() => {
    console.log(props.files);
    const promiseArray = [];
    for (let i = 0; i < props.files.length; i++) {
      promiseArray.push(readImage(props.files[i]));
    }

    Promise.all(promiseArray).then((dataImages) => {
      setImages(dataImages);
    });
  }, [props.files]);

  return (
    <div className="CreatePost">
      <div
        className={images.length !== 0 ? "backdrop" : ""}
        onClick={props.onClose}
      />

      {images.length !== 0 ? (
        <SelectImage
          images={images}
          onClose={props.onClose}
          page={createPostPage}
          onNext={(imageOrder) => {
            const newOrderedImages = [];
            for (let i = 0; i < imageOrder.length; i++) {
              if (imageOrder[i] !== null) {
                newOrderedImages[imageOrder[i]] = props.files[i];
              }
            }
            setOrderedImages(newOrderedImages)
            setCreatePostPage(1)
            // uploadPost(props.axios, orderedImages);
          }}
        />
      ) : null}
    </div>
  );
});

export default CreatePost;
