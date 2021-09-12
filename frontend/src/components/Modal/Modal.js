import React from "react";
import ReactDOM from "react-dom";
import "./Modal.scss";

const Modal = (props) => {
  return props.show
    ? ReactDOM.createPortal(
        <>
          <div className="Backdrop" onClick={props.onClose} />
          {props.children}
        </>,
        document.querySelector(".modal")
      )
    : null;
};

export default Modal;
