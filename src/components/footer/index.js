import { colors, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React from "react";

const Footer = () => {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100px",
        backgroundColor: colors.teal[500],
      }}
    >
      <Typography sx={{color: colors.common.white}}>&copy; 2022</Typography>
    </Box>
  );
};

export default Footer;
