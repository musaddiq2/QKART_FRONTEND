import ArrowBackIcon from "@mui/icons-material/ArrowBack";
// eslint-disable-next-line
import { Avatar, Button, Stack } from "@mui/material";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  const handleLogOut = () => {
    localStorage.clear();
    history.push("/");
    window.location.reload();
  };
  const handleLogin = () => {
    history.push("/login");
  };
  const handleRegister = () => {
    history.push("/register");
  };
  const handleExplore = () => {
    history.push("/");
  };
  return (
    <Box className="header">
      <Box className="header-title" onClick={handleExplore}>
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      {children}
      {hasHiddenAuthButtons ? (
        <Box>
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={handleExplore}
        >
          Back to explore
        </Button>
        </Box>) : localStorage.getItem("username") ? (
        <>
          <Stack direction="row" spacing={2} justifyContent="center">
            <div className="avatar">
              <img
                src="avatar.png"
                alt={localStorage.getItem("username")}
              ></img>
              <span className="username">
                {localStorage.getItem("username")}
              </span>
            </div>
            <Button
              className="explore-button"
              variant="text"
              onClick={handleLogOut}
            >
              LOGOUT
            </Button>
          </Stack>
        </>
      ) : (
        <Stack direction="row" spacing={2} justifyContent="center">
        <Button  variant="text" onClick={handleLogin}>
          LOGIN
        </Button>
        <Button  variant="contained" onClick={handleRegister}>
        REGISTER
      </Button>
      </Stack>
      )}
    </Box>
  );
};

export default Header;
