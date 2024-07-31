import React from "react";

export default function Input(props) {
  const { error } = props;
  return (
    <>
      <input {...props} className="form-control" />
      {error ? (
        <p style={{ paddingTop: 5, fontSize: 13, color: "red" }}>{error}</p>
      ) : null}
    </>
  );
}
