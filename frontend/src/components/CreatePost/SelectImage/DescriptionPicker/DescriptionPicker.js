import React, { useContext, useRef } from "react";
import "./DescriptionPicker.scss";
import Avatar from "../../../Avatar/Avatar";
import UserContext from "../../../../contexts/UserContext";

const DescriptionPicker = (props) => {
  const user = useContext(UserContext);
  const inputRef = useRef(null);
  console.log(`user`, user);
  return (
    <div className="DescriptionPicker">
      <div className="input">
        <div className="avatar">
          <Avatar imageUrl={localStorage.getItem("avatarUrl")} size="40rem" />
        </div>
        <textarea
          maxLength="2200"
          placeholder="Write a caption..."
          ref={inputRef}
          onChange={(e) => {
            inputRef.current.style.height = ""; /* Reset the height*/
            inputRef.current.style.height = inputRef.current.scrollHeight + "px";
            props.onDescriptionChange(e.target.value)
          }}
        />
        <img className="preview" src={props.previewImage} alt="" />
      </div>
    </div>
  );
};

export default DescriptionPicker;
