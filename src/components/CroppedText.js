import React from "react";

const CroppedText = (props) => {
  return <div>{props.bool ? props.text.slice(0, 10) + "..." : props.text}</div>;
};

export default CroppedText;
