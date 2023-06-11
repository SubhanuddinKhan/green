import React, { useState, useEffect } from "react";
//import { BrowserRouter as Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import makeStyles from '@mui/styles/makeStyles';
import Container from "@mui/material/Container";
import UserApi from "../services/user.service";
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardPricing: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: theme.spacing(2),
  },
  cardMedia: {
    paddingTop: "56.25%", // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  cardHeader: {
    backgroundColor: "#585191",
    color: "white",
  },
}));

function Home(props) {
  const history = useHistory();
  const classes = useStyles();
  const userAPI = new UserApi();
  const [carriersNumber, setCarriersNumber] = useState("-");
  const [carriersOnMachine, setCarriersOnMachine] = useState("-");
  const [carriersInStorage, setCarriersInStorage] = useState("-");
  const [carriersReserved, setCarriersReserved] = useState("-");
  const [carriersPending, setCarriersPending] = useState("-");
  const [storageDevicesNumber, setStorageDevicesNumber] = useState("-");
  const [totalCapacity, setTotalCapacity] = useState("-");
  const [usedCapacity, setUsedCapacity] = useState("-");
  const [jobsNumber, setJobsNumber] = useState("-");
  const { t, i18n } = useTranslation();

  useEffect(() => {
    let isMounted = true;
    userAPI
      .getDashboardData()
      .then((res) => {
        if (isMounted) {
          setCarriersNumber(res.data.carriers_count);
          setCarriersOnMachine(res.data.carriers_on_machines);
          setCarriersInStorage(res.data.carriers_in_storage);
          setCarriersReserved(res.data.carriers_reserved);
          setCarriersPending(res.data.carriers_pending);
          setStorageDevicesNumber(res.data.storage_devices_number);
          setTotalCapacity(res.data.total_capacity);
          setUsedCapacity(res.data.total_used);
          setJobsNumber(res.data.jobs_number);
        }
      })
      .catch((err) => console.log(err));
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <Typography
        style={{ paddingTop: 10 }}
        gutterBottom
        variant="h4"
        component="h4"
      >
        {t("dashboardChooseStation")}
      </Typography>
      <Container className={classes.cardGrid} maxWidth="lg">
        {/* End hero unit */}
        <Grid container spacing={10}>
          <Grid item key={"matEntry"} xs={12} sm={6} md={4}>
            <Card>
              <CardHeader
                title={t("sidebarMaterialEntry")}
                titleTypographyProps={{ align: "center" }}
                className={classes.cardHeader}
              />
              <CardContent>
                <div className={classes.cardPricing}>
                  <Typography component="h2" variant="h3" color="textPrimary">
                    {carriersNumber}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    &nbsp;{t("carrier")}
                  </Typography>
                </div>
                <ul>
                  <Typography component="li" variant="subtitle1" align="center">
                    &nbsp;{t("onMachines")}: {carriersOnMachine}
                  </Typography>
                  <Typography component="li" variant="subtitle1" align="center">
                    &nbsp;{t("reserved")}: {carriersReserved}
                  </Typography>
                  <Typography component="li" variant="subtitle1" align="center">
                    &nbsp;{t("pendingDelivery")}: {carriersPending}
                  </Typography>
                </ul>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => history.push("/index/material_entry")}
                  fullWidth
                >
                  {t("open")}
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item key={"matStorage"} xs={12} sm={6} md={4}>
            <Card>
              <CardHeader
                title={t("sidebarMaterialStorage")}
                titleTypographyProps={{ align: "center" }}
                className={classes.cardHeader}
              />
              <CardContent>
                <div className={classes.cardPricing}>
                  <Typography component="h2" variant="h3" color="textPrimary">
                    {storageDevicesNumber}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    &nbsp;{t("device")}
                  </Typography>
                </div>
                <ul>
                  <Typography component="li" variant="subtitle1" align="center">
                    {t("totalCapacity")} : {totalCapacity}
                  </Typography>
                  <Typography component="li" variant="subtitle1" align="center">
                    {t("usedCapacity")} : {usedCapacity}
                  </Typography>
                </ul>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => history.push("/index/material_storage")}
                  fullWidth
                >
                  {t("open")}
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item key={"setCenter"} xs={12} sm={6} md={4}>
            <Card>
              <CardHeader
                title={t("sidebarSetupCenter")}
                titleTypographyProps={{ align: "center" }}
                className={classes.cardHeader}
              />
              <CardContent>
                <div className={classes.cardPricing}>
                  <Typography component="h2" variant="h3" color="textPrimary">
                    {jobsNumber}
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    &nbsp;{t("job")}
                  </Typography>
                </div>
                <ul>
                  <Typography component="li" variant="subtitle1" align="center">
                    &nbsp;
                  </Typography>
                  <Typography component="li" variant="subtitle1" align="center">
                    &nbsp;
                  </Typography>
                </ul>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => history.push("/index/setup_center")}
                  fullWidth
                >
                  {t("open")}
                </Button>
              </CardActions>
            </Card>
          </Grid>
          <Grid item key={"contact"} xs={12} sm={6} md={4}>
            <Card>
              <CardHeader
                title={"Admin"}
                titleTypographyProps={{ align: "center" }}
                className={classes.cardHeader}
              />
              <CardContent>
                <div className={classes.cardPricing}>
                  <Typography component="h2" variant="h3" color="textPrimary">
                    &nbsp;
                  </Typography>
                  <Typography variant="h6" color="textSecondary">
                    &nbsp;
                  </Typography>
                </div>
                <ul>
                  <Typography component="li" variant="subtitle1" align="center">
                    &nbsp;
                  </Typography>
                  <Typography component="li" variant="subtitle1" align="center">
                    &nbsp;
                  </Typography>
                </ul>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => history.push("/index/admin")}
                  fullWidth
                >
                  {t("open")}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

export default Home;
