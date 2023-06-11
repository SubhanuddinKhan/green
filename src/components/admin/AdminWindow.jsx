import React, { useState } from "react";

import makeStyles from '@mui/styles/makeStyles';
import { HashLink as Link } from "react-router-hash-link";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import ListItemIcon from "@mui/material/ListItemIcon";
import clsx from "clsx";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ManageUsers from "./ManageUsers";

const drawerWidth = 220;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    backgroundColor: "#CDD6DD",
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
    backgroundColor: "#CDD6DD",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  content: {
    //flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: theme.spacing(9) + 1,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
    overflowX: "scroll",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#CDD6DD",
  },
  // necessary for content to be below app bar
  toolbar: {
    ...theme.mixins.toolbar,
    marginTop: 10,
  },
}));

export default function AdminWindow() {
  const classes = useStyles();

  const [renderedWindow, setRenderedWindow] = useState("md");
  const [sideBarOpen, setSideBarOpen] = useState(false);

  const renderWindow = () => {
    return (
      <div>
        <section id="mu">
          <ManageUsers></ManageUsers>
        </section>
      </div>
    );
  };

  return (
    <div>
      <div
        className={clsx(classes.content, {
          [classes.contentShift]: sideBarOpen,
        })}
      >
        {renderWindow()}
      </div>
      <Drawer
        variant="permanent"
        anchor="right"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: sideBarOpen,
          [classes.drawerClose]: !sideBarOpen,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: sideBarOpen,
            [classes.drawerClose]: !sideBarOpen,
          }),
        }}
      >
        <div className={classes.toolbar} />
        <Divider />
        <List>
          <ListItem
            button
            key={"openSidebar"}
            onClick={() => setSideBarOpen(!sideBarOpen)}
          >
            <ListItemIcon>
              {sideBarOpen ? <ArrowRightIcon /> : <ArrowLeftIcon />}
            </ListItemIcon>
          </ListItem>

          <Divider />

          <ListItem
            button
            key={"manageUsers"}
            smooth
            onClick={() => setRenderedWindow("mu")}
            selected={renderedWindow === "mu"}
            component={Link}
            to={"/index/admin#mu"}
          >
            <ListItemIcon>
              <GroupAddIcon />
            </ListItemIcon>
            <ListItemText primary={"Manage users"} />
          </ListItem>
        </List>
      </Drawer>
    </div>
  );
}
