import React, { useEffect, useState } from "react";
import withStyles from '@mui/styles/withStyles';
import makeStyles from '@mui/styles/makeStyles';
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useTranslation } from "react-i18next";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#585191",
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
      height: 33,
    },
  },
}))(TableRow);

const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  paginationStyle: {
    "& > *": {
      marginTop: theme.spacing(4),
      marginRight: "auto",
    },
  },
  filterInputStyle: {
    margin: theme.spacing(2),
    marginLeft: "auto",
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

export default function SlotsTable(props) {
  const classes = useStyles();
  const { t, i18n } = useTranslation();
  const [slots, setSlots] = useState([]);
  const headCells = [
    { id: "carrier", label: t("carrier") },
    { id: "article", label: t("article") },
    { id: "bank", label: t("bank") },
    { id: "slot", label: t("slot") },
    { id: "description", label: t("description") },
    { id: "quantity", label: t("quantity") },
    { id: "feeder", label: t("feeder") },
  ];

  useEffect(() => {
    setSlots(props.slots);
  }, [props.slots]);

  return (
    <Grid container style={{ display: "flex", flexGrow: 1 }} direction="column">
      {slots.length > 0 ? (
        <TableContainer component={Paper}>
          <Table className={classes.table} aria-label="simple table">
            <TableHead>
              <StyledTableRow>
                {headCells.map((headCell) => (
                  <StyledTableCell key={headCell.id}>
                    {headCell.label}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {slots.map((row) => (
                <StyledTableRow key={row.id}>
                  <StyledTableCell component="th" scope="row">
                    {row.carrier ? row.carrier.uid : "N/A"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {row.article ? row.article.name : "N/A"}
                  </StyledTableCell>
                  <StyledTableCell>{row.bank}</StyledTableCell>
                  <StyledTableCell>{row.slot}</StyledTableCell>
                  <StyledTableCell>
                    {row.article ? row.article.description : "N/A"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {row.carrier ? row.carrier.quantity : "N/A"}
                  </StyledTableCell>
                  <StyledTableCell>
                    {row.feeder ? row.feeder.uid : "N/A"}
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div>{t("noData")}</div>
      )}
    </Grid>
  );
}
