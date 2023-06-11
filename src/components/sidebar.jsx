import React, { useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import DashboardIcon from "@mui/icons-material/Dashboard";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StorageIcon from "@mui/icons-material/Storage";
import TuneIcon from "@mui/icons-material/Tune";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";
import { Showfor } from "./helpers/Showfor";
import { useTranslation } from "react-i18next";
import MuiAppBar from "@mui/material/AppBar";
import MuiDrawer from "@mui/material/Drawer";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

// const DrawerHeader = styled("div")(({ theme }) => ({
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "flex-end",
//   padding: theme.spacing(0, 1),
//   // necessary for content to be below app bar
//   ...theme.mixins.toolbar,
// }));

// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== "open",
// })(({ theme, open }) => ({
//   zIndex: theme.zIndex.drawer + 1,
//   transition: theme.transitions.create(["width", "margin"], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   ...(open && {
//     marginLeft: drawerWidth,
//     width: `calc(100% - ${drawerWidth}px)`,
//     transition: theme.transitions.create(["width", "margin"], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   }),
// }));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },

  menuButton: {
    marginRight: theme.spacing(1),
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
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
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    marginTop: theme.spacing(10),
    justifyContent: "flex-end",
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    marginBottom: theme.spacing(1),
    ...theme.mixins.toolbar,
  },
  largeAvatar: {
    marginTop: 15,
    marginBottom: 15,
    alignSelf: "center",
    width: theme.spacing(10),
    height: theme.spacing(10),
    fontSize: 35,
    color: "#080D0C",
    backgroundColor: "#FAE789",
  },
}));

export default function Sidebar(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [current, setCurrent] = useState("");
  const [userRole, setuserRole] = useState("");
  const { t, i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    if (props.user) {
      setuserRole(props.user.user_role);
    }
  }, [props.user]);

  useEffect(() => {
    if (location.pathname === "/") {
      setCurrent("dashboard");
    } else if (location.pathname === "/index/material_storage") {
      setCurrent("matSto");
    } else if (location.pathname === "/index/material_entry") {
      setCurrent("matEnt");
    } else if (location.pathname === "/index/setup_center") {
      setCurrent("setCen");
    } else if (location.pathname === "/index/admin") {
      setCurrent("admin");
    } else if (location.pathname === "/index/docs") {
      setCurrent("docs");
    }
  }, [location.pathname]);

  return (
    <div className={classes.root}>
      <Drawer
        variant="permanent"
        open={props.sideBarOpen}
        // sx={clsx(classes.drawer, {
        //   [classes.drawerOpen]: props.sideBarOpen,
        //   [classes.drawerClose]: !props.sideBarOpen,
        // })}
        // classes={{
        //   paper: clsx({
        //     [classes.drawerOpen]: props.sideBarOpen,
        //     [classes.drawerClose]: !props.sideBarOpen,
        //   }),
        // }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={props.toggleSidebar} size="large">
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </div>
        <Divider />
        {props.sideBarOpen ? (
          <Avatar alt="avatar" className={classes.largeAvatar}>
            {JSON.parse(localStorage.getItem("currentUser")).username.substring(
              0,
              2
            )}
          </Avatar>
        ) : (
          ""
        )}
        <Divider />

        <List>
          <ListItem
            button
            key={"dashboard"}
            component={Link}
            to={"/index"}
            onClick={() => setCurrent("main")}
            selected={current === "main"}
          >
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary={t("sidebarDashboard")} />
          </ListItem>
          <ListItem
            button
            key={"materialEntry"}
            component={Link}
            to={"/index/material_entry"}
            onClick={() => setCurrent("matEnt")}
            selected={current === "matEnt"}
          >
            <ListItemIcon>
              <LocalShippingIcon />
            </ListItemIcon>
            <ListItemText primary={t("sidebarMaterialEntry")} />
          </ListItem>
          <ListItem
            button
            key={"materialStorage"}
            component={Link}
            to={"/index/material_storage"}
            onClick={() => setCurrent("matSto")}
            selected={current === "matSto"}
          >
            <ListItemIcon>
              <StorageIcon />
            </ListItemIcon>
            <ListItemText primary={t("sidebarMaterialStorage")} />
          </ListItem>
          <ListItem
            button
            key={"setupCenter"}
            component={Link}
            to={"/index/setup_center"}
            onClick={() => setCurrent("setCen")}
            selected={current === "setCen"}
          >
            <ListItemIcon>
              <TuneIcon />
            </ListItemIcon>
            <ListItemText primary={t("sidebarSetupCenter")} />
          </ListItem>
          <Divider />
          <Showfor id="material_entry" showfor={userRole === "A"}>
            <ListItem
              button
              key={"admin"}
              component={Link}
              to={"/index/admin"}
              onClick={() => setCurrent("admin")}
              selected={current === "admin"}
            >
              <ListItemIcon>
                <SupervisorAccountIcon />
              </ListItemIcon>
              <ListItemText primary={"Admin"} />
            </ListItem>
          </Showfor>
          <ListItem
            button
            key={"docs"}
            component={Link}
            to={"/index/docs"}
            onClick={() => setCurrent("docs")}
            selected={current === "docs"}
          >
            <ListItemIcon>
              <ContactSupportIcon />
            </ListItemIcon>
            <ListItemText primary={t("sidebarDocu")} />
          </ListItem>
        </List>
        <Divider />
      </Drawer>

      {/*<aside>
        <div id="sidebar" className="nav-collapse ">
          <ul className="sidebar-menu">
            <p className="centered">
              <a href="profile.html">
                <img
                  src="https://eu.ui-avatars.com/api/?background=0D8ABC&color=fff&rounded=true&name=A+A"
                  className="transparent"
                />
              </a>
            </p>
            <li className="mt">
              <Link to="/">
                <i className="fa fa-dashboard"></i>
                <span>Dashboard</span>
              </Link>
            </li>
            <li className="sub-menu">
              <Link to="/index/material_entry">
                <i className="fa fa-truck"></i>
                <span>Material Entry</span>
              </Link>
            </li>
            <li className="sub-menu">
              <Link to="/index/material_storage">
                <i className="fa fa-building"></i>
                <span>Material Storage</span>
              </Link>
            </li>
            <li className="sub-menu">
              <Link to="/index/setup_center">
                <i className="fa fa-cogs"></i>
                <span>Setup center</span>
              </Link>
            </li>
            <li className="sub-menu">
              <Link to="/index/admin">
                <i className="fa fa-user"></i>
                <span>Admin</span>
              </Link>
            </li>
            <li className="sub-menu">
              <a href="#">
                <i className="fa fa-desktop"></i>
                <span>Contact</span>
              </a>
            </li>
          </ul>
        </div>
      </aside>*/}
    </div>
  );
}
