// eslint-disable-next-line
import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
// eslint-disable-next-line
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const history = useHistory();
  const [formData, setformData] = useState({ username: "", password: "" });
  // eslint-disable-next-line
  const [loading, setloading] = useState(false);

  const handleCountChange = (e) => {
    // const[key,value]=[e.target.name,e.target.value];
    // setformData((nextFormData)=>({...nextFormData,[key]:value}));
    setformData(e.target.value);
  
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Fetch the API response
  /**
   * Perform the Login API call
   * @param {{ username: string, password: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/login"
   *
   * Example for successful response from backend:
   * HTTP 201
   * {
   *      "success": true,
   *      "token": "testtoken",
   *      "username": "criodo",
   *      "balance": 5000
   * }
   *
   * Example for failed response from backend:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Password is incorrect"
   * }
   *
   */
  const login = async (formData) => {
    if (validateInput(formData)) {
      setloading(true);
      try {
        const res = await axios.post(`${config.endpoint}/auth/login`,formData);
        persistLogin(res.data.token,res.data.username,res.data.balance);
        setformData({
          username:'',
          password:'',
         });
        
      
        if (res.status === 201) {
          setloading(false);
        //  console.log(res);
          enqueueSnackbar("logged in", { variant: "success" });
         history.push("/");
        }
      } catch (error) {
        setloading(false);
        const res = error.response;
        if (res && res.status === 400) {
          const errorMessage = res.data.message;
          enqueueSnackbar(errorMessage, { variant: "error" });
        }
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Validate the input
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false and show warning message if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that password field is not an empty value - "Password is a required field"
   */
  const validateInput = (data) => {
    if (!data.username || data.username === "") {
      enqueueSnackbar("Username is a required field", { variant: "error" });
      // alert("Username is a required field", { variant: "error" });
      return false;
    } else if (!data.password || data.password === "") {
      enqueueSnackbar("Password is a required field", { variant: "error" });
      return false;
    } else {
      return true;
    }
  };

  // TODO: CRIO_TASK_MODULE_LOGIN - Persist user's login information
  /**
   * Store the login information so that it can be used to identify the user in subsequent API calls
   *
   * @param {string} token
   *    API token used for authentication of requests after logging in
   * @param {string} username
   *    Username of the logged in user
   * @param {string} balance
   *    Wallet balance amount of the logged in user
   *
   * Make use of localStorage: https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
   * -    `token` field in localStorage can be used to store the Oauth token
   * -    `username` field in localStorage can be used to store the username that the user is logged in as
   * -    `balance` field in localStorage can be used to store the balance amount in the user's wallet
   */
  const persistLogin = (token, username, balance) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("balance", balance);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form" onSubmit={handleCountChange}>
          <h2 className="title">Login</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            value={formData.username}
            name="username"
            onChange={(event) =>
              setformData((value) => ({
                ...value,
                username: event.target.value,
              }))
            }
            placeholder="Enter Username"
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={(event) =>
              setformData((value) => ({
                ...value,
                password: event.target.value,
              }))
            }
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />

          <Button
            className="button"
            variant="contained"
            onClick={() => login(formData)}
          >
            login to qkart
          </Button>
          <p className="secondary-action">
            Don't have an account?{" "}
            <a className="link" href="/register">
              Register Now
            </a>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
