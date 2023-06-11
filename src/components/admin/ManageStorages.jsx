import React, { useState, useEffect } from "react";

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

export default function ManageStorages() {
  const classes = useStyles();
  const userApi = new UserApi();
  const [deviceType, setDeviceType] = useState("");
  const [name, setName] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [banks, setBanks] = useState(0);
  const [description, setDescription] = useState("");
  const [networkAddress, setNetworkAddress] = useState("");
  const [port, setPort] = useState(0);

  const sendNewStorage = () => {
    userApi
      .sendNewStorageDevice({
        name,
        deviceType,
        capacity,
        banks,
        description,
        networkAddress,
        port,
      })
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
        <Typography component="h1" variant="h4" align="center">
          Add / Edit storage device
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
                  Storage devices
                </MenuItem>
                <MenuItem value={5}>PickToLight-Regal</MenuItem>
                <MenuItem value={6}>SMD-BOX SISO</MenuItem>
                <MenuItem value={7}>MD-BOX MIMO</MenuItem>
                <MenuItem value={8}>SMD BOX HYBRID</MenuItem>
                <Divider />

                <MenuItem value={"m"}>Add another device</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}></Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              required
              id="deviceName"
              name="deviceName"
              label="Device name"
              fullWidth
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              id="capacity"
              name="capacity"
              label="Capacity"
              type="number"
              fullWidth
              onChange={(e) => setCapacity(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              id="banks"
              name="banks"
              label="No Banks/Shelves"
              type="number"
              fullWidth
              onChange={(e) => setBanks(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="description"
              name="description"
              label="Device description"
              fullWidth
              onChange={(e) => setDescription(e.target.value)}
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
              type="number"
              fullWidth
              onChange={(e) => setPort(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              disabled={deviceType === ""}
              onClick={sendNewStorage}
              size="large"
            >
              Add/Edit device
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}
