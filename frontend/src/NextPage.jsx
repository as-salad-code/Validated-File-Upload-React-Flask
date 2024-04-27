// NextPage.js

import React from "react";

const NextPage = ({ progress }) => {
  const successPageStyle = {
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
    color: "#2ecc71"
  };

  const paragraphStyle = {
    fontSize: "18px"
  };

  return (
    <div style={successPageStyle}>
      <h2 style={headingStyle}>Success</h2>
      <p style={paragraphStyle}>Your upload was successful!</p>
    </div>
  );
};

export default NextPage;
