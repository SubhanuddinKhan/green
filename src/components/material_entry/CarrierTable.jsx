import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import renderCellExpand from "../helpers/DGRenderCellExpand";
import RenderFilterCellType from "../helpers/DGRenderFilterCells";
import { useHistory } from "react-router-dom";

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

import CircularProgress from "@mui/material/CircularProgress";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
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
import TextField from "@mui/material/TextField";

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

export default function CarrierTable(props) {
  const [carrierRows, setCarrierRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const [filterQuery, setFilterQuery] = useState("");
  const [orderArg, setOrderArg] = useState("");
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [selectionModelList, setSelectionModelList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [filterMenu, setFilterMenu] = React.useState(null);
  const [filterColumn, setFilterColumn] = React.useState(null);
  const [filterModel, setFilterModel] = React.useState({
    searchFilter: "",
    uid: "",
    article_number: "",
    lot_number: "",
    description: "",
    quantity_max: "",
    quantity_min: "",
    provider: "",
    provider_description: "",
    manufacturer: "",
    manufacturer_description: "",
  });

  const [sortModel, setSortModel] = React.useState([]);

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t, i18n } = useTranslation();
  const userApi = new UserApi();
  const history = useHistory();

  const columns = [
    {
      field: "carrier",
      headerName: t("carrier"),
      editable: true,
      width: 120,
      filterType: "text",
    },
    {
      field: "article",
      headerName: t("article"),
      editable: true,
      width: 120,
      renderCell: renderCellExpand,
      filterType: "text",
    },
    {
      field: "description",
      headerName: t("description"),
      editable: true,
      width: 250,
      renderCell: renderCellExpand,
      filterType: "text",
    },
    {
      field: "quantity",
      headerName: t("quantity"),
      editable: true,
      filterType: "number",
    },
    {
      field: "delivered",
      headerName: t("delivered"),
      editable: false,
      renderCell: (params) => {
        return (
          <CheckCircleOutlineIcon
            color={params.value ? "primary" : "disabled"}
          />
        );
      },
    },
    {
      field: "provider",
      headerName: t("provider"),
      editable: true,
      renderCell: renderCellExpand,
      filterType: "text",
    },
    {
      field: "providerDescription",
      headerName: t("providerDescription"),
      width: 200,
      editable: true,
      renderCell: renderCellExpand,
      filterType: "text",
    },
    {
      field: "manufacturer",
      headerName: t("manufacturer"),
      editable: true,
      renderCell: renderCellExpand,
      filterType: "text",
    },
    {
      field: "manufacturerDescription",
      headerName: t("manufacturerDescription"),
      width: 200,
      editable: true,
      renderCell: renderCellExpand,
      filterType: "text",
    },
    {
      field: "lotNumber",
      headerName: t("lotNumber"),
      editable: true,
      width: 120,
      filterType: "text",
    },
    {
      field: "SapNumber",
      headerName: t("sap.number"),
      editable: true,
      width: 120,
    },
    { field: "type", headerName: t("type") },
    { field: "size", headerName: t("diameter") + " /inch " },
    { field: "width", headerName: t("width") + " /mm" },
  ];

  function deleteAllChips() {
    setFilterModel({
      uid: "",
      article_number: "",
      lot_number: "",
      description: "",
      quantity_min: "",
      quantity_max: "",
      provider: "",
      provider_description: ""
    });
  }

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

  const handleSortModelChange = (newModel) => {
    const field = getFieldfromModel(newModel);
    getCarrierData(pageNumber, pageSize, filterModel, field);
    setSortModel(newModel);
  };

  const getCarrierData = (page, pageSize, filter, order) => {
    const importedData = [];
    const newCarrierUIDs = [];

    userApi
      .getCarriers({
        page: page,
        page_size: pageSize,
        // search: filter,
        ordering: order,
        uid: filter.uid,
        article_number: filter.article_number,
        lot_number: filter.lot_number,
        description: filter.description,
        quantity_max: filter.quantity_max,
        quantity_min: filter.quantity_min,
        provider: filter.provider,
        provider_description: filter.provider_description,
        manufacturer: filter.manufacturer,
        manufacturer_description: filter.manufacturer_description,
      })
      .then((res) => {
        const data = res.data;
        setRowsCount(data.count);
        if (data) {
          data.results.map((x) => {
            importedData.push({
              id: x.id,
              carrier: x.uid,
              article: x.article ? x.article.name : "N/A",
              description: x.article ? x.article.description : "N/A",
              quantity: x.quantity_current,
              stored: x.is_delivered,
              provider: x.article ? x.article.provider_name : "N/A",
              providerDescription: x.article
                ? x.article.provider_description
                : "N/A",
              manufacturer: x.article ? x.article.manufacturer_name : "N/A",
              manufacturerDescription: x.article
                ? x.article.Manufacturer_description
                : "N/A",
              lotNumber: x.lot_number,
              SapNumber: x.article ? x.article.sap_number : "N/A",
              size: x.diameter,
              width: x.width,
              type: x.container_type,
              delivered: x.is_delivered,
            });
            newCarrierUIDs.push(x.uid);
          });

          setCarrierRows(importedData);
        }
      })
      .catch((err) => props.onRenderActivityAlert());
  };

  useEffect(() => {
    getCarrierData(1, 100, "", "");
  }, [props.hackeyAddition]);

  useEffect(() => {
    getCarrierData(pageNumber, pageSize, filterModel, orderArg);
  }, [pageNumber, pageSize, filterModel, orderArg]);

  const onChangePage = (page) => {
    setPageNumber(page + 1);
  };

  const onChangeFilter = (event) => {
    setFilterQuery(event.target.value);
  };

  const printLabel = (message_a, message_b) => {
    userApi
      .printLabel({ message_a, message_b, labelType: "carrier" })
      .then((res) => {
        const data = res.data;
        if (data.status === "success") {
          enqueueSnackbar(data.message, {
            variant: "success",
          });
        } else {
          enqueueSnackbar(data.message, {
            variant: "error",
          });
        }
        getCarrierData(1, "", "");
      })
      .catch((err) => console.log(err));
  };

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
                <Tooltip title={t("toolbar.deliver")}>
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault();
                      //TODO some logic to reset fully when all return success and if not to keep filter and selection for the warnings/errors
                      selectionModel.forEach((row) => {
                        userApi
                          .handle_carrier_delivered({
                            uid: row.carrier,
                          })
                          .then((res) => {
                            const data = res.data;
                            console.log(data);
                            if (data.status === "success") {
                              enqueueSnackbar(data.message, {
                                variant: "success",
                              });
                            }
                            else if (data.status === "warning") {
                              enqueueSnackbar(data.message, {
                                variant: "warning",
                              });
                            }
                            else {
                              enqueueSnackbar(data.message, {
                                variant: "error",
                              });
                            }
                          })
                          .catch((err) => console.log(err));
                      });
                      getCarrierData(1, 100, "", "");
                      setFilterModel({ ...filterModel, searchFilter: "" });
                      setSelectionModel([]);
                      setSelectionModelList([]);
                      deleteAllChips();

                      
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
          <Box key="filter-chip-box" pl={2}>
            
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
              
              {filterModel.lot_number && (
                <Grid item>
                  <Chip
                    label={
                      t("toolbar.lot_number") +
                      ": " +
                      filterModel.lot_number
                    }
                    onDelete={() => {
                      setFilterModel({ ...filterModel, lot_number: "" });
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
    <Grid container direction="column" style={{ flexGrow: 1 }}>
      {/* <Grid
        container
        style={{ display: "flex", spacing: 10, flexGrow: 1 }}
        direction="row"
        width={1}
      >
        <Grid item className={classes.paginationStyle}>
          <Pagination
            count={Math.ceil(rowsCount / 100)}
            page={pageNumber}
            variant="outlined"
            color="primary"
            onChange={onChangePage}
          />
        </Grid>
        <Grid item className={classes.countStyle}>
          {t("count")}: {rowsCount}
        </Grid>
        <Grid item className={classes.filterInputStyle}>
          <TextField
            id="filter-input"
            label="Filter"
            variant="outlined"
            onChange={onChangeFilter}
            onKeyDown={onEnteredfilter}
          ></TextField>
        </Grid>
      </Grid> */}
      {rowsCount === 0 ? (
        <CircularProgress style={{ alignSelf: "center" }} />
      ) : (
        // <TableContainer component={Paper} className={classes.tableContainer}>
        //   <Table className={classes.table} aria-label="simple table">
        //     <TableHead>
        //       <StyledTableRow>
        //         {headCells.map((headCell) => (
        //           <StyledTableCell
        //             key={headCell.id}
        //             sortDirection={orderBy === headCell.id ? order : false}
        //           >
        //             <TableSortLabel
        //               active={orderBy === headCell.id}
        //               direction={orderBy === headCell.id ? order : "asc"}
        //               onClick={handleSorting(headCell.id)}
        //             >
        //               {headCell.label}
        //               {orderBy === headCell.id ? (
        //                 <span className={classes.visuallyHidden}>
        //                   {order === "desc"
        //                     ? "sorted descending"
        //                     : "sorted ascending"}
        //                 </span>
        //               ) : null}
        //             </TableSortLabel>
        //           </StyledTableCell>
        //         ))}
        //       </StyledTableRow>
        //     </TableHead>
        //     <TableBody>
        //       {carrierRows.map((row) => (
        //         <StyledTableRow key={row.carrier}>
        //           <StyledTableCell>{row.carrier}</StyledTableCell>
        //           <StyledTableCell>{row.article}</StyledTableCell>
        //           <StyledTableCell>{row.description}</StyledTableCell>
        //           <StyledTableCell>{row.quantity}</StyledTableCell>
        //           <StyledTableCell>{row.provider}</StyledTableCell>
        //           <StyledTableCell>{row.providerDescription}</StyledTableCell>
        //           <StyledTableCell>{row.manufacturer}</StyledTableCell>
        //           <StyledTableCell>
        //             {row.manufacturerDescription}
        //           </StyledTableCell>
        //           <StyledTableCell>{row.lotNumber}</StyledTableCell>
        //           <StyledTableCell>{row.SapNumber}</StyledTableCell>
        //           <StyledTableCell>{row.type}</StyledTableCell>
        //           <StyledTableCell>{row.size}</StyledTableCell>
        //           <StyledTableCell>{row.width}</StyledTableCell>
        //           <StyledTableCell>
        //             {" "}
        //             <IconButton
        //               aria-label="delete"
        //               onClick={() => printLabel(row.carrier, row.article)}
        //               style={row.delivered ? { color: "#45DD40" } : {}}
        //               size="large"
        //             >
        //               <PrintIcon />
        //             </IconButton>{" "}
        //           </StyledTableCell>
        //         </StyledTableRow>
        //       ))}
        //     </TableBody>
        //   </Table>
        // </TableContainer>
        <div style={{ height: 950, width: "100%" }}>
          <DataGrid
            rows={carrierRows}
            columns={columns}
            rowCount={rowsCount}
            pagination
            paginationMode="server"
            // pageSize={size}
            onPageChange={onChangePage}
            onPageSizeChange={(pageSize) => setPageSize(pageSize)}
            checkboxSelection
            disableSelectionOnClick
            rowsPerPageOptions={[10, 20, 50, 100]}
            onSelectionModelChange={(newSelectionModelList) => {
              const newSelectionModel = [];
              newSelectionModelList.forEach((item) => {
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
              setSelectionModelList(newSelectionModelList);
            }}
            selectionModel={selectionModelList}
            // onStateChange={onColumnVisibilityChange}
            filterMode="server"
            sortingMode="server"
            sortModel={sortModel}
            rowHeight={30}
            onSortModelChange={handleSortModelChange}
            loading={loading}
            onCellDoubleClick={(event) => {
              console.log(event);
            }}
            onCellEditCommit={(e) => {
              const changeInstance = {
                id: e.id,
                field: e.field,
                value: e.value,
              };
              // check if change instance is already in the list
              userApi
                .editCarrierRecord(changeInstance)
                .then((res) => {
                  console.log(res);
                })
                .catch((err) => {
                  console.log(err);
                });
            }}
            components={{
              Toolbar: CustomToolbar,
              ColumnMenu: CustomColumnMenuComponent,
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
                ) : filterColumn.field === "lotNumber" ? (
                  <RenderFilterCellType
                    column={filterColumn}
                    updateOptions={(value, callback) => {
                      userApi
                        .getLotNumbers({ search_value: value })
                        .then((res) => {
                          callback(res.data.lot_numbers);
                        });
                    }}
                    onChange={(value) => {
                      setFilterModel({
                        ...filterModel,
                        lot_number: value,
                      });
                      setFilterMenu(null);
                    }}
                  />
                ): filterColumn.field === "description" ? (
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
      )}
    </Grid>
  );
}
