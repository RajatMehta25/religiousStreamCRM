import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
import moment from "moment";
// import Switch from '@mui/material/Switch';
// import { styled } from '@mui/material/styles';
// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'
import {
  Button,
  IconButton,
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
import { BsFilter } from "react-icons/bs";

import DatePicker from "react-date-picker";
import DatePickerNew from "react-datepicker";
import Swal from "sweetalert2";
import { confirm } from "react-confirm-box";

// import { Delete } from '@material-ui/icons';
import VisibilityIcon from "@material-ui/icons/Visibility";
import BlockIcon from "@material-ui/icons/Block";
// import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import KErrorMessage from "./KErrorMessage";

// For Table
import SearchBar from "material-ui-search-bar";
import { get, identity, sortBy } from "lodash";

//history
import { useHistory } from "react-router-dom";
// import AddEditCategory from "../AccountManagement/Account_Details";
import * as yup from "yup";

// import './Category_Management.css' ;
import EditIcon from "@material-ui/icons/Edit";
import { Category, DeleteOutline, WidgetsOutlined } from "@material-ui/icons";
import ModalVideo from "react-modal-video";
// import 'node_modules/react-modal-video/scss/modal-video.scss';
import VideocamIcon from "@material-ui/icons/Videocam";
import { CSVLink, CSVDownload } from "react-csv";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Formik, Field, Form } from "formik";
import { Close, Search } from "@material-ui/icons";
// import "./UserManagement.css";
import "react-datepicker/dist/react-datepicker.css";
import RSelect from "react-select";
import "./ViewNotification.css";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { YearPicker, MonthPicker, DayPicker } from "react-dropdown-date";

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
  Marginbutton: {
    margin: "0.5rem",
  },
  container: {
    // maxHeight: "58vh",
  },
  paperPaddingRightLeft: {
    padding: "0rem 1rem",
  },
}));

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&:before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&:after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
}));

