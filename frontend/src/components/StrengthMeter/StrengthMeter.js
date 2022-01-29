import React from "react";
import "./StrengthMeter.scss";

const STRENGTHS = ["Weak", "Fair", "Good", "Strong", "Very Strong"];
const COLORS = ["#ed4957", "#e1ff00", "#008cff", "#006e1b", "#00ff3f"];
const StrengthMeter = (props) => {
  return (
    <div className="StrengthMeter">
      <p>
        Password strength:{" "}
        <span className="strength">{STRENGTHS[props.strength]}</span>
      </p>
      <div
        className="bar"
        style={{ width: props.strength * 20 + 20 + "%", backgroundColor:COLORS[props.strength] }}
      ></div>
    </div>
  );
};

export default StrengthMeter;
