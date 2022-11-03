import React from "react";
import Lottie from "lottie-react";
import animation from "../../assets/animations/not-found.json";

const NotFoundAnimation = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      height:"100vh"
    }}
  >
    <Lottie
      animationData={animation}
      loop={true}
      style={{margin: "100px"}}
    />
  </div>
);

export default NotFoundAnimation;