export default function ViewNotification(props) {
  const classes = useStyles();

  // const history=useHistory();
  const calref = useRef(null);
  const [showFilter, setShowFilter] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [calView, setCalView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [UserCategoryData, setUserCategoryData] = useState();
  const [expiryDateExtend, setExpiryDateExtend] = useState();
  const [ButtonColor, setButtonColor] = useState({
    User: true,
    Broadcast: false,
  });
  const [type, setType] = useState("User");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  // status switch
  // const [checked, setChecked] = useState(true);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getCategoriesContent(month, year);
  }, [type]);

  //get content
  const getCategoriesContent = async (month = "", year = "") => {
    if (type == "User") {
      try {
        const { data } = await axios.get(`/admin/getNotification?notificationType=USER&month=${month}&year=${year}`);
        console.log(data);
        setTableData(data.data);
        setSearchedData(data.data);
        setIsLoading(false);

        if (data.data.length === 0) {
          toast.error("No Data Found", { position: "top-right" });
        } else {
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const { data } = await axios.get(`/admin/getNotification?notificationType=BRODCAST&month=${month}&year=${year}`);
        console.log(data);
        setTableData(data.data);
        setSearchedData(data.data);
        setIsLoading(false);

        if (data.data.length === 0) {
          toast.error("No Data Found", { position: "top-right" });
        } else {
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  // edit user

  // For Search
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);

  const requestSearch = (searchedVal) => {
    console.log(searchedVal);

    const filteredRows = searchedData.filter((row) => {
      let name = row.first_name + " " + row.last_name;
      let email = row.email_id;
      return name.toLowerCase().includes(searchedVal.toLowerCase()) || email.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setTableData(filteredRows);
  };

  const sorting = () => {
    let sortedData = sortBy(tableData, [
      function (o) {
        return new Date(o.createdAt).getTime();
      },
    ]).reverse();
    return sortedData;
  };
  const DisplayIndividual = async (category) => {
    props.history.push({
      pathname: "/adminPanel/DisplayIndividual",
      state: [category.unique_id, type === "Broadcast" ? "BRODCAST" : "USER"],
    });
  };

  const getfilteredContent = () => {
    if (month === "" && year === "") {
      toast.info("Select Month & Year", { position: "top-right" });
    } else if (month === "" && year) {
      toast.info("Select Month ", { position: "top-right" });
    } else if (month && year === "") {
      toast.info("Select Year", { position: "top-right" });
    } else {
      // toast.success("Filtered Data", { position: "top-right" });
      getCategoriesContent(month, year);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper>
            <div className={classes.paperPaddingRightLeft}>
              <div className="">
                <Paper elevation={0} className={classNames(classes.paperHeading, classes.headingAlignment)}>
                  <div style={{ display: "flex", whiteSpace: "nowrap", alignItems: "center" }}>
                    <Button
                      variant="outlined"
                      aria-label="add"
                      className={classes.iconMargin}
                      onClick={() => {
                        // props.history.push({
                        //   pathname: "/adminPanel/Subscription_Management",
                        //   // state: state.userType._id,
                        // });
                        props.history.goBack();
                      }}
                    >
                      <ArrowBackIcon />
                    </Button>
                    &emsp;
                    <h3 style={{}}>Notification History</h3>
                  </div>
                  {/* <div style={{ display: "flex", whiteSpace: "nowrap", alignItems: "center" }}>
                    <MonthPicker
                      defaultValue={"Select Month"}
                      // numeric // to get months as numbers
                      // short // default is full name
                      // caps // default is Titlecase
                      // endYearGiven // mandatory if end={} is given in YearPicker
                      // year={this.state.year} // mandatory
                      // required={true} // default is false
                      // disabled={true} // default is false
                      value={month} // mandatory
                      onChange={(month) => {
                        // mandatory
                        // this.setState({ month });

                        setMonth(month);
                        console.log(month);
                      }}
                      id={"month"}
                      name={"month"}
                      classes="monthYearContainer"
                      optionClasses={"option classes"}
                    />{" "}
                    &nbsp; &nbsp;
                    <YearPicker
                      defaultValue={"Select Year"}
                      start={2022} // default is 1900
                      // end={2020} // default is current year
                      reverse // default is ASCENDING
                      // required={true} // default is false
                      // disabled={true} // default is false
                      value={year} // mandatory
                      onChange={(year) => {
                        // mandatory
                        // this.setState({ year });
                        setYear(year);
                        console.log(year);
                      }}
                      id={"year"}
                      name={"year"}
                      classes="monthYearContainer"
                      optionClasses={"option classes"}
                    />
                    &nbsp; &nbsp;
                    <Button
                      variant="contained"
                      className="buttoncss"
                      style={{ backgroundColor: "#0e3f37", color: "#fff" }}
                      onClick={() => {
                        getfilteredContent();
                      }}
                    >
                      Apply
                    </Button>
                    &nbsp; &nbsp;
                    <Button
                      variant="contained"
                      className="buttoncss"
                      style={{ backgroundColor: "#0e3f37", color: "#fff" }}
                      onClick={() => {
                        setMonth("");
                        setYear("");
                        getCategoriesContent();
                      }}
                    >
                      RESET
                    </Button>
                  </div> */}
                  <div>
                    <div style={{ position: "relative" }}>
                      <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Filter</span>} arrow>
                        <IconButton
                          className=""
                          style={{ backgroundColor: "#0E3F37", color: "#fff", marginLeft: "5px" }}
                          onClick={() => {
                            setShowFilter(!showFilter);
                          }}
                        >
                          <BsFilter />
                        </IconButton>
                      </Tooltip>
                      {showFilter ? (
                        <div
                          className="box arrow-top"
                          style={{
                            display: "flex",
                            position: "absolute",
                            backgroundColor: "whitesmoke",
                            zIndex: 5,
                            borderRadius: "10px",
                            marginLeft: "-110px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "5px",
                              backgroundColor: "white",
                              borderRadius: "5px",
                              padding: "5px",
                              margin: "20px",
                              // width: "250px",
                            }}
                          >
                            <MonthPicker
                              defaultValue={"Select Month"}
                              // numeric // to get months as numbers
                              // short // default is full name
                              // caps // default is Titlecase
                              // endYearGiven // mandatory if end={} is given in YearPicker
                              // year={this.state.year} // mandatory
                              // required={true} // default is false
                              // disabled={true} // default is false
                              value={month} // mandatory
                              onChange={(month) => {
                                // mandatory
                                // this.setState({ month });

                                setMonth(month);
                                console.log(month);
                              }}
                              id={"month"}
                              name={"month"}
                              classes="monthYearContainer"
                              optionClasses={"option classes"}
                            />{" "}
                            &nbsp; &nbsp;
                            <YearPicker
                              defaultValue={"Select Year"}
                              start={2022} // default is 1900
                              // end={2020} // default is current year
                              reverse // default is ASCENDING
                              // required={true} // default is false
                              // disabled={true} // default is false
                              value={year} // mandatory
                              onChange={(year) => {
                                // mandatory
                                // this.setState({ year });
                                setYear(year);
                                console.log(year);
                              }}
                              id={"year"}
                              name={"year"}
                              classes="monthYearContainer"
                              optionClasses={"option classes"}
                            />
                            {/* <div style={{ display: "flex", gap: "5px", marginTop: "10px" }}>
                              <Button
                                variant="contained"
                                className=""
                                style={{ backgroundColor: "#0e3f37", color: "#fff" }}
                                onClick={() => {
                                  if (startDate === null && endDate === null) {
                                    toast.info("Please Select Both Dates To Get Filtered Data", {
                                      position: toast.POSITION.TOP_RIGHT,
                                    });
                                  } else if (startDate === null || endDate === null) {
                                    toast.info("Please Select Both Dates To Get Filtered Data", {
                                      position: toast.POSITION.TOP_RIGHT,
                                    });
                                  } else if (startDate !== null && endDate !== null) {
                                    setShowFilter(false);
                                    getFilteredData();
                                  }
                                }}
                              >
                                {" "}
                                Apply
                              </Button>
                              <Button
                                variant="contained"
                                className=" "
                                style={{ backgroundColor: "#0e3f37", color: "#fff" }}
                                onClick={() => {
                                  setStartDate(null);
                                  setEndDate(null);
                                  getCategoriesContent();
                                }}
                              >
                                {" "}
                                RESET
                              </Button>
                            </div> */}
                            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "15px" }}>
                              <span
                                style={{
                                  backgroundColor: "#0e3f37",
                                  color: "#fff",
                                  cursor: "pointer",
                                  borderRadius: "5px",
                                  padding: "5px 10px",
                                }}
                                onClick={() => {
                                  if (month === "" && year === "") {
                                    toast.info("Select Month & Year", { position: "top-right" });
                                  } else if (month === "" && year) {
                                    toast.info("Select Month ", { position: "top-right" });
                                  } else if (month && year === "") {
                                    toast.info("Select Year", { position: "top-right" });
                                  } else {
                                    // toast.success("Filtered Data", { position: "top-right" });
                                    setShowFilter(false);
                                    getCategoriesContent(month, year);
                                  }
                                }}
                              >
                                {" "}
                                Apply
                              </span>
                              <span
                                style={{
                                  backgroundColor: "#0e3f37",
                                  color: "#fff",
                                  cursor: "pointer",
                                  borderRadius: "5px",
                                  padding: "5px 10px",
                                }}
                                onClick={() => {
                                  setMonth("");
                                  setYear("");
                                  getCategoriesContent();
                                }}
                              >
                                {" "}
                                Reset
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        false
                      )}
                    </div>
                  </div>

                  {/* <Button
                    variant="contained"
                    className="buttoncss"
                    style={{ backgroundColor: "#0E3F37", color: "#fff" }}
                  > */}
                  {/* </Button> */}
                </Paper>

                <Paper elevation={0}>
                  <div style={{ display: "flex", margin: "20px 50px" }}>
                    <h5
                      className="payHeading"
                      style={{
                        flex: 1,
                        textAlign: "center",
                        // borderRight: "1px solid black",
                        padding: "20px",
                        // borderBottomLeftRadius: "15px",
                        // borderBottomRightRadius: "15px",
                        borderRadius: "5px 0px 0px 5px",
                        backgroundColor: ButtonColor.User ? "#0e3f37" : "#c4c4c4",
                        // backgroundColor: ButtonColor.donation ? "#0e3f37" : "#c4c4c4",
                        color: "#fff",
                      }}
                      onClick={() => {
                        setButtonColor({ ...ButtonColor, User: true, Broadcast: false });
                        setType("User");
                      }}
                    >
                      User
                    </h5>
                    <h5
                      className="payHeading"
                      style={{
                        flex: 1,
                        textAlign: "center",
                        padding: "20px",
                        // borderBottomLeftRadius: "15px",
                        // borderBottomRightRadius: "15px",
                        borderRadius: "0px 5px 5px 0px",
                        backgroundColor: ButtonColor.Broadcast ? "#0e3f37" : "#c4c4c4",
                        // backgroundColor: ButtonColor.subscription ? "#0e3f37" : "#c4c4c4",
                        // color: "#fff",
                        color: "#fff",
                      }}
                      onClick={() => {
                        setButtonColor({ ...ButtonColor, User: false, Broadcast: true });
                        setType("Broadcast");
                      }}
                    >
                      Broadcast
                    </h5>
                  </div>
                </Paper>

                {/* //new design */}

                {/* <br /> */}

                {/* status end */}

                <Paper>
                  <div className="tablePadding">
                    <TableContainer className={classes.container}>
                      <Table className={classes.table} stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Sr. No.</TableCell>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Date & Time </TableCell>
                            {/* <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Time</TableCell> */}
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Title</TableCell>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Description</TableCell>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Device Type</TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {/* {isLoading?<TableRow ><Skeleton style={{width:"70vw",borderRadius:"20px"}} highlightColor="#fff" height="1rem" count={2} baseColor="#ebebeb"/></TableRow>:false} */}
                          {sorting()
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((category, index) => (
                              <TableRow hover key={index}>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  className={classes.textMiddle}
                                  style={{ textAlign: "center" }}
                                >
                                  {index + 1 + page * rowsPerPage}
                                </TableCell>

                                <TableCell style={{ textAlign: "center" }}>
                                  {
                                    // category.createdAt
                                    // ? new Date(category.createdAt)
                                    //     // .toUTCString()
                                    //     .getUTCDate() +
                                    //   "/" +
                                    //   (new Date(category.createdAt)
                                    //     // .toUTCString()
                                    //     .getUTCMonth() +
                                    //     1) +
                                    //   "/" +
                                    //   new Date(category.createdAt)
                                    //     // .toUTCString()
                                    //     .getUTCFullYear()
                                    // : // moment.utc(category.createdAt).format("L")
                                    //   "N/A"
                                  }
                                  {moment(category.createdAt).format("MMM Do, YYYY") +
                                    " " +
                                    // </TableCell>
                                    // <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>

                                    // moment(category?.createdAt, "HH:mm")
                                    moment(category?.createdAt)
                                      // .add(new Date().getTimezoneOffset(), "minute")
                                      // .utc()
                                      // .local()

                                      .format("hh:mm A")}
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  {get(category, "title", "N/A")}
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  {get(category, "body", "N/A")}
                                </TableCell>
                                <TableCell
                                  className={(classes.textMiddle, category?.send_to === "INDIVIDUAL" ? "" : "")}
                                  style={{
                                    textAlign: "center",
                                    cursor: category?.send_to === "INDIVIDUAL" ? "pointer" : "",
                                    color: category?.send_to === "INDIVIDUAL" ? "#fff" : "",
                                  }}
                                  onClick={() => {
                                    if (category?.send_to === "INDIVIDUAL") {
                                      DisplayIndividual(category);
                                    }
                                  }}
                                >
                                  {category?.send_to ? (
                                    category.send_to.charAt(0).toUpperCase() + category.send_to.slice(1).toLowerCase() ===
                                    "Ios" ? (
                                      "iOS"
                                    ) : category.send_to.charAt(0).toUpperCase() + category.send_to.slice(1).toLowerCase() ===
                                      "Individual" ? (
                                      <>
                                        <Tooltip arrow title="Tap to see list of users">
                                          <Button
                                            variant="contained"
                                            className="hoverIndividual"
                                            style={{ backgroundColor: "#0e3f37", color: "#fff", textTransform: "capitalize" }}
                                          >
                                            Individual
                                          </Button>
                                        </Tooltip>
                                      </>
                                    ) : (
                                      category.send_to.charAt(0).toUpperCase() + category.send_to.slice(1).toLowerCase()
                                    )
                                  ) : (
                                    "N/A"
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                  <TablePagination
                    rowsPerPageOptions={[15, 25, 100]}
                    component="div"
                    count={tableData.length}
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
