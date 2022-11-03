import { Container } from "@mui/system";
import React, { useEffect, useState } from "react";
import { Box, colors, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { collection, query, onSnapshot, where } from "firebase/firestore";

import CardStyle from "../../components/cardStyle";
import Navbar from "../../components/navbar";
import Footer from "../../components/footer";
import { db } from "../../lib/config/firebase";
import SkeletonCard from "../../components/animations/skeletonCard";
import { useContextApi } from "../../lib/hooks/useContextApi";

const Home = () => {
  const navigate = useNavigate();
  const { allPost, setAllPost } = useContextApi();
  const [isDataAvaliable, setIsDataAvaliable] = useState(false);

  const handleNavigation = (data) => {
    navigate("/detailPost", { state: data });
  };

  const getPosts = (querySnapshot) => {
    const result = [];
    querySnapshot.forEach((doc) => {
      result.push({ docID: doc.id, ...doc.data() });
    });
    setAllPost(result);
    setIsDataAvaliable(true);
  };

  useEffect(() => {
    const queryCommand = query(collection(db, "Articles"), where("isPublish", "==", true));
    const unsubscribe = onSnapshot(queryCommand, getPosts);
    return () => unsubscribe;
  }, []);

  return (
    <Box component="div" sx={{ backgroundColor: colors.grey[100] }}>
      <Navbar />
      <Container maxWidth="xl" sx={{ my: 8 }}>
        <Grid container spacing={{ xs: 2, md: 3 }}>
          {isDataAvaliable &&
            allPost.map((data, index) => (
              <Grid item xs={12} sm={6} md={4} xl={1} key={index}>
                <CardStyle key={data.id} data={data} onClick={() => handleNavigation(data)} />
              </Grid>
            ))}
          {!isDataAvaliable &&
            [1, 2, 3].map((value, index) => (
              <Grid item xs={12} sm={6} md={4} xl={1} key={index}>
                <SkeletonCard key={value} />
              </Grid>
            ))}
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default Home;
