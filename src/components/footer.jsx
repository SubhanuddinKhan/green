import React from "react";
import Typography from "@mui/material/Typography";
import makeStyles from "@mui/styles/makeStyles";
import Link from "@mui/material/Link";
import { Grid } from "@mui/material";
import logo from "../img/logo.png";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: "auto",
    paddingLeft: "5%",
    height: 45,
    backgroundColor:
      theme.palette.mode === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[800],
  },
}));

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="left">
      {"Copyright © "}
      <Link color="inherit" href="https://www.atn-berlin.de/en/home.htm">
        ATN Berlin
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function Footer(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  return (
    <footer className={classes.footer}>
      <Grid container spacing={2} direction="row">
        <Grid item>
          <img src={logo} alt="logo" style={{ marginLeft: 20 }} />
        </Grid>
        <Grid item spacing={1}>
          <Typography variant="h7" align="left" gutterBottom>
            ATN GmbH
          </Typography>
          <Typography
            variant="subtitle1"
            align="left"
            color="textSecondary"
            component="p"
            fontSize={13}
          >
            Segelfliegerdamm 94-98 · 12487 Berlin
          </Typography>
          <Typography
            variant="subtitle1"
            align="left"
            color="textSecondary"
            component="p"
            fontSize={13}
          >
            Tel.:+49 (0)30 5659 095-0
          </Typography>
          <Typography
            variant="subtitle1"
            align="left"
            color="textSecondary"
            component="p"
            fontSize={13}
          >
            Fax:+49 (0)30 5659 095-60
          </Typography>
        </Grid>
        <Grid item style={{ marginLeft: 300 }}>
          <Typography variant="h7" align="left" gutterBottom>
            {t("contact")}
          </Typography>
          <Typography
            variant="subtitle1"
            align="left"
            color="textSecondary"
            component="p"
            fontSize={13}
          >
            Ammar Alidelbi
          </Typography>
          <Typography
            variant="subtitle1"
            align="left"
            color="textSecondary"
            component="p"
            fontSize={13}
          >
            ammar.alidelbi@atn-berlin.de
          </Typography>
          <Typography
            variant="subtitle1"
            align="left"
            color="textSecondary"
            component="p"
            fontSize={13}
          >
            Tel.:+49 (0)30 5659 095-29
          </Typography>
        </Grid>
        {/* <Grid item style={{ marginLeft: 300 }}>
          <Copyright />
        </Grid> */}
      </Grid>
    </footer>
  );
}

export default Footer;
