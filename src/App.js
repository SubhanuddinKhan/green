import React, { useState, useEffect, useContext } from "react";
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from "@mui/material/styles";

import makeStyles from "@mui/styles/makeStyles";

import Header from "./components/header";
import Footer from "./components/footer";
import Sidebar from "./components/sidebar";
import MainContent from "./components/mainContent";
import CssBaseline from "@mui/material/CssBaseline";
import { Switch, Route, useHistory } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

import ErrorPage from "./components/error_pages/ErrorPage";
import SignIn from "./components/LogIn";
import { authenticationService } from "./services/auth.service";
import { PrivateRoute } from "./components/PrivateRoute";
import { socket } from "./services/socket.service";
import {
  NotificationsProvider,
  NotificationsContext,
} from "./contexts/NotficationsContext";
import { SnackbarProvider } from "notistack";
import { useTranslation } from "react-i18next";
import { Input } from "@mui/material";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "80vh",
  },
}));

const Dashboard = (props) => {
  const classes = useStyles();

  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [notifications, setNotifications] = useContext(NotificationsContext);
  var websocket = socket;

  websocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log('websocket info: ',data); 
    setNotifications(data);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Header
        key="header"
        toggleSidebar={() => setSideBarOpen(!sideBarOpen)}
        sideBarOpen={sideBarOpen}
        onLogOut={props.onLogOut}
        user={props.user}
      />

      <Sidebar
        key="sidebar"
        sideBarOpen={sideBarOpen}
        toggleSidebar={() => setSideBarOpen(!sideBarOpen)}
        user={props.user}
      />
      <MainContent
        key="main"
        sideBarOpen={sideBarOpen}
        toggleSidebar={() => setSideBarOpen(!sideBarOpen)}
        user={props.user}
        onRenderActivityAlert={props.onRenderActivityAlert}
      />

      <Footer key="footer" />
    </div>
  );
};

const App = () => {
  const [showSideBar, setShowSideBar] = useState(true);
  const [showActivityAlert, setShowActivityAlert] = useState(false);
  const [containerClass, setContainerClass] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const { t, i18n } = useTranslation();

  const history = useHistory();

  useEffect(() => {
    const interval = setInterval(() => {
      authenticationService.refresh();
    }, 1000 * 60 * 60);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleKeyDown(e) {
      if (
        ["F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10"].includes(
          e.key
        )
      ) {
        e.preventDefault();
        if (e.key === "F1") {
          history.push({
            pathname: "/index/material_storage",
            state: { input: "display" },
          });
        } else if (e.key === "F2") {
          history.push({
            pathname: "/index/material_storage",
            state: { input: "add" },
          });
        } else if (e.key === "F3") {
          history.push({
            pathname: "/index/material_storage",
            state: { input: "collect" },
          });
        } else if (e.key === "F4") {
          history.push({
            pathname: "/index/material_storage",
            state: { input: "delete" },
          });
        } else if (e.key === "F5") {
          history.push({
            pathname: "/index/material_storage",
            state: { input: "collectJob" },
          });
        } else if (e.key === "F6") {
        } else if (e.key === "F7") {
        } else if (e.key === "F8") {
        } else if (e.key === "F9") {
        } else if (e.key === "F10") {
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    // Don't forget to clean up
    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const onLogOut = () => {
    authenticationService.logout();
    history.push("/login");
  };

  const onRenderAlert = () => {
    if (currentUser) {
      setShowActivityAlert(true);
    }
  };

  const onAtiveAgain = async (e) => {
    setShowActivityAlert(false);
    authenticationService.logout();
    history.push("/login");
  };

  const renderActivityAlert = () => {
    return (
      <div>
        <Dialog
          open={showActivityAlert}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          onAbort={onAtiveAgain}
        >
          <DialogTitle id="alert-dialog-title">{"Are you here?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {t("inactivityText")}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onAtiveAgain} color="primary">
              ok
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  };

  const quickAccess = (event) => {
    if (event.keyCode in [112, 113, 114, 115]) {
      event.preventDefault();
    }
  };

  useEffect(() => {
    var currentUserInstance;
    authenticationService.currentUser.subscribe((x) => {
      setShowActivityAlert(false);
      setCurrentUser(x);
      currentUserInstance = x;
    });
    if (!currentUserInstance) {
      history.push("/login");
    }
  }, []);

  const toggleSidebar = () => {
    setShowSideBar(!showSideBar);
    setContainerClass(showSideBar ? "sidebar-closed" : "sidebar");
  };

  return (
    <div>
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <SnackbarProvider maxSnack={3}>
              <NotificationsProvider data-testid="notifications-container">
                <Switch>
                  <PrivateRoute path="/index">
                    <Dashboard
                      containerClass={containerClass}
                      toggleSidebar={toggleSidebar}
                      onLogOut={onLogOut}
                      showSideBar={showSideBar}
                      user={currentUser}
                      onRenderActivityAlert={onRenderAlert}
                    />
                  </PrivateRoute>
                  <Route path="/login" component={SignIn} />
                  <Route path="/error" render={() => <ErrorPage></ErrorPage>} />
                  <PrivateRoute path="*">
                    <Dashboard
                      containerClass={containerClass}
                      toggleSidebar={toggleSidebar}
                      onLogOut={onLogOut}
                      showSideBar={showSideBar}
                      user={currentUser}
                      onRenderActivityAlert={onRenderAlert}
                    />
                  </PrivateRoute>
                </Switch>
                {renderActivityAlert()}
              </NotificationsProvider>
            </SnackbarProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </StyledEngineProvider>
    </div>
  );
};

export default App;
