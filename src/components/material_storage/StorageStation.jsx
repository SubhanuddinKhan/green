import React, { useEffect, useState, useRef, createContext } from "react";

import makeStyles from "@mui/styles/makeStyles";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Grid from "@mui/material/Grid";
import StorageDevice from "./StorageDevice";
import MachineStorage from "./MachineStorage";
import axios from "axios";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CircularProgress from "@mui/material/CircularProgress";
import Drawer from "@mui/material/Drawer";
import { useSnackbar } from "notistack";
import UserApi from "../../services/user.service";
import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { timer } from "rxjs";

const drawerWidth = 220;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },

  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    padding: theme.spacing(1),
    width: drawerWidth,
    // backgroundColor: "#CDD6DD",
  },
  // necessary for content to be below app bar
  toolbar: {
    ...theme.mixins.toolbar,
    marginBottom: theme.spacing(1),
  },
  content: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3),
  },
}));

const MaterialStorage = (props) => {
  const [serialCollectActive, setSerialCollectActive] = useState(false);
  const [storageDevices, setStorageDevices] = useState([]);
  const [chosenStorageDevice, setChosenStorageDevice] = useState(null);
  const [carrierDialogOpen, setCarrierDialogOpen] = useState(false);
  const [carrierInfo, setCarrierInfo] = useState();
  const [carriersQueue, setCarriersQueue] = useState({});
  const [jobs, setJobs] = useState();
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hackeyAddition, setHackeyAddition] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [lastUpdateTime, setLastUpdateTime] = useState(null);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t, i18n } = useTranslation();

  const userApi = new UserApi();
  const classes = useStyles();
  const location = useLocation();

  const displayInputRef = useRef();
  const addInputRef = useRef();
  const collectInputRef = useRef();
  const removeInputRef = useRef();

  useEffect(() => {
    fetchQueue();
  }, []);

  useEffect(() => {
    if (location.state) {
      if (location.state.input === "display") {
        setTimeout(() => {
          if (displayInputRef.current) {
            displayInputRef.current.focus();
          }
        }, 1000);
      } else if (location.state.input === "add") {
        setTimeout(() => {
          if (addInputRef.current) {
            addInputRef.current.focus();
          }
        }, 1000);
      } else if (location.state.input === "collect") {
        setTimeout(() => {
          if (collectInputRef.current) {
            collectInputRef.current.focus();
          }
        }, 1000);
      } else if (location.state.input === "delete") {
        setTimeout(() => {
          if (removeInputRef.current) {
            removeInputRef.current.focus();
          }
        }, 1000);
      }
    }
  }, [location]);

  useEffect(() => {
    setCurrentUser(
      (({ user_id, username, user_role }) => ({
        user_id,
        username,
        user_role,
      }))(JSON.parse(localStorage.getItem("currentUser")))
    );
  }, []);

  useEffect(() => {
    userApi.resetStorages().then((res) => {});
    userApi
      .getStorageDevices()
      .then((res) => {
        const data = res.data;
        console.log(data);
        setStorageDevices(data.results);
        data.results.forEach((device) => {
          if (device.default) {
            setChosenStorageDevice(device.id);
          }
        });
      })
      .catch((err) => props.onRenderActivityAlert());
    getJobs("");
    userApi
      .getMachinesList()
      .then((res) => {
        const data = res.data.results;
        var machinesDevices = [];
        data.forEach((machine) => {
          machinesDevices.push({
            id: machine.id,
            name: machine.name,
            slots: machine.slots,
          });
        });
        setMachines(machinesDevices);
      })
      .catch((err) => console.log(err));
    setLastUpdateTime(new Date());
  }, []);

  const fetchQueue = () => {
    userApi.getCollectQueue().then((res) => {
      const queue = res.data.data;
      setCarriersQueue(queue);
    });
  };

  const getJobs = (filter) => {
    userApi
      .getJobsList({ search: filter })
      .then((res) => {
        const data = res.data.results;
        setJobs(data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  // const handleSerialCollectSwitchChange = (event) => {
  //   setSerialCollectActive(!serialCollectActive);
  // };

  // add two numbers abd return sum of them

  const handleStorageChange = (newStorage) => {
    userApi.changeActiveStorage({ name: newStorage }).then((res) => {
      userApi.getStorageDevices().then((res) => {
        const data = res.data.results;
        setStorageDevices(data);
        data.forEach((device) => {
          if (device.default) {
            setChosenStorageDevice(device.id);
          }
        });
      });
    });

    //setState({ chosenStorageDevice: event.target.value });
  };

  const openCarrierDialog = (info) => {
    setCarrierDialogOpen(true);
    setCarrierInfo(info);
  };

  const handleCarrierDialogClose = (event) => {
    userApi.turnOffLights().then((res) => {
      setCarrierDialogOpen(false);
    });
  };

  const handleCarriersQueueClear = (event) => {
    setCarriersQueue({});
    userApi
      .clearCarriersQueue()
      .then((res) => {
        const data = res.data;
        enqueueSnackbar(data.message, { variant: "success" });
      })
      .catch((err) => {
        enqueueSnackbar(err.response.data.message, { variant: "error" });
      });
  };

  const updateContentData = () => {
    setLastUpdateTime(new Date());
  };

  const updateQueueFocusCollect = () => {
    fetchQueue();
    setTimeout(() => {
      if (collectInputRef.current) {
        collectInputRef.current.focus();
      }
    }, 100);
  };

  const resetStorage = () => {
    userApi.resetStorages().then((res) => {
      const data = res.data;
    });
  };

  return (
    <div>
      <div style={{ marginRight: drawerWidth }}>
        {storageDevices.length > 0 && machines.length > 0 ? (
          <div>
            {storageDevices.map((device) => (
              <StorageDevice
                key={device.id}
                deviceName={device.name}
                deviceType={device.device_type}
                deviceDescription={device.description}
                totalSlots={device.capacity}
                busySlots={device.busy}
                active={device.default}
                handleSelected={handleStorageChange}
                lastUpdateTime={lastUpdateTime}
                updateQueueFocusCollect={updateQueueFocusCollect}
              />
            ))}

            {machines.map((device) => (
              <MachineStorage
                key={device.id}
                deviceName={device.name}
                busySlots={device.slots.length}
                slots={device.slots}
                lastUpdateTime={lastUpdateTime}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 250,
            }}
          >
            <CircularProgress />
          </div>
        )}
      </div>

      <div>
        {currentUser && currentUser.user_role !== "R" ? (
          <Drawer
            className={classes.drawer}
            variant="permanent"
            classes={{
              paper: classes.drawerPaper,
            }}
            anchor="right"
          >
            <div className={classes.toolbar} />
            <List key="rightSideBar" aria-label="main mailbox folders">
              <ListItem>
                <UidCodeEntry
                  key="display"
                  entryName={t("display")}
                  icon="fa fa-info"
                  apiFunction={userApi.displayCarrier}
                  serialStatus={false}
                  chosenStorage={chosenStorageDevice}
                  openCarrierDialog={openCarrierDialog}
                  setQueue={setCarriersQueue}
                  onFocus={() => resetStorage()}
                  resetStorage={resetStorage}
                  inputRef={displayInputRef}
                  updateData={updateContentData}
                />
              </ListItem>
              <ListItem>
                <UidCodeEntry
                  key="add"
                  entryName={t("add")}
                  icon="fa fa-sign-in"
                  apiFunction={userApi.addCarrierToStorage}
                  serialStatus={false}
                  chosenStorage={chosenStorageDevice}
                  setQueue={setCarriersQueue}
                  onFocus={() => resetStorage()}
                  resetStorage={resetStorage}
                  inputRef={addInputRef}
                  updateData={updateContentData}
                />
              </ListItem>
              <ListItem>
                <UidCodeEntry
                  key="collect"
                  entryName={t("collect")}
                  icon="fa fa-sign-out"
                  collect={true}
                  apiFunction={userApi.collectCarrierFromStorage}
                  serialStatus={false}
                  chosenStorage={chosenStorageDevice}
                  setQueue={setCarriersQueue}
                  inputRef={collectInputRef}
                  updateData={updateContentData}
                />
              </ListItem>
              {Object.keys(carriersQueue).length > 0 ? (
                <ListItem>
                  <Accordion>
                    <AccordionSummary
                      aria-controls="panel1d-content"
                      id="panel1d-header"
                    >
                      <Chip
                        label={Object.keys(carriersQueue).length}
                        color="primary"
                      />

                      <Button
                        color="primary"
                        onClick={handleCarriersQueueClear}
                      >
                        {t("clear")}
                      </Button>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List component="nav" aria-label="main mailbox folders">
                        {Object.keys(carriersQueue).map((key) => (
                          <ListItem>
                            <ListItemText primary={key} />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </ListItem>
              ) : (
                ""
              )}
              <ListItem>
                <UidCodeEntry
                  key="delete"
                  entryName={t("delete")}
                  icon="fa fa-trash-o"
                  apiFunction={userApi.deleteCarrier}
                  serialStatus={false}
                  setQueue={setCarriersQueue}
                  onFocus={() => resetStorage()}
                  resetStorage={resetStorage}
                  inputRef={removeInputRef}
                  updateData={updateContentData}
                />
              </ListItem>
              <ListItem>
                {loading ? (
                  <CircularProgress />
                ) : (
                  <UidCodeEntry
                    key="collectJob"
                    entryName={t("collectJob")}
                    icon="fa fa-tasks"
                    apiFunction={userApi.collectJobFromStorage}
                    serialStatus={serialCollectActive}
                    chosenStorage={chosenStorageDevice}
                    setQueue={setCarriersQueue}
                    type="collectJob"
                    collectRef={collectInputRef}
                    jobs={jobs}
                    onFocus={() => resetStorage()}
                    updateData={updateContentData}
                  />
                )}
              </ListItem>
            </List>
          </Drawer>
        ) : null}

        {carrierInfo ? (
          <Dialog
            onClose={handleCarrierDialogClose}
            aria-labelledby="simple-dialog-title"
            open={carrierDialogOpen}
          >
            <DialogTitle
              id="simple-dialog-title"
              style={{ background: "#2F323A", color: "white" }}
            >
              {t("carrier")} {carrierInfo.uid} info
            </DialogTitle>
            <DialogContent>
              <br />
              <Grid container spacing={3}>
                <Grid item xs={4}>
                  <TextField
                    variant="outlined"
                    value={carrierInfo.article.name}
                    label={t("article")}
                  />
                </Grid>
                <Grid item xs={3}>
                  <TextField
                    variant="outlined"
                    value={carrierInfo.quantity_current}
                    label={t("quantity")}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    value={carrierInfo.article.description}
                    label={t("description")}
                    fullWidth
                  />
                </Grid>

                <Grid item>
                  <TextField
                    variant="outlined"
                    value={carrierInfo.provider_name}
                    label={t("provider")}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    variant="outlined"
                    value={carrierInfo.manufacturer_name}
                    label={t("manufacturer")}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    variant="outlined"
                    value={carrierInfo.diameter}
                    label={t("size")}
                  />
                </Grid>
                <Grid item>
                  <TextField
                    variant="outlined"
                    value={carrierInfo.width}
                    label={t("width")}
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button color="primary">Save</Button>
              <Button color="secondary" onClick={handleCarrierDialogClose}>
                {t("close")}
              </Button>
            </DialogActions>
          </Dialog>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

const UidCodeEntry = (props) => {
  const [uid, setUid] = useState("");
  const [snackbarKey, setSnackbarKey] = useState(null);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const action = (key) => (
    <React.Fragment>
      <Button
        onClick={() => {
          props.resetStorage();
          closeSnackbar(key);
        }}
      >
        OK
      </Button>
    </React.Fragment>
  );

  const handleUidSubmit = (e) => {
    if (e.keyCode === 13) {
      const value = e.target.value;
      setUid(value);
      if (props.newUIDScanned) {
        props.newUIDScanned();
      }
      if (snackbarKey) {
        closeSnackbar(snackbarKey);
        setSnackbarKey(null);
      }

      props
        .apiFunction({
          uid,
          entry: props.entryName,
          serialStatus: props.serialStatus,
          chosenStorage: props.chosenStorage,
        })
        .then((res) => {
          let carrierInfo = res.data.carrierInfo;
          let resCarriersQueue = res.data.queue;

          if (carrierInfo) {
            props.openCarrierDialog(carrierInfo);
          }

          if (resCarriersQueue) {
            props.setQueue(resCarriersQueue);
          }

          const key = props.collect
            ? enqueueSnackbar(res.data.message, {
                variant: res.data.status,
              })
            : enqueueSnackbar(res.data.message, {
                variant: res.data.status,
                persist: true,
                action,
              });
          setSnackbarKey(key);

          if (props.type === "collectJob") {
            props.collectRef.current.focus();
          }
        });
      setUid("");
      props.updateData();
    }
  };

  const handleJobNameSelected = (value) => {
    const jobName = value ? value.name : "";
    if (jobName === "") {
      return;
    }
    setUid(jobName);
    if (props.newUIDScanned) {
      props.newUIDScanned();
    }
    props
      .apiFunction({
        uid: jobName,
        entry: props.entryName,
        serialStatus: props.serialStatus,
        chosenStorage: props.chosenStorage,
      })
      .then((res) => {
        let carrierInfo = res.data.carrierInfo;
        let resCarriersQueue = res.data.queue;

        if (carrierInfo) {
          props.openCarrierDialog(carrierInfo);
        }

        if (resCarriersQueue) {
          props.setQueue(resCarriersQueue);
        }

        enqueueSnackbar(res.data.message, {
          variant: res.data.status,
        });

        if (props.type === "collectJob") {
          props.collectRef.current.focus();
        }
      });
    setUid("");
  };

  return props.type === "collectJob" ? (
    <Autocomplete
      id="machine-name"
      options={props.jobs}
      getOptionLabel={(option) => option.name}
      style={{ width: 300, paddingTop: 25, paddingBottom: 25 }}
      onChange={(e, newValue) => handleJobNameSelected(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label={props.entryName}
          variant="outlined"
          onChange={(event) => setUid(event.target.value)}
        />
      )}
    />
  ) : (
    <TextField
      variant="outlined"
      value={uid}
      id={props.entryName}
      label={props.entryName}
      onChange={(event) => setUid(event.target.value)}
      onKeyDown={handleUidSubmit}
      inputRef={props.inputRef}
      onFocus={props.onFocus}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <i className={props.icon}></i>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default MaterialStorage;
