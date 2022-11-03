import { Box } from "@mui/material";
import React, { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { getDoc, doc } from "firebase/firestore";
import { db } from "../../lib/config/firebase";

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useContextApi } from "../../lib/hooks/useContextApi";

const Analysis = () => {
  const [isDataAvaliable, setIsDataAvaliable] = useState(false);
  const [viewsData, setViewsData] = useState([]);
  const { currentUserID } = useContextApi();

  const theme = useTheme();
  const isDesktopScreen = useMediaQuery(theme.breakpoints.up('sm'));

  useEffect(() => {
    const getAnalysis = async () => {
      const documentRefrence = doc(db, "Analysis", currentUserID);
      const docSnap = await getDoc(documentRefrence);
      const postsResult = docSnap.data()
      console.log(postsResult)

      setViewsData(postsResult.views);
      setIsDataAvaliable(true);
    };
    getAnalysis();
  }, []);

  if (!isDataAvaliable) return "";

  return (
    <Box sx={{ backgroundColor: "#FFF", p: isDesktopScreen ? 5 : 1 }}>
      <LineChart
        width={isDesktopScreen ? 750 : 380}
        height={isDesktopScreen ? 300 : 250}
        data={viewsData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="totalView" stroke="#82ca9d" activeDot={{ r: 5 }} />
      </LineChart>
    </Box>
  );
};

export default Analysis;
