import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
// import Switch from '@mui/material/Switch';
// import { styled } from '@mui/material/styles';
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Switch,
  styled,
  Tooltip,
} from "@material-ui/core";

// import { Delete } from '@material-ui/icons';
import VisibilityIcon from "@material-ui/icons/Visibility";
import BlockIcon from "@material-ui/icons/Block";
// import ArrowBackIcon from "@material-ui/icons/ArrowBack";

// For Table
import SearchBar from "material-ui-search-bar";
import { orderBy } from "lodash";

//history
import { useHistory } from "react-router-dom";
// import AddEditCategory from "../AccountManagement/Account_Details";

// import "./Sects_Management.css";
import EditIcon from "@material-ui/icons/Edit";
import { DeleteOutline, WidgetsOutlined } from "@material-ui/icons";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import RSelect from "react-select";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  root: {
    flexWrap: "wrap",
    // marginTop: '5rem',
  },
  margin: {
    margin: theme.spacing(1),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  paperHeading: {
    padding: "1rem 0rem",
  },
  table: {
    minWidth: 650,
  },
  textMiddle: {
    verticalAlign: "middle !important",
  },
  iconMargin: {
    margin: "0.5rem",
    color: "#696969",
    backgroundColor: "#fff",
  },
  iconcolor: {
    margin: "0.5rem",
    color: "#fff",
    backgroundColor: "#0294b3 !important",
  },
  headingButton: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    padding: "10px",
  },
  headingAlignment: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    // padding: "0 2rem 0 2rem"
    alignItems: "center",
    flexWrap: "wrap",
    ["@media (max-width:780px)"]: {
      // eslint-disable-line no-useless-computed-key
      flexDirection: "column",
      width: "100%",
      gap: "1rem",
      justifyContent: "center",
      textAlign: "center",
    },
  },
  addNewCategory: {
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    justifyContent: "space-between",
    ["@media (max-width:780px)"]: {
      // eslint-disable-line no-useless-computed-key
      flexDirection: "column",
      width: "100%",
      gap: "1rem",
      justifyContent: "center",
      textAlign: "center",
    },
  },
  addNewCategoryHeading: {
    textAlign: "center",
    flex: 1,
    paddingBottom: "0 !important",
    ["@media (max-width:780px)"]: {
      // eslint-disable-line no-useless-computed-key
      flexDirection: "column",
      width: "100%",
      gap: "1rem",
      justifyContent: "center",
      textAlign: "center",
    },
  },
  MarginControl: {
    ["@media (max-width:780px)"]: {
      // eslint-disable-line no-useless-computed-key
      margin: "0 !important",
    },
  },
  Marginbutton: {
    margin: "0.5rem",
  },
  container: {
    maxHeight: "58vh",
  },
  paperPaddingRightLeft: {
    padding: "0rem 1rem",
  },
}));

