import React from "react";
import Lottie from "lottie-react";
import animation from "../../assets/animations/list.json";

const DataEmptyAnimation = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      marginTop: "100px"
    }}
  >
    <Lottie
      animationData={animation}
      loop={true}
      style={{ width: "200px", height: "200px" }}
    />
    <p>empty</p>
  </div>
);

export default DataEmptyAnimation;
