import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";

import { collection, query, getDocs, updateDoc, deleteDoc, where, doc } from "firebase/firestore";
import { db } from "../../lib/config/firebase";

import { colors, IconButton, Stack, Tooltip, Typography } from "@mui/material";
import { Visibility } from "@mui/icons-material";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import CommentIcon from "@mui/icons-material/Comment";
import { useNavigate } from "react-router-dom";
import PublicIcon from "@mui/icons-material/Public";
import DraftsRoundedIcon from "@mui/icons-material/DraftsRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useContextApi } from "../../lib/hooks/useContextApi";
import DataEmptyAnimation from "../../components/animations/dataEmptyAnimation";

const Post = () => {
  const { currentUserID } = useContextApi();
  const [listPosts, setListPosts] = useState([]);
  const [isDataAvaliable, setIsDataAvaliable] = useState(false);
  const [openPopUp, setOpenPopUp] = useState(false);

  const navigate = useNavigate();

  const handleNavigation = (data) => {
    navigate("/EditePost", { state: data });
  };

  const handlePopUp = () => {
    setOpenPopUp(!openPopUp);
  };

  useEffect(() => {
    const getPosts = async () => {
      const collectionRefrence = collection(db, "Articles");
      const queryCommand = query(collectionRefrence, where("userID", "==", currentUserID));
      const querySnapshot = await getDocs(queryCommand);
      const postsResult = [];
      querySnapshot.forEach((doc) => {
        postsResult.push({ docID: doc.id, ...doc.data() });
      });
      setListPosts(postsResult);
      setIsDataAvaliable(true);
    };
    getPosts();
  }, []);

  const handleUpdate = async (docID, isPublish) => {
    const documentPostRefrence = doc(db, "Articles", docID);
    await updateDoc(documentPostRefrence, {
      isPublish: isPublish ? false : true,
    });
  };

  const handleDeletePost = async (docID) => {
    const documentPostRefrence = doc(db, "Articles", docID);
    await deleteDoc(documentPostRefrence);
  };

  if (!isDataAvaliable) return "";

  return (
    <Box
      sx={{
        width: {
          sx: 400,
          sm: 600,
          md: 700,
        },
        bgcolor: "background.paper",
        minHeight: 500,
        margin: "auto",
        p: 2,
      }}
    >
      <List>
        {listPosts.length === 0 && <DataEmptyAnimation />}
        {Array.isArray(listPosts) &&
          listPosts.map((post, index) => (
            <Stack
              key={index}
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "self-start", sm: "center" }}
              justifyContent="space-between"
              sx={{
                border: "1px solid #e3e3e3",
                p: 1,
                mb: 3,
                borderRadius: "5px",
              }}
            >
              <Stack>
                <Typography fontWeight="bold" sx={{ color: colors.grey[500] }}>
                  {post.title.length >= 35 ? post.title.slice(0, 35) + "..." : post.title}
                </Typography>
                <small style={{ color: "gray" }}>
                  {post.isPublish ? "publish" : "draf"} : {post.createdAt}
                </small>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={5}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Tooltip title="likes" placement="top">
                    <FavoriteRoundedIcon sx={{ color: colors.grey[500] }} />
                  </Tooltip>
                  <Typography variant="body2" color="text.secondary">
                    {post.likes.length}
                  </Typography>
                  <Tooltip title="views" placement="top">
                    <Visibility sx={{ color: colors.grey[500] }} />
                  </Tooltip>
                  <Typography variant="body2" color="text.secondary">
                    {post.views}
                  </Typography>
                  <Tooltip title="comments" placement="top">
                    <CommentIcon sx={{ color: colors.grey[500] }} />
                  </Tooltip>
                  <Typography variant="body2" color="text.secondary">
                    {post?.comments ? post?.comments.length : "0"}
                  </Typography>
                </Stack>

                <Stack direction="row" alignItems="center" mr={2} ml={2}>
                  <Tooltip title="delete" placement="top">
                    <IconButton onClick={handlePopUp}>
                      <DeleteRoundedIcon />
                    </IconButton>
                  </Tooltip>

                  {post.isPublish ? (
                    <Tooltip title="publish" placement="top">
                      <IconButton onClick={() => handleUpdate(post.docID, post.isPublish)}>
                        <PublicIcon />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="draft" placement="top">
                      <IconButton onClick={() => handleUpdate(post.docID, post.isPublish)}>
                        <DraftsRoundedIcon />
                      </IconButton>
                    </Tooltip>
                  )}
                  <Tooltip title="edit" placement="top">
                    <IconButton onClick={() => handleNavigation(post)}>
                      <CreateRoundedIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>

              <Dialog
                open={openPopUp}
                onClose={handlePopUp}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">Delete Post</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    apakah anda yakin ingin menghapus postingan ini?
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handlePopUp}>cancle</Button>
                  <Button onClick={() => handleDeletePost(post.docID)}>Ok</Button>
                </DialogActions>
              </Dialog>
            </Stack>
          ))}
      </List>
    </Box>
  );
};

export default Post;
