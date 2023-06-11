import React from "react";
import SpaceBarIcon from "@mui/icons-material/SpaceBar";
import TextField from "@mui/material/TextField";
import axios from "axios";

import Box from "@mui/material/Box";
import Badge from "@mui/material/Badge";
import Grid from "@mui/material/Grid";
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  feederSlotFree: { background: "white" },
  feederSlotBusy: { background: "crimson" },
  feederSlotReady: { background: "chartreuse" },
  feederBank: { background: "#5A5766", padding: "2em", borderRadius: "10px" },
}));

var feederCartShelf1 = [];
var feederCartShelf2 = [];

for (var x = 1; x < 38; x++) {
  feederCartShelf1.push({ id: x, status: "empty" });
  feederCartShelf2.push({ id: x, status: "empty" });
}

const FeederCart = (props) => {
  const classes = useStyles();

  return (
    <div>
      <Grid
        container
        id="feederSorter"
        spacing={2}
        justifyContent="center"
        alignItems="center"
        direction="column"
      >
        {Object.keys(props.bankSlots).map((bank) => (
          <Grid item key={bank}>
            <h6>Cart {props.cartUID} B1</h6>
            <Box className={classes.feederBank}>
              <Grid
                container
                id="feedSorterShelf1"
                spacing={1}
                justifyContent="center"
                alignItems="center"
              >
                {props.bankSlots[bank].map((element) => (
                  <Grid item key={element.id}>
                    <Box
                      className={
                        element.id == props.readySlot
                          ? classes.feederSlotReady
                          : element.status == 0
                          ? classes.feederSlotFree
                          : element.status == 1
                          ? classes.feederSlotBusy
                          : classes.feederSlotReady
                      }
                      height={100}
                      width={15}
                      borderRadius="1px"
                    >
                      <Badge
                        badgeContent={element.id}
                        style={{
                          top: "8em",
                          right: "0.5em",
                          color: "white",
                        }}
                      >
                        <SpaceBarIcon
                          style={{
                            position: "relative",
                            bottom: "1.5em",
                            left: "0.5em",
                            fontSize: 14,
                            color: "black",
                          }}
                        ></SpaceBarIcon>
                      </Badge>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default FeederCart;
