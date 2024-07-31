import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
// import Switch from '@mui/material/Switch';
// import { styled } from '@mui/material/styles';
// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'
import { BsFilter } from "react-icons/bs";
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

// import { Delete } from '@material-ui/icons';
import VisibilityIcon from "@material-ui/icons/Visibility";
import BlockIcon from "@material-ui/icons/Block";
// import ArrowBackIcon from "@material-ui/icons/ArrowBack";

// For Table
import SearchBar from "material-ui-search-bar";
import { get, sortBy } from "lodash";

//history
import { useHistory } from "react-router-dom";
// import AddEditCategory from "../AccountManagement/Account_Details";

// import './Category_Management.css' ;
import EditIcon from "@material-ui/icons/Edit";
import { DeleteOutline, WidgetsOutlined } from "@material-ui/icons";
import ModalVideo from "react-modal-video";
// import 'node_modules/react-modal-video/scss/modal-video.scss';
import VideocamIcon from "@material-ui/icons/Videocam";
import { CSVLink, CSVDownload } from "react-csv";
import moment from "moment";
import NoDataFound from "../../components/NoDataFound";
import { TiExport } from "react-icons/ti";
import AddIcon from "@material-ui/icons/Add";
import CroppedText from "../../components/CroppedText";
import "./Broadcast.css";

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
    // maxHeight: "59vh",
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

