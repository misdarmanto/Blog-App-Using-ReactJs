import React, { useEffect, useRef } from "react";
import { Stack, Avatar, Typography } from "@mui/material";

const CommentList = ({ commentData }) => {
  const textRef = useRef(null);

  useEffect(() => {
    if (commentData) {
      textRef.current.innerHTML = commentData.comment;
    }
  }, [commentData]);

  return (
    <Stack>
      <Stack direction="row" spacing={2} alignItems="center" mt={1}>
        <Avatar>{commentData.author[0].toUpperCase()}</Avatar>
        <Stack>
          <Typography>{commentData.author}</Typography>
          <small style={{color: "grey"}}>{commentData.createdAt}</small>
        </Stack>
      </Stack>
      <div style={{ paddingLeft: "55px", color: "grey" }} ref={textRef}></div>
    </Stack>
  );
};

export default CommentList;
