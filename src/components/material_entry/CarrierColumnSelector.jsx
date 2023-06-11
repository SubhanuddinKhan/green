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
const CarrierColumnSelectorModal = (props) => {
  const [headers, setHeaders] = useState({});
  const [columnOptions, setColumnOptions] = useState([]);
  const [carrierUIDColumn, setCarrierUIDColumn] = useState("");
  const [articleColumn, setArticleColumn] = useState("");
  const [typeColumn, setTypeColumn] = useState("");
  const [diameterColumn, setDiameterColumn] = useState("");
  const [widthColumn, setWidthColumn] = useState("");
  const [quantityColumn, setQuantityColumn] = useState("");
  const [lotNumberColumn, setLotNumberColumn] = useState("");
  const [locationColumn, setLocationColumn] = useState("");
  const [quantityOriginalColumn, setQuantityOriginalColumn] = useState("");

  const { t, i18n } = useTranslation();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});

  const resetDataAndCloseModal = () => {
    setHeaders({});
    setColumnOptions([]);
    setCarrierUIDColumn("");
    setArticleColumn("");
    setTypeColumn("");
    setDiameterColumn("");
    setWidthColumn("");
    setQuantityColumn("");
    setQuantityOriginalColumn("");
    setLotNumberColumn("");
    setLocationColumn("");
    props.toggleFunction();
  };

  useEffect(() => {
    setHeaders(props.headers);
  }, [props.headers]);

  useEffect(() => {
    setCarrierUIDColumn(props.neededFields.UID);
    setArticleColumn(props.neededFields.Article);
    setTypeColumn(props.neededFields.Type);
    setDiameterColumn(props.neededFields.Diameter);
    setWidthColumn(props.neededFields.Width);
    setQuantityColumn(props.neededFields.Quantity);
    setQuantityOriginalColumn(props.neededFields.QuantityOriginal);
    setLotNumberColumn(props.neededFields.LotNumber);
    setLocationColumn(props.neededFields.Location);
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

    if (!carrierUIDColumn) {
      isError = true;
      errorMessages["UID"] = t("carriersColumnEmpty");
    }
    if (!articleColumn) {
      isError = true;
      errorMessages["Article"] = t("articleColumnEmpty");
    }
    if (!isError) {
      //add else if for validating other fields (if any)
      setError(false);
      setErrorMessage({});
      let selectedHeaders = {
        UID: carrierUIDColumn,
        Article: articleColumn,
        Type: typeColumn,
        Diameter: diameterColumn,
        Width: widthColumn,
        Quantity: quantityColumn,
        QuantityOriginal: quantityOriginalColumn,
        LotNumber: lotNumberColumn,
        Location: locationColumn
      };
      props.importNewCarriers(selectedHeaders);
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
        {t("importCarriers")}
      </DialogTitle>
      <DialogContent style={{ padding: 30, minHeight: 200 }}>
        <div className={{ flexGrow: 1 }}>
          <Grid container spacing={4} id="main-grid" direction="column">
            <Grid item xs={12}>
              <Grid id="middle-segment" container spacing={2}>
                <Grid item xs={3} spacing={2}>
                  <TextField
                    error={errorMessage.UID}
                    key="UID"
                    required
                    select
                    label="UID"
                    value={carrierUIDColumn}
                    onChange={(event) =>
                      setCarrierUIDColumn(event.target.value)
                    }
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

                <Grid item xs={3} spacing={2}>
                  <TextField
                    error={errorMessage.Article}
                    key="Article"
                    required
                    select
                    label={t("article")}
                    value={articleColumn}
                    onChange={(event) => setArticleColumn(event.target.value)}
                    variant="outlined"
                    style={{ width: 250 }}
                    fullWidth
                    helperText={errorMessage.Article && errorMessage.Article}
                  >
                    {columnOptions.map((option) => (
                      <MenuItem
                        key={"article" + option.value}
                        value={option.value}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={3} spacing={2}>
                  <TextField
                    key="Type"
                    select
                    label={t("type")}
                    value={typeColumn}
                    onChange={(event) => setTypeColumn(event.target.value)}
                    variant="outlined"
                    style={{ width: 250 }}
                    fullWidth
                  >
                    {columnOptions.map((option) => (
                      <MenuItem
                        key={"type" + option.value}
                        value={option.value}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={3} spacing={2}>
                  <TextField
                    key="diameter"
                    select
                    label={t("diameter")}
                    value={diameterColumn}
                    onChange={(event) => setDiameterColumn(event.target.value)}
                    variant="outlined"
                    style={{ width: 250 }}
                    fullWidth
                  >
                    {columnOptions.map((option) => (
                      <MenuItem
                        key={"diameter" + option.value}
                        value={option.value}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={3} spacing={2}>
                  <TextField
                    key="Width"
                    select
                    label={t("width")}
                    value={widthColumn}
                    onChange={(event) => setWidthColumn(event.target.value)}
                    variant="outlined"
                    style={{ width: 250 }}
                    fullWidth
                  >
                    {columnOptions.map((option) => (
                      <MenuItem
                        key={"width" + option.value}
                        value={option.value}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={3} spacing={2}>
                  <TextField
                    key="Quantity"
                    select
                    label={t("quantity")}
                    value={quantityColumn}
                    onChange={(event) => setQuantityColumn(event.target.value)}
                    variant="outlined"
                    style={{ width: 250 }}
                    fullWidth
                  >
                    {columnOptions.map((option) => (
                      <MenuItem key={"qty" + option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={3} spacing={2}>
                  <TextField
                    key="QuantityOriginal"
                    select
                    label={t("quantityOriginal")}
                    value={quantityOriginalColumn}
                    onChange={(event) => setQuantityOriginalColumn(event.target.value)}
                    variant="outlined"
                    style={{ width: 250 }}
                    fullWidth
                  >
                    {columnOptions.map((option) => (
                      <MenuItem key={"qtyOrig" + option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={3} spacing={2}>
                  <TextField
                    key="LotNumber"
                    select
                    label={t("lotNumber")}
                    value={lotNumberColumn}
                    onChange={(event) => setLotNumberColumn(event.target.value)}
                    variant="outlined"
                    style={{ width: 250 }}
                    fullWidth
                  >
                    {columnOptions.map((option) => (
                      <MenuItem key={"lot" + option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={3} spacing={2}>
                  <TextField
                    key="Location"
                    select
                    label={t("location")}
                    value={locationColumn}
                    onChange={(event) => setLocationColumn(event.target.value)}
                    variant="outlined"
                    style={{ width: 250 }}
                    fullWidth
                  >
                    {columnOptions.map((option) => (
                      <MenuItem key={"location" + option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

              </Grid>
              <Grid item xs={12}>
                <Grid
                  id="last-row"
                  container
                  spacing={3}
                  alignItems="flex-start"
                >
                  <Grid item xs={3}></Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
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
};

export default CarrierColumnSelectorModal;
