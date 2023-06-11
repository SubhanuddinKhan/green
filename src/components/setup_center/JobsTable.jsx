import React, { useEffect, useState } from "react";
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
import { IconButton } from "@mui/material";
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
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";
import deLocale from "date-fns/locale/de";
import Grid from "@mui/material/Grid";
import UserApi from "../../services/user.service";
import JobDocument from "./jobDocument";

import renderCellExpand from "../helpers/DGRenderCellExpand";

export default function JobListTable(props) {
  const [jobRows, setJobRows] = useState([]);
  const [rowsCount, setRowsCount] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [filterQuery, setFilterQuery] = useState("");
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [filterModel, setFilterModel] = React.useState({
    searchFilter: "",
    article_number: "",
    description: "",
    articleTypes: [],
    manufacturers: [],
    storages: [],
    assemblys: [],
    supplier: "",
    supplier_article_number: "",
    supplier_description: "",
  });
  const [sortModel, setSortModel] = React.useState([]);
  const [selectionModel, setSelectionModel] = React.useState([]);
  const [selectionModelList, setSelectionModelList] = React.useState([]);

  const { t, i18n } = useTranslation();

  const userApi = new UserApi();

  const columns = [
    { field: "name", headerName: t("name"), editable: true, width: 120 },

    {
      field: "description",
      headerName: t("description"),
      editable: true,
      width: 250,
      renderCell: renderCellExpand,
    },
    { field: "count", headerName: t("count"), editable: true },
    {
      field: "board",
      headerName: t("board"),
      editable: true,
    },
    {
      field: "customer",
      headerName: t("customer"),
      width: 200,
      editable: true,
      renderCell: renderCellExpand,
    },
    {
      field: "project",
      headerName: t("project"),
      editable: true,
      renderCell: renderCellExpand,
    },
    {
      field: "projectDescription",
      headerName: t("projectDescription"),
      width: 200,
      editable: true,
      renderCell: renderCellExpand,
    },
    {
      field: "start_date",
      headerName: t("startDate"),
      editable: true,
      width: 150,
    },
    {
      field: "finish_date",
      headerName: t("finishDate"),
      editable: true,
      width: 150,
    },
    { field: "department", headerName: t("department") },
    { field: "status", headerName: t("status") },
    { field: "pdf", headerName: t("pdf") },
  ];

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getJobData = (page, filter) => {
    const importedData = [];

    userApi.getJobsList({ offset: page * 100, search: filter }).then((res) => {
      const data = res.data;
      if (data) {
        setRowsCount(data.count);
        data.results.forEach((x) => {
          var reserveStatus = true;
          var machineStatus = true;
          var setupStatus = true;
          if (x.jobarticles) {
            for (var i = 0; i < x.jobarticles.length; i++) {
              if (x.jobarticles[i].carrier === null) {
                reserveStatus = false;
                setupStatus = false;
                machineStatus = false;
                break;
              } else if (x.jobarticles[i].carrier.feeder === null) {
                setupStatus = false;
                machineStatus = false;
              }
            }
          }

          importedData.push({
            id: x.id,
            name: x.name,
            description: x.description,
            count: x.count,
            board: x.board ? x.board.name : "",
            customer: x.customer ? x.customer.name : "",
            start_date: x.commission_date
              ? x.commission_date.replace("T", " ").slice(0, 16)
              : "     ",
            finish_date: x.finish_date
              ? x.finish_date.replace("T", " ").slice(0, 16)
              : "     ",

            reserveStatus,
            setupStatus,
            machineStatus,
            project: x.project ? x.project.name : "",
          });
        });
        setJobRows(importedData);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    setLoading(true);
    getJobData(0, "");
    setLoading(false);
  }, [props.hackeyAddition]);

  const onChangePage = (event, page) => {
    setPageNumber(page);
    getJobData(page - 1, filterQuery);
  };

  const onChangeFilter = (event) => {
    setFilterQuery(event.target.value);
  };

  const onEnteredfilter = (e) => {
    if (e.keyCode === 13) {
      setPageNumber(1);
      getJobData(0, filterQuery);
      // put the login here
    }
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
                {t("jobs")}
              </Typography>
              <div>
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
              {filterModel.storages.length > 0 &&
                filterModel.storages.map((storage) => (
                  <Grid item>
                    <Chip
                      key={storage.filterValue}
                      label={t("toolbar.storage") + ": " + storage.label}
                      onDelete={() => {
                        const newStorages = filterModel.storages.filter(
                          (s) => s !== storage
                        );
                        setFilterModel({
                          ...filterModel,
                          storages: newStorages,
                        });
                      }}
                    />
                  </Grid>
                ))}

              {filterModel.articleTypes.length > 0 &&
                filterModel.articleTypes.map((articleType) => (
                  <Grid item>
                    <Chip
                      key={articleType.value}
                      label={
                        t("toolbar.articleType") + ": " + articleType.label
                      }
                      onDelete={() => {
                        const newArticleTypes = filterModel.articleTypes.filter(
                          (item) => item !== articleType
                        );
                        setFilterModel({
                          ...filterModel,
                          articleTypes: newArticleTypes,
                        });
                      }}
                    />
                  </Grid>
                ))}
              {filterModel.manufacturers.length > 0 &&
                filterModel.manufacturers.map((articleType) => (
                  <Grid item>
                    <Chip
                      key={articleType.value}
                      label={
                        t("toolbar.manufacturer") + ": " + articleType.label
                      }
                      onDelete={() => {
                        const newManufacturers =
                          filterModel.manufacturers.filter(
                            (item) => item !== articleType
                          );
                        setFilterModel({
                          ...filterModel,
                          manufacturers: newManufacturers,
                        });
                      }}
                    />
                  </Grid>
                ))}
              {filterModel.supplier && (
                <Grid item>
                  <Chip
                    label={t("toolbar.supplier") + ": " + filterModel.supplier}
                    onDelete={() => {
                      setFilterModel({ ...filterModel, supplier: "" });
                    }}
                  />
                </Grid>
              )}

              {filterModel.supplier_article_number && (
                <Grid item>
                  <Chip
                    label={
                      t("toolbar.supplier_article_number") +
                      ": " +
                      filterModel.supplier_article_number
                    }
                    onDelete={() => {
                      setFilterModel({
                        ...filterModel,
                        supplier_article_number: "",
                      });
                    }}
                  />
                </Grid>
              )}
              {filterModel.supplier_description && (
                <Grid item>
                  <Chip
                    label={
                      t("toolbar.supplier_description") +
                      ": " +
                      filterModel.supplier_description
                    }
                    onDelete={() => {
                      setFilterModel({
                        ...filterModel,
                        supplier_description: "",
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
            // renderFilterCell(e, currentColumn, hideMenu);
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
    <Grid container style={{ display: "flex", flexGrow: 1 }} direction="column">
      {rowsCount === 0 ? (
        <CircularProgress style={{ alignSelf: "center" }} />
      ) : (
        <div style={{ height: 689, width: "100%" }}>
          <DataGrid
            rows={jobRows}
            columns={columns}
            rowCount={rowsCount}
            pagination
            // paginationMode="server"
            // pageSize={size}
            // onPageChange={onChangePage}
            // onPageSizeChange={(pageSize) => setPageSize(pageSize)}
            // checkboxSelection
            disableSelectionOnClick
            // rowsPerPageOptions={[10, 20, 50, 100]}
            // onSelectionModelChange={(newSelectionModelList) => {
            //   const newSelectionModel = [];
            //   newSelectionModelList.forEach((item) => {
            //     const row = carrierRows.filter((row) => {
            //       if (row.id === item) {
            //         return row;
            //       } else {
            //         return null;
            //       }
            //     });
            //     if (row) {
            //       newSelectionModel.push(row[0]);
            //     }
            //   });

            //   setSelectionModel(newSelectionModel);
            //   setSelectionModelList(newSelectionModelList);
            // }}
            // selectionModel={selectionModelList}
            // onStateChange={onColumnVisibilityChange}
            filterMode="server"
            sortingMode="server"
            // sortModel={sortModel}
            rowHeight={50}
            // onSortModelChange={handleSortModelChange}
            // loading={loading}
            // onCellDoubleClick={(event) => {
            //   if (event.field === "image") {
            //     setTempImageArticleID(event.id);
            //     renderImageEditCell(event);
            //   }
            //   console.log(event);
            // }}
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
        </div>
      )}
    </Grid>
  );
}
