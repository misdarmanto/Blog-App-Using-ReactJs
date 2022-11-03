import React from "react";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Typography } from "@mui/material";

import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import MailRoundedIcon from "@mui/icons-material/MailRounded";
import { useContextApi } from "../../lib/hooks/useContextApi";

const Profile = () => {
  const { currentUserData } = useContextApi();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <List
        sx={{
          width: { xs: 360, sm: 400, md: 500 },
          bgcolor: "background.paper",
          p: 5,
        }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            <Typography sx={{ textAlign: "center", fontWeight: "bold" }}>
              My Profile
            </Typography>
          </ListSubheader>
        }
      >
        <ListItemButton sx={{mt: 5}}>
          <ListItemIcon>
            <PersonRoundedIcon />
          </ListItemIcon>
          <ListItemText primary={currentUserData.displayName || "Anonymouse"} />
        </ListItemButton>
        <ListItemButton>
          <ListItemIcon>
            <MailRoundedIcon />
          </ListItemIcon>
          <ListItemText primary={currentUserData.email} />
        </ListItemButton>
      </List>
    </div>
  );
};

export default Profile;
