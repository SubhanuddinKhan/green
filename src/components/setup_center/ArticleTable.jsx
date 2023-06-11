import React from "react";

import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten } from "@mui/material/styles";
import makeStyles from "@mui/styles/makeStyles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import Checkbox from "@mui/material/Checkbox";

function EnhancedTableHead(props) {
  return (
    <TableHead>
      <TableRow>
        <TableCell />
        {props.headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            padding={headCell.disablePadding ? "none" : "default"}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.mode === "light"
      ? {
          color: theme.palette.primary.main,
          backgroundColor: lighten(theme.palette.primary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.primary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {props.tableName}
        </Typography>
      )}
    </Toolbar>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
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

export default function ArticleTable(props) {
  const classes = useStyles();
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [page, setPage] = React.useState(0);

  const handleArticleChange = (event, value, index) => {
    props.setSelectedArticle(value, index);
  };
  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, props.rows.length - page * rowsPerPage);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar tableName={props.tableName} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={"small"}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              rowCount={props.rows.length}
              headCells={props.headCells}
            />
            <TableBody>
              {props.rows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="radio"
                    aria-checked={
                      (row.name === props.selectedArticle) &
                      (index === props.articleIndex)
                    }
                    tabIndex={-1}
                    key={row.name}
                    onClick={(e) => handleArticleChange(e, row.name, index)}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={props.reservations.some(function (u) {
                          if (u.article === row.name && u.carrier) return true;
                          return false;
                        })}
                        inputProps={{ "aria-label": "primary checkbox" }}
                        valueSelected={props.selectedArticle}
                        value={row.name}
                        indeterminate={props.machineSlots.some(
                          (el) => el.article && el.article.name === row.name
                        )}
                      />
                    </TableCell>
                    {/* <TableCell padding="checkbox">
                        <RadioGroup
                          name={row.name}
                          key={index}
                          onChange={(e, value) => {
                            handleArticleChange(e, value, index);
                          }}
                          //valueSelected={props.selectedArticle}
                        >
                          <Radio
                            value={row.name}
                            checked={
                              (row.name === props.selectedArticle) &
                              (index === props.articleIndex)
                                ? true
                                : false
                            }
                          />
                        </RadioGroup>
                      </TableCell> */}
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                    >
                      {row.name}
                    </TableCell>
                    <TableCell align="left">{row.count}</TableCell>
                    <TableCell align="left">{row.description}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 33 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
