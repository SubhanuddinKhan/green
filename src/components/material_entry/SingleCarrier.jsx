import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import UserApi from "../../services/user.service";
import Autocomplete from '@mui/material/Autocomplete';
import { useSnackbar } from "notistack";
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

const widthVariants = [
  {
    value: "9",
    label: "9 mm",
  },
  {
    value: "12",
    label: "12 mm",
  },
  {
    value: "15",
    label: "15 mm",
  },
  {
    value: "34",
    label: "34 mm",
  },
];

const diameterVariants = [
  {
    value: "7",
    label: '7"',
  },
  {
    value: "13",
    label: '13"',
  },
];

const SingleCarrierModal = (props) => {
  const [articles, setArticles] = useState([]);
  const [errorArticleNumber, setErrorArticleNumber] = useState(false);
  const [articleNumber, setArticleNumber] = useState("");
  const [carrierUID, setCarrierUID] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [provider, setProvider] = useState("");
  const [manufacturer, setManufacturer] = useState("");
  const [sapNumber, setSapNumber] = useState("");
  const [lotNumber, setLotNumber] = useState("");
  const [carrierType, setCarrierType] = useState("reel");
  const [diameter, setDiameter] = useState("7");
  const [width, setWidth] = useState("9");
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [errorUID, setErrorUID] = useState(false);
  const userApi = new UserApi();

  const carrierTypes = [
    {
      value: "reel",
      label: t("reel"),
    },
    {
      value: "tray",
      label: t("tray"),
    },
    {
      value: "container",
      label: t("container"),
    },
    {
      value: "single",
      label: t("single"),
    },
  ];

  const handleArticleSelected = (option) => {
    setArticleNumber(option.name);
    setDescription(option.description);
    setProvider(option.provider_name);
    setManufacturer(option.manufacturer_name);
    setSapNumber(option.sap_number);
  };

  
  const getArticles = (filter) => {
    userApi
    .getArticlesList({ search: filter })
    .then((res) => {
      const data = res.data.results;
      setArticles(data);
      })
      .catch((err) => console.log(err));
  };

  const handleCarrierSubmit = () => {
    setErrorUID(false);
    setErrorArticleNumber(false);

    if (!carrierUID) {
      setErrorUID(true);
      return;
    }
    if (!articleNumber) {
      setErrorArticleNumber(true);
      return;
    }

    userApi
      .addSingleCarrier({
        carrierUID,
        articleNumber,
        quantity,
        carrierType,
        lotNumber,
        diameter,
        width,
      })
      .then((res) => {
        let infoMessage = res.data.message;
        enqueueSnackbar(infoMessage, { variant: "info" });
        setCarrierUID("");
        setArticleNumber("");
        setDescription("");
        setQuantity("");
        setProvider("");
        setManufacturer("");
        setSapNumber("");
        setLotNumber("");
        setArticles([]);
        setCarrierType("reel");
        setDiameter("7");
        setWidth("9");
      });
    props.updateCarrierTable();
  };


  const handleCarrierSubmitAndClose = () => {
    handleCarrierSubmit();
    props.toggleFunction();
  };

  const handleCarrierUIDChange = (event) => {
    const uid = event.target.value;
    userApi.checkCarrierUIDIsUnique({ uid }).then((res) => {
      const data = res.data;
      if (data.unique) {
        setErrorUID(false);
      } else {
        setErrorUID(t("carrierUIDNotUnique"));
      }
    });
    setCarrierUID(event.target.value);
  };

  return (
    <Dialog
      onClose={props.toggleFunction}
      open={props.isOpen}
      maxWidth="lg"
      PaperComponent={PaperComponent}
      data-testid="me-modal-single-carrier"
      aria-labelledby="draggable-dialog-title">
      <DialogTitle
        style={{ background: "#2F323A", color: "white", cursor: "grab" }}
        id="draggable-dialog-title"
      >
        {t("addSingleCarrier")}
      </DialogTitle>
      <DialogContent style={{ padding: 30 }}>
        <Grid container spacing={4}>
          <Grid item xs={3}>
            <TextField
              required
              error={errorUID}
              value={carrierUID}
              name="carrierUid"
              label={t("carrierUID")}
              variant="outlined"
              fullWidth
              helperText={errorUID ? errorUID : ""}
              onChange={(event) => handleCarrierUIDChange(event)}
            />
          </Grid>
          <Grid item xs={3}>
            <Autocomplete
              id="articles"
              options={articles}
              getOptionLabel={(option) => option.name}
              error={errorArticleNumber}
              style={{ width: 300 }}
              onChange={(e, newValue) => handleArticleSelected(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("articleNumber")}
                  variant="outlined"
                  value={articleNumber}
                  onChange={(e) => getArticles(e.target.value)}
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              disabled
              value={description}
              name="description"
              label={t("description")}
              variant="outlined"
              fullWidth
              onChange={(event) => setDescription(event.target.value)}
            ></TextField>
          </Grid>
          <Grid item xs={3}>
            <TextField
              disabled
              value={provider}
              name="provider"
              label={t("provider")}
              variant="outlined"
              fullWidth
              onChange={(event) => setProvider(event.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              disabled
              value={manufacturer}
              name="manufacturer"
              label={t("manufacturer")}
              variant="outlined"
              onChange={(event) => setManufacturer(event.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              disabled
              value={sapNumber}
              name="sap-nr"
              label={t("sap.number")}
              variant="outlined"
              fullWidth
              onChange={(event) => setSapNumber(event.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              name="quantity"
              label={t("quantity")}
              value={quantity}
              variant="outlined"
              fullWidth
              onChange={(event) => setQuantity(event.target.value)}
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              name="carrierType"
              select
              label={t("type")}
              value={carrierType}
              onChange={(event) => setCarrierType(event.target.value)}
              variant="outlined"
              fullWidth
            >
              {carrierTypes.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={3}>
            <TextField
              name="width"
              select
              label={t("width")}
              value={width}
              onChange={(event) => setWidth(event.target.value)}
              variant="outlined"
              fullWidth
            >
              {widthVariants.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={3}>
            <TextField
              name="diameter"
              select
              label={t("diameter")}
              value={diameter}
              onChange={(event) => setDiameter(event.target.value)}
              variant="outlined"
              fullWidth
            >
              {diameterVariants.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={3}>
            <TextField
              value={lotNumber}
              name="lot-nr"
              label={t("lotNumber")}
              variant="outlined"
              fullWidth
              onChange={(event) => setLotNumber(event.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleCarrierSubmit}>
          {t("add")}
        </Button>{" "}
        <Button
          variant="contained"
          onClick={handleCarrierSubmitAndClose}
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

export default SingleCarrierModal;
