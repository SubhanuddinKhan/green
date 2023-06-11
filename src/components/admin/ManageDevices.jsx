import React, { useState, useEffect } from "react";

import smartShelfSrc from "../../img/smart-shelf.JPG"; // gives image path
import inoComSrc from "../../img/inoplacer_compact.jpg"; // gives image path

import makeStyles from '@mui/styles/makeStyles';
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Divider from "@mui/material/Divider";

import UserApi from "../../services/user.service";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  cardStyle: {
    display: "inline-block",
    width: 275,
    margin: theme.spacing(2),
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
}));

export default function ManageDevices() {
  const classes = useStyles();
  const userApi = new UserApi();
  const [deviceType, setDeviceType] = useState("");
  const [name, setName] = useState("");
  const [banks, setBanks] = useState(1);
  const [networkAddress, setNetworkAddress] = useState("");
  const [port, setPort] = useState();

  const validateAndSendDevice = () => {
    userApi
      .sendNewDevice({ name, deviceType, banks, networkAddress, port })
      .then((res) => {
        const data = res.data;
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography
          component="h1"
          variant="h4"
          align="center"
          style={{ padding: 25 }}
        >
          Add / Edit Pick and Place machine
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <FormControl
              variant="outlined"
              className={classes.formControl}
              fullWidth
            >
              <InputLabel id="demo-simple-select-outlined-label">
                Select device type
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                value={deviceType}
                onChange={(e) => setDeviceType(e.target.value)}
                label="Sellect device type"
                fullWidth
              >
                <Divider />
                <MenuItem disabled value={""}>
                  Placment devices
                </MenuItem>
                <MenuItem value={1}>IP-Advance</MenuItem>
                <MenuItem value={2}>IP-Compact</MenuItem>
                <MenuItem value={3}>IP-Junior</MenuItem>
                <Divider />
                <MenuItem value={"m"}>Add another device</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={9}></Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              required
              id="deviceName"
              name="deviceName"
              label="Device name"
              fullWidth
              autoComplete="family-name"
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              id="capacity"
              name="capacity"
              label="Capacity"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              id="banks"
              name="banks"
              label="No Banks/Shelves"
              fullWidth
              type="number"
              onChange={(e) => setBanks(e.target.value)}
            />
          </Grid>
          <Grid item xs={4} sm={3}>
            <TextField
              id="network-address"
              name="network-address"
              label="Network address"
              helperText="IP address of the device"
              fullWidth
              onChange={(e) => setNetworkAddress(e.target.value)}
            />
          </Grid>
          <Grid item xs={4} sm={3}>
            <TextField
              id="port"
              name="port"
              label="Port number"
              fullWidth
              type="number"
              onChange={(e) => setPort(e.target.value)}
            />
          </Grid>

          <Grid item xs={12} sm={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={deviceType === ""}
              size="large"
              onClick={validateAndSendDevice}
            >
              Add/Edit device
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
