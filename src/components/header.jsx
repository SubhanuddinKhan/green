import React, { useEffect } from "react";
import clsx from "clsx";

import makeStyles from "@mui/styles/makeStyles";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTranslation } from "react-i18next";
import Avatar from "@mui/material/Avatar";
import whiteLogo from "../img/ATN_SMT-logos_white_small.png";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  hide: {
    display: "none",
  },
  menuButton: {
    marginRight: 10,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  title: {
    flexGrow: 1,
  },
  large: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    padding: theme.spacing(1.5),
    marginLeft: -20,
    cursor: "pointer",
  },
}));

export default function Header(props) {
  const { t, i18n } = useTranslation();

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar
        position="fixed"
        style={{ background: "#0C1821" }}
        className={clsx(classes.appBar, {
          [classes.appBarShift]: props.sideBarOpen,
        })}
      >
        <Toolbar>
          <div
            className={clsx(
              classes.menuButton,
              props.sideBarOpen && classes.hide
            )}
          >
            <Avatar
              alt="ATN logo"
              src={whiteLogo}
              className={classes.large}
              onClick={props.toggleSidebar}
            />
          </div>
          <Typography variant="h6" className={classes.title}>
            ATN_SMT
          </Typography>
          <Button
            color="inherit"
            onClick={() => {
              localStorage.setItem("lang", t("lang"));
              i18n.changeLanguage(t("lang"));
            }}
          >
            {t("lang")}
          </Button>
          <Button
            onClick={props.onLogOut}
            variant="contained"
            color="error"
            size="small"
          >
            {t("Signout")}
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
