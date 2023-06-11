import React, { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { PieChart, Pie, Cell } from "recharts";
import Grid from "@mui/material/Grid";
import CarrierTable from "./StorageContentTable";
import Avatar from "@mui/material/Avatar";
import smartShelfSrc from "../../img/smart-shelf.JPG"; // gives image path
import inoComSrc from "../../img/inoplacer_compact.jpg"; // gives image path
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import makeStyles from "@mui/styles/makeStyles";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StorageIcon from "@mui/icons-material/Storage";
import { useTranslation } from "react-i18next";

const COLORS = ["#E71D36", "#53DD6C"];

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

const StorageDevice = (props) => {
  const [pieData, setPieData] = useState(null);
  const { t, i18n } = useTranslation();

  const classes = useStyles();

  useEffect(() => {
    setPieData([
      { name: "busy", value: props.busySlots },
      { name: "free", value: props.totalSlots - props.busySlots },
    ]);
  }, []);

  useEffect(() => {
    setPieData([
      { name: "busy", value: props.busySlots },
      { name: "free", value: props.totalSlots - props.busySlots },
    ]);
  }, [props.busySlots]);

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
            {props.deviceType !== 2 ? (
              <Grid item xs={3}>
                {pieData ? (
                  <PieChart width={150} height={120}>
                    <Pie
                      dataKey="value"
                      data={pieData}
                      cx={75}
                      cy={50}
                      innerRadius={40}
                      outerRadius={50}
                      fill="#8884d8"
                      paddingAngle={5}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={entry}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                  </PieChart>
                ) : (
                  <CircularProgress color="primary" />
                )}
              </Grid>
            ) : (
              ""
            )}
            <Grid item xs={2}>
              <Typography variant="h5" gutterBottom>
                {props.busySlots}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {t("busy")}
              </Typography>
              {props.deviceType !== 2 ? (
                <div>
                  <Typography variant="h5" gutterBottom>
                    {props.totalSlots}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    {t("total")}
                  </Typography>
                </div>
              ) : (
                ""
              )}
            </Grid>
            <Grid item xs={4}>
              <Typography variant="h5" gutterBottom>
                {props.deviceName}
              </Typography>
              <Typography variant="subtitle1" gutterBottom>
                {props.deviceDescription}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              {props.deviceType === 0 ? (
                <Radio
                  checked={props.active}
                  onChange={() => props.handleSelected(props.deviceName)}
                  value={props.deviceName}
                  name="deviceActive"
                  inputProps={{ "aria-label": "A" }}
                />
              ) : (
                ""
              )}
              <Avatar
                alt="smart-shelf"
                src={props.deviceType === 0 ? smartShelfSrc : ""}
                style={{
                  width: "120px",
                  height: "120px",
                  marginTop: "10px",
                  alignSelf: "right",
                }}
              >
                {props.deviceType === 2 ? <StorageIcon /> : ""}
              </Avatar>
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
              <CarrierTable
                device={props.deviceName}
                lastUpdateTime={props.lastUpdateTime}
                updateQueueFocusCollect={props.updateQueueFocusCollect}
              />
            </AccordionDetails>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default StorageDevice;
