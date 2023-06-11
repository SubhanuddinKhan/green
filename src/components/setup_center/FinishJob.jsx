import React, { useState } from "react";
import makeStyles from '@mui/styles/makeStyles';
import UserApi from "../../services/user.service";

import Autocomplete from '@mui/material/Autocomplete';
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";

import FinishJobTable from "./FinishJobTable";
import Draggable from "react-draggable";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

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
    flex: 1,
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

const FinishJobModal = (props) => {
  const classes = useStyles();
  const [enteredJobName, setEnteredJobName] = useState("");
  const [machineName, setMachineName] = useState("");
  const [jobEntered, setJobEntered] = useState(false);
  const [jobsLoaded, setJobsLoaded] = useState(false);
  const [jobs, setJobs] = useState();
  const [machineJobs, setMachineJobs] = useState();
  const [notes, setNotes] = useState("");
  const [job, setJob] = useState({});
  const [tableData, setTableData] = useState([]);
  const [finishJobData, setFinishJobData] = useState({});
  const userApi = new UserApi();
  const { t, i18n } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();

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

    let finishJobDataInstance = finishJobData;
    let machinename = "";

    userApi
      .getJob(jobName)
      .then((res) => {
        const data = res.data;
        setJob(data.job);
        setEnteredJobName(data.job.name);
        machinename = data.job.machine ? data.job.machine.name : "";
        setMachineName(machinename);
        setJobEntered(true);
        if (machineName !== "") {
          handleMachineJobData(jobName, machinename);
        }
        let newTableData = [];
        data.job.jobarticles.forEach((element) => {
          newTableData.push({
            id: element.id,
            carrier: element.carrier ? element.carrier.uid : "",
            article: element.article.name,
            description: element.article.description,
            shouldUse: element.count * data.job.count,
            machineUse: "",
            actualUsed: element.count * data.job.count + 5,
          });
          if (element.carrier) {
            finishJobDataInstance[element.carrier.uid] = {
              reserved: element.count * data.job.count,
              used: element.count * data.job.count + 5,
            };
            setFinishJobData(finishJobDataInstance);
          }
        });
        setTableData(newTableData);
      })

      .catch((err) => console.log(err));
  };

  const handleMachineJobData = (jobName, machineName) => {
    let newMachineJobs = [];
    userApi
      .getJobFromMachine({ job_name: jobName, machine_name: machineName })
      .then((res) => {
        const data = res.data;
        if (data.status === "error") {
          enqueueSnackbar(data.message, { variant: "error" });
          setMachineJobs([]);
        } else if (data.jobs) {
          enqueueSnackbar(data.message, { variant: "success" });
          Object.keys(data.jobs).forEach((key) => {
            const job = data.jobs[key];
            newMachineJobs.push(job["__data__"]);
          });
          setMachineJobs(newMachineJobs);
        } else {
          enqueueSnackbar(data.message, { variant: "warning" });
          setMachineJobs([]);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleMachineJobSelected = async (e) => {
    var articleUsed = {};
    var tableDataWithMachine = tableData;
    userApi
      .getFeederexFromMachine({
        job_id: e.target.value,
        machine_name: machineName,
      })
      .then((res) => {
        const data = res.data;
        if (data.feederexs) {
          const feederexs = data.feederexs;

          Object.keys(feederexs).forEach((key) => {
            if (feederexs[key]["__data__"].article) {
              articleUsed[feederexs[key]["__data__"].article] =
                feederexs[key]["__data__"].fullcounter;
            }
          });

          for (var i in tableDataWithMachine) {
            tableDataWithMachine[i].machineUse =
              articleUsed[tableDataWithMachine[i].article];
            tableDataWithMachine[i].actualUsed =
              articleUsed[tableDataWithMachine[i].article] + 5;
          }
        }
      })
      .then(() => {
        setTableData([...tableDataWithMachine]);
      })
      .catch((err) => console.log(err));
  };

  const onFinishJob = () => {
    let data = finishJobData;
    data["notes"] = notes;
    data["jobName"] = enteredJobName;
    console.log(data);

    userApi
      .sendJobFinishData(data)
      .then((res) => {
        //props.snackbarFunction(res.data, "info");
        exitCheck();
      })
      .catch((err) => console.log(err));
  };

  const handleUsedArticle = (value, carrierUID) => {
    let finishJobDataInstance = finishJobData;
    finishJobDataInstance[carrierUID].used = value;
    setFinishJobData(finishJobDataInstance);
  };

  const exitCheck = () => {
    setEnteredJobName("");
    setJobEntered(false);
    setJobsLoaded(false);
    setJob({});
    setFinishJobData({});
    setNotes("");
    setMachineJobs(null);
    props.updateJobsTable();
    props.toggleFunction();
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
        {t("finishJob")}
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
              <Grid item>
                <Typography variant="h5" gutterBottom>
                  {job.name}
                </Typography>
              </Grid>
              {job.customer ? (
                <Grid item>
                  <Typography variant="h5" gutterBottom>
                    {job.customer.name}
                  </Typography>
                </Grid>
              ) : (
                ""
              )}
              {machineName !== "" ? (
                machineJobs && machineJobs.length > 0 ? (
                  <Grid item xs={9}>
                    <TextField
                      id="outlined-select-job-machine"
                      select
                      label="Select job"
                      onChange={handleMachineJobSelected}
                      helperText="Found these jobs on machine"
                      variant="outlined"
                      fullWidth
                    >
                      {machineJobs.map((option) => (
                        <MenuItem
                          key={option.id}
                          value={option.id}
                          style={{ flexDirection: "column" }}
                        >
                          <div>
                            {`ID: ${option.id}  _ PCBs: ${option.pcbcounter}  _ SMDs: ${option.partcounter}`}
                          </div>
                          <div style={{ color: "gray", fontSize: 12 }}>
                            {option.created.replace("T", " ")}
                          </div>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                ) : machineJobs && machineJobs.length === 0 ? (
                  <Grid item xs={9}>
                    {t("noJobsFound")}
                  </Grid>
                ) : (
                  <Grid item xs={9}>
                    {t("Fetching...")}
                  </Grid>
                )
              ) : (
                <Grid item xs={9}>
                  {t("No machine assigned for this job")}
                </Grid>
              )}
              <FinishJobTable
                data={tableData}
                handleChangedData={(data) => setFinishJobData(data)}
              />
              <Grid item>
                <TextField
                  id="job_notes"
                  label={t("Notes")}
                  multiline
                  vlaue={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  variant="outlined"
                  fullWidth
                />
              </Grid>
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
        <Button variant="contained" onClick={onFinishJob}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FinishJobModal;
