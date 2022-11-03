import React, { useState } from "react";
import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import { Box } from "@mui/system";
import { Button, colors, TextField, Stack, IconButton, CircularProgress } from "@mui/material";

import { doc, setDoc, collection } from "firebase/firestore";
import { db } from "../../lib/config/firebase";
import { useContextApi } from "../../lib/hooks/useContextApi";
import { storage } from "../../lib/config/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { PhotoCamera } from "@mui/icons-material";

const CreatePost = () => {
  const { quill, quillRef } = useQuill();
  const { currentUserData, currentUserID } = useContextApi();

  const [title, setTitle] = useState("");
  const [imageURL, setImageURL] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadImage = (event) => {
    setIsLoading(true);
    const file = event.target.files[0];

    const storageRef = ref(storage, `/files/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    const handleGetDOwnloadUrl = () => {
      getDownloadURL(uploadTask.snapshot.ref).then((url) => setImageURL(url));
    };

    const handleGetPercent = (snapshot) => {
      const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      console.log(percent);
    };

    uploadTask.on("state_changed", handleGetPercent, console.log, handleGetDOwnloadUrl);
    setIsLoading(false);
  };

  const handleCreatePost = async ({ isPublish }) => {
    if (title === "") return;
    const contentHTML = quill.root.innerHTML;

    const documentPostRefrence = doc(collection(db, "Articles"));
    const createDate = new Date();

    const post = {
      id: Date.now(),
      userID: currentUserID,
      title: title,
      thumbnail: imageURL || "",
      createdAt: createDate.toDateString(),
      author: currentUserData.displayName,
      photo: currentUserData.photo,
      body: contentHTML,
      likes: [],
      views: 0,
      isPublish: isPublish,
    };

    const clearForm = () => {
      quill.root.innerHTML = "";
      setTitle("");
      setImageURL(null);
    };

    try {
      await setDoc(documentPostRefrence, post);
      clearForm();
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
      <Box
        component={"div"}
        sx={{
          height: "200px",
          backgroundColor: "#F5F5F5",
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {isLoading && <CircularProgress />}
        {!imageURL && (
          <Stack>
            <IconButton color="primary" aria-label="upload picture" component="label" onChange={handleUploadImage}>
              <input hidden accept="image/*" multiple type="file" />
              <PhotoCamera />
            </IconButton>
            <small>thumbnail</small>
          </Stack>
        )}
        {imageURL && <img src={imageURL} height="100%" width={"100%"} />}
      </Box>

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
        <Button variant="outlined" onClick={() => handleCreatePost({ isPublish: false })}>
          Draf
        </Button>
        <Button variant="outlined" onClick={() => handleCreatePost({ isPublish: true })}>
          Publish
        </Button>
      </Stack>
    </Box>
  );
};

export default CreatePost;
