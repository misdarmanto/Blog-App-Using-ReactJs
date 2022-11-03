import React, { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { Box } from "@mui/system";
import { Button, colors, TextField, Stack } from "@mui/material";

import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../lib/config/firebase";
import { useLocation, useNavigate } from "react-router-dom";

const EditePost = () => {
  const { quill, quillRef } = useQuill();
  const [title, setTitle] = useState("");
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (quill) {
      quill.root.innerHTML = state.body;
      setTitle(state.title);
    }
  }, [quill]);

  const clearForm = () => {
    quill.root.innerHTML = "";
    setTitle("");
  };

  const handlePublishArticel = async ({ isPublish }) => {
    if (title === "") return;
    state.title = title;
    state.body = quill.root.innerHTML;
    state.isPublish = isPublish;
    try {
      const documentPostRefrence = doc(db, "Articles", state.docID);
      await updateDoc(documentPostRefrence, state);
      clearForm();
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box
      sx={{
        width: {
          sx: 400,
          sm: 600,
          md: 700,
        },
        backgroundColor: colors.common.white,
        minHeight: 500,
        margin: "auto",
        p: 5,
      }}
    >
      <TextField
        sx={{ mb: 2 }}
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        id="outlined-basic"
        label="Title"
        variant="outlined"
      />
      <div ref={quillRef} style={{ minHeight: "250px" }} />
      <Stack direction="row" justifyContent="flex-end" alignItems="center" sx={{ mt: 2 }} spacing={2}>
        <Button variant="outlined" onClick={() => handlePublishArticel({ isPublish: false })}>
          Draf
        </Button>
        <Button variant="outlined" onClick={() => handlePublishArticel({ isPublish: true })}>
          Publish
        </Button>
      </Stack>
    </Box>
  );
};

export default EditePost;
