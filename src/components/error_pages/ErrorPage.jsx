import React, { useState, useEffect } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import errorImage from "../../img/500.png";
import { useHistory } from "react-router-dom";

import Button from "@mui/material/Button";
const ErrorPage = (props) => {
  const history = useHistory();

  return (
    <Grid container direction="column" justifyContent="center" alignItems="center">
      <img src={errorImage} alt="" />
      <Typography variant="h1" component="h2" gutterBottom>
        Error Code
      </Typography>
      <p />
      <Typography variant="h3" component="h4">
        Some Error happened
      </Typography>
      <p />
      <Button onClick={() => history.push("/index")}>
        Go back to the Dashboard
      </Button>
    </Grid>
  );
};

export default ErrorPage;
