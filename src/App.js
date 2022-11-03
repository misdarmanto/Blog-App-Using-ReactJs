import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { onAuthStateChanged } from "firebase/auth";

import PageNotFound from "./pages/404";
import Login from "./pages/auth/login";
import Home from "./pages/home";
import { ContextApi } from "./lib/helpers/ContextApi";
import { auth } from "./lib/config/firebase";
import Dashboard from "./pages/dashboard";
import SignUp from "./pages/auth/signUp";
import DetailPost from "./pages/detailPost";
import EditePost from "./pages/dashboard/editPost";

let theme = createTheme({
  palette: {
    primary: {
      main: "#009688",
    },
    secondary: {
      main: "#edf2ff",
    },
  },
});

function App() {
  const [isAuth, setIsAuth] = useState(false);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [currentUserID, setCurrentUserID] = useState(null);
  const [allPost, setAllPost] = useState([]);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userData = {
          displayName: user.displayName,
          email: user.email,
          photo: user.photoURL,
        };
        setCurrentUserData(userData);
        setCurrentUserID(user.email);
        setIsAuth(true);
      } 
    });
  }, []);

  return (
    <ContextApi.Provider
      value={{
        isAuth,
        setIsAuth,
        currentUserData,
        setCurrentUserData,
        currentUserID,
        setCurrentUserID,
        allPost,
        setAllPost,
      }}
    >
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route index element={<Home />} />
            <Route path="DetailPost" element={<DetailPost />} />

            {!isAuth && (
              <>
                <Route path="Login" element={<Login />} />
                <Route path="SignUp" element={<SignUp />} />
              </>
            )}
            {isAuth && (
              <>
                <Route path="EditePost" element={<EditePost />} />
                <Route path="dashboard" element={<Dashboard />} />
              </>
            )}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ContextApi.Provider>
  );
}

export default App;
