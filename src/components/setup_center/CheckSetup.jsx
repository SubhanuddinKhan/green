import React, { useState, useEffect, useRef } from "react";
import makeStyles from '@mui/styles/makeStyles';
import errorSound from "../../media/error.fee855fa.mp3";
import passSound from "../../media/pass.a0515499.mp3";
import bankPassSound from "../../media/alert_simple.dafe14e1.wav";
import { green, red } from "@mui/material/colors";
import Autocomplete from '@mui/material/Autocomplete';
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import UserApi from "../../services/user.service";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";
import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useSnackbar } from "notistack";
import Draggable from "react-draggable";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Paper } from "@mui/material";
import { useTranslation } from "react-i18next";

const useAudio = (url) => {
  const [audio] = useState(new Audio(url));
  const [playing, setPlaying] = useState(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

  return [playing, toggle];
};

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
  entry: { width: 200 },
}));

const CheckSetupModal = (props) => {
  const classes = useStyles();
  const [enteredJobName, setEnteredJobName] = useState("");
  const [jobEntered, setJobEntered] = useState(false);
  const [jobsLoaded, setJobsLoaded] = useState(false);

  const [jobs, setJobs] = useState();
  const [scanned, setScanned] = useState(false);
  const [scannedUID, setScannedUID] = useState("");
  const [scanningIndex, setScanningIndex] = useState(0);
  const [chipInfo, setChipInfo] = useState("");
  const [job, setJob] = useState({});
  const [sorting, setSorting] = useState({});
  const [selectedBank, setSelectedBank] = useState();
  const [setupStatus, setSetupStatus] = useState({});
  const [uidError, setUidError] = useState(false);
  const [playingErrorSound, toggleErrorSound] = useAudio(errorSound);
  const [playingPassSound, togglePassSound] = useAudio(passSound);
  const [playingBankPassSound, toggleBankPassSound] = useAudio(bankPassSound);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t, i18n } = useTranslation();
  const uidScannerInput = useRef();

  const userApi = new UserApi();

  const getJobs = (filter) => {
    userApi
      .getJobsList({ search: filter })
      .then((res) => {
        const data = res.data.results;
        setJobs(data);
        setJobsLoaded(true);
      })
      .catch((err) => console.log(err));
  };

  const handleJobNameSelected = async (newValue) => {
    const jobName = newValue.name;
    var materialSorting = sorting;
    userApi
      .getJob(jobName)
      .then((res) => {
        const data = res.data;

        data.job.jobarticles.map((jobarticle) => {
          if (jobarticle.bank in materialSorting) {
            materialSorting[jobarticle.bank].push({
              slot: jobarticle.slot,
              carrier: jobarticle.carrier ? jobarticle.carrier.uid : null,
              article: jobarticle.article.name,
              feeder: jobarticle.feeder ? jobarticle.feeder.uid : null,
            });
          } else {
            materialSorting[jobarticle.bank] = [
              {
                slot: jobarticle.slot,
                carrier: jobarticle.carrier ? jobarticle.carrier.uid : null,
                article: jobarticle.article.name,
                feeder: jobarticle.feeder ? jobarticle.feeder.uid : null,
              },
            ];
          }
        });
        for (const bank in materialSorting) {
          materialSorting[bank].sort((a, b) => {
            return a.slot - b.slot;
          });
        }
        setSorting(materialSorting);
        setJobEntered(true);
        setJob(data.job);
        setEnteredJobName(data.job.name);
      })
      .catch((err) => console.log(err));
  };

  const handleUIDChanged = (e) => {
    setScanned(false);
    setUidError(false);
    setScannedUID(e.target.value);
  };

  const handleUIDScanned = (e) => {
    if (e.keyCode === 13) {
      setScanned(true);
      if (
        scannedUID === sorting[selectedBank][scanningIndex].carrier ||
        scannedUID === sorting[selectedBank][scanningIndex].feeder ||
        scannedUID === sorting[selectedBank][scanningIndex].article
      ) {
        if (scanningIndex === sorting[selectedBank].length - 1) {
          setChipInfo(t("Bank sorting correct choose another bank"));
          setScanningIndex(0);
          toggleBankPassSound("play");
        } else {
          setChipInfo(
            `${t("Feeder located on bank")}: ${selectedBank} ${t("on slot")} ${
              sorting[selectedBank][scanningIndex].slot
            }`
          );
          setScanningIndex(scanningIndex + 1);
          togglePassSound("play");
        }
      } else {
        setUidError(true);
        setScanningIndex(0);
        toggleErrorSound("play");
      }
      /*let resFound = false;
      job.jobarticles.map((element) => {
        if (!resFound) {
          if (element.carrier.uid === scannedUID) {
            setUidError(false);
            setChipInfo(`Bank: ${element.bank}, Slot: ${element.slot}`);
            resFound = true;
            return;
          } else if (element.carrier.feeder) {
            if (element.carrier.feeder.uid === scannedUID) {
              setUidError(false);
              setChipInfo(`Bank: ${element.bank}, Slot: ${element.slot}`);
              resFound = true;
              return;
            }
          } else {
            setUidError(true);
          }
        }
      });*/
      setScannedUID("");
    }
  };

  const exitCheck = () => {
    setEnteredJobName("");
    setJobEntered(false);
    setJob({});
    setScanned(false);
    setUidError(false);
    setChipInfo("");
    setSorting({});
    setSelectedBank(null);
    props.toggleFunction();
  };

  const onConfirm = () => {
    userApi
      .sendConfirmSetup({ enteredJobName, sorting })
      .then((res) => {
        const data = res.data;
        enqueueSnackbar(data.info, {
          variant: "success",
        });
      })
      .catch((err) => console.log(err));
    exitCheck();
  };

  const handleChangeBank = (e) => {
    setSelectedBank(e.target.value);
    setScanningIndex(0);
    setScanned(false);
    setUidError(false);
    setTimeout(() => {
      uidScannerInput.current.focus();
    }, 200);
  };

  const renderFeedBack = () => {
    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        {scanned ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <Grid item>
              {uidError ? (
                <ErrorIcon style={{ color: red[500], fontSize: 75 }} />
              ) : (
                <CheckCircleIcon style={{ color: green[500], fontSize: 75 }} />
              )}
            </Grid>
            <Grid item style={{ paddingTop: 20 }}>
              {uidError ? (
                <Chip
                  label={t("Please check setup and repeat from start")}
                  clickable
                  color="error"
                />
              ) : (
                <Chip label={chipInfo} clickable color="primary" />
              )}
            </Grid>{" "}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  };

  return (
    <Dialog
      open={props.isOpen}
      onClose={exitCheck}
      maxWidth="lg"
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      TransitionProps={{
        onEntered: () => {
          getJobs("");
        },
      }}
    >
      <DialogTitle
        style={{ background: "#2F323A", color: "white", cursor: "grab" }}
        id="draggable-dialog-title"
      >
        {t("checkSetup")}
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          alignItems="center"
          className={classes.root}
          justifyContent="center"
        >
          {jobEntered ? (
            <Grid
              container
              alignItems="center"
              className={classes.root}
              justifyContent="center"
              direction="column"
              spacing={2}
            >
              <Grid item reRender={sorting}>
                <TextField
                  id="select-bank"
                  select
                  label={t("Select bank")}
                  value={selectedBank}
                  onChange={handleChangeBank}
                  variant="outlined"
                  style={{ minWidth: 150 }}
                >
                  {Object.keys(sorting).map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {selectedBank ? (
                <Grid item>
                  <TextField
                    id="feeder-uid"
                    className={classes.entry}
                    label={"UID"}
                    value={scannedUID}
                    variant="outlined"
                    onChange={handleUIDChanged}
                    onKeyDown={handleUIDScanned}
                    inputRef={uidScannerInput}
                  />
                </Grid>
              ) : (
                ""
              )}
              {renderFeedBack()}
            </Grid>
          ) : jobsLoaded ? (
            <Autocomplete
              id="job-name"
              options={jobs}
              getOptionLabel={(option) => option.name}
              style={{ width: 300 }}
              onChange={(e, newValue) => handleJobNameSelected(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("jobName")}
                  variant="outlined"
                  onChange={(e) => getJobs(e.target.value)}
                />
              )}
            />
          ) : (
            <CircularProgress />
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={onConfirm}>
          {t("confirm")}
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={exitCheck}
          style={{ marginRight: 10 }}
        >
          {t("cancel")}
        </Button>{" "}
      </DialogActions>
    </Dialog>
  );
};

export default CheckSetupModal;
