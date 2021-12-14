import React from "react";
import "./Dots.scss";

const Dots = (props) => {
  return (
    <div className="Dots">
      {[...Array(props.amount)].map((_, index) => {
        return (
          <div
            key={index}
            className={index === props.active ? "active" : ""}
            style={{
              background: props.color,
              width: props.size,
              height: props.size,
              cursor: props.cursor,
            }}
          />
        );
      })}
    </div>
  );
};

export default Dots;
