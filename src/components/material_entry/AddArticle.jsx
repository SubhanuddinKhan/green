import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import UserApi from "../../services/user.service";
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

const AddArticleModal = (props) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [provider, setProvider] = useState("");
  const [providerDescription, setProviderDescription] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [manufacturerDescription, setManufacturerDescription] = useState("");
  const [smdPackage, setSmdPackage] = useState("");
  const [location, setLocation] = useState("");
  const [SAPNumber, setSAPNumber] = useState("");
  const [errorDescription, setErrorDescription] = useState(false);
  const [errorName, setErrorName] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t, i18n } = useTranslation();

  const userAPI = new UserApi();

  const handleArticleSubmit = () => {
    setErrorName(false);
    setErrorDescription(false);

    if (!description) {
      setErrorDescription(true);
    }
    if (!name) {
      setErrorName(t("Article number is required"));
    }
    if (!description || !name) {
      return;
    }

    userAPI
      .addSingleArticle({
        name,
        description,
        smdPackage,
        provider,
        providerDescription,
        manufacturer,
        manufacturerDescription,
        SAPNumber,
        location,
      })
      .then((res) => {
        const infoMessage = res.data.message;
        const notificationVariant = res.data.status;
        enqueueSnackbar(infoMessage, {
          variant: notificationVariant,
          "data-testid": "snackbar",
        });
        setName("");
        setDescription("");
        setProvider("");
        setProviderDescription("");
        setManufacturer("");
        setManufacturerDescription("");
        setSmdPackage("");
        setSAPNumber("");
        setLocation("");
      });
    props.updateCarrierTable();
  };

  const handleArticleSubmitAndClose = () => {
    handleArticleSubmit();
    props.toggleFunction();
  };

  const handleArticleNameChange = (event) => {
    const name = event.target.value;
    userAPI.checkArticleNameIsUnique({ name }).then((res) => {
      const data = res.data;
      if (data.unique) {
        setErrorName(false);
      } else {
        setErrorName(t("articleNameNotUnique"));
      }
    });
    setName(event.target.value);
  };

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.toggleFunction}
      maxWidth="lg"
      data-testid="me-modal-single-article"
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle
        style={{ background: "#2F323A", color: "white", cursor: "grab" }}
        id="draggable-dialog-title"
      >
        {t("addSingleArticle")}
      </DialogTitle>
      <DialogContent
        style={{
          padding: "20px",
        }}
      >
        <form noValidate autoComplete="off">
          <div>
            <Grid container spacing={4}>
              <Grid item xs={3}>
                <TextField
                  required
                  error={errorName}
                  helperText={errorName ? errorName : ""}
                  name={name}
                  value={name}
                  label={t("articleNumber")}
                  variant="outlined"
                  fullWidth
                  onChange={(event) => handleArticleNameChange(event)}
                  data-testid="me-msa-input-article-number"
                />
              </Grid>
              <Grid item xs={9}>
                <TextField
                  required
                  error={errorDescription}
                  helperText={
                    errorDescription ? t("Article description is required") : ""
                  }
                  name="description"
                  value={description}
                  label={t("description")}
                  variant="outlined"
                  fullWidth
                  onChange={(event) => setDescription(event.target.value)} 
                  data-testid="me-msa-input-article-description"
                ></TextField>
              </Grid>

              <Grid item xs={3}>
                <TextField
                  name="provider"
                  label={t("provider")}
                  value={provider}
                  variant="outlined"
                  fullWidth
                  onChange={(event) => setProvider(event.target.value)}
                />
              </Grid>
              <Grid item xs={9}>
                <TextField
                  name="provider-description"
                  value={providerDescription}
                  label={t("provider.description")}
                  variant="outlined"
                  fullWidth
                  onChange={(event) =>
                    setProviderDescription(event.target.value)
                  }
                  data-testid="me-msa-input-article-description"
                ></TextField>
              </Grid>
              <Grid item xs={3}>
                <TextField
                  name="manufacturer"
                  label={t("manufacturer")}
                  value={manufacturer}
                  variant="outlined"
                  onChange={(event) => setManufacturer(event.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={9}>
                <TextField
                  name="manufacturer-description"
                  value={manufacturerDescription}
                  label={t("manufacturer.description")}
                  variant="outlined"
                  fullWidth
                  onChange={(event) =>
                    setManufacturerDescription(event.target.value)
                  }
                  data-testid="me-msa-input-article-description"
                ></TextField>
              </Grid>

              <Grid item xs={3}>
                <TextField
                  name="location"
                  label={t("location")}
                  value={location}
                  variant="outlined"
                  fullWidth
                  onChange={(event) => setLocation(event.target.value)}
                />
              </Grid>
              <Grid item xs={3}>
                <TextField
                  name="sap-number"
                  value={SAPNumber}
                  label={t("sap.number")}
                  variant="outlined"
                  fullWidth
                  onChange={(event) => setSAPNumber(event.target.value)}
                />
              </Grid>
            </Grid>
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          onClick={handleArticleSubmit}
          data-testid="me-msa-btn-save"
        >
          {t("add")}
        </Button>{" "}
        <Button
          variant="contained"
          onClick={handleArticleSubmitAndClose}
          color="primary"
          style={{ margin: 10 }}
        >
          {t("addAndClose")}
        </Button>{" "}
        <Button
          variant="contained"
          color="secondary"
          onClick={props.toggleFunction}
        >
          {t("cancel")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddArticleModal;
