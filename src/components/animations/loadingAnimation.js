import React from "react";
import Lottie from "lottie-react";
import animation from "../../assets/animations/loading-animation.json";
import { colors, Typography } from "@mui/material";

const LoadingAnimation = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <Lottie animationData={animation} loop={true}/>
  </div>
);

export default LoadingAnimation;
