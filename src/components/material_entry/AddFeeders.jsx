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
import IconButton from "@mui/material/IconButton";
import PrintIcon from "@mui/icons-material/Print";
import Autocomplete from '@mui/material/Autocomplete';
function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title">
      <Paper {...props} />
    </Draggable>
  );
}

const AddFeedersModal = (props) => {
  const [carriers, setCarriers] = useState([])
  const [errorCarrierUid, setErrorCarrierUid] = useState(false);
  const [carrier, setCarrier] = useState("");
  const [feederUID, setFeederUID] = useState("");
  const [description, setDescription] = useState("");
  const [feederType, setFeederType] = useState("");
  const [errorUID, setErrorUID] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const feederUIDRef = React.useRef();
  const { t, i18n } = useTranslation();
  const userApi = new UserApi();


  const handleCarrierSelected = (option) => {
    console.log(option);
    setCarrier(option.uid);
  }

  const getCarriers = (filter) => {
    console.log(filter)
    userApi
    .getCarriers({uid: filter})
    .then((res) => {
      const data = res.data.results;
      setCarriers(data);
    })
    .catch((err) => console.log(err));
  };

  const handleFeederSubmit = (event) => {
    setErrorUID(false);
    setErrorCarrierUid(false);

    if (!feederUID) {
      setErrorUID(t("feederUIDEmpty"));
      return;
    }

    userApi
      .addFeeder({ feederUID, description,carrier, feederType })
      .then((res) => {
        const infoMessage = res.data.message;
        const notificationVariant = res.data.status;
        enqueueSnackbar(infoMessage, { variant: notificationVariant });
      })
      .catch((err) => {
        enqueueSnackbar(t("serverError"), { variant: "error" });
      });
    setFeederUID("");
    setDescription("");
    feederUIDRef.current.focus();
  };

  const handleFeederSubmitAndClose = (event) => {
    handleFeederSubmit(event);
    props.toggleFunction();
  };

  const handleUIDPrint = () => {
    userApi
      .printLabel({ feederUID, labelType: "feeder" })
      .then((res) => {
        const data = res.data;
        if (data.status === "success") {
          enqueueSnackbar(data.message, {
            variant: "success",
          });
        } else {
          enqueueSnackbar(data.message, {
            variant: "error",
          });
        }
      })
      .catch((err) => console.log(err));
  };

  const handleFeederUIDChange = (event) => {
    const uid = event.target.value;
    userApi.checkFeederUIDIsUnique({ uid }).then((res) => {
      const data = res.data;
      if (data.unique) {
        setErrorUID(false);
      } else {
        setErrorUID(t("feederUIDNotUnique"));
      }
    });
    setFeederUID(event.target.value);
  };

  return (
    <Dialog
      open={props.isOpen}
      onClose={props.toggleFunction}
      maxWidth="lg"
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      TransitionProps={{
        onEntered: () => {
          feederUIDRef.current.focus();
        },
      }}
    >
      <DialogTitle
        style={{ background: "#2F323A", color: "white", cursor: "grab" }}
        id="draggable-dialog-title"
      >
        {t("addSingleFeeder")}
      </DialogTitle>
      <DialogContent style={{ padding: 40 }}>
        <form noValidate autoComplete="off">
          <div>
            <Grid container spacing={4}>
              <Grid item xs={3}>
                <TextField
                  required
                  error={errorUID}
                  name="feederUID"
                  label={t("feederUID")}
                  value={feederUID}
                  variant="outlined"
                  fullWidth
                  inputRef={feederUIDRef}
                  onChange={(event) => handleFeederUIDChange(event)}
                  helperText={errorUID ? errorUID : ""}
                />
              </Grid>
              <Grid item xs={3}>
                <IconButton aria-label="delete" onClick={() => handleUIDPrint()} size="large">
                  <PrintIcon />
                </IconButton>
              </Grid>
              <Grid item xs={9}>
                <TextField
                  name="description"
                  label={t("description")}
                  value={description}
                  variant="outlined"
                  fullWidth
                  onChange={(event) => setDescription(event.target.value)}
                ></TextField>
              </Grid>
              <Grid item xs={3}>
                <Autocomplete
                  id="carriers"
                  options={carriers}
                  getOptionLabel={(option) => option.uid}
                  error={errorCarrierUid}
                  style={{ width: 300 }}
                  onChange={(e, newValue) => handleCarrierSelected(newValue)}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={"Carrier Uid"}
                      variant="outlined"
                      value={carrier}
                      onChange={(e) => getCarriers(e.target.value)}
                      fullWidth
                    />
                  )}
                  />
              </Grid>
              <Grid item xs={9}>
                <TextField
                  name="feederType"
                  label="Feeder Type"
                  value={feederType}
                  variant="outlined"
                  fullWidth
                  onChange={(event) => setFeederType(event.target.value)}
                ></TextField>
              </Grid>
            </Grid>
          </div>
        </form>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleFeederSubmit}>
          {t("add")}
        </Button>{" "}
        <Button
          variant="contained"
          onClick={handleFeederSubmitAndClose}
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

export default AddFeedersModal;
