import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Draggable from "react-draggable";
import { Paper } from "@mui/material";
import { useTranslation } from "react-i18next";

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title">
      <Paper {...props} />
    </Draggable>
  );
}

export default function FeedersColumnSelector(props) {
  const [headers, setHeaders] = useState({});
  const [columnOptions, setColumnOptions] = useState([]);
  const [feederUIDColumn, setFeederUIDColumn] = useState("");
  const [description, setDescription] = useState("");
  const [feederTypeColumn, setFeederTypeColumn] = useState("");
  const [carrierColumn, setCarrierColumn] = useState("");
  

  const { t, i18n } = useTranslation();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});

  const resetDataAndCloseModal = () => {
    setHeaders({});
    setColumnOptions([]);
    setFeederUIDColumn("");
    setDescription("");

    props.toggleFunction();
  };

  useEffect(() => {
    setHeaders(props.headers);
  }, [props.headers]);

  useEffect(() => {
    setFeederUIDColumn(props.neededFields.UID);
    setDescription(props.neededFields.Description);
  }, [props.neededFields]);

  const modalOpened = () => {
    //setSelectedFields(props.neededFields);
    //setHeaders(props.headers);
    let newColumnOptions = [];
    if (headers) {
      headers.forEach((column) => {
        newColumnOptions.push({ label: column, value: column });
      });
      setColumnOptions(newColumnOptions);
    }
  };

  const validateAndImport = () => {
    let isError = false;
    let errorMessages = errorMessage;

    if (!feederUIDColumn) {
      isError = true;
      errorMessages["UID"] = t("feederUIDColumnEmpty");
    }
    if (!description) {
      isError = true;
      errorMessages["Description"] = t("descriptionEmpty");
    }
    if (!carrierColumn) {
      isError = true;
      errorMessages["Carrier"] = "carrierEmpty"
    }
    if (!feederTypeColumn) {
      isError = true;
      errorMessages["Feeder Type"] = "dfeederTypeEmpty"
    }


    if (!isError) {
      //add else if for validating other fields (if any)
      setError(false);
      setErrorMessage({});
      let selectedHeaders = {
        UID: feederUIDColumn,
        Description: description,
        Carrier: carrierColumn,
        feederType: feederTypeColumn
      };
      props.importNewFeeders(selectedHeaders);
    } else {
      setError(isError);
      setErrorMessage(errorMessages);
    }
  };

  return (
    <Dialog
      onClose={() => resetDataAndCloseModal()}
      open={props.isOpen}
      maxWidth="lg"
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      TransitionProps={{
        onEntered: modalOpened
      }}>
      <DialogTitle
        id="draggable-dialog-title"
        style={{ background: "#2F323A", color: "white", cursor: "grab" }}
      >
        Import carriers
      </DialogTitle>
      <DialogContent style={{ padding: 30, minHeight: 200 }}>
        <Grid container spacing={3} direction="row">
          <Grid item xs={3} spacing={3} style={{ marginRight: 120 }}>
            <TextField
              error={errorMessage.UID}
              key="UID"
              required
              select
              label="UID"
              value={feederUIDColumn}
              onChange={(event) => setFeederUIDColumn(event.target.value)}
              variant="outlined"
              style={{ width: 250 }}
              fullWidth
              helperText={errorMessage.UID && errorMessage.UID}
            >
              {columnOptions.map((option) => (
                <MenuItem key={"uid" + option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={3} spacing={3}>
            <TextField
              error={errorMessage.Description}
              key="Description"
              required
              select
              label={t("description")}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              variant="outlined"
              style={{ width: 250 }}
              fullWidth
              helperText={errorMessage.Description && errorMessage.Description}
            >
              {columnOptions.map((option) => (
                <MenuItem
                  key={"description" + option.value}
                  value={option.value}
                >
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={3} spacing={3} style={{ marginRight: 120 }}>
            <TextField
              error={errorMessage.UID}
              key="Feeder Type"
              required
              select
              label="Feeder Type"
              value={feederTypeColumn}
              onChange={(event) => setFeederTypeColumn(event.target.value)}
              variant="outlined"
              style={{ width: 250 }}
              fullWidth
              helperText={errorMessage.UID && errorMessage.UID}
            >
              {columnOptions.map((option) => (
                <MenuItem key={"Feeder Type" + option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={3} spacing={3} style={{ marginRight: 120 }}>
            <TextField
              error={errorMessage.UID}
              key="Carrier"
              required
              select
              label="Carrier"
              value={carrierColumn}
              onChange={(event) => setCarrierColumn(event.target.value)}
              variant="outlined"
              style={{ width: 250 }}
              fullWidth
              helperText={errorMessage.UID && errorMessage.UID}
            >
              {columnOptions.map((option) => (
                <MenuItem key={"Carrier" + option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={validateAndImport} color="primary">
          {t("saveColumnsImportNew")}
        </Button>{" "}
        <Button
          variant="contained"
          color="secondary"
          onClick={() => resetDataAndCloseModal()}
        >
          {t("cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
