import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";

const Register = () => {
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const [input, setInput] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleCountChange = (e) => {
    setInput(e.target.value);
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    if (validateInput(input)) {
      try {
        const res = await axios.post(`${config.endpoint}/auth/register`, {
          username: formData.username,
          password: formData.password,
        });
        if (res.status === 201) {
          enqueueSnackbar("Regsiter Successfully", { variant: "success" });
          history.push("/login");
        }
      } catch (error) {
        const res = error.response;
        if (res && res.status === 400) {
          const errorMessage = res.data.message;
          enqueueSnackbar(errorMessage, { variant: "error" });
        }
      }
    }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (input) => {
    if (!input.username || input.username === "") {
      enqueueSnackbar("Username is a required field", { variant: "error" });
      // alert("Username is a required field", { variant: "error" });
      return false;
    } else if (input.username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", {
        variant: "error",
      });
      return false;
    } else if (!input.password || input.password === "") {
      enqueueSnackbar("Password is a required field", { variant: "error" });
      return false;
    } else if (input.password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", {
        variant: "error",
      });
      return false;
    } else if (input.password !== input.confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "error" });
      return false;
    } else {
      return true;
    }
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
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            value={input.username}
            name="username"
            onChange={(event) =>
              setInput((value) => ({
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
            value={input.password}
            onChange={(event) =>
              setInput((value) => ({
                ...value,
                password: event.target.value,
              }))
            }
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            value={input.confirmPassword}
            onChange={(event) =>
              setInput((value) => ({
                ...value,
                confirmPassword: event.target.value,
              }))
            }
            type="password"
            fullWidth
          />
          <Button
            className="button"
            variant="contained"
            onClick={() => register(input)}
          >
            Register Now
          </Button>
          <p className="secondary-action">
            Already have an account?{" "}
            <a className="link" href="/login">
              Login here
            </a>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
