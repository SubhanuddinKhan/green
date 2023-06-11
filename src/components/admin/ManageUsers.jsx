import React, { useState } from "react";
import makeStyles from '@mui/styles/makeStyles';
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

import UserApi from "../../services/user.service";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  cardStyle: {
    display: "inline-block",
    margin: theme.spacing(2),
    width: 275,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
}));

export default function ManageUsers() {
  const classes = useStyles();
  const userApi = new UserApi();
  const [userRole, setUserRole] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRe, setPasswordRe] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslation();

  const sendNewUser = () => {
    if (password === passwordRe) {
      userApi
        .sendNewUser({ username, password, userRole })
        .then((res) => {
          const data = res.data;
          enqueueSnackbar(data.message, { variant: data.status });
          setUsername("");
          setPassword("");
          setPasswordRe("");
          setUserRole("");
        })
        .catch((err) => {
          const data = err.response.data;
          console.log(data);
          enqueueSnackbar(data.error, { variant: "error" });
        });
    } else {
      setPasswordError(true);
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography component="h1" variant="h4" align="center">
          {t("addUsers")}
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <TextField
              required
              id="username"
              name="username"
              label={t("username")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <TextField
              required
              id="password"
              name="password"
              label={t("password")}
              type="password"
              value={password}
              fullWidth
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              helperText={passwordError ? t("passwordError") : ""}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="repPassword"
              name="repPassword"
              label={t("repeatPassword")}
              type="password"
              fullWidth
              value={passwordRe}
              onChange={(e) => setPasswordRe(e.target.value)}
              error={passwordError}
              helperText={passwordError ? t("passwordError") : ""}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <FormControl
              variant="outlined"
              className={classes.formControl}
              fullWidth
            >
              <InputLabel id="userRole-label">{t("selectUserRole")}</InputLabel>
              <Select
                labelId="userRole"
                id="userRole"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
                label={t("selectRole")}
                fullWidth
              >
                <MenuItem value={"A"}>{t("admin")}</MenuItem>
                <MenuItem value={"U"}>{t("user")}</MenuItem>
                <MenuItem value={"R"}>{t("reader")}</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={userRole === ""}
              size="large"
              onClick={sendNewUser}
            >
              {t("addUser")}
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
