import React, { useState, useEffect } from "react";
import UserApi from "../../services/user.service";
import { authenticationService } from "../../services/auth.service";
import { styled, useTheme } from "@mui/material/styles";

import JobListTable from "./JobsTable";
import SetupJobModal from "./SetupJob";
import CreateJobModal from "./CreateJob";
import ReserveMaterialModal from "./ReserveMaterial";
import DisassambleJobModal from "./DisassambleJob";
import CheckSetupModal from "./CheckSetup";
import FinishJobModal from "./FinishJob";
import makeStyles from "@mui/styles/makeStyles";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import clsx from "clsx";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ListItemIcon from "@mui/material/ListItemIcon";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import BuildIcon from "@mui/icons-material/Build";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import FindInPageIcon from "@mui/icons-material/FindInPage";
import { useTranslation } from "react-i18next";
import MuiDrawer from "@mui/material/Drawer";

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

function timeDiffCalc(dateFuture, dateNow) {
  let diffInMilliSeconds = Math.abs(dateFuture - dateNow) / 1000;

  // calculate days
  const days = Math.floor(diffInMilliSeconds / 86400);
  diffInMilliSeconds -= days * 86400;

  // calculate hours
  const hours = Math.floor(diffInMilliSeconds / 3600) % 24;
  diffInMilliSeconds -= hours * 3600;

  // calculate minutes
  const minutes = Math.floor(diffInMilliSeconds / 60) % 60;
  diffInMilliSeconds -= minutes * 60;

  let difference = "";
  if (days > 0) {
    difference += days === 1 ? `${days} day, ` : `${days} days, `;
  }

  difference +=
    hours === 0 || hours === 1 ? `${hours} hour, ` : `${hours} hours, `;

  difference +=
    minutes === 0 || hours === 1 ? `${minutes} minutes` : `${minutes} minutes`;

  return difference;
}

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  textEntry: {
    padding: theme.spacing(2),
    textAlign: "center",
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: "#fff",
  },

  content: {
    //flexGrow: 1,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: theme.spacing(8),
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    marginBottom: theme.spacing(4),
    justifyContent: "flex-end",
  },

  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#CDD6DD",
  },
  toolbar: {
    ...theme.mixins.toolbar,
    marginBottom: theme.spacing(1),
  },
}));

