import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { SnackbarProvider } from "notistack";
// eslint-disable-next-line
import { BrowserRouter } from "react-router-dom";
// eslint-disable-next-line
import { ThemeProvider } from "@mui/system";
// eslint-disable-next-line
import theme from "./theme";

ReactDOM.render(
  <React.StrictMode>
        <SnackbarProvider
          maxSnack={1}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          preventDuplicate
        >
          <App />
        </SnackbarProvider>
  </React.StrictMode>,
   document.getElementById('root')
);
