import React, { useState } from "react";
import {
  Button,
  Card,
  colors,
  Stack,
  TextField,
  Typography,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormControl,
  IconButton,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../lib/config/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/config/firebase";
import { useContextApi } from "../../lib/hooks/useContextApi";
import LoadingAnimation from "../../components/animations/loadingAnimation";

const Login = () => {
  const { setIsAuth, setCurrentUserData, setCurrentUserID } = useContextApi();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hidePassword, setHidepassword] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleClickHidePassword = () => {
    setHidepassword(!hidePassword);
  };

  const handleLogin = () => {
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const userData = {
          displayName: user.displayName,
          email: user.email,
          photo: user.photoURL,
        };
        setCurrentUserData(userData);
        setCurrentUserID(user.email);
        setIsLoading(false);
        setIsAuth(true);
        navigate("/Dashboard");
      })
      .catch((error) => {
        console.warn(error);
        // const errorCode = error.code;
        // const errorMessage = error.message;
      });
  };

  const createUserDB = async (data, userID) => {
    const userCollectionsRef = doc(db, "Users", userID);
    setDoc(userCollectionsRef, data);
  };

  const handleSignUpWithGoogle = () => {
    setIsLoading(true);
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const userData = {
          displayName: user.displayName,
          email: user.email,
          photo: user.photoURL,
        };
        setCurrentUserData(userData);
        setCurrentUserID(user.email);
        createUserDB(userData, user.email);
        setIsLoading(false);
        setIsAuth(true);
        navigate("/Dashboard");
      })
      .catch((error) => {
        console.warn(error);
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // const email = error.email;
        // const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

  return (
    <div
      style={{
        height: "100vh",
        backgroundColor: colors.grey[100],
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isLoading && <LoadingAnimation />}
      {!isLoading && (
        <Card
          style={{
            width: "450px",
            minHeight: "500px",
            display: "flex",
            alignItems: "center",
            flexDirection: "column",
            padding: "25px",
            margin: "15px",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: colors.teal,
              textAlign: "center",
              fontWeight: "bold",
              mb: 5,
            }}
          >
            Login
          </Typography>

          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <TextField value={email} onChange={(e) => setEmail(e.target.value)} id="outlined-basic" label="E-mail" variant="outlined" />
          </FormControl>
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={hidePassword ? "password" : "text"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickHidePassword}
                    onMouseDown={handleClickHidePassword}
                    edge="end"
                  >
                    {hidePassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <Button fullWidth variant="contained" onClick={handleLogin}>
            Login
          </Button>
          <Typography sx={{ mt: 2, color: colors.grey[700] }}>OR</Typography>
          <Button onClick={handleSignUpWithGoogle} startIcon={<GoogleIcon />} fullWidth variant="outlined" sx={{ mt: 2 }}>
            Signin with google
          </Button>
          <Stack direction="row" mt={2} alignItems="center">
            <Typography sx={{ color: colors.grey[700] }}>Belum Punya Akun?</Typography>
            <Button onClick={() => navigate("/SignUp")}>SignUp</Button>
          </Stack>
        </Card>
      )}
    </div>
  );
};

export default Login;