const SetupCenter = () => {
  const [createJobModalOpen, setCreateJobModalOpen] = useState(false);
  const [setupJobModalOpen, setSetupJobModalOpen] = useState(false);
  const [finishJobModalOpen, setFinishJobModalOpen] = useState(false);
  const [reserveMaterialModalOpen, setReserveMaterialModalOpen] =
    useState(false);
  const [disassambleJobModalOpen, setDisassambleJobModalOpen] = useState(false);
  const [checkSetupModalOpen, setCheckSetupModalOpen] = useState(false);
  const [errorSnackBarOpen, setErrorSnackBarOpen] = useState(false);
  const [infoSnackBarOpen, setInfoSnackBarOpen] = useState(false);
  const [warningSnackBarOpen, setWarningSnackBarOpen] = useState(false);
  const [errorSnackBarMessage, setErrorSnackBarMessage] = useState("");
  const [infoSnackBarMessage, setInfoSnackBarMessage] = useState("");
  const [warningSnackBarMessage, setWarningSnackBarMessage] = useState("");
  const [hackeyAddition, setHackeyAddition] = useState(0);
  const [sideBarOpen, setSideBarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  const [timelineJobs, setTimelineJobs] = useState([]);
  const { t, i18n } = useTranslation();

  const classes = useStyles();
  const userApi = new UserApi();

  useEffect(() => {
    setCurrentUser(
      (({ user_id, username, user_role }) => ({
        user_id,
        username,
        user_role,
      }))(JSON.parse(localStorage.getItem("currentUser")))
    );
  }, []);

  const renderTooltip = (startDate, finishDate) => {
    const startDateFormatted = startDate.toLocaleString();
    const finishDateFormatted = finishDate.toLocaleString();

    return `<div style="padding:20px;">
        <p> ${t("start")}: ${startDateFormatted}</p>
        <p> ${t("finish")}: ${finishDateFormatted}</p>
        <p> ${t("duration")}: ${timeDiffCalc(finishDate, startDate)}</p>
      </div>`;
  };

  const getMachinePlans = (filter) => {
    userApi
      .getMachinePlansList({ offset: 0, search: filter })
      .then((res) => {
        const data = res.data;
        if (data) {
          var newTimelineJobs = [
            [
              { type: "string", id: "Machine" },
              { type: "string", id: "job" },
              { role: "tooltip", type: "string" },
              { type: "date", id: "Start" },
              { type: "date", id: "End" },
            ],
          ];
          data.results.forEach((item) => {
            const thisStartDate = new Date(
              item.job.commission_date.replace("T", " ").slice(0, 16)
            );
            const thisEndDate = new Date(
              item.job.finish_date.replace("T", " ").slice(0, 16)
            );
            newTimelineJobs.push([
              item.machine.name,
              item.job.name,
              renderTooltip(thisStartDate, thisEndDate),
              thisStartDate,
              thisEndDate,
            ]);
          });
          setTimelineJobs(newTimelineJobs);
        }
      })
      .catch((err) => {
        authenticationService.refresh();
      });
  };

  useEffect(() => {
    getMachinePlans("");
  }, []);

  const openSnackBar = (message, type) => {
    if (type === "error") {
      setErrorSnackBarOpen(true);
      setErrorSnackBarMessage(message);
    } else if (type === "info") {
      setInfoSnackBarOpen(true);
      setInfoSnackBarMessage(message);
    } else if (type === "warning") {
      setWarningSnackBarOpen(true);
      setWarningSnackBarMessage(message);
    }
  };

  const handleErrorSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorSnackBarOpen(false);
  };

  const handleWarningSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setWarningSnackBarOpen(false);
  };

  const handleInfoSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setInfoSnackBarOpen(false);
  };

  const toggleCreateJobModal = () => setCreateJobModalOpen(!createJobModalOpen);

  const toggleSetupJobModal = () => setSetupJobModalOpen(!setupJobModalOpen);

  const toggleFinishJobModal = () => {
    setFinishJobModalOpen(!finishJobModalOpen);
  };

  const toggleReserveMaterialModal = () => {
    setReserveMaterialModalOpen(!reserveMaterialModalOpen);
  };

  const toggleDisassambleJobModal = () =>
    setDisassambleJobModalOpen(!disassambleJobModalOpen);

  const toggleCheckSetupModal = () =>
    setCheckSetupModalOpen(!checkSetupModalOpen);

  const updateJobsTable = () => {
    setHackeyAddition(hackeyAddition + 1);
    getMachinePlans("");
  };

  return (
    <div>
      <div
        className={clsx(classes.content, {
          [classes.contentShift]: sideBarOpen,
        })}
      >
        <JobsTable hackeyAddition={hackeyAddition} />
        {/*<CircularProgress color="inherit" />*/}
      </div>
      {currentUser && currentUser.user_role !== "R" ? (
        <Drawer open={sideBarOpen} variant="permanent" anchor="right">
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
            <ListItem button key={"newJob"} onClick={toggleCreateJobModal}>
              <ListItemIcon>
                <AddCircleIcon />
              </ListItemIcon>
              <ListItemText primary={t("newJob")} />
            </ListItem>
            <ListItem
              button
              key={"resMaterial"}
              onClick={toggleReserveMaterialModal}
            >
              <ListItemIcon>
                <AssignmentTurnedInIcon />
              </ListItemIcon>
              <ListItemText primary={t("prepareMaterial")} />
            </ListItem>
            <ListItem
              button
              key={"disassamble"}
              onClick={toggleDisassambleJobModal}
            >
              <ListItemIcon>
                <SubdirectoryArrowRightIcon />
              </ListItemIcon>
              <ListItemText primary={t("disassemble")} />
            </ListItem>
            <ListItem button key={"setJob"} onClick={toggleSetupJobModal}>
              <ListItemIcon>
                <BuildIcon />
              </ListItemIcon>
              <ListItemText primary={t("preSetup")} />
            </ListItem>

            <ListItem button key={"checkSetup"} onClick={toggleCheckSetupModal}>
              <ListItemIcon>
                <FindInPageIcon />
              </ListItemIcon>
              <ListItemText primary={t("checkSetup")} />
            </ListItem>
            <ListItem button key={"finishJob"} onClick={toggleFinishJobModal}>
              <ListItemIcon>
                <DoneAllIcon />
              </ListItemIcon>
              <ListItemText primary={t("finishJob")} />
            </ListItem>
          </List>
        </Drawer>
      ) : null}

      <CreateJobModal
        isOpen={createJobModalOpen}
        cancel={toggleCreateJobModal}
        snackbarFunction={openSnackBar}
        updateJobsTable={updateJobsTable}
        updateTimeLineData={() => getMachinePlans("")}
        timelineJobs={timelineJobs}
      />
      <ReserveMaterialModal
        isOpen={reserveMaterialModalOpen}
        toggleFunction={toggleReserveMaterialModal}
        snackbarFunction={openSnackBar}
        updateJobsTable={updateJobsTable}
      />
      <SetupJobModal
        isOpen={setupJobModalOpen}
        toggleFunction={toggleSetupJobModal}
        updateJobsTable={updateJobsTable}
      />
      <DisassambleJobModal
        isOpen={disassambleJobModalOpen}
        toggleFunction={toggleDisassambleJobModal}
        updateJobsTable={updateJobsTable}
      />
      <CheckSetupModal
        isOpen={checkSetupModalOpen}
        toggleFunction={toggleCheckSetupModal}
        updateJobsTable={updateJobsTable}
      />
      <FinishJobModal
        isOpen={finishJobModalOpen}
        toggleFunction={toggleFinishJobModal}
        updateJobsTable={updateJobsTable}
      />

      <Snackbar
        open={errorSnackBarOpen}
        autoHideDuration={6000}
        onClose={handleErrorSnackBarClose}
      >
        <Alert variant="filled" severity="error">
          {errorSnackBarMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={warningSnackBarOpen}
        autoHideDuration={6000}
        onClose={handleWarningSnackBarClose}
      >
        <Alert variant="filled" severity="warning">
          {warningSnackBarMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={infoSnackBarOpen}
        autoHideDuration={6000}
        onClose={handleInfoSnackBarClose}
      >
        <Alert variant="filled" severity="info">
          {infoSnackBarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

const JobsTable = (props) => {
  return <JobListTable hackeyAddition={props.hackeyAddition} />;
};

export default SetupCenter;
