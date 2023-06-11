import React, { useEffect, useState, useRef } from "react";
import makeStyles from "@mui/styles/makeStyles";
import Grid from "@mui/material/Grid";
import UserApi from "../../services/user.service";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import DateTimePicker from "@mui/lab/DateTimePicker";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import Typography from "@mui/material/Typography";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import DeleteIcon from "@mui/icons-material/Delete";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import { Chart } from "react-google-charts";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LinearProgress from "@mui/material/LinearProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import Draggable from "react-draggable";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title">
      <Paper {...props} />
    </Draggable>
  );
}

const filter = createFilterOptions();

// add one week to current date
const setFinish = () => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 7);
  return currentDate;
};

const setStart = () => {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 7);
  return currentDate;
};

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
  button: {
    margin: theme.spacing(1),
  },
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  timeline: {
    transform: "rotate(90deg)",
  },
  timelineContentContainer: {
    textAlign: "left",
  },
  timelineContent: {
    display: "inline-block",
    transform: "rotate(-90deg)",
    textAlign: "center",
    minWidth: 50,
  },
  timelineIcon: {
    transform: "rotate(-90deg)",
  },
}));

const CreateJobModal = (props) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [selectedFile, setSelectedFile] = useState(null);
  const [bankOptions, setBankOptions] = useState([{ number: "1" }]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});
  const [articleOptions, setArticleOptions] = useState([]);
  const [machineOptions, setMachineOptions] = useState([]);
  const [jobName, setJobName] = useState("");
  const [description, setDescription] = useState("");
  const [customer, setCustomer] = useState("");
  const [board, setBoard] = useState("");
  const [count, setCount] = useState(1);
  const [project, setProject] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [projects, setProjects] = useState([]);
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [departments, setDepartments] = useState([]);
  const [projectOpen, toggleProjectOpen] = useState(false);
  const [projectDialogValue, setProjectDialogValue] = useState({
    name: "",
    description: "",
    department: "",
  });
  const [startDate, setStartDate] = useState(new Date());
  const [finishDate, setFinishDate] = useState(new Date());
  const [deadline, setDeadline] = useState(new Date());
  const [machine, setMachine] = useState("");
  const [materialSorting, setMaterialSorting] = useState([]);
  const [newArticle, setNewArticle] = useState("");
  const [newArticleBank, setNewArticleBank] = useState("");
  const [newArticlePlace, setNewArticlePlace] = useState("");
  const [newArticleCount, setNewArticleCount] = useState("");
  const [autoCompleteUsed1, setAutoCompleteUsed1] = useState(0);
  const [autoCompleteUsed2, setAutoCompleteUsed2] = useState(0);
  const programFileInputReference = React.createRef();
  const userApi = new UserApi();
  const articleInputRef = useRef(null);
  const classes = useStyles();
  const { t, i18n } = useTranslation();

  const handleClose = () => {
    setProjectDialogValue({
      name: "",
      description: "",
      department: "",
    });

    toggleProjectOpen(false);
  };

  const handleProjectSubmit = () => {
    createNewProject();
    setProject(projectDialogValue.name);
    handleClose();
  };

  const getArticleData = (filter) => {
    userApi
      .getArticlesList({ offset: 0, search: filter })
      .then((res) => {
        const data = res.data;

        if (data) {
          setArticleOptions(data.results);
        }
      })
      .catch((err) => console.log(err));
  };

  const getMachines = (filter) => {
    userApi
      .getMachinesList({ offset: 0, search: filter })
      .then((res) => {
        const data = res.data;
        if (data) {
          setMachineOptions(data.results);
        }
      })
      .catch((err) => console.log(err));
  };

  const getProjects = (filter) => {
    userApi
      .getProjectsList({ offset: 0, search: filter })
      .then((res) => {
        const data = res.data;
        if (data) {
          setProjects(data.results);
        }
      })
      .catch((err) => console.log(err));
  };

  const getDepartments = (filter) => {
    userApi
      .getDepartmentsList({ offset: 0, search: filter })
      .then((res) => {
        const data = res.data;
        if (data) {
          setDepartments(data.results);
        }
      })
      .catch((err) => console.log(err));
  };

  const createNewDepartment = (department) => {
    userApi
      .createDepartment({
        name: department,
      })
      .then((res) => {
        const data = res.data;
        if (data) {
          enqueueSnackbar(data.message, {
            variant: data.status,
          });
          getDepartments("");
          setProjectDialogValue({
            ...projectDialogValue,
            department: department,
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const createNewProject = () => {
    userApi
      .createProject({
        name: projectDialogValue.name,
        description: projectDialogValue.description,
        department: projectDialogValue.department,
      })
      .then((res) => {
        const data = res.data;
        if (data) {
          enqueueSnackbar(data.message, {
            variant: data.status,
          });
          getProjects("");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleModalOpen = () => {
    getArticleData("");
    getMachines("");
    getProjects("");
    getDepartments("");
  };

  useEffect(() => {
    if (selectedFile != null) {
      onProgramFileUpload();
    }
  }, [selectedFile]);

  const addNewArticle = () => {
    let isError = false;
    let articleInput = newArticle;
    let bankInput = newArticleBank;
    let placeInput = newArticlePlace;
    let countInput = newArticleCount;

    let errorMessages = errorMessage;

    if (!articleInput | !bankInput | !placeInput | !countInput) {
      isError = true;
      errorMessages["emptyArticleFields"] = t("all fields must be entered!");
    }
    /*if (!input["Article"]) {
      isError = true;
      errorMessages["Article"] = "Article column can't be empty.";
    }*/

    if (!isError) {
      let materialSortingData = materialSorting;
      if (materialSortingData) {
        materialSortingData.push({
          article: newArticle,
          bank: newArticleBank,
          place: newArticlePlace,
          count: newArticleCount,
        });
      } else {
        materialSortingData = [];
        materialSortingData.push({
          article: newArticle,
          bank: newArticleBank,
          place: newArticlePlace,
          count: newArticleCount,
        });
      }
      setNewArticle("");
      setNewArticleBank("");
      setNewArticlePlace("");
      setNewArticleCount("");
      setErrorMessage({});
      setAutoCompleteUsed1(autoCompleteUsed1 + 1);
      setAutoCompleteUsed2(autoCompleteUsed2 + 1);
      setMaterialSorting(materialSortingData);
    } else {
      setErrorMessage(errorMessages);
      setError(isError);
    }
    setTimeout(() => {
      articleInputRef.current.focus();
    }, 100);
  };

  const onProgramFileChange = async (event) => {
    // Update the state
    setSelectedFile(event.target.files[0]);
  };

  const onProgramFileButtonClicked = () => {
    programFileInputReference.current.click();
  };

  const onProgramFileUpload = () => {
    const formData = new FormData();

    formData.append("programFile", selectedFile, selectedFile.name);

    userApi.sendJobProgramFile(formData).then((res) => {
      const data = res.data;

      if (data.jobInfo === "error") {
        props.snackbarFunction("File couldn't be imported", "error");
      } else {
        setMaterialSorting(data.jobInfo);
      }
    });
  };

  const exitModal = () => {
    setError(false);
    setErrorMessage({});
    setArticleOptions([]);
    setMachineOptions([]);
    setJobName("");
    setDescription("");
    setCustomer("");
    setBoard("");
    setCount(1);
    setStartDate(new Date());
    setFinishDate(new Date());
    setDeadline(new Date());
    setMaterialSorting([]);
    setNewArticle("");
    setNewArticleBank("");
    setNewArticlePlace("");
    setNewArticleCount("");
    setAutoCompleteUsed1(0);
    setAutoCompleteUsed2(0);
    setProjectDialogValue({
      name: "",
      description: "",
      department: "",
    });
    setProject("");
    props.updateJobsTable();
    props.updateTimeLineData();
    props.cancel();
  };

  const onSaveJob = () => {
    let isError = false;
    let errorMessages = errorMessage;

    if (!jobName) {
      isError = true;
      errorMessages["jobName"] = t("Job name can't be empty");
    }

    if (!description) {
      isError = true;
      errorMessages["description"] = t("Job description can't be empty");
    }

    if (finishDate < startDate) {
      isError = true;
      errorMessages["finishDate"] = t("Finish date can't be before start date");
    }

    /*if (!input["Article"]) {
      isError = true;
      errorMessages["Article"] = "Article column can't be empty.";
    }*/
    if (!isError) {
      //add else if for validating other fields (if any)
      setError(isError);
      setErrorMessage({});
      let job = {
        jobName,
        description,
        customer,
        board,
        count,
        project,
        startDate,
        finishDate,
        materialSorting,
        machine,
      };
      userApi
        .sendNewJob(job)
        .then((res) => {
          const data = res.data;
          if (data.success) {
            props.snackbarFunction("Job created successfully", "info");
            //props.snackbarFunction(data.log.warning, "warning");
            exitModal();
            return true;
          } else {
            props.snackbarFunction(data.log.error, "error");
            exitModal();
            return false;
          }
        })
        .catch((err) => console.log(err));
    } else {
      setError(isError);
      setErrorMessage(errorMessages);
      return false;
    }
  };

  const onChangedArticle = (newValue) => {
    getArticleData(newValue);
  };

  const removeJobArticle = (article, e) => {
    var newJobInfo = materialSorting.filter(function (obj) {
      return obj.article !== article;
    });
    setMaterialSorting(newJobInfo);
  };

  const handleMachineChosen = (machine) => {
    if (machine) {
      var new_bank_options = [];

      for (let i = 1; i <= machine.banks; i++) {
        new_bank_options.push({ number: i.toString() });
      }
      setMachine(machine.name);
      setBankOptions(new_bank_options);
    } else {
      setBankOptions([{ number: "1" }]);
    }
  };

  const handleJobNameChange = (event) => {
    const name = event.target.value;
    userApi.checkJobNameIsUnique({ name }).then((res) => {
      const data = res.data;
      if (data.unique) {
        setErrorMessage({});
      } else {
        setErrorMessage({
          jobName: t("jobNameNotUnique"),
        });
      }
    });
    setJobName(event.target.value);
  };

  return (
    <Dialog
      onClose={props.toggleFunction}
      open={props.isOpen}
      maxWidth="lg"
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      TransitionProps={{
        onEnter: () => {
          handleModalOpen();
        },
      }}
    >
      <DialogTitle
        style={{ background: "#2F323A", color: "white", cursor: "grab" }}
        id="draggable-dialog-title"
      >
        {t("Create job")}
      </DialogTitle>
      <DialogContent style={{ padding: 30 }}>
        <Grid
          container
          spacing={4}
          id="main-grid"
          direction="column"
          className={classes.root}
        >
          <Grid item xs={12}>
            <Grid id="top-row" container spacing={3}>
              <Grid item xs={3}>
                <TextField
                  id="job-name"
                  label={t("name")}
                  variant="outlined"
                  fullWidth={true}
                  onChange={(event) => handleJobNameChange(event)}
                  required
                  error={!!errorMessage.jobName}
                  helperText={errorMessage.jobName ? errorMessage.jobName : ""}
                ></TextField>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  fullWidth={true}
                  id="description"
                  label={t("description")}
                  variant="outlined"
                  onChange={(event) => setDescription(event.target.value)}
                  required
                  error={!!errorMessage.description}
                  helperText={
                    errorMessage.description ? errorMessage.description : ""
                  }
                ></TextField>{" "}
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="board-name"
                  label={t("board")}
                  variant="outlined"
                  onChange={(event) => setBoard(event.target.value)}
                  fullWidth
                ></TextField>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  id="count"
                  label={t("count")}
                  variant="outlined"
                  onChange={(event) => setCount(event.target.value)}
                  fullWidth
                ></TextField>
              </Grid>
              <Grid item xs={3}>
                <Autocomplete
                  value={project}
                  onChange={(event, newValue) => {
                    if (typeof newValue === "string") {
                      // timeout to avoid instant validation of the dialog's form.
                      setTimeout(() => {
                        toggleProjectOpen(true);
                        setProjectDialogValue({
                          name: newValue,
                          description: "",
                          department: "",
                        });
                      });
                    } else if (newValue && newValue.inputValue) {
                      toggleProjectOpen(true);
                      setProjectDialogValue({
                        name: newValue.inputValue,
                        description: "",
                        department: "",
                      });
                    } else {
                      setProject(newValue);
                    }
                  }}
                  options={projects}
                  getOptionLabel={(option) => {
                    // e.g value selected with enter, right from the input
                    if (typeof option === "string") {
                      return option;
                    }
                    if (option.inputValue) {
                      return option.inputValue;
                    }
                    return option.name;
                  }}
                  filterOptions={(options, params) => {
                    const filtered = projects;
                    if (params.inputValue !== "") {
                      filtered.push({
                        inputValue: params.inputValue,
                        name: `Add "${params.inputValue}"`,
                      });
                    }

                    return filtered;
                  }}
                  onInputChange={(event, newInputValue) => {
                    getProjects(newInputValue);
                  }}
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  renderOption={(option) => option.name}
                  style={{ width: 300 }}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("project")}
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Grid id="middle-row" container spacing={3}></Grid>
          </Grid>
          <Grid item xs={12}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>
                  {t("timeline")}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {props.timelineJobs.length > 1 ? (
                  <Chart
                    width={"100%"}
                    height={`250px`}
                    chartType="Timeline"
                    data={props.timelineJobs}
                    loader={<LinearProgress />}
                    options={{
                      showRowNumber: true,
                      allowHtml: true,
                      tooltip: { isHtml: true },
                      hAxis: {
                        format: "d/M hh:mm",
                      },
                    }}
                    rootProps={{ "data-testid": "1" }}
                  />
                ) : (
                  <LinearProgress />
                )}
              </AccordionDetails>
            </Accordion>
          </Grid>
          <Grid item xs={12}>
            <Grid id="third-row" container spacing={3}>
              <Grid item xs={3}>
                <Autocomplete
                  id="machine-name"
                  options={machineOptions}
                  getOptionLabel={(option) => option.name}
                  //style={{ width: 300, paddingTop: 25, paddingBottom: 25 }}
                  onChange={(e, newValue) => handleMachineChosen(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("Machine name")}
                      variant="outlined"
                      onChange={(e) => getMachines(e.target.value)}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={3}>
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  key="startDate"
                  label={t("startDate")}
                  onChange={(value) => {
                    setStartDate(value);
                  }}
                  value={startDate}
                  ampm={false}
                  fullWidth
                ></DateTimePicker>
              </Grid>
              <Grid item xs={3}>
                <DateTimePicker
                  renderInput={(props) => <TextField {...props} />}
                  key="finishDate"
                  onChange={(value) => setFinishDate(value)}
                  value={finishDate}
                  style={{ border: "none" }}
                  ampm={false}
                  label={t("finishDate")}
                  fullWidth
                  error={!!errorMessage.finishDate}
                  helperText={
                    errorMessage.finishDate ? errorMessage.finishDate : ""
                  }
                ></DateTimePicker>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid id="last-row" container spacing={3} alignItems="flex-start">
              <Grid item xs={2}>
                <input
                  name="programFile"
                  type="file"
                  hidden
                  /*onClick={onProgramFileInputClicked}*/
                  onChange={onProgramFileChange}
                  ref={programFileInputReference}
                  accept=".asc"
                />
                <Button
                  variant="contained"
                  className={classes.button}
                  startIcon={<CloudUploadIcon />}
                  onClick={onProgramFileButtonClicked}
                >
                  {t("Upload file")}
                </Button>
              </Grid>
              <Grid item xs={10}>
                <TableContainer component={Paper}>
                  <Table aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>{t("article")}</TableCell>
                        <TableCell>{t("bank")}</TableCell>
                        <TableCell>{t("slot")}</TableCell>
                        <TableCell>{t("count")}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody
                      style={{
                        maxHeight: 500,
                        overflow: "auto",
                      }}
                    >
                      {materialSorting
                        ? materialSorting.map((element) => (
                            <TableRow key={element.article}>
                              <TableCell
                                component="th"
                                scope="row"
                                style={{ width: 250 }}
                              >
                                {element.article}
                              </TableCell>
                              <TableCell style={{ width: 75 }}>
                                {element.bank}
                              </TableCell>
                              <TableCell style={{ width: 75 }}>
                                {element.place}
                              </TableCell>
                              <TableCell style={{ width: 75 }}>
                                {element.count}
                              </TableCell>
                              <TableCell style={{ width: 75 }}>
                                <IconButton
                                  aria-label="delete"
                                  className={classes.margin}
                                  onClick={(e) =>
                                    removeJobArticle(element.article, e)
                                  }
                                  size="large"
                                >
                                  <DeleteIcon />
                                </IconButton>{" "}
                              </TableCell>
                            </TableRow>
                          ))
                        : ""}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TableContainer>
                  <TableRow key="footer">
                    <TableCell colSpan={2} component="th" scope="row">
                      <Autocomplete
                        freeSolo
                        autoHighlight
                        key={autoCompleteUsed1}
                        id="article-autocomplete"
                        options={articleOptions}
                        getOptionLabel={(option) =>
                          `${option.name}  -  ${option.description}`
                        }
                        onChange={(e, newValue) => {
                          if (newValue) {
                            setNewArticle(newValue.name);
                          } else {
                            setNewArticle("");
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="filled"
                            size="small"
                            error={!!errorMessage.emptyArticleFields}
                            helperText={
                              errorMessage.emptyArticleFields
                                ? errorMessage.emptyArticleFields
                                : ""
                            }
                            onChange={(e) => {
                              onChangedArticle(e.target.value);
                            }}
                            style={{ width: 300 }}
                            inputRef={articleInputRef}
                            required
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <Autocomplete
                        key={autoCompleteUsed2}
                        id="bank-autocomplete"
                        autoHighlight
                        autoSelect
                        options={bankOptions}
                        getOptionLabel={(option) => option.number}
                        onChange={(e, newValue) => {
                          if (newValue) {
                            setNewArticleBank(newValue.number);
                          } else {
                            setNewArticleBank("");
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="filled"
                            size="small"
                            error={!!errorMessage.emptyArticleFields}
                            style={{ width: 150 }}
                            required
                          />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="place"
                        type="number"
                        label=""
                        variant="filled"
                        size="small"
                        value={newArticlePlace}
                        onChange={(event) => {
                          if (
                            (event.target.value >= 0) |
                            (event.target.value === "")
                          ) {
                            setNewArticlePlace(event.target.value);
                          }
                        }}
                        error={!!errorMessage.emptyArticleFields}
                        style={{ width: 150 }}
                        required
                      />
                    </TableCell>
                    <TableCell>
                      {" "}
                      <TextField
                        id="count"
                        type="number"
                        label=""
                        variant="filled"
                        size="small"
                        value={newArticleCount}
                        onChange={(event) => {
                          if (
                            (event.target.value >= 0) |
                            (event.target.value === "")
                          ) {
                            setNewArticleCount(event.target.value);
                          }
                        }}
                        error={!!errorMessage.emptyArticleFields}
                        style={{ width: 150 }}
                        required
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="add"
                        size="small"
                        onClick={addNewArticle}
                      >
                        <AddIcon fontSize="inherit" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </TableContainer>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={onSaveJob}>
          {t("saveJob")}
        </Button>{" "}
        <Button variant="contained" color="secondary" onClick={exitModal}>
          {t("cancel")}
        </Button>
      </DialogActions>
      <Dialog
        open={projectOpen}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="lg"
      >
        <DialogTitle id="form-dialog-title">{t("add.project")}</DialogTitle>
        <DialogContent style={{ padding: 30 }}>
          <Grid container spacing={3} direction="row">
            <TextField
              autoFocus
              margin="dense"
              id="name"
              value={projectDialogValue.name}
              onChange={(event) =>
                setProjectDialogValue({
                  ...projectDialogValue,
                  name: event.target.name,
                })
              }
              label={t("name")}
              type="text"
              variant="outlined"
              style={{ marginRight: 20 }}
            />
            <TextField
              margin="dense"
              id="name"
              value={projectDialogValue.description}
              onChange={(event) =>
                setProjectDialogValue({
                  ...projectDialogValue,
                  description: event.target.value,
                })
              }
              label={t("description")}
              type="text"
              variant="outlined"
              style={{ marginRight: 20 }}
            />
            <Autocomplete
              value={projectDialogValue.department}
              onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                  // timeout to avoid instant validation of the dialog's form.
                  setTimeout(() => {
                    createNewDepartment(newValue);
                  });
                } else if (newValue && newValue.inputValue) {
                  // timeout to avoid instant validation of the dialog's form.
                  createNewDepartment(newValue.inputValue);
                } else {
                  setProjectDialogValue({
                    ...projectDialogValue,
                    department: newValue.name,
                  });
                }
              }}
              filterOptions={(options, params) => {
                const filtered = departments;
                if (params.inputValue !== "") {
                  filtered.push({
                    inputValue: params.inputValue,
                    name: `Add "${params.inputValue}"`,
                  });
                }

                return filtered;
              }}
              onInputChange={(event, newInputValue) => {
                getDepartments(newInputValue);
              }}
              options={departments}
              getOptionLabel={(option) => {
                // e.g value selected with enter, right from the input
                if (typeof option === "string") {
                  return option;
                }
                if (option.inputValue) {
                  return option.inputValue;
                }
                return option.name;
              }}
              selectOnFocus
              clearOnBlur
              handleHomeEndKeys
              renderOption={(option) => option.name}
              style={{ width: 224 }}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  margin="dense"
                  label={t("department")}
                  variant="outlined"
                />
              )}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleProjectSubmit()}
            type="submit"
            color="primary"
            variant="contained"
          >
            {t("add")}
          </Button>
          <Button onClick={handleClose} color="secondary" variant="contained">
            {t("cancel")}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default CreateJobModal;
