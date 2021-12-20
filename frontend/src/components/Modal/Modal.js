import React, {useEffect} from "react";
import ReactDOM from "react-dom";
import "./Modal.scss";

const Modal = (props) => {
  useEffect(() => {
    if (props.show) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [props.show]);
  return props.show
    ? ReactDOM.createPortal(
        <>
          <div className="Backdrop" onClick={props.onClose} />
          <div className="Modal">
            {props.content || props.message ? (
              <div className="content">
                <h1>{props.title}</h1>
                <p>{props.message}</p>
              </div>
            ) : null}

            <ul>
              {props.options.map((option) => {
                return (
                  <li key={option.text} className={option.type} onClick={option.action}>
                    {option.text}
                  </li>
                );
              })}
            </ul>
          </div>
        </>,
        document.querySelector(".modal")
      )
    : null;
};

export default Modal;