export default function CalenderView(props) {
  const classes = useStyles();
  useEffect(() => {
    getactivemenuitem();
  }, []);
  const {
    location: { state },
  } = props;
  console.log(props);
  const getactivemenuitem = () => {
    const result = [...document.getElementsByTagName("a")];
    const newres = result.filter((ele) => {
      if (ele.innerText === "Manage Calendar") {
        return ele;
      }
    });
    newres[0].classList.add("activate");
    console.log(newres);
    console.log(result);
  };
  // const history=useHistory();
  console.log(state);
  const [tableData, setTableData] = useState([]);
  const [menuData, setMenuData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  // status switch
  // const [checked, setChecked] = useState(true);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const optionsMonth = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];

  const handleChangePage = (event, newPage) => {
    // console.log(event);
    // console.log(newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    //   getCategoriesContent();
    getCalenderFiltereddata(state[0]);
  }, [state]);

  const getCalenderFiltereddata = async (id, Selectedmonth) => {
    const { data } = await axios.get(`/admin/getCalendar?unique_id=${id}&year=${state[1].calendarYear}`);
    console.log(data.data);
    // setExcelData(data.data);
    if (Selectedmonth) {
      let fileteredCalenderData = data.data[Selectedmonth].azan_timing;
      // let finalData = fileteredCalenderData.unshift({ Lemon: "Pineapple" });
      console.log(fileteredCalenderData);
      setMenuData(fileteredCalenderData);
    } else {
      setMenuData(data.data[0].azan_timing);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper>
            <div className={classes.paperPaddingRightLeft}>
              <div className="py-4">
                <Paper elevation={0} className={classNames(classes.paperHeading, classes.addNewCategory)}>
                  <div className={classes.headingSellerDetails}>
                    <Button
                      variant="outlined"
                      aria-label="add"
                      className={classes.iconMargin}
                      onClick={() => {
                        // if (window.confirm("Leave this page?")) {
                        props.history.push({
                          pathname: "/adminPanel/Calender_Management",
                          state: state[1],
                        });
                        // }
                      }}
                    >
                      <ArrowBackIcon />
                    </Button>
                  </div>
                  <h3 className="mx-3">View Calendar</h3>
                  <div style={{ minWidth: "150px" }}>
                    {/* <RSelect
                      defaultValue={{ value: "Jan", label: "January" }}
                      options={optionsMonth}
                      onChange={(e) => {
                        getCalenderFiltereddata(state, e.value);
                      }}
                    /> */}
                    <label>Select Month :&nbsp;</label>
                    <Select
                      // label="demo-simple-select-label"
                      defaultValue="0"
                      onChange={(e) => {
                        getCalenderFiltereddata(state[0], e.target.value);
                        console.log(e.target.value);
                      }}
                    >
                      {optionsMonth.map((item) => (
                        <MenuItem value={item.value}>{item.label}</MenuItem>
                      ))}
                    </Select>
                  </div>
                </Paper>

                {/* //new design */}

                {/* <br /> */}

                {/* status end */}

                <Paper>
                  <TableContainer className={classes.tableContainerHeight}>
                    <Table stickyHeader id="downloadTable">
                      <TableHead>
                        <TableRow>
                          <TableCell className={classes.tablePadding}></TableCell>
                          <TableCell className={classes.tablePadding}></TableCell>
                          <TableCell className={classes.tablePadding} style={{ textAlign: "center" }} colSpan="2">
                            Fajr
                          </TableCell>
                          <TableCell className={classes.tablePadding}></TableCell>
                          <TableCell className={classes.tablePadding} style={{ textAlign: "center" }} colSpan="2">
                            Zuhr
                          </TableCell>
                          {/* <TableCell
                            className={classes.tablePadding}
                          ></TableCell> */}
                          <TableCell className={classes.tablePadding} style={{ textAlign: "center" }} colSpan="2">
                            Asr
                          </TableCell>
                          {/* <TableCell
                            className={classes.tablePadding}
                          ></TableCell> */}
                          <TableCell className={classes.tablePadding} style={{ textAlign: "center" }} colSpan="2">
                            Maghrib
                          </TableCell>
                          {/* <TableCell
                            className={classes.tablePadding}
                          ></TableCell>
                          <TableCell
                            className={classes.tablePadding}
                          ></TableCell> */}
                          <TableCell className={classes.tablePadding} style={{ textAlign: "center" }} colSpan="2">
                            Isha
                          </TableCell>
                          <TableCell className={classes.tablePadding}></TableCell>
                          {console.log(menuData)}
                        </TableRow>
                        <TableRow>
                          <TableCell className={classes.tablePadding}>Date</TableCell>
                          <TableCell className={classes.tablePadding}>Day</TableCell>
                          <TableCell className={classes.tablePadding}>Begin</TableCell>
                          <TableCell className={classes.tablePadding}>Jamat</TableCell>
                          <TableCell className={classes.tablePadding}>Sunrise</TableCell>
                          <TableCell className={classes.tablePadding}>Begin</TableCell>
                          <TableCell className={classes.tablePadding}>Jamat</TableCell>
                          <TableCell className={classes.tablePadding}>Begin</TableCell>
                          <TableCell className={classes.tablePadding}>Jamat</TableCell>
                          <TableCell className={classes.tablePadding}>Begin</TableCell>
                          <TableCell className={classes.tablePadding}>Jamat</TableCell>
                          <TableCell className={classes.tablePadding}>Begin</TableCell>
                          <TableCell className={classes.tablePadding}>Jamat</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {menuData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((category, index) => (
                          <>
                            {
                              // index === 0 ? (
                              // ""
                              // ) :
                              <>
                                <TableRow key={category._id}>
                                  <TableCell component="th" scope="row" className={classes.textMiddle}>
                                    <div>{category.date}</div>
                                  </TableCell>
                                  <TableCell className={classes.textMiddle}>
                                    <div>{category.day}</div>
                                  </TableCell>
                                  <TableCell className={classes.textMiddle}>
                                    <div>{category.Fajr.start}</div>
                                  </TableCell>
                                  <TableCell className={classes.textMiddle}>
                                    <div>{category.Fajr.end}</div>
                                  </TableCell>
                                  <TableCell className={classes.textMiddle}>
                                    <div>{category.sunrise}</div>
                                  </TableCell>
                                  <TableCell className={classes.textMiddle}>
                                    <div>{category.Zuhr.start}</div>
                                  </TableCell>
                                  <TableCell className={classes.textMiddle}>
                                    <div>{category.Zuhr.end}</div>
                                  </TableCell>
                                  <TableCell className={classes.textMiddle}>
                                    <div>{category.Asr.start}</div>
                                  </TableCell>
                                  <TableCell className={classes.textMiddle}>
                                    <div>{category.Asr.end}</div>
                                  </TableCell>
                                  <TableCell className={classes.textMiddle}>
                                    <div>{category.Maghrib.start}</div>
                                  </TableCell>
                                  <TableCell className={classes.textMiddle}>
                                    <div>{category.Maghrib.end}</div>
                                  </TableCell>
                                  <TableCell className={classes.textMiddle}>
                                    <div>{category.Isha.start}</div>
                                  </TableCell>
                                  <TableCell className={classes.textMiddle}>
                                    <div>{category.Isha.end}</div>
                                  </TableCell>
                                </TableRow>
                              </>
                            }
                          </>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={menuData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </Paper>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </React.Fragment>
  );
}
