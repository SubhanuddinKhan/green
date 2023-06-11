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

const ArticleColumnSelectorModal = (props) => {
  const [headers, setHeaders] = useState({});
  const [columnOptions, setColumnOptions] = useState([]);
  const [nameColumn, setNameColumn] = useState("");
  const [descriptionColumn, setDescriptionColumn] = useState("");
  const [providerColumn, setProviderColumn] = useState("");
  const [providerDescriptionColumn, setProviderDescriptionColumn] =
    useState("");
  const [manufacturerColumn, setManufacturerColumn] = useState("");
  const [manufacturerDescriptionColumn, setManufacturerDescriptionColumn] =
    useState("");
  const [packageColumn, setPackageColumn] = useState("");
  const [SAPNumberColumn, setSAPNumberColumn] = useState("");
  const [locationColumn, setLocationColumn] = useState("");
  const { t, i18n } = useTranslation();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState({});

  const resetDataAndCloseModal = () => {
    window.location.reload();
  };

  useEffect(() => {
    setHeaders(props.headers);
  }, [props.headers]);

  useEffect(() => {
    setNameColumn(props.neededFields.Name);
    setDescriptionColumn(props.neededFields.Description);
    setProviderColumn(props.neededFields.Provider);
    setManufacturerColumn(props.neededFields.Manufacturer);
    setPackageColumn(props.neededFields.Package);
    setLocationColumn(props.neededFields.Location);
    setSAPNumberColumn(props.neededFields.SapNumber);
    setProviderDescriptionColumn(props.neededFields.ProviderDescription);
    setManufacturerDescriptionColumn(
      props.neededFields.ManufacturerDescription
    );
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

    if (!nameColumn) {
      isError = true;
      errorMessages["Article"] = t("articleColumnEmpty");
    }
    if (!descriptionColumn) {
      isError = true;
      errorMessages["Description"] = t("descriptionColumnEmpty");
    }
    if (!isError) {
      //add else if for validating other fields (if any)
      setError(false);
      setErrorMessage({});
      let selectedHeaders = {
        Name: nameColumn,
        Description: descriptionColumn,
        Package: packageColumn,
        Provider: providerColumn,
        Manufacturer: manufacturerColumn,
        Location: locationColumn,
        SapNumber: SAPNumberColumn,
        ProviderDescription: providerDescriptionColumn,
        ManufacturerDescription: manufacturerDescriptionColumn,
      };
      props.importNewArticles(selectedHeaders);
    } else {
      setError(isError);
      setErrorMessage(errorMessages);
    }
  };

  return (
    <Dialog
      onClose={props.toggleFunction}
      open={props.isOpen}
      maxWidth="lg"
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      TransitionProps={{
        onEntered: modalOpened,
      }}
    >
      <DialogTitle
        style={{ background: "#2F323A", color: "white", cursor: "grab" }}
        id="draggable-dialog-title"
      >
        {t("importArticles")}
      </DialogTitle>
      <DialogContent style={{ padding: 40, minHeight: 300 }}>
        <div>
          <Grid container spacing={4} id="main-grid" direction="column">
            <Grid item xs={12}>
              <Grid id="middle-segment" container spacing={3}>
                <Grid item xs={3} spacing={3}>
                  <TextField
                    error={errorMessage.Article}
                    key="Article"
                    required
                    select
                    label={t("name")}
                    value={nameColumn}
                    onChange={(event) => setNameColumn(event.target.value)}
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

                <Grid item xs={3} spacing={3}>
                  <TextField
                    key="Description"
                    required
                    select
                    label={t("description")}
                    value={descriptionColumn}
                    onChange={(event) =>
                      setDescriptionColumn(event.target.value)
                    }
                    variant="outlined"
                    style={{ width: 250 }}
                    fullWidth
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

                <Grid item xs={3} spacing={3}>
                  <TextField
                    key="Provider"
                    select
                    label={t("provider")}
                    value={providerColumn}
                    onChange={(event) => setProviderColumn(event.target.value)}
                    variant="outlined"
                    style={{ width: 250 }}
                    fullWidth
                  >
                    {columnOptions.map((option) => (
                      <MenuItem
                        key={"provider" + option.value}
                        value={option.value}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={3} spacing={3}>
                  <TextField
                    key="ProviderDescription"
                    select
                    label={t("provider.description")}
                    value={providerDescriptionColumn}
                    onChange={(event) =>
                      setProviderDescriptionColumn(event.target.value)
                    }
                    variant="outlined"
                    style={{ width: 250 }}
                    fullWidth
                  >
                    {columnOptions.map((option) => (
                      <MenuItem
                        key={"provider" + option.value}
                        value={option.value}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={3} spacing={3}>
                  <TextField
                    key="Manufacturer"
                    select
                    label={t("manufacturer")}
                    value={manufacturerColumn}
                    onChange={(event) =>
                      setManufacturerColumn(event.target.value)
                    }
                    variant="outlined"
                    style={{ width: 250 }}
                    fullWidth
                  >
                    {columnOptions.map((option) => (
                      <MenuItem
                        key={"manufacturer" + option.value}
                        value={option.value}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={3} spacing={3}>
                  <TextField
                    key="Manufacturer-Description"
                    select
                    label={t("manufacturer.description")}
                    value={manufacturerDescriptionColumn}
                    onChange={(event) =>
                      setManufacturerDescriptionColumn(event.target.value)
                    }
                    variant="outlined"
                    style={{ width: 250 }}
                    fullWidth
                  >
                    {columnOptions.map((option) => (
                      <MenuItem
                        key={"manufacturer" + option.value}
                        value={option.value}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={3} spacing={3}>
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
                      <MenuItem
                        key={"location" + option.value}
                        value={option.value}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={3} spacing={3}>
                  <TextField
                    key="SAP-Number"
                    select
                    label={t("sap.number")}
                    value={SAPNumberColumn}
                    onChange={(event) => setSAPNumberColumn(event.target.value)}
                    variant="outlined"
                    style={{ width: 250 }}
                    fullWidth
                  >
                    {columnOptions.map((option) => (
                      <MenuItem key={"sap" + option.value} value={option.value}>
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
                ></Grid>
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

export default ArticleColumnSelectorModal;
