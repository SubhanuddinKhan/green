import React, { useState, useEffect, useContext } from "react";

import makeStyles from "@mui/styles/makeStyles";
import { styled, useTheme } from "@mui/material/styles";

import Button from "@mui/material/Button";

import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import clsx from "clsx";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import LoupeIcon from "@mui/icons-material/Loupe";
import AddBoxIcon from "@mui/icons-material/AddBox";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import ControlPointDuplicateIcon from "@mui/icons-material/ControlPointDuplicate";

import CarriersTable from "./CarrierTable";
import CarrierColumnSelectorModal from "./CarrierColumnSelector";
import ArticleColumnSelectorModal from "./ArticleColumnSelector";
import FeedersColumnSelector from "./FeedersColumnSelector";
import SingleCarrierModal from "./SingleCarrier";
import AddArticleModal from "./AddArticle";
import AddFeedersModal from "./AddFeeders";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useSnackbar } from "notistack";
import UserApi from "../../services/user.service";
import { NotificationsContext } from "../../contexts/NotficationsContext";
import { useTranslation } from "react-i18next";
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

  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  content: {
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
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundColor: "#CDD6DD",
  },
  // necessary for content to be below app bar
  toolbar: {
    ...theme.mixins.toolbar,
    marginBottom: theme.spacing(1),
  },
}));

