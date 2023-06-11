import React, { useState, useEffect } from "react";
import makeStyles from "@mui/styles/makeStyles";
import UserApi from "../../services/user.service";
import { useTheme } from "@mui/material/styles";

import withStyles from "@mui/styles/withStyles";

import axios from "axios";

import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import ArticleTable from "./ArticleTable";
import CarrierTable from "./CarrierTableReserveation";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Draggable from "react-draggable";
import { Paper } from "@mui/material";
import { useTranslation } from "react-i18next";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import TransferList from "./PriorityList";
import { SortableContainer, SortableElement } from "react-sortable-hoc";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { useSnackbar } from "notistack";

/* jshint ignore:start */
function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title">
      <Paper {...props} />
    </Draggable>
  );
}
/* jshint ignore:end */

function createArticleData(name, count, description) {
  return { name, count, description };
}

function createCarrierData(
  uid,
  count,
  reserved,
  location,
  delivered,
  provider,
  manufacturer
) {
  return { uid, count, reserved, location, delivered, provider, manufacturer };
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
  feederSlot: { background: "silver" },
  chips: {
    display: "flex",
    flexWrap: "wrap",
  },
  chip: {
    margin: 2,
  },
}));

const demoManufacturers = [
  "Oliver",
  "Van",
  "April",
  "Ralph",
  "Alexander",
  "Abbott",
  "Wagner",
  "Wilkerson",
  "Andrews",
  "Snyder",
];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, itemName, theme) {
  return {
    fontWeight:
      itemName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const ReserveMaterialModal = (props) => {
  const classes = useStyles();
  const theme = useTheme();

  const [enteredJobName, setEnteredJobName] = useState("");
  const [jobEntered, setJobEntered] = useState(false);
  const [jobsLoaded, setJobsLoaded] = useState(false);
  const [job, setJob] = useState({});
  const [jobs, setJobs] = useState();
  const [jobArticles, setJobArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState();
  const [articleIndex, setArticleIndex] = useState();
  const [availableCarriers, setAvailableCarriers] = useState([]);
  const [selectedCarrier, setSelectedCarrier] = useState();
  const [reservations, setReservations] = useState([]);
  const [articleSwitch, setArticleSwitch] = useState(false);
  const [boardsCount, setBoardsCount] = useState(0);
  const [reservedCarrier, setReservedCarrier] = useState("");
  const [machineSlots, setMachineSlots] = useState([]);
  const { t, i18n } = useTranslation();
  const [anchorAutoRes, setAnchorAutoRes] = useState(null);
  const [autoSortDialogOpen, setAutoSortDialogOpen] = useState(false);
  const [strategies, setStrategies] = useState({});
  const [forceAssign, setForceAssign] = useState(true);
  const [manufacturers, setManufacturers] = useState([]);
  const [selectedManufacturers, setSelectedManufacturers] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [storages, setStorages] = useState([]);
  const [selectedStorages, setSelectedStorages] = useState([]);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    userApi
      .getStorageDevices()
      .then((res) => {
        const data = res.data;
        setStorages(data.results);
      })
      .catch((err) => {
        console.log(err);
      });
    userApi
      .getManufacturers()
      .then((res) => {
        const data = res.data;
        setManufacturers(data.results);
      })
      .catch((err) => {
        console.log(err);
      });
    userApi
      .getSuppliers()
      .then((res) => {
        const data = res.data;
        setSuppliers(data.results);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (autoSortDialogOpen) {
      const savedStrategies = JSON.parse(localStorage.getItem("strategies"));
      console.log(savedStrategies);
      if (savedStrategies) {
        setStrategies(savedStrategies);
      }
    }
  }, [autoSortDialogOpen]);

  const handleAutoResClick = (event) => {
    setAutoSortDialogOpen(true);
  };

  const handleAutoResClose = (event) => {
    setSelectedStorages([]);
    setSelectedManufacturers([]);
    setSelectedSuppliers([]);
    setAutoSortDialogOpen(false);
    localStorage.setItem("strategies", JSON.stringify(strategies));
  };

  const userApi = new UserApi();

  const articleHeadCells = [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: t("article"),
    },
    {
      id: "count",
      numeric: true,
      disablePadding: true,
      label: t("count"),
    },
    {
      id: "description",
      numeric: false,
      disablePadding: true,
      label: t("description"),
    },
  ];

  const carrierHeadCells = [
    {
      id: "uid",
      numeric: false,
      disablePadding: true,
      label: t("Carrier UID"),
    },
    { id: "count", numeric: true, disablePadding: true, label: t("quantity") },
    {
      id: "reserved",
      numeric: true,
      disablePadding: true,
      label: t("reserved"),
    },
    {
      id: "location",
      numeric: false,
      disablePadding: true,
      label: t("location"),
    },
    {
      id: "delivered",
      numeric: false,
      disablePadding: true,
      label: t("delivered"),
    },
    {
      id: "provider",
      numeric: false,
      disablePadding: true,
      label: t("provider"),
    },
    {
      id: "manufacturer",
      numeric: false,
      disablePadding: true,
      label: t("manufacturer"),
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

  const handleJobNameSelected = (newValue) => {
    const jobName = newValue ? newValue.name : "";
    var articles = [];
    var reservationsArticles = [];

    userApi
      .getJob(jobName)
      .then((res) => {
        const data = res.data;
        setJobEntered(true);
        setJob(data.job);
        setEnteredJobName(jobName);

        data.job.jobarticles.forEach((x) => {
          articles.push(
            createArticleData(
              x.article.name,
              data.job.count ? x.count : 1,
              x.article.description
            )
          );
          var reservationInstance = {};
          reservationInstance["article"] = x.article.name;
          reservationInstance["count"] = x.count;
          reservationInstance["bank"] = x.bank;
          reservationInstance["slot"] = x.slot;

          if (x.carrier) {
            reservationInstance["carrier"] = x.carrier.uid;
          } else {
            reservationInstance["carrier"] = null;
          }
          reservationsArticles.push(reservationInstance);
        });
        setJobArticles(articles);
        setReservations(reservationsArticles);
        if (data.job.machine) {
          setMachineSlots(data.job.machine.slots);
        }
      })
      .catch((err) => console.log(err));

    setBoardsCount(job.count);
  };

  const setArticleImportCarriers = (articleName, index) => {
    const carriers = [];
    setSelectedArticle(articleName);
    setArticleIndex(index);
    axios
      .get("http://localhost:8000/api/get_article_carriers/" + articleName)
      .then((res) => {
        const data = res.data;
        data.carriers.forEach((x) => {
          carriers.push(
            createCarrierData(
              x.uid,
              x.quantity_current,
              x.quantity_reserved,
              x.location,
              x.is_delivered,
              x.article.provider_name,
              x.article.manufacturer_name
            )
          );
        });
        var reservation = reservations.filter((obj, objIndex) => {
          return (obj.article === articleName) & (objIndex === index);
        });
        setReservedCarrier(
          reservation.length > 0 ? reservation[0].carrier : null
        );
        setArticleSwitch(!articleSwitch);
        setAvailableCarriers(carriers);
      });
  };

  const changeReservation = (value) => {
    setSelectedCarrier(value);
    const nextReservations = reservations;
    nextReservations[articleIndex].carrier = value;
    setReservedCarrier(value);
    setReservations(nextReservations);
  };

  const onSaveBom = () => {
    let data = { reservations, enteredJobName };
    userApi
      .sendJobReservations(data)
      .then((res) => {
        if (res.data.error) {
          props.snackbarFunction(res.data.error, "error");
        } else if (res.data.got_reservations) {
          props.snackbarFunction(res.data.got_reservations, "info");
          cancelReservation();
        }
        //props.snackbarFunction(res.data, "info");
      })
      .catch((err) =>
        props.snackbarFunction("Request error has occurred", "error")
      );
  };

  const handleManufacturerStrategyChanged = (event) => {
    setSelectedManufacturers(event.target.value);
  };

  const handleSupplierStrategyChanged = (event) => {
    setSelectedSuppliers(event.target.value);
  };

  const handleStorageStrategyChanged = (event) => {
    setSelectedStorages(event.target.value);
  };

  const updateStrategiesList = (newList) => {
    //map array to dict with index as key
    const newStrategies = newList.reduce((acc, curr, index) => {
      acc[index] = curr;
      return acc;
    }, {});
    console.log(newStrategies);
    setStrategies(newStrategies);
  };

  const handleAutomaticReservation = (event) => {
    userApi
      .handleAutomaticReservation({
        job: enteredJobName,
        strategies: strategies,
        selectedStorages: selectedStorages,
        selectedManufacturers: selectedManufacturers,
        selectedSuppliers: selectedSuppliers,
      })
      .then((res) => {
        const data = res.data;
        console.log(data);
        enqueueSnackbar(data.status, { variant: "info" });
        setAutoSortDialogOpen(false);
      })
      .catch((err) => console.log(err));
  };

  const cancelReservation = () => {
    setEnteredJobName("");
    setJobEntered(false);
    setJobArticles([]);
    setSelectedArticle([]);
    setAvailableCarriers([]);
    setSelectedCarrier("");
    setReservations([]);
    props.updateJobsTable();
    props.toggleFunction();
  };

  return (
    <Dialog
      onClose={() => cancelReservation()}
      open={props.isOpen}
      maxWidth="lg"
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      TransitionProps={{
        onEnter: () => {
          getJobs("");
        },
      }}
    >
      <DialogTitle
        style={{ background: "#2F323A", color: "white", cursor: "grab" }}
        id="draggable-dialog-title"
      >
        {t("prepareMaterial")}
      </DialogTitle>
      <DialogContent>
        <Grid
          container
          alignItems="center"
          className={classes.root}
          justifyContent="center"
        >
          {jobEntered ? (
            <div className={{ flexGrow: 1 }}>
              {/* <Grid style={{ marginTop: "10px", flex: 1 }}>
                <Button
                  aria-controls="customized-menu"
                  aria-haspopup="true"
                  variant="contained"
                  color="primary"
                  onClick={handleAutoResClick}
                  style={{
                    alignSelf: "center",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  Open Menu
                </Button>
              </Grid> */}
              <Grid container direction="row" spacing={4}>
                <Grid item xs={6}>
                  <ArticleTable
                    id="articles-table"
                    tableName={t("articles")}
                    headCells={articleHeadCells}
                    rows={jobArticles}
                    machineSlots={machineSlots}
                    selectedArticle={selectedArticle}
                    articleIndex={articleIndex}
                    setSelectedArticle={(value, index) =>
                      setArticleImportCarriers(value, index)
                    }
                    reservations={reservations}
                  />
                </Grid>
                <Grid item xs={6}>
                  <CarrierTable
                    id="carriers-table"
                    tableName={t("Available Carriers")}
                    headCells={carrierHeadCells}
                    rows={selectedArticle ? availableCarriers : []}
                    selectedCarrier={reservedCarrier}
                    switch={articleSwitch}
                    machineSlots={machineSlots}
                    setSelectedCarrier={(value) => changeReservation(value)}
                    withDense={true}
                    job={job}
                  />
                </Grid>
              </Grid>
            </div>
          ) : jobsLoaded ? (
            <Autocomplete
              id="job-name"
              options={jobs}
              getOptionLabel={(option) => option.name}
              style={{ width: 300, paddingTop: 25, paddingBottom: 25 }}
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
        <Button variant="contained" onClick={() => onSaveBom()}>
          {t("Save BOM")}
        </Button>{" "}
        <Button
          variant="contained"
          color="secondary"
          onClick={() => cancelReservation()}
        >
          {t("cancel")}
        </Button>
      </DialogActions>
      <Dialog
        open={autoSortDialogOpen}
        onClose={handleAutoResClose}
        maxWidth="md"
        classes={{
          flex: 1,
          alignItems: "center",
        }}
      >
        <DialogTitle id="simple-dialog-title">Choose strategies</DialogTitle>
        <DialogContent
          style={{ overflow: "hidden", alignItems: "center", flex: 1 }}
        >
          <TransferList updateStrategiesList={updateStrategiesList} />
          <div style={{ margin: "20px" }}>
            <Autocomplete
              multiple
              id="tags-outlined"
              options={manufacturers}
              getOptionLabel={(option) => option.name}
              filterSelectedOptions
              onChange={(e, newValue) => setSelectedManufacturers(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Manufacturers"
                  placeholder="select manufacturers..."
                />
              )}
            />
          </div>
          <div style={{ margin: "20px" }}>
            <Autocomplete
              multiple
              id="tags-outlined"
              options={suppliers}
              getOptionLabel={(option) => option.name}
              filterSelectedOptions
              onChange={(e, newValue) => setSelectedSuppliers(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Suppliers"
                  placeholder="select suppliers..."
                />
              )}
            />
          </div>
          <div style={{ margin: "20px" }}>
            <Autocomplete
              multiple
              id="tags-outlined"
              options={storages}
              getOptionLabel={(option) => option.name}
              filterSelectedOptions
              onChange={(e, newValue) => setSelectedStorages(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Storages"
                  placeholder="select storages..."
                />
              )}
            />
          </div>
          <div style={{ margin: "10px" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={forceAssign}
                  onChange={() => setForceAssign(!forceAssign)}
                  name="checkedB"
                  color="primary"
                />
              }
              label="Assign any carrier if no carriers according to strategies found"
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAutoResClose} color="primary" autoFocus>
            cancel
          </Button>
          <Button onClick={() => handleAutomaticReservation()} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};

export default ReserveMaterialModal;
