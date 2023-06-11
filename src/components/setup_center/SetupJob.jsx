import React, { useState, useEffect } from "react";
import makeStyles from '@mui/styles/makeStyles';
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import SetupTable from "./SetupTable";
import Autocomplete from '@mui/material/Autocomplete';
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import UserApi from "../../services/user.service";
import CircularProgress from "@mui/material/CircularProgress";
import { useSnackbar } from "notistack";
import Draggable from "react-draggable";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Paper } from "@mui/material";
import { useTranslation } from "react-i18next";

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title">
      <Paper {...props} />
    </Draggable>
  );
}

function createMaterialData(
  uid,
  article,
  count,
  storage,
  provider,
  manufacturer,
  feeder,
  bank,
  slot_nr
) {
  return {
    uid,
    article,
    count,
    storage,
    provider,
    manufacturer,
    feeder,
    bank,
    slot_nr,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },

  button: {
    margin: theme.spacing(0.5, 0),
  },
  entry: { width: 200, paddingBottom: "2em" },
}));

export default function SetupJobModal(props) {
  const classes = useStyles();
  const [enteredJobName, setEnteredJobName] = useState("");
  const [job, setJob] = useState();
  const [jobEntered, setJobEntered] = React.useState(false);
  const [jobsLoaded, setJobsLoaded] = useState(false);

  const [jobs, setJobs] = useState();
  const [recordToBeScanned, setRecordToBeScanned] = React.useState(true);
  const [carrierArticle, setCarrierArticle] = React.useState("");
  const [feederUID, setFeederUID] = React.useState("");
  const [reservedMaterial, setReservedMaterial] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState();
  const [feeders, setFeeders] = useState([]);
  const [selectedFeeder, setSelectedFeeder] = useState();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t, i18n } = useTranslation();

  const userApi = new UserApi();

  const carrierHeadCells = [
    {
      id: "uid",
      numeric: false,
      disablePadding: true,
      label: t("Carrier UID"),
    },
    {
      id: "article",
      numeric: false,
      disablePadding: false,
      label: t("article"),
    },
    { id: "count", numeric: true, disablePadding: false, label: t("quantity") },
    {
      id: "storage",
      numeric: false,
      disablePadding: false,
      label: t("storage"),
    },
    {
      id: "provider",
      numeric: false,
      disablePadding: false,
      label: t("provider"),
    },
    {
      id: "manufacturer",
      numeric: false,
      disablePadding: false,
      label: t("manufacturer"),
    },
    {
      id: "feeder",
      numeric: false,
      disablePadding: false,
      label: t("feeder"),
    },
    {
      id: "bank",
      numeric: false,
      disablePadding: false,
      label: "Bank",
    },
    {
      id: "slot_nr",
      numeric: false,
      disablePadding: false,
      label: "Slot",
    },
  ];

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

  useEffect(() => {
    if (job) {
      updateJobs(job.jobarticles);
    }
  }, [job]);

  const updateJobs = (jobArticles) => {
    const material = [];
    jobArticles.map((x) => {
      if (x) {
        material.push(
          createMaterialData(
            x.carrier ? x.carrier.uid : "",
            x.article.name,
            x.carrier ? x.carrier.quantity_current : x.article.quantity,
            x.carrier ? x.carrier.location : "",
            x.article.manufacturer_name,
            x.article.provider_name,
            x.feeder ? x.feeder.uid : "",
            x.bank,
            x.slot
          )
        );
      }
    });
    setReservedMaterial(material);
  };

  const handleScanRecordChange = (e) => {
    const value = e.target.value;
    setCarrierArticle(value);
  };

  const handleScanRecordKeyPress = (e) => {
    if (e.keyCode === 13) {
      if (
        !(
          reservedMaterial.find((r) => r.article === carrierArticle) ||
          reservedMaterial.find((r) => r.uid === carrierArticle) ||
          carrierArticle === ""
        )
      ) {
        setCarrierArticle("");
        enqueueSnackbar(t("Record not found"), {
          variant: "error",
        });
      } else {
        setSelectedRecord(carrierArticle);
        setCarrierArticle("");
        setRecordToBeScanned(false);
        enqueueSnackbar(t("Record scanned"), {
          variant: "info",
        });
      }
    }
  };
  const handleScanFeederChange = (e) => {
    const value = e.target.value;
    setFeederUID(value);
  };
  const handleScanFeederKeyPress = (e) => {
    if (e.keyCode === 13) {
      const jobData = job.jobarticles;
      userApi
        .setFeederToJobArticle({ selectedRecord, feederUID, jobUID: job.name })
        .then((res) => {
          const data = res.data;
          jobData.forEach((element) => {
            if (element.carrier) {
              if (element.carrier.uid === selectedRecord) {
                element.feeder = data.feeder;
              }
            } else if (element.article.name === selectedRecord) {
              element.feeder = data.feeder;
            }
          });
          updateJobs(jobData);
          setJob((prevJob) => ({
            ...prevJob,
            jobarticles: jobData,
          }));
        })
        .catch((err) => console.log(err));
      setSelectedFeeder(feederUID);
      setFeederUID("");
      setRecordToBeScanned(true);
    }
  };

  const handleJobNameSelected = async (newValue) => {
    const jobName = newValue ? newValue.name : "";

    userApi
      .getJob(newValue)
      .then((res) => {
        const data = res.data;
        setJobEntered(true);
        setJob(data.job);
        setEnteredJobName(jobName);
      })
      .catch((err) => console.log(err));

    //console.log(

    // );
  };

  const cancelSetup = () => {
    setJobEntered(false);
    setEnteredJobName("");
    setRecordToBeScanned(true);
    setCarrierArticle("");
    setFeederUID("");
    setReservedMaterial([]);
    setSelectedRecord("");
    setFeeders([]);
    setSelectedFeeder("");
    props.updateJobsTable();
    props.toggleFunction();
  };

  return (
    <Dialog
      open={props.isOpen}
      onClose={cancelSetup}
      maxWidth="xl"
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
        {t("setupJob")}
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          justifyContent="center"
          alignItems="center"
          className={classes.root}
        >
          {jobEntered ? (
            <div className={{ flexGrow: 1 }}>
              <Grid
                container
                justifyContent="center"
                alignItems="center"
                direction="column"
                spacing={3}
                className={classes.root}
              >
                <Grid
                  container
                  direction="row"
                  alignItems="center"
                  justifyContent="center"
                  spacing={1}
                >
                  <Grid item>
                    {recordToBeScanned ? <ArrowForwardIcon /> : ""}
                  </Grid>
                  <Grid item xs={4}>
                    {recordToBeScanned ? (
                      <div>
                        <br />
                        <TextField
                          id="carrier-scan"
                          label="Scan carrier"
                          variant="outlined"
                          onKeyDown={handleScanRecordKeyPress}
                          onChange={handleScanRecordChange}
                          value={carrierArticle}
                          fullWidth
                        />
                        <br />
                      </div>
                    ) : (
                      <div>
                        <br />
                        <TextField
                          id="feeder-scan"
                          label="Scan feeder"
                          variant="outlined"
                          onKeyDown={handleScanFeederKeyPress}
                          onChange={handleScanFeederChange}
                          value={feederUID}
                          fullWidth
                        />
                        <br />
                      </div>
                    )}
                  </Grid>
                  <Grid item>
                    {!recordToBeScanned ? (
                      <ArrowBackIcon style={{ paddingTob: 5 }} />
                    ) : (
                      ""
                    )}
                  </Grid>
                </Grid>

                <Grid item>
                  <SetupTable
                    id="setup-table"
                    tableName={t("Job's material")}
                    headCells={carrierHeadCells}
                    rows={reservedMaterial}
                    //updateTable = {props.updateTable}
                    dense={true}
                    selectedRecord={selectedRecord}
                  />
                </Grid>
                <Grid item style={{ paddingBottom: "2em" }}></Grid>
              </Grid>
            </div>
          ) : jobsLoaded ? (
            <Autocomplete
              id="job-name"
              options={jobs}
              getOptionLabel={(option) => option.name}
              style={{ width: 300 }}
              onChange={(e, newValue) => {
                handleJobNameSelected(newValue.name);
              }}
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
        <Button variant="contained" onClick={cancelSetup}>
          OK
        </Button>{" "}
      </DialogActions>
    </Dialog>
  );
}
