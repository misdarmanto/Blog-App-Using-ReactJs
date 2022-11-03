import React, { useState } from "react";
import PropTypes from "prop-types";
import { AppBar, Box, CssBaseline, Drawer, IconButton, List } from "@mui/material";

import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { colors, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useContextApi } from "../../lib/hooks/useContextApi";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/config/firebase";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import InsertChartOutlinedIcon from "@mui/icons-material/InsertChartOutlined";

import Post from "./post";
import MyProfile from "./profile";
import CreateArticle from "./creatPost";
import Analysis from "./analysis";

const drawerWidth = 240;

function Dashboard(props) {
  const { window } = props;
  const { setIsAuth } = useContextApi();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDialogLogout, setOpenDialogLogout] = useState(false);

  const [navigationSelected, setNavigationSelected] = useState("Posts");

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        setIsAuth(false);
        navigate("/Login", { replace: true });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const hanldeDialogLogOut = () => {
    setOpenDialogLogout(!openDialogLogout);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const DashboardContain = () => {
    switch (navigationSelected) {
      case "Posts":
        return <Post />;
      case "Analysis":
        return <Analysis />;
      case "Create Post":
        return <CreateArticle />;
      case "Profile":
        return <MyProfile />;

      default:
        break;
    }
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {["Posts", "Analysis", "Create Post", "Profile"].map((navigationName, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              onClick={() => {
                setNavigationSelected(navigationName);
              }}
            >
              <ListItemIcon>
                <IconButton
                  sx={{
                    backgroundColor: navigationSelected === navigationName ? colors.teal[500] : colors.teal[50],
                  }}
                >
                  {navigationName === "Posts" && (
                    <ListAltIcon
                      sx={{
                        color: navigationSelected === navigationName ? colors.common.white : colors.teal[500],
                      }}
                    />
                  )}
                  {navigationName === "Analysis" && (
                    <InsertChartOutlinedIcon
                      sx={{
                        color: navigationSelected === navigationName ? colors.common.white : colors.teal[500],
                      }}
                    />
                  )}
                  {navigationName === "Create Post" && (
                    <CreateNewFolderIcon
                      sx={{
                        color: navigationSelected === navigationName ? colors.common.white : colors.teal[500],
                      }}
                    />
                  )}
                  {navigationName === "Profile" && (
                    <PersonRoundedIcon
                      sx={{
                        color: navigationSelected === navigationName ? colors.common.white : colors.teal[500],
                      }}
                    />
                  )}
                </IconButton>
              </ListItemIcon>
              <ListItemText
                primary={navigationName}
                sx={{
                  color: navigationSelected === navigationName ? colors.teal[500] : colors.grey[700],
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Dashboard
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Stack direction="row" justifyContent="flex-end" alignItems="flex-end">
            <ListItemButton onClick={() => navigate("/", { replace: true })}>
              <HomeRoundedIcon />
              <Typography sx={{ fontWeight: "bold" }}>Home</Typography>
            </ListItemButton>
            <ListItemButton onClick={hanldeDialogLogOut}>
              <LogoutOutlinedIcon />
              <Typography sx={{ fontWeight: "bold" }}>Logout</Typography>
            </ListItemButton>
          </Stack>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: colors.grey[100],
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <DashboardContain />

        <Dialog
          open={openDialogLogout}
          onClose={hanldeDialogLogOut}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Logout</DialogTitle>
          <DialogContent>Apakah anda yakin ingin keluar?</DialogContent>
          <DialogActions>
            <Button onClick={hanldeDialogLogOut}>Cancel</Button>
            <Button
              onClick={() => {
                hanldeDialogLogOut();
                handleLogout();
              }}
              autoFocus
            >
              Logout
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
}

Dashboard.propTypes = { window: PropTypes.func };
export default Dashboard;
