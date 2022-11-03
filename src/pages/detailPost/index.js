import React, { useEffect, useRef, useState } from "react";
import { Avatar, IconButton, Stack, Typography, colors } from "@mui/material";
import { Container } from "@mui/system";
import { useLocation, useNavigate } from "react-router-dom";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CommentIcon from "@mui/icons-material/Comment";

import {
  doc,
  updateDoc,
  increment,
  arrayUnion,
  arrayRemove,
  collection,
  query,
  getDoc,
  orderBy,
  limit,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "../../lib/config/firebase";
import { useContextApi } from "../../lib/hooks/useContextApi";
import { generateRandomColors } from "../../lib/functions/generateColor";
import CommentArticle from "./createComment";
import CommentList from "./commentsLIst";

const Index = () => {
  const { state } = useLocation();
  const textRef = useRef();
  const navigate = useNavigate();

  const { currentUserID, isAuth } = useContextApi();

  const [isUserAlreadyLike, setIsUserAlreadyLike] = useState(false);
  const [likes, setLikes] = useState(0);
  const [userComments, setUserComments] = useState([]);

  const handleIncrementLike = async () => {
    if (!isAuth) navigate("/login");

    const documentPostRefrence = doc(db, "Articles", state.docID);

    const incrementLike = async () => {
      await updateDoc(documentPostRefrence, {
        likes: arrayUnion(currentUserID),
      });
      setIsUserAlreadyLike(true);
      setLikes(likes + 1);
    };

    const decrementLike = async () => {
      await updateDoc(documentPostRefrence, {
        likes: arrayRemove(currentUserID),
      });
      setIsUserAlreadyLike(false);
      setLikes(likes - 1);
    };

    isUserAlreadyLike ? decrementLike() : incrementLike();
  };

  const handleIncrementView = async () => {
    const documentPostRefrence = doc(db, "Articles", state.docID);
    await updateDoc(documentPostRefrence, {
      views: increment(1),
    });
  };

  const handleUpdateCommentList = (newComment) => {
    setUserComments([...userComments, newComment]);
  };

  const storeCurrentDateTime = () => {
    const dayMonthYear = new Date().toLocaleDateString();
    localStorage.setItem("CURRENT_DATE_TIME", dayMonthYear);
  };

  const getCurrentDateTime = () => {
    const date = localStorage.getItem("CURRENT_DATE_TIME");
    return date;
  };

  useEffect(() => {
    storeCurrentDateTime();
    window.scrollTo(0, 0);
  }, []);

  const getDataAnalysis = async () => {
    const docRef = doc(db, "Analysis", currentUserID);
    const docSnap = await getDoc(docRef);
    return docSnap.data().views;
  };

  const storeDataAnalysis = async () => {
    const previousDataAnalysis = await getDataAnalysis();
    const previousDateTime = getCurrentDateTime();
    const currentDateTime = new Date().toLocaleDateString();
    const documentPostRefrence = doc(db, "Analysis", currentUserID);

    if (currentDateTime === previousDateTime) {
      const lastIndex = previousDataAnalysis.length - 1;
      const lastData = previousDataAnalysis[lastIndex];

      lastData.totalView = lastData.totalView + 1;
      previousDataAnalysis[lastIndex] = lastData;

      const newData = { views: previousDataAnalysis };
      await setDoc(documentPostRefrence, newData);
    } else {
      const createDate = new Date();
      const data = {
        date: createDate.toDateString(),
        totalView: 1,
      };
      previousDataAnalysis.push(data);
      const newData = { views: previousDataAnalysis };
      await setDoc(documentPostRefrence, newData);
    }
  };

  let isFirstLoad = true;
  useEffect(() => {
    textRef.current.innerHTML = state.body;
    return () => {
      if (!isFirstLoad) {
        handleIncrementView();
        storeDataAnalysis();
      }
      isFirstLoad = false;
    };
  }, []);

  useEffect(() => {
    const result = state.likes.includes(currentUserID);
    setIsUserAlreadyLike(result);
    setLikes(state.likes.length);
    if (state.comments) setUserComments(state.comments);
  }, []);

  return (
    <Container maxWidth="md" sx={{ pt: 5, pb: 10 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" mb={5}>
        <div>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              sx={{
                bgcolor: generateRandomColors(state.author[0].toUpperCase()),
              }}
            >
              {state.author[0].toUpperCase()}
            </Avatar>
            <div>
              <Typography variant="h6" fontWeight="bold">
                {state.author}
              </Typography>
              <small>{state.createdAt}</small>
            </div>
          </Stack>
        </div>

        <Stack direction="row" alignItems="center" spacing={1}>
          <IconButton aria-label="likes" onClick={handleIncrementLike}>
            <FavoriteIcon
              sx={{
                color: isUserAlreadyLike ? colors.red[500] : colors.grey[500],
              }}
            />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {likes}
          </Typography>
          <IconButton aria-label="views">
            <VisibilityIcon />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {state.views}
          </Typography>

          <IconButton aria-label="comments">
            <CommentIcon />
          </IconButton>
          <Typography variant="body2" color="text.secondary">
            {state?.comments ? state?.comments.length : "0"}
          </Typography>
        </Stack>
      </Stack>

      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        {state.title}
      </Typography>
      {state.thumbnail !== "" && <img src={state.thumbnail} style={{ height: "250px", width: "100%" }} />}
      <p ref={textRef}></p>

      <div style={{ marginTop: "70px" }}>
        {userComments.length !== 0 &&
          userComments.map((data, index) => (
            <CommentList key={index} commentData={data} onSendComment={handleUpdateCommentList} />
          ))}
      </div>
      <CommentArticle docID={state.docID} />
    </Container>
  );
};

export default Index;