const MaterialEntry = (props) => {
  const [carrierSelectedFile, setCarrierSelectedFile] = useState(null);
  const [articleSelectedFile, setArticleSelectedFile] = useState(null);
  const [feederSelectedFile, setFeederSelectedFile] = useState(null);

  const [carrierColumnSelectorModalOpen, setCarrierColumnSelectorModalOpen] =
    useState(false);
  const [articleColumnSelectorModalOpen, setArticleColumnSelectorModalOpen] =
    useState(false);
  const [feederColumnSelectorModalOpen, setFeederColumnSelectorModalOpen] =
    useState(false);

  const [columnSelectorType, setColumnSelectorType] = useState(null);
  const [carrierFileSelected, setCarrierFileSelected] = useState(false);
  const [articleFileSelected, setArticleFileSelected] = useState(false);
  const [feederFileSelected, setFeederFileSelected] = useState(false);

  const [carrierHeaders, setCarrierHeaders] = useState({ init: ["something"] });
  const [articleHeaders, setArticleHeaders] = useState({ init: ["something"] });
  const [feederHeaders, setFeederHeaders] = useState({ init: ["something"] });

  const [totalCarriers, setTotalCarriers] = useState(0);
  const [successfulCarriers, setSuccessfulCarriers] = useState(0);
  const [failedCarriers, setFailedCarriers] = useState(0);
  const [totalArticles, setTotalArticles] = useState(0);
  const [successfulArticles, setSuccessfulArticles] = useState(0);
  const [failedArticles, setFailedArticles] = useState(0);
  const [importLog, setImportLog] = useState({});
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [sideBarOpen, setSideBarOpen] = useState(false);

  const [carrierNeededFields, setCarrierNeededFields] = useState({
    UID: "",
    Article: "",
    Type: "",
    Diameter: "",
    Width: "",
    LotNumber: "",
  });

  const [articlesNeededFields, setArticlesNeededFields] = useState({
    Name: "",
    Description: "",
    Provider: "",
    ProviderDescription: "",
    Manufacturer: "",
    ManufacturerDescription: "",
    SapNumber: "",
    Location: "",
  });

  const [feedersNeededFields, setFeedersNeededFields] = useState({
    UID: "",
    Description: "",
  });

  const [errorSnackBarOpen, setErrorSnackBarOpen] = useState(false);
  const [errorSnackBarMessage, setErrorSnackBarMessage] = useState("");
  const [singleCarrierModalOpen, setSingleCarrierModalOpen] = useState(false);
  const [addArticleModalOpen, setAddArticleModalOpen] = useState(false);
  const [addFeedersModalOpen, setAddFeedersModalOpen] = useState(false);
  const [hackeyAddition, setHackeyAddition] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [notifications, setNotifications] = useContext(NotificationsContext);
  const [prevNoti, setPrevNoti] = useState("someinitialvalue");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t, i18n } = useTranslation();

  const materialEntryFileInputReference = React.createRef();
  const articlesFileInputReference = React.createRef();
  const feedersFileInputReference = React.createRef();

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

  const toggleCarrierColumnSelectorModal = () => {
    setCarrierColumnSelectorModalOpen(!carrierColumnSelectorModalOpen);
  };

  const toggleArticleColumnSelectorModal = () => {
    setArticleColumnSelectorModalOpen(!articleColumnSelectorModalOpen);
  };

  const toggleFeederColumnSelectorModal = () => {
    setFeederColumnSelectorModalOpen(!feederColumnSelectorModalOpen);
  };

  const onCarrierFileInputClicked = (e) => {
    e.target.value = null;
  };

  const onArticleFileInputClicked = (e) => {
    e.target.value = null;
  };

  const onFeederFileInputClicked = (e) => {
    e.target.value = null;
  };

  const onImportCarriersClicked = () => {
    materialEntryFileInputReference.current.click();
  };

  const onImportArticlesClicked = () => {
    articlesFileInputReference.current.click();
  };

  const onImportFeedersClicked = () => {
    feedersFileInputReference.current.click();
  };

  const onCarriersFileChange = (event) => {
    setCarrierSelectedFile(event.target.files[0]);
  };

  const onArticlesFileChange = (event) => {
    setArticleSelectedFile(event.target.files[0]);
  };

  const onFeedersFileChange = (event) => {
    setFeederSelectedFile(event.target.files[0]);
  };

  useEffect(() => {
    if (carrierSelectedFile) {
      onCarrierFileUpload();
    }
  }, [carrierSelectedFile]);

  useEffect(() => {
    if (articleSelectedFile) {
      onArticleFileUpload();
    }
  }, [articleSelectedFile]);

  useEffect(() => {
    if (feederSelectedFile) {
      onFeederFileUpload();
    }
  }, [feederSelectedFile]);

  // handle websocket notifications
  useEffect(() => {
    if (notifications !== prevNoti) {
      updateCarrierTable();
      switch (notifications.notification_type) {
        case "carrier_file_data":
          renderCarrierColumnSelector(notifications);
          setPrevNoti(notifications);
          break;

        case "article_file_data":
          renderArticleColumnSelector(notifications);
          setPrevNoti(notifications);
          break;

        case "article_file_error":
          enqueueSnackbar(notifications.message, {
            variant: "error",
          });
          setPrevNoti(notifications);
          break;
        case "carrier_file_error":
          enqueueSnackbar(notifications.message, {
            variant: "error",
          });
          setPrevNoti(notifications);
          break;
        case "article_file_import_log":
          enqueueSnackbar("got article file report", {
            variant: "info",
          });
          setPrevNoti(notifications);
          break;
        case "carrier_file_import_log":
          enqueueSnackbar("got carrier file report", {
            variant: "info",
            "data-testid": "snackbar",
          });
          setPrevNoti(notifications);
          break;

        default:
          break;
      }
    }
  }, [notifications]);

  useEffect(() => {
    // returned function will be called on component unmount
    return () => {
      setNotifications([]);
    };
  }, []);

  const onCarrierFileUpload = () => {
    const formData = new FormData();
    if (carrierSelectedFile == null) {
      return;
    }

    formData.append(
      "carriersfile",
      carrierSelectedFile,
      carrierSelectedFile.name
    );

    userApi
      .sendCarriersFile(formData)
      .then((res) => {
        const data = res.data;
        enqueueSnackbar(data.info, {
          variant: "info",
        });
      })
      .catch((err) => console.log(err));
    renderCarrierColumnSelector();
  };

  const onArticleFileUpload = () => {
    const formData = new FormData();
    if (articleSelectedFile == null) {
      return;
    }

    formData.append(
      "articlesfile",
      articleSelectedFile,
      articleSelectedFile.name
    );
    userApi
      .sendArticlesFile(formData)
      .then((res) => {
        const data = res.data;
        enqueueSnackbar(data.info, {
          variant: "info",
        });
      })
      .catch((err) => console.log(err));
  };

  const onFeederFileUpload = () => {
    const formData = new FormData();
    if (feederSelectedFile == null) {
      return;
    }

    formData.append("feedersfile", feederSelectedFile, feederSelectedFile.name);
    userApi
      .sendFeedersFile(formData)
      .then((res) => {
        const data = res.data;
        enqueueSnackbar(data.info, {
          variant: "info",
        });
      })
      .catch((err) => console.log(err));
  };

  const renderCarrierColumnSelector = (data) => {
    if (data) {
      let importedNeededFields = carrierNeededFields;

      if (data.savedFileData) {
      console.log("#############################################");
      console.log(carrierNeededFields);
      console.log("<<display values||data passed>>");
      console.log(data);
      console.log("before ",importedNeededFields);
      for (let field in data.savedFileData){
        const val = data.savedFileData[field] ;
        console.log("checking ",val)
        if (val !== null){
          console.log("updating importedNeededFields with:",val);
          importedNeededFields[field] = val ;
        }
      };

      setCarrierNeededFields(importedNeededFields);
      console.log("after #################################");
      console.log(importedNeededFields);
      console.log("<<created from data importedNeededFields || display values >>");
      console.log(carrierNeededFields);} else {
        setCarrierNeededFields({
          UID: "",
          Article: "",
          Type: "",
          Diameter: "",
          Width: "",
          lotNumber: "",
        });
      }

      if (data.newFileData) {
        let headers = data.newFileData;
        setCarrierHeaders(headers);
        setCarrierFileSelected(true);
        setCarrierColumnSelectorModalOpen(true);
      } else if (data.errorFileData) {
        let errorMessage = data.errorFileData;
        setErrorSnackBarOpen(true);
        setErrorSnackBarMessage(errorMessage);
      }
    }
    return (
      <CarrierColumnSelectorModal
        isOpen={carrierColumnSelectorModalOpen}
        toggleFunction={toggleCarrierColumnSelectorModal}
        headers={carrierHeaders}
        neededFields={carrierNeededFields}
        importNewCarriers={(selected) => importNewCarriersFunction(selected)}
        setNeededFields={setCarrierNeededFields}
      />
    );
  };

  const renderArticleColumnSelector = (data) => {
    if (data) {
      let importedNeededFields = articlesNeededFields;

      if (data.savedFileData) {
        console.log("#############################################");
        console.log(articlesNeededFields);
        console.log("<<display values||data passed>>");
        console.log(data);
        console.log("before ",importedNeededFields);
        for (let field in data.savedFileData){
          const val = data.savedFileData[field] ;
          console.log("checking ",val)
          if (val !== null){
            console.log("updating importedNeededFields with:",val);
            importedNeededFields[field] = val ;
          }
        };

        setArticlesNeededFields(importedNeededFields);
        console.log("after #################################");
        console.log(importedNeededFields);
        console.log("<<created from data importedNeededFields || display values >>");
        console.log(articlesNeededFields);
      } else {
        setArticlesNeededFields({
          Name: "",
          Package: "",
          Description: "",
          Provider: "",
          ProviderDescription: "",
          Manufacturer: "",
          ManufacturerDescription: "",
          SapNumber: "",
          Location: "",
        });
      }

      if (data.newFileData) {
        let headers = data.newFileData;
        setArticleHeaders(headers);
        setArticleFileSelected(true);
        setArticleColumnSelectorModalOpen(true);
      } else if (data.errorFileData) {
        let errorMessage = data.errorFileData;
        setErrorSnackBarOpen(true);
        setErrorSnackBarMessage(errorMessage);
      }
    }
    return (
      <ArticleColumnSelectorModal
        isOpen={articleColumnSelectorModalOpen}
        toggleFunction={toggleArticleColumnSelectorModal}
        headers={articleHeaders}
        neededFields={articlesNeededFields}
        importNewArticles={(selected) => importNewArticlesFunction(selected)}
        setNeededFields={setArticlesNeededFields}
      />
    );
  };

  const renderFeederColumnSelector = (data) => {
    if (data) {
      let importedNeededFields = feedersNeededFields;

      if (data.savedFileData) {
        data.savedFileData.forEach((x) => {
          if (x.name !== "sheet") {
            importedNeededFields[x.name] = x.detail;
          }
        });
        setFeedersNeededFields(importedNeededFields);
      } else {
        setFeedersNeededFields({
          UID: "",
          Description: "",
        });
      }

      if (data.newFileData) {
        let headers = data.newFileData;
        setFeederHeaders(headers);
        setFeederFileSelected(true);
        setFeederColumnSelectorModalOpen(true);
      } else if (data.errorFileData) {
        let errorMessage = data.errorFileData;
        setErrorSnackBarOpen(true);
        setErrorSnackBarMessage(errorMessage);
      }
    }
    return (
      <FeedersColumnSelector
        isOpen={feederColumnSelectorModalOpen}
        toggleFunction={toggleFeederColumnSelectorModal}
        headers={feederHeaders}
        neededFields={feedersNeededFields}
        importNewFeeders={(selected) => importNewFeedersFunction(selected)}
        setNeededFields={setFeedersNeededFields}
      />
    );
  };

  const importNewCarriersFunction = (selectedSheetFields) => {
    setCarrierColumnSelectorModalOpen(false);

    const data = {
      file_name: carrierSelectedFile.name,
      file_data: selectedSheetFields,
      file_type: columnSelectorType,
    };

    userApi
      .getNewCarriers(data)
      .then((res) => {
        //const data = res.data;
        enqueueSnackbar("Importing new carriers", {
          variant: "info",
        });
      })
      .catch((err) => console.log(err));
  };

  const importNewArticlesFunction = (selectedSheetFields) => {
    setArticleColumnSelectorModalOpen(false);

    const data = {
      file_name: articleSelectedFile.name,
      file_data: selectedSheetFields,
      file_type: columnSelectorType,
    };

    userApi
      .getNewArticles(data)
      .then((res) => {
        enqueueSnackbar(t("importingNewArticles"), {
          variant: "info",
        });
      })
      .catch((err) => console.log(err));
  };

  const importNewFeedersFunction = (selectedSheetFields) => {
    setFeederColumnSelectorModalOpen(false);

    const data = {
      file_name: feederSelectedFile.name,
      file_data: selectedSheetFields,
      file_type: columnSelectorType,
    };

    userApi
      .getNewFeeders(data)
      .then((res) => {
        enqueueSnackbar(t("importingNewArticles"), {
          variant: "info",
        });
      })
      .catch((err) => console.log(err));
  };

  const toggleSingleCarrierModal = () =>
    setSingleCarrierModalOpen(!singleCarrierModalOpen);

  const toggleAddFeedersModal = () =>
    setAddFeedersModalOpen(!addFeedersModalOpen);

  const toggleAddArticleModal = () =>
    setAddArticleModalOpen(!addArticleModalOpen);

  const handleErrorSnackBarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setErrorSnackBarOpen(false);
  };

  const updateCarrierTable = () => {
    setHackeyAddition(hackeyAddition + 1);
  };

  return (
    <div>
      <div>
        <div
          className={clsx(classes.content, {
            [classes.contentShift]: sideBarOpen,
          })}
        >
          <CarriersTable
            onRenderActivityAlert={props.onRenderActivityAlert}
            hackeyAddition={hackeyAddition}
          />
        </div>
        {currentUser && currentUser.user_role !== "R" ? (
          <Drawer
            data-testid="side-bar"
            variant="permanent"
            anchor="right"
            open={sideBarOpen}
            sx={clsx(classes.drawer, {
              [classes.drawerOpen]: sideBarOpen,
              [classes.drawerClose]: !sideBarOpen,
            })}
            classes={{
              paper: clsx({
                [classes.drawerOpen]: sideBarOpen,
                [classes.drawerClose]: !sideBarOpen,
              }),
            }}
          >
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
              <ListItem
                button
                key={"addarticle"}
                onClick={toggleAddArticleModal}
                data-testid="btn-open-single-article"
              >
                <ListItemIcon>
                  <AddBoxIcon />
                </ListItemIcon>
                <ListItemText primary={t("addArticle")} />
              </ListItem>

              <input
                name="articlesfile"
                type="file"
                hidden
                onClick={onArticleFileInputClicked}
                onChange={onArticlesFileChange}
                ref={articlesFileInputReference}
                accept="text/csv, .csv, .xls, .xlsx"
              />
              <ListItem
                button
                key={"articlesfile"}
                onClick={onImportArticlesClicked}
              >
                <ListItemIcon>
                  <LibraryAddIcon />
                </ListItemIcon>
                <ListItemText primary={t("importArticles")} />
              </ListItem>
              <ListItem
                button
                key={"addCarrier"}
                onClick={toggleSingleCarrierModal}
                data-testid="btn-open-single-carrier"
              >
                <ListItemIcon>
                  <ControlPointIcon />
                </ListItemIcon>
                <ListItemText primary={t("addCarrier")} />
              </ListItem>
              <input
                name="materialentryfile"
                type="file"
                hidden
                onClick={onCarrierFileInputClicked}
                onChange={onCarriersFileChange}
                ref={materialEntryFileInputReference}
                accept="text/csv, .csv, .xls, .xlsx"
              />
              <ListItem
                button
                key={"carrierFile"}
                onClick={onImportCarriersClicked}
              >
                <ListItemIcon>
                  <ControlPointDuplicateIcon />
                </ListItemIcon>
                <ListItemText primary={t("importCarriers")} />
              </ListItem>
              {/* <ListItem
                button
                key={"addFeeder"}
                onClick={toggleAddFeedersModal}
              >
                <ListItemIcon>
                  <LoupeIcon />
                </ListItemIcon>
                <ListItemText primary={t("addFeeders")} />
              </ListItem>
              <input
                name="feedersfile"
                type="file"
                hidden
                onClick={onFeederFileInputClicked}
                onChange={onFeedersFileChange}
                ref={feedersFileInputReference}
                accept="text/csv, .csv, .xls, .xlsx"
              />
              <ListItem
                button
                key={"feedersFile"}
                onClick={onImportFeedersClicked}
              >
                <ListItemIcon>
                  <ControlPointDuplicateIcon />
                </ListItemIcon>
                <ListItemText primary={t("importFeeders")} />
              </ListItem>
               */}
            </List>
          </Drawer>
        ) : null}
      </div>
      {carrierFileSelected ? renderCarrierColumnSelector() : <span></span>}
      {articleFileSelected ? renderArticleColumnSelector() : <span></span>}
      {feederFileSelected ? renderFeederColumnSelector() : <span></span>}

      <Snackbar
        open={errorSnackBarOpen}
        autoHideDuration={6000}
        onClose={handleErrorSnackBarClose}
      >
        <Alert variant="filled" severity="error">
          {errorSnackBarMessage}
        </Alert>
      </Snackbar>

      <SingleCarrierModal
        isOpen={singleCarrierModalOpen}
        toggleFunction={toggleSingleCarrierModal}
        updateCarrierTable={updateCarrierTable}
      />

      <AddArticleModal
        isOpen={addArticleModalOpen}
        toggleFunction={toggleAddArticleModal}
        updateCarrierTable={updateCarrierTable}
      />

      <AddFeedersModal
        isOpen={addFeedersModalOpen}
        toggleFunction={toggleAddFeedersModal}
        updateCarrierTable={updateCarrierTable}
      />

      <ImportDialog
        open={importDialogOpen}
        handleClose={() => setImportDialogOpen(false)}
        total={totalCarriers}
        successful={successfulCarriers}
        failed={failedCarriers}
        log={importLog}
      />
    </div>
  );
};

function ImportDialog(props) {
  return (
    <div>
      <Dialog
        open={props.open}
        onClose={props.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Import dialog"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            file contains {props.total} carriers, {props.successful} were
            imported, and {props.failed} couldn't be imported.
          </DialogContentText>

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1a-content"
              id="panel1a-header"
            >
              <Typography>Import log:</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <List component="nav" aria-label="main mailbox folders">
                {Object.keys(props.log).map((item) => (
                  <ListItem>
                    <Chip label={item} />
                    <ListItemText primary={"__" + props.log[item]} />
                  </ListItem>
                ))}
              </List>
            </AccordionDetails>
          </Accordion>
        </DialogContent>
        <DialogActions>
          <Button onClick={props.handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default MaterialEntry;
