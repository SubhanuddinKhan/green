import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import SlotsTable from "./MachineSlotsTable";
import Avatar from "@mui/material/Avatar";
import inoComSrc from "../../img/inoplacer_compact.jpg"; // gives image path
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import makeStyles from "@mui/styles/makeStyles";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Button from "@mui/material/Button";
import { composeInitialProps, useTranslation } from "react-i18next";
import UserApi from "../../services/user.service";
import { useSnackbar } from "notistack";

const useStyles = makeStyles((theme) => ({
  largeAvatar: {
    width: "100px",
    height: "100px",
  },
  expandButton: {
    backgroundColor: "#585191",
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
    textAlign: "center",
    color: "#ffffff",
  },
}));

const MachineStorage = (props) => {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const userAPI = new UserApi();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const clearMachine = () => {
    userAPI
      .clearMachine({ name: props.deviceName })
      .then((res) => {
        const data = res.data;
        //props.updateMachine(res.data);
        enqueueSnackbar(t("machine.cleared"), {
          variant: "success",
          autoHideDuration: 6000,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div style={{ marginBottom: "10px" }}>
      <Card variant="outlined">
        <CardContent>
          <br />
          <Grid
            container
            justifyContent="space-around"
            spacing={10}
            direction="row"
          >
            <Grid item xs={2}>
              <Typography variant="h5" gutterBottom>
                {props.busySlots}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {t("busy")}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h5" gutterBottom>
                {props.deviceName}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Avatar
                alt="smart-shelf"
                src={inoComSrc}
                style={{
                  width: "120px",
                  height: "120px",
                  marginTop: "10px",
                  alignSelf: "right",
                }}
              />
              <Button color="primary" onClick={() => clearMachine()}>
                {t("clearMachine")}
              </Button>
            </Grid>
          </Grid>
          <br />

          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon style={{ color: "white" }} />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              className={classes.expandButton}
            >
              <Typography>{t("displayContents")}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <SlotsTable device={props.deviceName} slots={props.slots} />
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default MachineStorage;
