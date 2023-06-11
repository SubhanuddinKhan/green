import React, { useState } from "react";
import makeStyles from '@mui/styles/makeStyles';

import IconButton from "@mui/material/IconButton";
import Autocomplete from '@mui/material/Autocomplete';
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import UserApi from "../../services/user.service";
import EjectIcon from "@mui/icons-material/Eject";
import CircularProgress from "@mui/material/CircularProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useSnackbar } from "notistack";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title">
      <Paper {...props} />
    </Draggable>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "auto",
  },
  paper: {
    width: 200,
    height: 230,
    overflow: "auto",
  },
  button: {
    margin: theme.spacing(0.5, 0),
  },
  unmountFeedersButton: {
    margin: theme.spacing(2),
    bottom: 12,
  },
  entry: { width: 200 },
}));

const CheckSetupModal = (props) => {
  const classes = useStyles();
  const [scanned, setScanned] = useState(false);
  const [scannedUID, setScannedUID] = useState("");
  const [feederUID, setFeederUID] = useState(null);
  const [job, setJob] = useState({});
  const [chipDataLog, setChipDataLog] = useState([]);
  const [machineEntered, setMachineEntered] = useState(false);
  const [machinesLoaded, setMachinesLoaded] = useState(false);
  const [slots, setSlots] = useState([]);
  const [unmountActive, setUnmountActive] = useState(false);
  const [machineName, setMachineName] = useState("");
  const [savedUID, setSavedUID] = useState("");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t, i18n } = useTranslation();

  const [machines, setMachines] = useState();
  const userApi = new UserApi();

  const handleUIDChanged = (e) => {
    setUnmountActive(false);
    setScannedUID(e.target.value);
    setScanned(false);

    setChipDataLog([]);
  };

  const handleFeederUnmounted = () => {
    userApi
      .unmount({
        savedUID,
        machineName,
        feederUID,
      })
      .then((res) => {
        const data = res.data;
        data.log.forEach((log) => {
          enqueueSnackbar(log, { variant: "success" });
        });
        setUnmountActive(false);
        setScannedUID("");
        setScanned(false);
        setChipDataLog([]);
        setSavedUID("");
        setFeederUID(null);
      });
  };

  const handleUIDScanned = (e) => {
    if (e.keyCode === 13) {
      let dataLog = [];
      var uidOnMachine = slots.some((slot) => {
        if (slot.carrier) {
          if (slot.carrier.uid === scannedUID) {
            return true;
          }
        }
        if (slot.article) {
          if (slot.article.name === scannedUID) {
            return true;
          }
        }
        if (slot.feeder) {
          if (slot.feeder.uid === scannedUID) {
            return true;
          }
        } else {
          return false;
        }
        return false;
      });
      if (uidOnMachine) {
        userApi
          .getReservedJobsFor(scannedUID)
          .then((res) => {
            const data = res.data;
            if (data.jobs) {
              data.jobs.forEach((element) => {
                element.jobarticles.forEach((secondElement) => {
                  if (
                    (secondElement.carrier &&
                      secondElement.carrier.uid === scannedUID) ||
                    (secondElement.feeder &&
                      secondElement.feeder.uid === scannedUID) ||
                    (secondElement.article &&
                      secondElement.article.name === scannedUID) ||
                    (secondElement.carrier &&
                      secondElement.carrier.feeder &&
                      secondElement.carrier.feeder.uid === scannedUID)
                  ) {
                    dataLog.push({
                      name: element.name,
                      startDate: element.commission_date,
                      bank: secondElement.bank,
                      slot: secondElement.slot,
                    });
                    return;
                  }
                });
              });
            }
            setFeederUID(data.feederUID);

            dataLog.sort((a, b) => {
              return a.startDate - b.startDate;
            });
            setChipDataLog(dataLog);
            setScanned(true);
            setSavedUID(scannedUID);
            setScannedUID("");
          })

          .catch((err) => console.log(err));
        setUnmountActive(true);
      } else {
        setScanned(true);
        setScannedUID("");
        enqueueSnackbar(t("UID not recognized or not on machine"), {
          variant: "warning",
        });
        setUnmountActive(false);
      }
    }
  };

  const getMachines = (filter) => {
    userApi
      .getMachinesList({ search: filter })
      .then((res) => {
        const data = res.data.results;
        setMachines(data);
        setMachinesLoaded(true);
      })
      .catch((err) => console.log(err));
  };

  const handleMachineNameSelected = (newValue) => {
    const machineName = newValue ? newValue.name : "";
    machines.forEach((element) => {
      if (element.name === machineName) {
        setSlots(element.slots);
        setMachineEntered(true);
        setMachineName(machineName);
        return;
      }
    });
  };

  const renderReservationsTable = () => {
    return (
      <Grid item>
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead
              style={{
                backgroundColor: "#09EC41",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">{t("startDate")}</TableCell>
                <TableCell align="right">Bank&nbsp;</TableCell>
                <TableCell align="right">Slot&nbsp;</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {chipDataLog.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">
                    {" "}
                    {row.startDate.replace("T", " ").slice(0, 16)}
                  </TableCell>
                  <TableCell align="right">{row.bank}</TableCell>
                  <TableCell align="right">{row.slot}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Grid>
    );
  };

  const exitCheck = () => {
    setScanned(false);
    setScannedUID("");
    setJob({});
    setChipDataLog([]);
    setMachines([]);
    setSlots([]);
    setMachineEntered(false);
    setMachinesLoaded(false);
    setUnmountActive(false);
    props.toggleFunction();
  };

  return (
    <Dialog
      onClose={exitCheck}
      open={props.isOpen}
      maxWidth="lg"
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      TransitionProps={{
        onEnter: () => {
          getMachines();
        },
      }}
    >
      <DialogTitle
        style={{ background: "#2F323A", color: "white", cursor: "grab" }}
        id="draggable-dialog-title"
      >
        {t("Disassemble machine")}
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          alignItems="center"
          className={classes.root}
          justifyContent="center"
          direction="column"
          spacing={2}
        >
          {machineEntered ? (
            <div>
              <Grid item alignItems="center">
                <TextField
                  id="feeder-uid"
                  className={classes.entry}
                  label="UID"
                  value={scannedUID}
                  variant="outlined"
                  onChange={handleUIDChanged}
                  onKeyDown={handleUIDScanned}
                />
                <IconButton
                  id="unmount-feeders"
                  variant="contained"
                  className={classes.unmountFeedersButton}
                  disabled={!unmountActive}
                  onClick={() => handleFeederUnmounted()}
                  size="large">
                  <EjectIcon />
                </IconButton>
              </Grid>

              {scanned ? (
                chipDataLog.length > 0 ? (
                  renderReservationsTable()
                ) : (
                  <Grid item>
                    <Chip
                      label={t("Not reserved for other jobs")}
                      clickable
                      style={{
                        backgroundColor: "#2A4494",
                        color: "white",
                        fontSize: "1.2rem",
                        width: "50",
                        padding: "1rem",
                        margin: "0.5rem",
                      }}
                    />
                  </Grid>
                )
              ) : (
                ""
              )}
            </div>
          ) : machinesLoaded ? (
            <Autocomplete
              id="machine-name"
              options={machines}
              getOptionLabel={(option) => option.name}
              style={{ width: 300, paddingTop: 25, paddingBottom: 25 }}
              onChange={(e, newValue) => handleMachineNameSelected(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("Machine name")}
                  variant="outlined"
                  onChange={(e) => getMachines(e.target.value)}
                />
              )}
            />
          ) : (
            <CircularProgress />
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={exitCheck}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CheckSetupModal;