export default function Broadcast_Management(props) {
  const classes = useStyles();

  // const history=useHistory();
  const exportRef = useRef(null);
  const [showFilter, setShowFilter] = useState(false);
  const [locationText, setLocationText] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loader, setLoader] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setOpen] = useState(false);
  // status switch
  // const [checked, setChecked] = useState(true);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);

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
    getCategoriesContent();
  }, []);

  //get content
  const getCategoriesContent = async () => {
    setLoader(true);
    try {
      const { data } = await axios.get("/admin/getBrodcast");
      console.log(data);
      setTableData(data.data);
      setSearchedData(data.data);
      setIsLoading(false);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  // edit user

  const EditUser = (category) => {
    props.history.push({
      pathname: "/adminPanel/AddEditBroadcast",
      state: category,
    });
  };

  // useEffect(() => {
  //    window.localStorage.setItem('query',JSON.stringify([]))

  // }, [])

  // For Search
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);

  const requestSearch = (searchedVal) => {
    console.log(searchedVal);

    const filteredRows = searchedData.filter((row) => {
      let name = row.name;
      let email = row.email_id;
      return name.toLowerCase().includes(searchedVal.toLowerCase()) || email.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setTableData(filteredRows);
  };

  const cancelSearch = () => {
    getCategoriesContent();
    // setSearched("");
    //  console.log(searchedData);
    //  requestSearch()
  };

  const sorting = () => {
    //   if(sort){
    //  let tableSortedData= sortBy(tableData,
    //     [function(o) { console.log(o); return new Date(o.postId.createdAt).getTime(); }])
    //     console.log(tableSortedData);
    // setTableData(tableSortedData);
    //   }else {
    //  let tableSortedData= sortBy(tableData,
    //     [function(o) { console.log(o); return new Date(o.postId.createdAt).getTime(); }],
    //     { reverse: true })
    //     setTableData(tableSortedData);
    //   }
    let sortedData = sortBy(tableData, [
      function (o) {
        // console.log(o);
        return new Date(o.createdAt).getTime();
      },
    ]).reverse();
    return sortedData;
  };

  const BlockUser = async (category) => {
    if (window.confirm("Are you sure you want to block this broadcast?")) {
      try {
        console.log(category);
        const { data } = await axios.post(`/admin/updateBrodcast`, {
          _id: category._id,
          // image: category.image,
          // name: category.name,
          // email_Id: category.email_Id,
          // mobile_number: category.mobile_number,
          // location: category.location,
          // password: category.password,
          // calendar: category.calendar,
          is_blocked: true,
          // lat: category.lat,
          // long: category.long,
        });
        console.log(data);
        getCategoriesContent();
        toast.error("Broadcast Blocked", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      // toast.error("Operation Cancelled", {
      //   position: toast.POSITION.TOP_RIGHT,
      // });
    }
  };

  const UnblockUser = async (category) => {
    if (window.confirm("Are you sure you want to unblock this broadcast?")) {
      try {
        console.log(category);
        const { data } = await axios.post(`/admin/updateBrodcast`, {
          _id: category._id,
          //  image: category.image,
          //  name: category.name,
          //  email_Id: category.email_Id,
          //  mobile_number: category.mobile_number,
          //  location: category.location,
          //  password: category.password,
          //  calendar: category.calendar,
          is_blocked: false,
          //  lat: category.lat,
          //  long: category.long,
        });
        console.log(data);
        getCategoriesContent();
        toast.success("Broadcast Unblocked", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      // toast.error("Operation Cancelled", {
      //   position: toast.POSITION.TOP_RIGHT,
      // });
    }
  };

  const DeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this broadcast?")) {
      try {
        //  console.log(category);
        const { data } = await axios.post(`/admin/deleteBrodcast`, {
          _id: id,
        });
        console.log(data);
        getCategoriesContent();
        toast.success("Broadcast Deleted", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (error) {
        console.log(error);
      }
    } else {
      // toast.error("Operation Cancelled", {
      //   position: toast.POSITION.TOP_RIGHT,
      // });
    }
  };

  // const [inspectionFormData, setInspectionformData] = useState([]);
  // const getInspectionFormData = async (id) => {
  //   try {
  //     const response = await axios.get(`/admin/inspection/${id}`);
  //     console.log(response);
  //     // setInspectionformData(response.data.data);

  //     props.history.push({
  //       pathname: "/adminPanel/ViewInspectionForm",
  //       state: [response.data.data, id],
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   if (startDate === null && endDate === null) {
  //     getCategoriesContent();
  //   } else if (startDate === null || endDate === null) {
  //     toast.info("Please Select Both Dates To Get Filtered Data", {
  //       position: toast.POSITION.TOP_RIGHT,
  //     });
  //     getCategoriesContent();
  //   } else if (startDate !== null && endDate !== null) {
  //     getFilteredData();
  //   }
  // }, [startDate, endDate]);

  // useEffect(() => {
  //   if (state[0] === null) {
  //     toast.error("No Data Found", {
  //       position: toast.POSITION.TOP_RIGHT,
  //     });
  //   } else {
  //   }
  // }, []);

  const filterDates = (date1) => {
    // if(startDate!==null&&endDate!==null)
    // {date1.filter((item) => (
    //  (new window.Date(item.date) >= startDate && new window.Date(item.date)<= endDate)? item:alert("no data found")
    // console.log(item.date)
    // console.log(new window.Date(item.date))
    // ))}
    // else{
    // return date1
    // }
    if (date1 !== null && date1 !== undefined) {
      // return date1.filter((item) => (
      //   (new window.Date(item.date) >= startDate && new window.Date(item.date)<= endDate)? item:alert("no data found")
      // ))
      // console.log(date1);
      setTableData(date1);
    } else {
      toast.info("Please Select Dates", {
        position: toast.POSITION.TOP_RIGHT,
      });

      console.log(startDate);
      console.log(endDate);

      // console.log(state);
    }
  };
  const getFilteredData = async () => {
    let newData = new Date(startDate);
    let newData1 = new Date(endDate);

    try {
      const { data } = await axios.get(`/admin/getBrodcast`, {
        params: {
          dateObject: {
            from: newData.getFullYear() + "/" + (newData.getMonth() + 1) + "/" + newData.getDate(),

            to: newData1.getFullYear() + "/" + (newData1.getMonth() + 1) + "/" + newData1.getDate(),
          },
        },
      });
      console.log(data);

      console.log(newData.getFullYear() + "/" + (newData.getMonth() + 1) + "/" + newData.getDate());
      console.log(newData.getFullYear() + "/" + (newData1.getMonth() + 1) + "/" + newData1.getDate());
      console.log(newData1.toLocaleDateString());
      if (data.data !== null && data.data.length > 0) {
        setTableData(data.data);
        setSearchedData(data.data);
        // toast.success("Filtered Data", {
        //   position: toast.POSITION.TOP_RIGHT,
        // });
      } else {
        setTableData([]);
        toast.error("No Data Found", {
          position: toast.POSITION.TOP_RIGHT,
        });
        setSearchedData([]);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const ViewUser = async (category) => {
    props.history.push({
      pathname: "/adminPanel/ViewBroadcast",
      state: category,
    });
  };

  const csvData = tableData.map((item) => ({
    "Date of Joining": moment(item.createdAt).format("YYYY-MM-DD"),
    // new Date(item.createdAt).getDate() +
    // "/" +
    // new Date(item.createdAt).getMonth() +
    // "/" +
    // new Date(item.createdAt).getFullYear(),
    "Mosque Name": item.name,
    "Mobile Number": !get(item, "mobile_number", "")
      ? "N/A"
      : get(item, "country_code", "") + " " + get(item, "mobile_number", ""),

    "Email Id": item.email_id,
    Location: item.location,
    "Calendar Name": !get(item, "calendarObj.calendar_name", "") ? "N/A" : get(item, "calendarObj.calendar_name", ""),
    "Channel Name": item.channel_name,
    "Total Listeners": item.active_listener,
    Status: item.is_live ? "LIVE" : "NOT LIVE",
    "First Jamat": get(item, "jumma.start", "") === "Invalid date" ? "N/A" : get(item, "jumma.start", ""),
    "Second Jamat": get(item, "jumma.end", "") === "Invalid date" ? "N/A" : get(item, "jumma.end", ""),
  }));
  const headers = [
    { label: "Date of Joining", key: "Date of Joining" },
    { label: "Mosque Name", key: "Mosque Name" },
    { label: "Mobile Number", key: "Mobile Number" },
    { label: "Email Id", key: "Email Id" },
    { label: "Location", key: "Location" },
    { label: "Calendar Name", key: "Calendar Name" },
    { label: "Channel Name", key: "Channel Name" },
    { label: "Total Listeners", key: "Total Listeners" },
    { label: "Status", key: "Status" },
    { label: "First Jamat", key: "First Jamat" },
    { label: "Second Jamat", key: "Second Jamat" },
  ];

  const csvLink = {
    filename: "Broadcast.csv",
    headers: headers,
    data: csvData,
  };
  console.log(csvData);
  const ViewIslamicEvent = async (id) => {
    props.history.push({
      pathname: "/adminPanel/IslamicEvent",
      state: id,
    });
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper>
            <div className={classes.paperPaddingRightLeft}>
              <div className="">
                <Paper elevation={0} className={classNames(classes.paperHeading, classes.headingAlignment)}>
                  <h3 style={{}}>Manage Broadcast</h3>
                  <SearchBar
                    // value={searched}
                    className="heightfix"
                    onChange={(searchVal) => requestSearch(searchVal)}
                    onCancelSearch={() => cancelSearch()}
                    placeholder="Search by Mosque Name/Email"
                  />
                  {console.log(tableData)}
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
                            zIndex: 5,
                            borderRadius: "10px",
                            marginLeft: "-15px",
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
                    {/* <div className="d-flex align-items-baseline ">
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
                    <Button
                      variant="contained"
                      className="buttoncss mx-3"
                      style={{ backgroundColor: "#0e3f37", color: "#fff" }}
                      onClick={() => {
                        setStartDate(null);
                        setEndDate(null);
                      }}
                    >
                      {" "}
                      RESET
                    </Button>
                  </div> */}
                    {/* <Button
                    variant="contained"
                    className="buttoncss"
                    style={{ backgroundColor: "#0E3F37", color: "#fff" }}
                  > */}

                    <CSVLink
                      ref={exportRef}
                      style={{
                        backgroundColor: "#0E3F37",
                        color: "#fff",
                        padding: "10px",
                        textTransform: "uppercase",
                        borderRadius: "5px",
                        fontSize: "18px",
                        marginRight: "10px",
                      }}
                      {...csvLink}
                      className="buttoncss"
                      hidden
                    >
                      Export
                    </CSVLink>
                    <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Export Broadcast</span>} arrow>
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
                    {/* Export Broadcast Data */}

                    {/* </Button> */}
                    {/* <Button
                      variant="contained"
                      className="buttoncss"
                      style={{ backgroundColor: "#0E3F37", color: "#fff" }}
                      onClick={() => {
                        props.history.push({
                          pathname: "/adminPanel/AddEditBroadcast",
                        });
                      }}
                    >
                      {" "}
                      Create Broadcast
                    </Button> */}
                    <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Create Broadcast</span>} arrow>
                      <IconButton
                        className=""
                        style={{ backgroundColor: "#0E3F37", color: "#fff" }}
                        onClick={() => {
                          props.history.push({
                            pathname: "/adminPanel/AddEditBroadcast",
                          });
                        }}
                      >
                        <AddIcon />
                      </IconButton>
                    </Tooltip>
                  </div>
                </Paper>
                {/* <Paper elevation={0} className="my-3">
                  <style>
                    {" "}
                    {`
                        .react-date-picker__calendar{
                          z-index: 3 !important;
                        }
                      `}
                  </style>
                  <div className="d-flex align-items-baseline my-4">
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
                    <Button
                      variant="contained"
                      className="buttoncss mx-3"
                      style={{ backgroundColor: "#0e3f37", color: "#fff" }}
                      onClick={() => {
                        setStartDate(null);
                        setEndDate(null);
                      }}
                    >
                      {" "}
                      RESET
                    </Button>
                  </div>
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
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Image</TableCell>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Mosque Name</TableCell>
                            {/* <TableCell
                            style={{ textAlign: "center", fontWeight: "bold" }}
                          >
                            Profile Image
                          </TableCell> */}

                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Mobile Number</TableCell>

                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Email Id</TableCell>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Location</TableCell>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Calendar Name</TableCell>

                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Channel Name</TableCell>

                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Total Listeners</TableCell>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Broadcast Status</TableCell>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Islamic Event</TableCell>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Actions</TableCell>
                            {/* <TableCell style={{textAlign:"center",fontWeight:"bold"}} >Doc</TableCell> 
                          <TableCell
                            style={{ textAlign: "center", fontWeight: "bold" }}
                          >
                            Actions
                          </TableCell>
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
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                  {/* {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : "N/A"}
                                   */}
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
                                  {moment(category.createdAt).format("MMM Do, YYYY")}
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  {category.image && category.image !== "" ? (
                                    <img src={category.image} alt="profile" style={{ width: "35px", height: "35px" }} />
                                  ) : (
                                    // <img
                                    //   src={require("../../assets/images/logo/logo1.png")}
                                    //   alt="profile"
                                    //   style={{ width: "35px", height: "35px" }}
                                    // />
                                    "N/A"
                                  )}
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                  {category.name ? category.name.charAt(0).toUpperCase() + category.name.slice(1) : "N/A"}
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  {get(category, "mobile_number", "") !== ""
                                    ? get(category, "country_code", "") + get(category, "mobile_number", "")
                                    : "N/A"}
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  {get(category, "email_id", "")}
                                </TableCell>
                                <Tooltip title={locationText === category._id ? "Click to Hide" : "Click to View"} arrow>
                                  <TableCell
                                    onClick={() => setLocationText(locationText === category._id ? null : category._id)}
                                    style={{
                                      // textAlign: "center",
                                      whiteSpace: locationText === category._id ? "" : "nowrap",
                                      maxWidth: "150px",
                                      overflow: locationText === category._id ? "" : "hidden",
                                      textOverflow: locationText === category._id ? "" : "ellipsis",
                                      cursor: "pointer",
                                    }}
                                    className={classes.textMiddle}
                                  >
                                    {get(category, "location", "")}
                                    {/* <CroppedText text={`${get(category, "location", "N/A")}`} bool={locationText} /> */}
                                  </TableCell>
                                </Tooltip>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                  {!get(category, "calendarObj.calendar_name", "")
                                    ? "N/A"
                                    : get(category, "calendarObj.calendar_name", "")}
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                                  {get(category, "channel_name", "")}
                                </TableCell>

                                <TableCell style={{ textAlign: "center" }}>
                                  {" "}
                                  {get(category, "active_listener", "N/A")}
                                </TableCell>
                                <TableCell style={{ textAlign: "center" }}>
                                  {/* <Android12Switch onChange={(e)=>{statusSwitch(e,category._id)}} checked={category.status} />
                                   */}
                                  {category.is_live ? (
                                    <span
                                      style={{
                                        backgroundColor: "mediumseagreen",
                                        color: "white",
                                        padding: "7px 20px",
                                        borderRadius: "100px",
                                        boxShadow: "0 0.5em 1.5em -0.5em #14a73e98",
                                      }}
                                    >
                                      LIVE
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
                                      LIVE
                                    </span>
                                  )}
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  <Tooltip title="View" arrow>
                                    <VisibilityIcon
                                      onClick={() => ViewIslamicEvent(category._id)}
                                      style={{ cursor: "pointer", color: "#696969", margin: "0.5rem" }}
                                    />
                                  </Tooltip>
                                </TableCell>

                                {/* <TableCell style={{textAlign:"center"}}>{category.doc?<img src={category.doc} alt="doc" style={{width:"50px",height:"50px"}}/>:"No Doc"}</TableCell> */}
                                <TableCell
                                  className={classes.textMiddle}
                                  style={{ textAlign: "center", minWidth: "200px", whiteSpace: "nowrap" }}
                                >
                                  {/* <Button
                                  onClick={() => ViewUser(category)}
                                  className=""
                                  style={{
                                    margin: "0.5rem",
                                    color: "#696969",
                                  }}
                                > */}
                                  <Tooltip title="View" arrow>
                                    <VisibilityIcon
                                      onClick={() => ViewUser(category)}
                                      style={{ cursor: "pointer", color: "#696969", margin: "0.5rem" }}
                                    />
                                  </Tooltip>
                                  {/* </Button> */}
                                  {/* <Button
                                  onClick={() => EditUser(category)}
                                  className=""
                                  style={{
                                    // border: "1.5px solid #c4c4c4",
                                    margin: "0.5rem",

                                    color: "#696969",
                                  }}
                                > */}
                                  <Tooltip title="Edit" arrow>
                                    <EditIcon
                                      style={{ cursor: "pointer", color: "#0E3F37", margin: "0.5rem" }}
                                      onClick={() => EditUser(category)}
                                    />
                                  </Tooltip>
                                  {/* </Button> */}
                                  {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}
                                  {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}
                                  {/* <Button
                                  className=""
                                  onClick={() => (category.is_blocked ? UnblockUser(category) : BlockUser(category))}
                                  style={{
                                    // border: "1.5px solid #c4c4c4",
                                    margin: "0.5rem",

                                    color: category.is_blocked ? "red" : "#696969",
                                  }}
                                > */}
                                  <Tooltip title="Block/Unblock" arrow>
                                    <BlockIcon
                                      style={{
                                        cursor: "pointer",
                                        color: category.is_blocked ? "red" : "#696969",
                                        margin: "0.5rem",
                                      }}
                                      onClick={() => {
                                        category.is_blocked ? UnblockUser(category) : BlockUser(category);
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
                                  <Tooltip title="Delete" arrow>
                                    <DeleteOutline
                                      style={{ cursor: "pointer", color: "#696969", margin: "0.5rem" }}
                                      onClick={() => DeleteUser(category._id)}
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
      </div>
    </React.Fragment>
  );
}
