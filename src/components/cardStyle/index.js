import React, { useEffect, useRef } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CommentIcon from "@mui/icons-material/Comment";
import { colors, Stack } from "@mui/material";
import { generateRandomColors } from "../../lib/functions/generateColor";

const CardStyle = ({ data, onClick }) => {
  const textRef = useRef(null);

  useEffect(() => {
    textRef.current.innerHTML = data.body.slice(0, 200) + "...";
  }, []);

  return (
    <Card
      sx={{
        mb: 5,
        mx: 1,
        maxWidth: 450,
        height: 500,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {data.thumbnail !== "" && (
        <img
          onClick={onClick}
          src={data.thumbnail}
          style={{ cursor: "pointer", height: 194, width: "100%" }}
          alt="thumbnail"
        />
      )}
      <div onClick={onClick} style={{ cursor: "pointer", padding: 5}}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {data.title.length >= 80 ? data.title.slice(0, 50) + "..." : data.title}
        </Typography>
        <p ref={textRef}></p>
      </div>

      <Stack direction="row" spacing={1} alignItems="center" mx={1} py={2}>
        <Avatar sx={{ bgcolor: generateRandomColors(data?.author[0].toUpperCase()) }} aria-label="avatar">
          {data?.author[0].toUpperCase()}
        </Avatar>
        <p>{data?.author}</p>
        <small>{data.createdAt}</small>
      </Stack>

      {/* <Stack direction="row" spacing={1} alignItems="center" ml={6}>
        <FavoriteIcon sx={{ color: colors.red[500] }} />
        <Typography variant="body2" color="text.secondary">
          {data.likes.length}
        </Typography>
        <VisibilityIcon sx={{ color: colors.grey[500] }} />
        <Typography variant="body2" color="text.secondary">
          {data.views}
        </Typography>
        <CommentIcon sx={{ color: colors.grey[500] }} />
        <Typography variant="body2" color="text.secondary">
          {data?.comments ? data?.comments.length : "0"}
        </Typography>
      </Stack> */}
    </Card>
  );
};

export default CardStyle;
