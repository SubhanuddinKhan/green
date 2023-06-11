import React, { useEffect, useState } from "react";
import withStyles from "@mui/styles/withStyles";
import makeStyles from "@mui/styles/makeStyles";
import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import TextField from "@mui/material/TextField";
import { useTranslation } from "react-i18next";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
  deDE,
  enUS,
  GridColumnMenu,
  GridColumnMenuContainer,
  GridFilterMenuItem,
  HideGridColMenuItem,
  GridColumnsMenuItem,
  SortGridMenuItems,
} from "@mui/x-data-grid";
import renderCellExpand from "../helpers/DGRenderCellExpand";
import RenderFilterCellType from "../helpers/DGRenderFilterCells";
import { useHistory } from "react-router-dom";

import CircularProgress from "@mui/material/CircularProgress";
import { useSnackbar } from "notistack";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Popper from "@mui/material/Popper";
import { IconButton, Select } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import InputAdornment from "@mui/material/InputAdornment";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import PrintIcon from "@mui/icons-material/Print";
import DeleteIcon from "@mui/icons-material/Delete";
import { RiLogoutCircleRFill } from "react-icons/ri";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import deLocale from "date-fns/locale/de";
//import CustomTable from "../general/reactable";

import UserApi from "../../services/user.service";

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: "#585191",
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

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

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function CarrierTable(props) {
  const [carrierRows, setCarrierRows] = useState([]);
  const [rowsCount, setRowsCount] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [filterQuery, setFilterQuery] = useState("");
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [selectionModelList, setSelectionModelList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [filterMenu, setFilterMenu] = React.useState(null);
  const [filterColumn, setFilterColumn] = React.useState(null);
  const [filterModel, setFilterModel] = React.useState({
    searchFilter: "",
    uid: "",
    article_number: "",
    description: "",
    quantity_max: "",
    quantity_min: "",
    provider: "",
    provider_description: "",
    manufacturer: "",
    manufacturer_description: "",
  });
  const [sortModel, setSortModel] = React.useState([]);

  const { t, i18n } = useTranslation();
  const userApi = new UserApi();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const columns = [
    {
      field: "carrier",
      headerName: t("carrier"),
      width: 150,
      editable: false,
    },
    {
      field: "article",
      headerName: t("article"),
      width: 150,
      editable: false,
    },
    {
      field: "description",
      headerName: t("description"),
      width: 250,
      editable: false,
    },
    {
      field: "quantity",
      headerName: t("quantity"),
      type: "number",
      width: 100,
      editable: false,
    },
    {
      field: "provider",
      headerName: t("provider"),
      width: 150,
      editable: false,
    },
    {
      field: "manufacturer",
      headerName: t("manufacturer"),
      width: 150,
      editable: false,
    },
    {
      field: "sapNumber",
      headerName: t("sap.number"),
      width: 150,
      editable: false,
    },
    {
      field: "lotNumber",
      headerName: t("lotNumber"),
      width: 150,
      editable: false,
    },
    {
      field: "diameter",
      headerName: t("diameter"),
      width: 150,
      editable: false,
    },
    { field: "width", headerName: t("width"), width: 150, editable: false },
    {
      field: "location",
      headerName: t("location"),
      width: 150,
      editable: false,
    },
  ];

  useEffect(() => {
    getCarrierData(0, "");
  }, [props.lastUpdateTime]);

  useEffect(() => {
    const newSelectionModel = [];
    carrierRows.forEach((row) => {
      const item = selectionModel.filter((selection) => {
        if (selection.carrier === row.carrier) {
          return selection;
        } else {
          return null;
        }
      });
      if (item) {
        newSelectionModel.push(item[0]);
      }
    });
    console.log(newSelectionModel);
  }, [carrierRows]);

  const renderFilterCell = (e, currentColumn, hideMenu) => {
    setFilterMenu(
      filterMenu === null
        ? {
            mouseX: e.clientX - 50,
            mouseY: e.clientY - 10,
          }
        : // repeated contextmenu when it is already open closes it with Chrome 84 on Ubuntu
          // Other native context menus might behave different.
          // With this behavior we prevent contextmenu from the backdrop to re-locale existing context menus.
          null
    );
    setFilterColumn(currentColumn);
    hideMenu(e);
  };

  const handleSortModelChange = (newModel) => {
    const field = getFieldfromModel(newModel);
    // getCarrierData(pageNumber, pageSize, filterModel, field);
    setSortModel(newModel);
  };

  const handleSelectionModelChange = (newModel) => {
    console.log(newModel);
    const newSelectionModel = [];
    newModel.forEach((item) => {
      const row = carrierRows.filter((row) => {
        if (row.id === item) {
          return row;
        } else {
          return null;
        }
      });
      if (row) {
        newSelectionModel.push(row[0]);
      }
    });
    setSelectionModel(newSelectionModel);
    setSelectionModelList(newModel);
  };

  const getFieldfromModel = (model) => {
    var field;

    if (model.length > 0) {
      const fieldsConvertor = {
        carrier: "uid",
        article: "article__name",
        description: "article__description",
        quantity: "quantity_current",
        provider: "article__provider__name",
        providerDescription: "article__provider__providerprops__description",
        manufacturer: "article__manufacturer__name",
        manufacturerDescription:
          "article__manufacturer__manufacturerprops__description",
        lotNumber: "lot_number",
        SapNumber: "article__sap_number",
        type: "type",
        diameter: "diameter",
        width: "width",
      };
      const sign = model[0].sort === "asc" ? "" : "-";
      field = `${sign}${fieldsConvertor[model[0].field]}`;
    } else {
      field = "";
    }
    return field;
  };

  const getCarrierData = (page, filter) => {
    var importedData = [];

    userApi
      .getStoredCarriers({
        offset: page * 100,
        search: filter,
        storage__name: props.device,
      })
      .then((res) => {
        const data = res.data;
        setRowsCount(data.count);
        console.log(data);
        if (data && data.results.length > 0) {
          data.results.map((x, index) =>
            importedData.push({
              id: index,
              carrier: x.carrier ? x.carrier.uid : "",
              article:
                x.carrier && x.carrier.article ? x.carrier.article.name : "N/A",
              description:
                x.carrier && x.carrier.article
                  ? x.carrier.article.description
                  : "N/A",
              quantity: x.carrier ? x.carrier.quantity_current : "",
              provider:
                x.carrier && x.carrier.article
                  ? x.carrier.article.provider_name
                  : "N/A",
              manufacturer:
                x.carrier && x.carrier.article
                  ? x.carrier.article.manufacturer_name
                  : "N/A",
              sapNumber:
                x.carrier && x.carrier.article
                  ? x.carrier.article.sap_number
                  : "",
              lotNumber: x.carrier ? x.carrier.lot_number : "",
              diameter: x.carrier ? x.carrier.diameter : "",
              width: x.carrier ? x.carrier.width : "",
              location: x.carrier ? x.carrier.location : "",
            })
          );
          setCarrierRows(importedData);
        }
      });
  };

  useEffect(() => {
    getCarrierData(0, "");
  }, []);

  useEffect(() => {
    getCarrierData(0, "");
  }, [props.hackeyAddition]);

  const onChangePage = (event, page) => {
    setPageNumber(page);
    getCarrierData(page - 1, filterQuery);
  };

  function CustomToolbar(props) {
    const [tempFilter, setTempFilter] = React.useState(
      filterModel.searchFilter
    );
    const [orderProject, setOrderProject] = React.useState(null);
    const [orderCode, setOrderCode] = React.useState("");
    const [orderWENote, setOrderWENote] = React.useState("");
    const [orderArticles, setOrderArticles] = React.useState([]);
    const [orderDeliveryDate, setOrderDeliveryDate] = React.useState(null);

    React.useEffect(() => {
      const newOrderArticles = [];
      selectionModel.forEach((row) => {
        const articleInst = {
          image: row.image,
          id: row.id,
          article_number: row.article_number,
          description: row.description,
          count: Math.ceil(
            (Number(row.max_quantity) - Number(row.min_quantity)) /
              Number(row.patch_size)
          ),
        };
        newOrderArticles.push(articleInst);
      });
      setOrderArticles(newOrderArticles);
    }, [selectionModel]);

    return (
      <>
        <Stack
          spacing={4}
          direction="column"
          align="center"
          justify="center"
          sx={{
            width: "100%",
          }}
        >
          <GridToolbarContainer>
            <Box
              sx={{
                // p: 0.5,
                pb: 0,
                justifyContent: "space-between",
                display: "flex",
                alignItems: "flex-start",
                flexWrap: "wrap",
                width: "100%",
              }}
            >
              <Typography
                variant="h6"
                gutterBottom
                sx={{
                  m: 0.5,
                }}
              >
                {t("carriers")}
              </Typography>
              <div>
                <Tooltip title={t("toolbar.collect")}>
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault();
                      selectionModel.forEach((row) => {
                        userApi
                          .collectCarrierFromStorage({
                            uid: row.carrier,
                          })
                          .then((res) => {
                            const data = res.data;
                            console.log(data);
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
                      });
                      getCarrierData(1, 100, "", "");
                      props.updateQueueFocusCollect();
                    }}
                    color="primary"
                    disabled={selectionModel.length === 0}
                  >
                    <RiLogoutCircleRFill />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t("toolbar.print")}>
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault();
                      // saveArticles();
                    }}
                    color="primary"
                    disabled={selectionModel.length === 0}
                  >
                    <PrintIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title={t("toolbar.delete")}>
                  <IconButton onClick={() => {}} color="primary">
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                <GridToolbarColumnsButton />
                <GridToolbarExport csvOptions={{ delimiter: ";" }} />
              </div>
              {/* <Divider orientation="vertical" /> */}

              <TextField
                variant="standard"
                value={tempFilter}
                onChange={(e) => {
                  setTempFilter(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setFilterModel({
                      ...filterModel,
                      searchFilter: tempFilter,
                    });
                    // setFilterModel(
                    // setFilter(tempFilter);
                  }
                }}
                placeholder={t("toolbar.search") + "..."}
                InputProps={{
                  startAdornment: (
                    <SearchIcon color="primary" fontSize="small" />
                  ),
                  endAdornment: (
                    <IconButton
                      title="Clear"
                      aria-label="Clear"
                      size="small"
                      style={{ visibility: tempFilter ? "visible" : "hidden" }}
                      onClick={() => {
                        setTempFilter("");
                        setFilterModel({ ...filterModel, searchFilter: "" });
                        // setFilter("");
                      }}
                    >
                      <ClearIcon color="primary" />
                    </IconButton>
                  ),
                }}
                sx={{
                  width: {
                    xs: 1,
                    sm: "auto",
                  },
                  alignSelf: "flex-end",
                  m: (theme) => theme.spacing(1, 0.5, 1.5),
                  "& .MuiSvgIcon-root": {
                    mr: 0.5,
                  },
                  "& .MuiInput-underline:before": {
                    borderBottom: 1,
                    borderColor: "divider",
                  },
                }}
              />
            </Box>
          </GridToolbarContainer>
          <Box pl={2}>
            <Grid container rowSpacing={1} columnSpacing={1}>
              {filterModel.uid && (
                <Grid item>
                  <Chip
                    label={t("toolbar.uid") + ": " + filterModel.uid}
                    onDelete={() => {
                      setFilterModel({ ...filterModel, uid: "" });
                    }}
                  />
                </Grid>
              )}
              {filterModel.article_number && (
                <Grid item>
                  <Chip
                    label={
                      t("toolbar.article_number") +
                      ": " +
                      filterModel.article_number
                    }
                    onDelete={() => {
                      setFilterModel({ ...filterModel, article_number: "" });
                    }}
                  />
                </Grid>
              )}
              {filterModel.description && (
                <Grid item>
                  <Chip
                    label={
                      t("toolbar.description") + ": " + filterModel.description
                    }
                    onDelete={() => {
                      setFilterModel({ ...filterModel, description: "" });
                    }}
                  />
                </Grid>
              )}
              {filterModel.quantity_max || filterModel.quantity_min ? (
                <Grid item>
                  <Chip
                    label={
                      t("toolbar.quantity") +
                      ": " +
                      filterModel.quantity_min +
                      " - " +
                      filterModel.quantity_max
                    }
                    onDelete={() => {
                      setFilterModel({
                        ...filterModel,
                        quantity_max: "",
                        quantity_min: "",
                      });
                    }}
                  />
                </Grid>
              ) : null}
              {filterModel.provider && (
                <Grid item>
                  <Chip
                    label={t("toolbar.provider") + ": " + filterModel.provider}
                    onDelete={() => {
                      setFilterModel({ ...filterModel, provider: "" });
                    }}
                  />
                </Grid>
              )}
              {filterModel.provider_description && (
                <Grid item>
                  <Chip
                    label={
                      t("toolbar.provider_description") +
                      ": " +
                      filterModel.provider_description
                    }
                    onDelete={() => {
                      setFilterModel({
                        ...filterModel,
                        provider_description: "",
                      });
                    }}
                  />
                </Grid>
              )}
            </Grid>
          </Box>
        </Stack>
        <Menu
          id="basic-menu"
          // open={orderMenu !== null}
          // onClose={() => {
          //   setOrderMenu(null);
          // }}
          // anchorReference="anchorPosition"
          // anchorPosition={
          //   orderMenu !== null
          //     ? { top: orderMenu.mouseY, left: orderMenu.mouseX }
          //     : undefined
          // }
        >
          <Box
            display="flex"
            alignItems="center"
            sx={{
              height: "auto",
              m: 2,
            }}
          >
            <List>
              <ListItem>
                {/* <Autocomplete
                  value={orderProject}
                  onChange={(event, newValue) => {
                    if (typeof newValue === "string") {
                      setOrderProject({
                        label: newValue,
                      });
                    } else if (newValue && newValue.inputValue) {
                      // Create a new value from the user input
                      setOrderProject({
                        label: newValue.inputValue,
                      });
                    } else {
                      setOrderProject(newValue);
                    }
                  }}
                  filterOptions={(options, params) => {
                    const filtered = projectsFilter(options, params);

                    const { inputValue } = params;
                    // Suggest the creation of a new value
                    const isExisting = options.some(
                      (option) => inputValue === option.label
                    );
                    if (inputValue !== "" && !isExisting) {
                      filtered.push({
                        inputValue,
                        label: `${t("add")} "${inputValue}"`,
                      });
                    }

                    return filtered;
                  }}
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  id="free-solo-with-text-demo"
                  options={projectsList}
                  getOptionLabel={(option) => {
                    // Value selected with enter, right from the input
                    if (typeof option === "string") {
                      return option;
                    }
                    // Add "xxx" option created dynamically
                    if (option.inputValue) {
                      return option.inputValue;
                    }
                    // Regular option
                    return option.label;
                  }}
                  renderOption={(props, option) => (
                    <li {...props}>{option.label}</li>
                  )}
                  sx={{ width: 120, mr: 2 }}
                  freeSolo
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("project")}
                      sx={{ width: 120, ml: 2 }}
                    />
                  )}
                /> */}
                <TextField
                  label={t("weNotes")}
                  sx={{ width: 200, ml: 2, mr: 2 }}
                  onChange={(e) => {
                    setOrderWENote(e.target.value);
                  }}
                  value={orderWENote}
                />
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  locale={deLocale}
                >
                  <DatePicker
                    mask="__.__.____"
                    label={t("delivery_time")}
                    value={orderDeliveryDate}
                    onChange={(newValue) => {
                      setOrderDeliveryDate(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </ListItem>
              <ListItem></ListItem>

              {orderArticles.map((item) => (
                <ListItem>
                  <ListItemIcon>
                    <Avatar
                      alt={item.article_number}
                      src={item.image}
                      variant="rounded"
                      sx={{
                        width: 50,
                        height: 50,
                        m: 1,
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.article_number}
                    secondary={item.description}
                    sx={{
                      width: 500,
                    }}
                  />
                  <TextField
                    id="outlined-number"
                    label={t("quantity")}
                    type="number"
                    size="small"
                    value={item.count}
                    onChange={(e) => {
                      setOrderArticles((prev) =>
                        prev.map((i) =>
                          i.article_number === item.article_number
                            ? { ...i, count: e.target.value }
                            : i
                        )
                      );
                    }}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    sx={{
                      width: 100,
                    }}
                    inputProps={{
                      endAdornment: (
                        <InputAdornment position="end">Pkg</InputAdornment>
                      ),
                    }}
                  />
                </ListItem>
              ))}
              <ListItem
                sx={{ mt: 5 }}
                secondaryAction={
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      //   userAPI
                      //     .handleArticlesOrdered({
                      //       orderCode,
                      //       orderProject: orderProject ? orderProject.label : "",
                      //       orderWENote,
                      //       orderArticles,
                      //       orderDeliveryDate,
                      //       userID: user.user_id,
                      //     })
                      //     .then((res) => {
                      //       const data = res.data;
                      //       enqueueSnackbar(t("order_success"), {
                      //         variant: "success",
                      //       });
                      //     })
                      //     .catch((err) => {
                      //       enqueueSnackbar(t("order_error"), {
                      //         variant: "error",
                      //       });
                      //       console.log(err);
                      //     });
                      //   setOrderCode("");
                      //   setOrderProject("");
                      //   setOrderWENote("");
                      //   setOrderArticles([]);
                      //   // setOrderMenu(null);
                      //   setSelectionModelList([]);
                      //   setSelectionModel([]);
                    }}
                  >
                    {t("confirm")}
                  </Button>
                }
              />
            </List>
          </Box>
        </Menu>
      </>
    );
  }

  function CustomColumnMenuComponent(props) {
    const { hideMenu, currentColumn, color, ...other } = props;

    return (
      <GridColumnMenuContainer
        hideMenu={hideMenu}
        currentColumn={currentColumn}
        ownerState={{ color }}
        {...other}
      >
        <MenuItem
          onClick={(e) => {
            e.stopPropagation();
            renderFilterCell(e, currentColumn, hideMenu);
          }}
        >
          {" "}
          {t("filter")}
        </MenuItem>
        <SortGridMenuItems onClick={hideMenu} column={currentColumn} />
        {/* <GridFilterMenuItem onClick={hideMenu} column={currentColumn} /> */}
        <HideGridColMenuItem onClick={hideMenu} column={currentColumn} />
        <GridColumnsMenuItem onClick={hideMenu} column={currentColumn} />
      </GridColumnMenuContainer>
    );
  }

  return (
    <div style={{ height: 700, width: "100%" }}>
      <DataGrid
        rows={carrierRows}
        columns={columns}
        pageSize={pageSize}
        rowsPerPageOptions={[10, 20, 50, 100]}
        checkboxSelection
        disableSelectionOnClick
        pagination
        paginationMode="server"
        onPageChange={onChangePage}
        onPageSizeChange={(pageSize) => setPageSize(pageSize)}
        onSelectionModelChange={(newSelectionModelList) =>
          handleSelectionModelChange(newSelectionModelList)
        }
        selectionModel={selectionModelList}
        // onStateChange={onColumnVisibilityChange}
        filterMode="server"
        sortingMode="server"
        sortModel={sortModel}
        rowHeight={50}
        onSortModelChange={handleSortModelChange}
        loading={loading}
        onCellDoubleClick={(event) => {
          console.log(event);
        }}
        components={{
          Toolbar: CustomToolbar,
          ColumnMenu: CustomColumnMenuComponent,
        }}
        componentsProps={{
          toolbar: { updateQueueFocusCollect: props.updateQueueFocusCollect },
        }}
        localeText={
          i18n.language === "en"
            ? enUS.components.MuiDataGrid.defaultProps.localeText
            : deDE.components.MuiDataGrid.defaultProps.localeText
        }
        sx={{
          boxShadow: "none",
          border: "1px solid #e0e0e0",
        }}
      />
      <Menu
        id="basic-menu"
        open={filterMenu !== null}
        onClose={() => {
          setFilterMenu(null);
        }}
        anchorReference="anchorPosition"
        anchorPosition={
          filterMenu !== null
            ? { top: filterMenu.mouseY, left: filterMenu.mouseX }
            : undefined
        }
      >
        <Box
          sx={{ width: 500, padding: 2 }}
          onKeyDown={(e) => e.stopPropagation()}
        >
          {filterColumn &&
            (filterColumn.field === "carrier" ? (
              <RenderFilterCellType
                column={filterColumn}
                updateOptions={(value, callback) => {
                  userApi
                    .getCarrierUIDs({ search_value: value })
                    .then((res) => {
                      callback(res.data.carriers_uids);
                    });
                }}
                onChange={(value) => {
                  setFilterModel({ ...filterModel, uid: value });
                  setFilterMenu(null);
                }}
              />
            ) : filterColumn.field === "article" ? (
              <RenderFilterCellType
                column={filterColumn}
                updateOptions={(value, callback) => {
                  userApi
                    .getArticleNumbers({ search_value: value })
                    .then((res) => {
                      callback(res.data.article_numbers);
                    });
                }}
                onChange={(value) => {
                  setFilterModel({
                    ...filterModel,
                    article_number: value,
                  });
                  setFilterMenu(null);
                }}
              />
            ) : filterColumn.field === "description" ? (
              <RenderFilterCellType
                column={filterColumn}
                updateOptions={(value, callback) => {
                  userApi
                    .getDescriptiontexts({ search_value: value })
                    .then((res) => {
                      callback(res.data.descriptions);
                    });
                }}
                onChange={(value) => {
                  setFilterModel({
                    ...filterModel,
                    description: value,
                  });
                  setFilterMenu(null);
                }}
              />
            ) : filterColumn.field === "quantity" ? (
              <RenderFilterCellType
                column={filterColumn}
                updateOptions={null}
                onChange={(value) => {
                  setFilterModel({
                    ...filterModel,
                    quantity_min: value[0],
                    quantity_max: value[1],
                  });
                  setFilterMenu(null);
                }}
              />
            ) : filterColumn.field === "provider" ? (
              <RenderFilterCellType
                column={filterColumn}
                updateOptions={(value, callback) => {
                  userApi
                    .getProviderNames({ search_value: value })
                    .then((res) => {
                      callback(res.data.provider_names);
                    });
                }}
                onChange={(value) => {
                  setFilterModel({
                    ...filterModel,
                    provider: value,
                  });
                  setFilterMenu(null);
                }}
              />
            ) : filterColumn.field === "providerDescription" ? (
              <RenderFilterCellType
                column={filterColumn}
                updateOptions={(value, callback) => {
                  userApi
                    .getProviderDescriptions({ search_value: value })
                    .then((res) => {
                      callback(res.data.provider_descriptions);
                    });
                }}
                onChange={(value) => {
                  setFilterModel({
                    ...filterModel,
                    provider_description: value,
                  });
                  setFilterMenu(null);
                }}
              />
            ) : filterColumn.field === "manufacturer" ? (
              <RenderFilterCellType
                column={filterColumn}
                updateOptions={(value, callback) => {
                  userApi
                    .getManufacturerNames({ search_value: value })
                    .then((res) => {
                      callback(res.data.manufacturer_names);
                    });
                }}
                onChange={(value) => {
                  setFilterModel({
                    ...filterModel,
                    manufacturer: value,
                  });
                  setFilterMenu(null);
                }}
              />
            ) : filterColumn.field === "manufacturerDescription" ? (
              <RenderFilterCellType
                column={filterColumn}
                updateOptions={(value, callback) => {
                  userApi
                    .getManufacturerDescriptions({ search_value: value })
                    .then((res) => {
                      callback(res.data.manufacturer_descriptions);
                    });
                }}
                onChange={(value) => {
                  setFilterModel({
                    ...filterModel,
                    manufacturer_description: value,
                  });
                  setFilterMenu(null);
                }}
              />
            ) : null)}
        </Box>
      </Menu>
    </div>
    // <Grid container style={{ display: "flex", flexGrow: 1 }} direction="column">
    //   <Grid
    //     container
    //     style={{ display: "flex", flexGrow: 1, spacing: 10 }}
    //     direction="row"
    //     width={1}
    //   >
    //     <Grid item className={classes.paginationStyle}>
    //       <Pagination
    //         count={Math.ceil(rowsCount / 100)}
    //         page={pageNumber}
    //         variant="outlined"
    //         color="primary"
    //         onChange={onChangePage}
    //       />
    //     </Grid>

    //     <Grid item className={classes.filterInputStyle}>
    //       <TextField
    //         id="filter-input"
    //         label="Filter"
    //         variant="outlined"
    //         onChange={onChangeFilter}
    //         onKeyDown={onEnteredfilter}
    //       ></TextField>
    //     </Grid>
    //   </Grid>

    //   <TableContainer component={Paper}>
    //     <Table className={classes.table} aria-label="simple table">
    //       <TableHead>
    //         <StyledTableRow>
    //           {headCells.map((headCell) => (
    //             <StyledTableCell
    //               key={headCell.id}
    //               sortDirection={orderBy === headCell.id ? order : false}
    //             >
    //               <TableSortLabel
    //                 active={orderBy === headCell.id}
    //                 direction={orderBy === headCell.id ? order : "asc"}
    //                 onClick={createSortHandler(headCell.id)}
    //               >
    //                 {headCell.label}
    //                 {orderBy === headCell.id ? (
    //                   <span className={classes.visuallyHidden}>
    //                     {order === "desc"
    //                       ? "sorted descending"
    //                       : "sorted ascending"}
    //                   </span>
    //                 ) : null}
    //               </TableSortLabel>
    //             </StyledTableCell>
    //           ))}
    //         </StyledTableRow>
    //       </TableHead>
    //       <TableBody>
    //         {stableSort(carrierRows, getComparator(order, orderBy)).map(
    //           (row) => (
    //             <StyledTableRow key={row.carrier}>
    //               <StyledTableCell>{row.carrier}</StyledTableCell>
    //               <StyledTableCell>{row.article}</StyledTableCell>
    //               <StyledTableCell>{row.description}</StyledTableCell>
    //               <StyledTableCell>{row.quantity}</StyledTableCell>
    //               <StyledTableCell>{row.provider}</StyledTableCell>
    //               <StyledTableCell>{row.manufacturer}</StyledTableCell>
    //               <StyledTableCell>{row.sapNumber}</StyledTableCell>
    //               <StyledTableCell>{row.lotNumber}</StyledTableCell>
    //               <StyledTableCell>{row.width}</StyledTableCell>
    //               <StyledTableCell>{row.diameter}</StyledTableCell>
    //               <StyledTableCell>{row.location}</StyledTableCell>
    //             </StyledTableRow>
    //           )
    //         )}
    //       </TableBody>
    //     </Table>
    //   </TableContainer>
    // </Grid>
  );
}
