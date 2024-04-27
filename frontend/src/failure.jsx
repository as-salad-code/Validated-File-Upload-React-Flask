// FailPage.js

import React from "react";

const FailPage = ({ progress }) => {
  const failPageStyle = {
    margin: "50px auto",
    padding: "20px",
    width: "80%",
    maxWidth: "600px",
    backgroundColor: "rgba(240, 240, 240, 0.8)", // Translucent background color
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center"
  };

  const headingStyle = {
    color: "#e74c3c"
  };

  const paragraphStyle = {
    fontSize: "18px"
  };

  return (
    <div style={failPageStyle}>
      <h2 style={headingStyle}>Failed</h2>
      <p style={paragraphStyle}>Your upload failed.</p>
    </div>
  );
};

export default FailPage;
