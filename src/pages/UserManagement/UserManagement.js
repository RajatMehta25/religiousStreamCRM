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
import "./UserManagement.css";
import "react-datepicker/dist/react-datepicker.css";
import RSelect from "react-select";
import NoDataFound from "../../components/NoDataFound";
import { TiExport } from "react-icons/ti";
import { BsFilter } from "react-icons/bs";
import {Modal} from "../../components/Modal"
import { AiOutlineClose } from "react-icons/ai";

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
    color: "#fff",
    backgroundColor: "#696969",
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

export default function UserManagement(props) {
  const classes = useStyles();

  // const history=useHistory();
  const exportRef = useRef(null);
  const calref = useRef(null);
  const [tableData, setTableData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [calView, setCalView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [UserCategoryData, setUserCategoryData] = useState();
  const [expiryDateExtend, setExpiryDateExtend] = useState();
  const [loader, setLoader] = useState(true);
  const [gender, setGender] = useState("");
  const [planStatus, setPlanStatus] = useState("");
  const [genderValue, setGenderValue] = useState({ label: "Select", value: "" });
  const [planStatusValue, setPlanStatusValue] = useState({ label: "Select", value: "" });
  const [showFilter, setShowFilter] = useState(false);
  // status switch
  // const [checked, setChecked] = useState(true);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const GenderOptions = [
    { label: "All", value: "" },
    { label: "Male", value: "MALE" },
    { label: "Female", value: "FEMALE" },
    { label: "Other", value: "OTHER" },
  ];
  const PlanOptions = [
    { label: "All", value: "" },
    { label: "Active", value: "ACTIVE" },
    { label: "Inactive", value: "INACTIVE" },
  ];

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  useEffect(() => {
    getCategoriesContent();
  }, []);

  //get content
  const getCategoriesContent = async (startDateValue = "", endDateValue = "", planStatus = "", gender = "") => {
    setLoader(true);
    try {
      const { data } = await axios.get(
        startDateValue !== "" && endDateValue !== ""
          ? `/admin/getUsers?dateObject={ "from" : "${startDateValue}" , "to" : "${endDateValue}" }&plan_type=${planStatus}&gender=${gender}`
          : `/admin/getUsers?plan_type=${planStatus}&gender=${gender}`
      );

      console.log(data);
      setTableData(data.data);
      setSearchedData(data.data);
      setIsLoading(false);
      setLoader(false);
      setPage(0);
      if (data.data.length === 0) {
        toast.error("No Data Found", { position: "top-right" });
      } else {
      }
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  // edit user

  const EditUser = (category) => {
    props.history.push({
      pathname: "/adminPanel/AddEditUser",
      state: category,
    });
  };

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

  const cancelSearch = () => {
    getCategoriesContent("", "", "", "");
  };

  const sorting = () => {
    let sortedData = sortBy(tableData, [
      function (o) {
        return new Date(o.createdAt).getTime();
      },
    ]).reverse();
    return sortedData;
  };

  const BlockUser = async (id) => {
    if (window.confirm("Are you sure you want to block this user?")) {
      try {
        const { data } = await axios.post(`/admin/blockUser`, {
          _id: id,
          is_blocked: true,
        });
        console.log(data);
        getCategoriesContent();
        toast.success("User Blocked", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
    }
  };

  const UnblockUser = async (id) => {
    if (window.confirm("Are you sure you want to unblock this user?")) {
      try {
        // console.log(category);
        const { data } = await axios.post(`/admin/blockUser`, {
          _id: id,
          is_blocked: false,
        });
        console.log(data);
        getCategoriesContent();
        toast.success("User Unblocked", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
    }
  };

  const DeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        // console.log(category);
        const { data } = await axios.post(`/admin/deleteUser`, {
          _id: id,
        });
        console.log(data);
        getCategoriesContent();
        toast.success("User Deleted", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
    }
  };

  // useEffect(() => {
  //   if (startDate === null && endDate === null) {
  //     getCategoriesContent("", "", planStatus, gender);
  //   } else if (startDate === null || endDate === null) {
  //     toast.info("Please Select Both Dates To Get Filtered Data", {
  //       position: toast.POSITION.TOP_RIGHT,
  //     });
  //     getCategoriesContent("", "", planStatus, gender);
  //   } else if (startDate !== null && endDate !== null) {
  //     getFilteredData();
  //     // getCategoriesContent("","",planStatus,gender)
  //   }
  // }, [startDate, endDate, planStatus, gender]);

  console.log(startDate);
  console.log(endDate);

  const getFilteredData = async () => {
    // console.log(startDate);
    // console.log(endDate);
    let newData = startDate && moment(startDate).format("YYYY/MM/DD");
    let newData1 = endDate && moment(endDate).format("YYYY/MM/DD");
    getCategoriesContent(newData || "", newData1 || "", planStatus, gender);
    // try {
    //   const { data } = await axios.get(`/admin/getUsers`, {
    //     params: {
    //       dateObject: {
    //         from: newData.getFullYear() + "/" + (newData.getMonth() + 1) + "/" + newData.getDate(),

    //         to: newData1.getFullYear() + "/" + (newData1.getMonth() + 1) + "/" + newData1.getDate(),
    //       },
    //     },
    //   });
    //   console.log(data);

    //   console.log(newData.getFullYear() + "/" + (newData.getMonth() + 1) + "/" + newData.getDate());
    //   console.log(newData.getFullYear() + "/" + (newData1.getMonth() + 1) + "/" + newData1.getDate());
    //   console.log(newData1.toLocaleDateString());
    //   if (data.data !== null && data.data.length > 0) {
    //     setTableData(data.data);
    //     setSearchedData(data.data);
    //     // toast.success("Filtered Data", {
    //     //   position: toast.POSITION.TOP_RIGHT,
    //     // });
    //   } else {
    //     setTableData([]);
    //     toast.error("No Data Found", {
    //       position: toast.POSITION.TOP_RIGHT,
    //     });
    //     setSearchedData([]);
    //   }
    // } catch (err) {
    //   console.log(err);
    // }
  };

  const csvData = tableData.map((item) => ({
    "Date of Joining": moment(item.createdAt).format("YYYY-MM-DD"),
    // new Date(item.createdAt).getDate() +
    // "/" +
    // new Date(item.createdAt).getMonth() +
    // "/" +
    // new Date(item.createdAt).getFullYear(),
    "User Id": item?.second_id,
    "User name": item?.first_name + " " + item?.last_name,

    "Email Id": !item?.email_id ? "N/A" : item?.email_id,
    "Mobile Number": item?.country_code + " " + item?.phone_number,
    "Selected Mosque": item?.mosque?.name ? item?.mosque?.name : "N/A",
    "Plan Name": item?.subscription_id?.plan_name ? item?.subscription_id?.plan_name : "N/A",
    "Plan Purchase Date": moment(item?.subscription_validity?.issueDate).format("YYYY-MM-DD"),
    "Plan Expiry Date": moment(item?.subscription_validity?.expiryDate).format("YYYY-MM-DD"),
    "No. of Days Left": item?.plan_days_left,
    "Plan Status": item?.plan_status,
  }));
  const headers = [
    { label: "Date of Joining", key: "Date of Joining" },
    { label: "User Id", key: "User Id" },
    { label: "User name", key: "User name" },
    { label: "Email Id", key: "Email Id" },
    { label: "Mobile Number", key: "Mobile Number" },
    { label: "Selected Mosque", key: "Selected Mosque" },
    { label: "Plan Name", key: "Plan Name" },
    { label: "Plan Purchase Date", key: "Plan Purchase Date" },
    { label: "Plan Expiry Date", key: "Plan Expiry Date" },
    { label: "No. of Days Left", key: "No. of Days Left" },
    { label: "Plan Status", key: "Plan Status" },
  ];

  const csvLink = {
    filename: "Users.csv",
    headers: headers,
    data: csvData,
  };
  console.log(csvData);
  const ExpiryDateCalculator = (category) => {
    let date1 = new Date(category?.subscription_validity?.expiryDate).getTime();
    let date2 = new Date(category?.subscription_validity?.issueDate).getTime();
    let diff = Math.round((date1 - date2) / (1000 * 60 * 60 * 24));
    return diff + 1;
  };

  const changeExpiryDate = (values) => {
    // setCalView(false)
    let newDate = moment(values.extendedDate).add(-new Date().getTimezoneOffset(), "minute").toISOString();
    console.log("new date", newDate);
    // console.log(expiryDateExtend);

    try {
      const { data } = axios.post(`/admin/updateTrial`, {
        user_id: UserCategoryData._id,
        expiryDate: newDate,
      });
      // toast.success(data.message, { position: "top-right" });
      setExpiryDateExtend("");
      setUserCategoryData("");
      setOpen(false);
      getCategoriesContent();
    } catch (error) {
      console.log(error);
    }

    // console.table(category);
    // console.table(date);
  };

  const validationSchemaDate = yup.object({
    extendedDate: yup.date().required("Date is Required!"),
  });
  // const Userfilter = (gender, planStatus) => {
  //   gender = String(gender).toLowerCase() !== "other" ? String(gender) : "";
  //   planStatus = String(planStatus).toLowerCase() !== "all" ? String(planStatus) : "";

  //   if (gender || planStatus) {
  //     let filteredData = searchedData.filter(
  //       (row) =>
  //         (gender ? String(row.gender).toLowerCase() == (gender).toLowerCase() : true) &&
  //         (planStatus ? String(row.plan_status).toLowerCase() == (planStatus).toLowerCase() : true)
  //     );
  //     filteredData.length === 0
  //       ? setTableData(filteredData) && toast.error("No Data Found", { position: "top-right" })
  //       : setTableData(filteredData);
  //   } else {
  //     getCategoriesContent();
  //   }
  // }
  // const filterPlanStatus = (filterValue) => {
  //   switch (filterValue) {
  //     case "Active":
  //       let filteredData = searchedData.filter((row) => row.plan_status == "Active");
  //       filteredData.length === 0
  //         ? setTableData(filteredData) && toast.error("No Data Found", { position: "top-right" })
  //         : setTableData(filteredData);
  //       // && toast.success("Filtered Data", { position: "top-right" })
  //       break;
  //     case "Inactive":
  //       let filteredData1 = searchedData.filter((row) => row.plan_status == "InActive");
  //       filteredData1.length === 0
  //         ? setTableData(filteredData1) && toast.error("No Data Found", { position: "top-right" })
  //         : setTableData(filteredData1);
  //       // && toast.success("Filtered Data", { position: "top-right" })
  //       break;
  //     case "All":
  //       getCategoriesContent();
  //       break;
  //     default:
  //       break;
  //   }
  // };
  // const filterGender = (filterValue) => {
  //   switch (filterValue) {
  //     case "MALE":
  //       let filteredData = searchedData.filter(
  //         (row) => row.gender == "MALE" || (row.gender == "Male") | (row.gender == "male")
  //       );
  //       filteredData.length === 0
  //         ? setTableData(filteredData) && toast.error("No Data Found", { position: "top-right" })
  //         : setTableData(filteredData);
  //       // && toast.success("Filtered Data", { position: "top-right" })
  //       break;
  //     case "FEMALE":
  //       let filteredData1 = searchedData.filter(
  //         (row) => row.gender == "FEMALE" || row.gender == "Female" || row.gender == "female"
  //       );
  //       filteredData1.length === 0
  //         ? setTableData(filteredData1) && toast.error("No Data Found", { position: "top-right" })
  //         : setTableData(filteredData1);
  //       // && toast.success("Filtered Data", { position: "top-right" })
  //       break;
  //     case "OTHER":
  //       let filteredData2 = searchedData.filter(
  //         (row) => row.gender == "OTHER" || row.gender == "Other" || row.gender == "other"
  //       );
  //       filteredData2.length === 0
  //         ? setTableData(filteredData2) && toast.error("No Data Found", { position: "top-right" })
  //         : setTableData(filteredData2);
  //       // && toast.success("Filtered Data", { position: "top-right" })
  //       break;
  //     case "All":
  //       getCategoriesContent();
  //       break;
  //     default:
  //       break;
  //   }
  // };
  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper>
            <div className={classes.paperPaddingRightLeft}>
              <div className="">
                <Paper elevation={0} className={classNames(classes.paperHeading, classes.headingAlignment)}>
                  <h3 style={{}}>Manage User</h3>
                  <SearchBar
                    // value={searched}
                    className="heightfix"
                    onChange={(searchVal) => requestSearch(searchVal)}
                    onCancelSearch={() => cancelSearch()}
                    placeholder="Search by User Name/Email"
                  />
                  {/* <Button
                    variant="contained"
                    className="buttoncss"
                    style={{ backgroundColor: "#0E3F37", color: "#fff" }}
                  > */}
                  <div style={{ display: "flex", gap: "10px" }}>
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
                            // width: "50%",
                            zIndex: 5,
                            borderRadius: "10px",
                            marginLeft: "-75px",
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
                              // width: "300px",
                            }}
                          >
                            <span>From:</span>
                            <DatePicker
                              value={startDate}
                              dateFormat="DD/MM/YYYY"
                              onChange={(date) => {
                                setStartDate(date);
                              }}
                            />
                            <span>To:</span>
                            <DatePicker
                              onChange={(date) => {
                                setEndDate(date);
                              }}
                              minDate={startDate}
                              value={endDate}
                              dateFormat="DD/MM/YYYY"
                            />
                            {/* planstatus start filter */}
                            <div className=" ">
                              <span>Filter by Plan Status:</span>
                              <div style={{ minWidth: "150px" }} className="customSelect">
                                <RSelect
                                  options={PlanOptions}
                                  value={planStatusValue}
                                  placeholder="Select"
                                  onChange={(e) => {
                                    // filterPlanStatus(e.value);
                                    setPlanStatus(e.value);
                                    setPlanStatusValue(e);
                                  }}
                                  isSearchable={false}
                                />
                              </div>
                            </div>
                            {/* planstatus end filter */}

                            {/* gender filter start */}
                            <div className="">
                              <span>Filter by Gender:</span>
                              <div style={{ minWidth: "150px" }} className="customSelect">
                                <RSelect
                                  options={GenderOptions}
                                  value={genderValue}
                                  placeholder="Select"
                                  onChange={(e) => {
                                    // filterGender(e.value);
                                    setGender(e.value);
                                    setGenderValue(e);
                                  }}
                                  isSearchable={false}
                                />
                              </div>
                            </div>
                            {/* gender filter end */}

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
                                  if (!startDate && !endDate && !gender && !planStatus) {
                                    toast.info("Please Select Atleast One Value To Get Filtered Data", {
                                      position: toast.POSITION.TOP_RIGHT,
                                    });
                                    return;
                                  }

                                  if ((startDate && !endDate) || (!startDate && endDate)) {
                                    toast.info("Please Select Both Dates", {
                                      position: toast.POSITION.TOP_RIGHT,
                                    });
                                    return;
                                  }

                                  setShowFilter(false);
                                  getFilteredData();

                                  // if (startDate && endDate) {
                                  //   setShowFilter(false);
                                  //   getFilteredData();
                                  // } else if (startDate !== null && endDate !== null) {
                                  //   setShowFilter(false);
                                  //   getFilteredData();
                                  // } else if (startDate === null || endDate === null) {
                                  //   toast.info("Please Select Both Dates ", {
                                  //     position: toast.POSITION.TOP_RIGHT,
                                  //   });
                                  // } else if (planStatus !== "" && gender !== "") {
                                  //   setShowFilter(false);
                                  //   getFilteredData();
                                  // } else if (planStatus !== "") {
                                  //   setShowFilter(false);
                                  //   getFilteredData();
                                  // } else if (gender !== "") {
                                  //   setShowFilter(false);
                                  //   getFilteredData();
                                  // }
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
                                  setStartDate(null);
                                  setEndDate(null);
                                  setPlanStatus("");
                                  setGender("");
                                  setPlanStatusValue({ label: "Select", value: "" });
                                  setGenderValue({ label: "Select", value: "" });
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
                    <CSVLink
                      ref={exportRef}
                      style={{
                        backgroundColor: "#0E3F37",
                        color: "#fff",
                        padding: "10px",
                        textTransform: "uppercase",
                        borderRadius: "5px",
                        fontSize: "13px",
                      }}
                      {...csvLink}
                      className="buttoncss"
                      hidden
                    >
                      Export User Data
                    </CSVLink>
                    {/* </Button> */}
                    <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Export User Data</span>} arrow>
                      <IconButton
                        className=""
                        style={{ backgroundColor: "#0E3F37", color: "#fff" }}
                        onClick={() => {
                          exportRef.current.link.click();
                          // props.history.push({
                          //   pathname: "/adminPanel/AddEditBroadcast",
                          // });
                        }}
                      >
                        <TiExport />
                      </IconButton>
                    </Tooltip>
                  </div>
                </Paper>
                {/* <Paper
                  elevation={0}
                  className="my-3 "
                  style={{ display: "flex", justifyContent: "space-between", gap: "0.5rem", flexWrap: "wrap" }}
                >
                  <style>
                    {`
                        .react-date-picker__calendar{
                          z-index: 3 !important;
                        }
                      `}
                  </style>
                  <div className="d-flex align-items-baseline">
                    <h5>From:</h5> &nbsp;
                    <DatePicker
                      value={startDate}
                      dateFormat="DD/MM/YYYY"
                      onChange={(date) => {
                        setStartDate(date);
                      }}
                    />
                    &emsp;<h5>To:&nbsp;</h5>
                    <DatePicker
                      onChange={(date) => {
                        setEndDate(date);
                      }}
                      minDate={startDate}
                      value={endDate}
                      dateFormat="DD/MM/YYYY"
                    />
                  </div>
                  <div className="d-flex align-items-center ">
                    <h5>Filter by Plan Status:</h5>&emsp;
                    <div style={{ minWidth: "150px" }} className="customSelect">
                      <RSelect
                        options={PlanOptions}
                        value={planStatusValue}
                        placeholder="Select"
                        onChange={(e) => {
                          // filterPlanStatus(e.value);
                          setPlanStatus(e.value);
                          setPlanStatusValue(e);
                        }}
                        isSearchable={false}
                      />
                    </div>
                  </div>
                  <div className="d-flex align-items-center  mx-3">
                    <h5>Filter by Gender:</h5>&emsp;
                    <div style={{ minWidth: "150px" }} className="customSelect">
                      <RSelect
                        options={GenderOptions}
                        value={genderValue}
                        placeholder="Select"
                        onChange={(e) => {
                          // filterGender(e.value);
                          setGender(e.value);
                          setGenderValue(e);
                        }}
                        isSearchable={false}
                      />
                    </div>
                  </div>
                  <Button
                    variant="contained"
                    className="buttoncss mx-3"
                    style={{ backgroundColor: "#0e3f37", color: "#fff" }}
                    onClick={() => {
                      setStartDate(null);
                      setEndDate(null);
                      setPlanStatus("");
                      setGender("");
                      setPlanStatusValue({ label: "Select", value: "" });
                      setGenderValue({ label: "Select", value: "" });
                    }}
                  >
                    {" "}
                    RESET
                  </Button>
                </Paper> */}

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
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Date of Joining</TableCell>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> User ID</TableCell>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> User Name</TableCell>

                            {/* <TableCell
                            style={{ textAlign: "center", fontWeight: "bold" }}
                          >
                            Profile Image
                          </TableCell> */}
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Email Id</TableCell>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Mobile Number</TableCell>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Gender</TableCell>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Selected Mosque</TableCell>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Plan Name</TableCell>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Plan Purchase Date</TableCell>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Plan Expiry Date</TableCell>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>No. of Days Left</TableCell>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Plan Status</TableCell>

                            {/* <TableCell style={{textAlign:"center",fontWeight:"bold"}} >Doc</TableCell> */}
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Actions</TableCell>
                            {/* <TableCell>User Type</TableCell>
                              <TableCell>Status</TableCell> */}
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

                                <TableCell style={{ textAlign: "center", whiteSpace: "nowrap" }}>
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
                                  {moment(category.createdAt).format("MMM DD, YYYY")}
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  {get(category, "second_id", "N/A")}
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  {category?.first_name
                                    ? category.first_name.charAt(0).toUpperCase() + category.first_name.slice(1)
                                    : "N/A"}
                                  &nbsp;
                                  {category?.last_name
                                    ? category.last_name.charAt(0).toUpperCase() + category.last_name.slice(1)
                                    : "N/A"}
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  {get(category, "email_id", "N/A")}
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  {category?.phone_number ? category?.country_code + category.phone_number : "N/A"}
                                </TableCell>
                                <TableCell
                                  className={classes.textMiddle}
                                  style={{ textAlign: "center", whiteSpace: "nowrap", textTransform: "capitalize" }}
                                >
                                  {get(category, "gender", "N/A").toLowerCase()}
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                  {get(category, "mosque.name", "N/A")}
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                  {get(category, "subscription_id.plan_name", "N/A")}
                                </TableCell>

                                <TableCell className={classes.textMiddle} style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                  {/* {get(category, "subscription_validity.issueDate", "N/A")} */}
                                  {
                                    // category?.subscription_validity?.issueDate
                                    // ? new Date(category?.subscription_validity?.issueDate)
                                    //     // .toUTCString()
                                    //     .getUTCDate() +
                                    //   "/" +
                                    //   (new Date(category?.subscription_validity?.issueDate)
                                    //     // .toUTCString()
                                    //     .getUTCMonth() +
                                    //     1) +
                                    //   "/" +
                                    //   new Date(category?.subscription_validity?.issueDate)
                                    //     // .toUTCString()
                                    //     .getUTCFullYear()
                                    // : // moment.utc(category.createdAt).format("L")
                                    //   "N/A"
                                  }
                                  {moment(category?.subscription_validity?.issueDate).utc().format("MMM DD, YYYY")}
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                  {/* {get(category, "subscription_validity.expiryDate", "N/A")} */}
                                  {
                                    // category?.subscription_validity?.expiryDate
                                    // ? new Date(category?.subscription_validity?.expiryDate)
                                    //     // .toUTCString()
                                    //     .getUTCDate() +
                                    //   "/" +
                                    //   (new Date(category?.subscription_validity?.expiryDate)
                                    //     // .toUTCString()
                                    //     .getUTCMonth() +
                                    //     1) +
                                    //   "/" +
                                    //   new Date(category?.subscription_validity?.expiryDate)
                                    //     // .toUTCString()
                                    //     .getUTCFullYear()
                                    // : // moment.utc(category.createdAt).format("L")
                                    //   "N/A"
                                  }
                                  {moment(category?.subscription_validity?.expiryDate)
                                    .utc()
                                    // .add(-new Date().getTimezoneOffset(), "minute")
                                    // .toISOString()
                                    .format("MMM DD, YYYY")}
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                  {/* {get(category, "3", "N/A")} */}
                                  {/* ExpiryDateCalculator(category) */}
                                  {get(category, "plan_days_left", "N/A") + " "}
                                 {
                                 category?.is_plan_purchased_first_time==false?
                                  <Tooltip title="Extend Trial Date" arrow>
                                    <span
                                      style={{
                                        color: "#fff",
                                        backgroundColor: "#0e3f37",
                                        padding: "0px 5px 0px 5px",
                                        margin: "0",
                                        cursor: "pointer",
                                        borderRadius: "5px",
                                        marginLeft: "5px",
                                      }}
                                      onClick={() => {
                                        setUserCategoryData(category);

                                        // calref.current.select();
                                        setOpen(true);
                                      }}
                                    >
                                      +
                                    </span>
                                  </Tooltip>
                                  :false
                                  }
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  {get(category, "plan_status", "N/A") == "Active" ? (
                                    <span
                                      style={{
                                        backgroundColor: "mediumseagreen",
                                        color: "white",
                                        padding: "7px 20px",
                                        borderRadius: "100px",
                                        boxShadow: "0 0.5em 1.5em -0.5em #14a73e98",
                                      }}
                                    >
                                      Active
                                    </span>
                                  ) : (
                                    <span
                                      style={{
                                        backgroundColor: "red",
                                        color: "white",
                                        padding: "7px 20px",
                                        borderRadius: "100px",
                                        boxShadow: "0 0.5em 1.5em -0.5em #EE4B2B",
                                      }}
                                    >
                                      Inactive
                                    </span>
                                  )}
                                </TableCell>
                                {/* <TableCell style={{textAlign:"center"}}>{category.doc?<img src={category.doc} alt="doc" style={{width:"50px",height:"50px"}}/>:"No Doc"}</TableCell> */}
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                  {/* <Button
                                  onClick={() => EditUser(category)}
                                  className=""
                                  style={{
                                    border: "1.5px solid #c4c4c4",
                                    margin: "0.5rem",
                                    color: "#2765B3",
                                  }}
                                >
                                  <Tooltip title="Edit User" arrow>
                                    <EditIcon />
                                  </Tooltip>
                                </Button> */}
                                  {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}
                                  {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}
                                  {/* <Button
                                  className=""
                                  onClick={() => (category.is_blocked ? UnblockUser(category._id) : BlockUser(category._id))}
                                  style={{
                                    // border: "1.5px solid #c4c4c4",
                                    margin: "0.5rem",
                                    color: category.is_blocked ? "red" : "#696969",
                                  }}
                                > */}
                                  <Tooltip title="Block/Unblock User" arrow>
                                    <BlockIcon
                                      onClick={() =>
                                        category.is_blocked ? UnblockUser(category._id) : BlockUser(category._id)
                                      }
                                      style={{
                                        // border: "1.5px solid #c4c4c4",
                                        margin: "0.5rem",
                                        color: category.is_blocked ? "red" : "#696969",
                                        cursor: "pointer",
                                      }}
                                    />
                                  </Tooltip>{" "}
                                  {/* </Button> */}
                                  {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}
                                  {/* <Button
                                  className=""
                                  onClick={() => DeleteUser(category._id)}
                                  style={{
                                    // border: "1.5px solid #c4c4c4",
                                    margin: "0.5rem",
                                    color: "#696969",
                                  }}
                                > */}
                                  <Tooltip title="Delete User" arrow>
                                    <DeleteOutline
                                      onClick={() => DeleteUser(category._id)}
                                      style={{
                                        // border: "1.5px solid #c4c4c4",
                                        margin: "0.5rem",
                                        color: "#696969",
                                        cursor: "pointer",
                                      }}
                                    />
                                  </Tooltip>
                                  {/* </Button> */}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                  {tableData.length === 0 ? (
                    <NoDataFound TextToDisplay="No Data Found." fontSize="24px" Loading={loader} />
                  ) : (
                    false
                  )}
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
        <Dialog
          // open={open}
          // onClose={handleClose}
          // fullScreen

          fullWidth={true}
        >
          <DialogTitle style={{ display: "flex", justifyContent: "center" }}>{/* <h4 className=""></h4> */}</DialogTitle>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {/* <img
              src={imageUrl}
              alt="..."
              style={{ width: "50px", height: "50px" }}
            /> */}
          </div>
          <Close
            onClick={() => {
              setOpen(false);
              setExpiryDateExtend("");
              setUserCategoryData("");
            }}
            style={{
              position: "absolute",
              right: "5",
              top: "5",
              cursor: "pointer",
              color: "white",
              backgroundColor: "red",
              borderRadius: "50%",
            }}
          />
          <DialogContent>
            {/* <DialogContentText > */}

            <div style={{ height: "max-content" }}>
              <Formik
                validationSchema={validationSchemaDate}
                initialValues={{
                  extendedDate: "",
                }}
                onSubmit={(values) => {
                  changeExpiryDate(values);
                }}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <br />
                    <div className="container ml-4 my-5">
                      <div className="row">
                        <div className="col-4">
                          <label className="" style={{}}>
                            Extend Trial Date : &nbsp;
                          </label>
                        </div>
                        <div className="col-4">
                          <DatePickerNew
                            // ref={calref}
                            placeholderText="Select date"
                            selected={expiryDateExtend}
                            dateFormat="dd-MM-yyyy"
                            onChange={(date) => {
                              // let newDate = new Date(date);
                              // changeExpiryDate(category, date);
                              console.log(date);
                              setFieldValue("extendedDate", date);
                              setExpiryDateExtend(date);
                            }}
                            // withPortal={true}
                            // popperClassName="heightControl"
                            // withPortal
                            minDate={!UserCategoryData ? "" : new Date(UserCategoryData?.subscription_validity?.expiryDate)}
                            // className="d-none"
                          />
                          <KErrorMessage name="extendedDate" />
                        </div>
                      </div>
                      <br />
                      <br />
                      <div className="row">
                        <div className="col-4">
                          <label className="" style={{}}>
                            &nbsp;
                          </label>
                        </div>
                        <div className="col-4">
                          <Button
                            type="submit"
                            variant="contained"
                            className="buttoncss"
                            style={{ backgroundColor: "#0e3f37", color: "#fff" }}
                          >
                            Update
                          </Button>
                        </div>
                      </div>
                      {/* <div className="text-center">
                        <Button
                          type="submit"
                          variant="contained"
                          className="buttoncss"
                          style={{ backgroundColor: "#0e3f37", color: "#fff" }}
                        >
                          Update
                        </Button>
                      </div> */}
                      <br />
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            {/* </DialogContentText> */}
          </DialogContent>
        </Dialog>
        <Modal
        maxWidth="lg"
        width="440px"
        isOpen={open}
        RoundedCorners={true}
        // image={true}
        // transparent={true}
        // setOpenModalImageZoom={setOpenModalImageZoom}
        // isSure={true}
        // noPadding={true}
        onClose={(event, reason) => {
          if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
            console.log(reason);
            setOpen(true);
          } else {
            setOpen(false);
            setExpiryDateExtend("");
            setUserCategoryData("");
            // setSelectedPetCategoryData(null);
          }
          // setModalState({
          //   isAddEditTaxiSingle: false,
          // });
          // setSelectedTaxiDataAddEdit(null);
        }}
        backgroundModal={false}
      
        backgroundModalContent={false}
        title={
          <div>
          <div
            className="my-3"
            style={{ textAlign: "center", fontWeight: "bold", fontSize: "22px", fontFamily: "'DM Sans', sans-serif" }}
          >
            Extend Trial Date
          </div>
          <div className="">
            <AiOutlineClose
              style={{
                fontSize: "1.5rem",
                position: "absolute",
                top: 16,
                right: 16,
                color: "#fff",
                borderRadius: "50%",
                backgroundColor: "red",
                cursor: "pointer",
              }}
              onClick={() => {
                setOpen(false);
                setExpiryDateExtend("");
                setUserCategoryData("");
                // setSelectedPetCategoryData(null);
              }}
            />
          </div>
        </div>
        }
        content={
          <>
        <Formik
                validationSchema={validationSchemaDate}
                initialValues={{
                  extendedDate: "",
                }}
                onSubmit={(values) => {
                  changeExpiryDate(values);
                }}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    
                    <div className="container  my-3">
                      <div className="" style={{display:"flex",justifyContent:"center"}}>
                        {/* <div className="col-6">
                          <label className="" style={{}}>
                            Extend Trial Date : &nbsp;
                          </label>
                        </div> */}
                        <div className="DatepickerBox" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                          <DatePickerNew
                            // ref={calref}
                            placeholderText="Select date"
                            selected={expiryDateExtend}
                            dateFormat="dd-MM-yyyy"
                            onChange={(date) => {
                              // let newDate = new Date(date);
                              // changeExpiryDate(category, date);
                              console.log(date);
                              setFieldValue("extendedDate", date);
                              setExpiryDateExtend(date);
                            }}
                            // withPortal={true}
                            // popperClassName="heightControl"
                            // withPortal
                            minDate={!UserCategoryData ? "" : new Date(UserCategoryData?.subscription_validity?.expiryDate)}
                            // className="d-none"
                          />
                          <KErrorMessage name="extendedDate" />
                        </div>
                      </div>
                      <br />
                      <br />
                      <div className="row">
                      
                        <div className="col-12 text-center">
                          <Button
                            type="submit"
                            variant="contained"
                            className="buttoncss"
                            style={{ backgroundColor: "#0e3f37", color: "#fff" }}
                          >
                            Update
                          </Button>
                        </div>
                      </div>
                      {/* <div className="text-center">
                        <Button
                          type="submit"
                          variant="contained"
                          className="buttoncss"
                          style={{ backgroundColor: "#0e3f37", color: "#fff" }}
                        >
                          Update
                        </Button>
                      </div> */}
                      <br />
                    </div>
                  </Form>
                )}
              </Formik>
          </>
        }
      />
      </div>
    </React.Fragment>
  );
}
