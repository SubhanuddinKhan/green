import React from "react";
import clsx from "clsx";
import { Switch, Route, useRouteMatch } from "react-router-dom";
import makeStyles from "@mui/styles/makeStyles";

import Home from "./home";
import MaterialEntry from "./material_entry/materialentry";
import MaterialStorage from "./material_storage/StorageStation";
import SetupCenter from "./setup_center/SetupCenter";
import AdminWindow from "./admin/AdminWindow";
import HomeDoc from "./docs/HomeDoc";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  content: {
    //flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: theme.spacing(8),
    minHeight: "80vh",
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: drawerWidth,
    minHeight: "80vh",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    marginTop: theme.spacing(1),
    ...theme.mixins.toolbar,
  },
}));

export default function MainContent(props) {
  let { path, url } = useRouteMatch();
  const classes = useStyles();

  return (
    <main
      className={clsx(classes.content, {
        [classes.contentShift]: props.sideBarOpen,
      })}
    >
      <div className={classes.toolbar} />
      <Switch>
        <Route path={`${path}/material_entry`}>
          <MaterialEntry
            key="materialentry"
            onRenderActivityAlert={props.onRenderActivityAlert}
          />
        </Route>

        <Route path={`${path}/material_storage`}>
          <MaterialStorage
            key="materialstorage"
            //
            onRenderActivityAlert={props.onRenderActivityAlert}
          />
        </Route>
        <Route path={`${path}/setup_center`}>
          <SetupCenter
            key="setupcenter"
            onRenderActivityAlert={props.onRenderActivityAlert}
          />
        </Route>
        <Route path={`${path}/admin`}>
          <AdminWindow
            key="admin"
            onRenderActivityAlert={props.onRenderActivityAlert}
          />
        </Route>
        <Route path={`${path}/docs`}>
          <HomeDoc
            key="docs"
            onRenderActivityAlert={props.onRenderActivityAlert}
          />
        </Route>

        <Route exact path={`${path}`}>
          <Home key="home" />
        </Route>
        <Route path="*">
          <Home key="home" />
        </Route>
      </Switch>
    </main>
  );
}
