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
import Swal from "sweetalert2";
import { confirm } from "react-confirm-box";

// import { Delete } from '@material-ui/icons';
import VisibilityIcon from "@material-ui/icons/Visibility";
import BlockIcon from "@material-ui/icons/Block";
// import ArrowBackIcon from "@material-ui/icons/ArrowBack";

// For Table
import SearchBar from "material-ui-search-bar";
import { get, identity, sortBy } from "lodash";

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
import "./Payment_Management.css";
import NoDataFound from "../../components/NoDataFound";
import { TiExport } from "react-icons/ti";
import { BsFilter } from "react-icons/bs";

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

export default function Payment_Management(props) {
  const classes = useStyles();

  // const history=useHistory();
  const exportRef = useRef(null);
  const exportRef2 = useRef(null);
  const [showFilter, setShowFilter] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setOpen] = useState(false);
  // status switch
  // const [checked, setChecked] = useState(true);
  const [ButtonColor, setButtonColor] = useState({
    donation: true,
    subscription: false,
  });
  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const [type, setType] = useState("donation");
  const [loader, setLoader] = useState(true);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  useEffect(() => {
    getCategoriesContent(type);
  }, [type]);

  //get content
  const getCategoriesContent = async (type) => {
    setLoader(true);
    try {
      if (type === "donation") {
        const { data } = await axios.get("/common/donationListing");
        console.log(data);
        setTableData(data.data);
        setSearchedData(data.data);
        setIsLoading(false);
      } else if (type === "subscription") {
        const { data } = await axios.get("/admin/getSubscriptionlisting");
        console.log("this data", data);
        setTableData(data.data);
        setSearchedData(data.data);
        setIsLoading(false);
      }
      setLoader(false);
    } catch (err) {
      setLoader(false);
      console.log(err);
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
    if (type === "donation") {
      const filteredRows = searchedData.filter((row) => {
        let Uname = row?.user_id?.first_name + " " + row?.user_id?.last_name;
        let Bname = row?.brodcast_id?.name;
        return (
          Uname.toLowerCase().includes(searchedVal.toLowerCase()) || Bname.toLowerCase().includes(searchedVal.toLowerCase())
        );
      });
      setTableData(filteredRows);
    } else {
      const filteredRows = searchedData.filter((row) => {
        let Uname = row?.first_name + " " + row?.last_name;
        // let Bname = row?.brodcast_id?.name;
        return Uname.toLowerCase().includes(searchedVal.toLowerCase());
      });
      setTableData(filteredRows);
    }
  };

  const cancelSearch = () => {
    getCategoriesContent(type);
  };

  const sorting = () => {
    let sortedData = sortBy(tableData, [
      function (o) {
        // console.log(o);
        return new Date(o.createdAt).getTime();
      },
    ]).reverse();
    return sortedData;
  };

  // useEffect(() => {
  //   if (startDate === null && endDate === null) {
  //     getCategoriesContent(type);
  //   } else if (startDate === null || endDate === null) {
  //     toast.info("Please Select Both Dates To Get Filtered Data", {
  //       position: toast.POSITION.TOP_RIGHT,
  //     });
  //     getCategoriesContent(type);
  //   } else if (startDate !== null && endDate !== null) {
  //     getFilteredData();
  //   }
  // }, [startDate, endDate]);

  console.log(startDate);
  console.log(endDate);

  const getFilteredData = async () => {
    console.log(startDate);
    console.log(endDate);
    let newData = new Date(startDate);
    let newData1 = new Date(endDate);

    try {
      const { data } = await axios.get(`${type === "donation" ? "/common/donationListing" : "/admin/getSubscriptionlisting"}`, {
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
  console.log(type);

  const csvData = tableData.map((item) => ({
    Date: item?.createdAt
      ? new Date(item?.createdAt)
          // .toUTCString()
          .getUTCDate() +
        "/" +
        (new Date(item?.createdAt)
          // .toUTCString()
          .getUTCMonth() +
          1) +
        "/" +
        new Date(item?.createdAt)
          // .toUTCString()
          .getUTCFullYear()
      : "N/A",
    "User Name": item?.user_id?.first_name + " " + item?.user_id?.last_name,
    "Broadcast Name": item?.brodcast_id?.name,
    "User Id": item?.user_id?.second_id,
    "Broadcast Id": item?.brodcast_id?.second_id,
    "Transaction Id": item?.transaction_id,
    "Donation Price": item?.amount,
  }));

  const SubcriptionCsvData = tableData.map((item) => ({
    "User Name": item?.first_name + " " + item?.last_name,
    "User Id": item?.second_id,
    "Transaction Id": item?.transaction_id,
    "Plan Price": item?.subscription_id?.price,
    "Plan Name": item?.subscription_id?.plan_name,
    "Issue Date": item?.subscription_validity?.issueDate,
    "Expiry Date": item?.subscription_validity?.expiryDate,
  }));

  const headers = [
    { label: "Date", key: "Date" },
    { label: "User Name", key: "User Name" },

    { label: "Broadcast Name", key: "Broadcast Name" },
    { label: "User Id", key: "User Id" },
    { label: "Broadcast Id", key: "Broadcast Id" },
    { label: "Transaction Id", key: "Transaction Id" },
    { label: "Donation Price", key: "Donation Price" },
  ];
  const headersSubcription = [
    { label: "User Name", key: "User Name" },
    { label: "User Id", key: "User Id" },
    { label: "Transaction Id", key: "Transaction Id" },
    { label: "Plan Price", key: "Plan Price" },
    { label: "Plan Name", key: "Plan Name" },
    { label: "Issue Date", key: "Issue Date" },
    { label: "Expiry Date", key: "Expiry Date" },
  ];
  const csvLink = {
    filename: "Donation.csv",
    headers: headers,
    data: csvData,
  };
  const SubcriptionCsvLink = {
    filename: "Subscription.csv",
    headers: headersSubcription,
    data: SubcriptionCsvData,
  };
  console.log(csvData);

  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper>
            <div className={classes.paperPaddingRightLeft}>
              <div className="">
                <Paper elevation={0} className={classNames(classes.paperHeading, classes.headingAlignment)}>
                  <h3 style={{}}>Manage Payment</h3>
                  <SearchBar
                    // value={searched}
                    className="heightfix"
                    onChange={(searchVal) => requestSearch(searchVal)}
                    onCancelSearch={() => cancelSearch()}
                    placeholder={type === "donation" ? "Search by User/Broadcast Name" : "Search by User Name"}
                  />
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
                                  getCategoriesContent(type);
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
                    {type === "donation" ? (
                      <>
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
                          Export Donation Data
                        </CSVLink>
                        <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Export Donation data</span>} arrow>
                          <IconButton
                            className=""
                            style={{ backgroundColor: "#0E3F37", color: "#fff" }}
                            onClick={() => {
                              exportRef.current.link.click();
                            }}
                          >
                            <TiExport />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <CSVLink
                          ref={exportRef2}
                          style={{
                            backgroundColor: "#0E3F37",
                            color: "#fff",
                            padding: "10px",
                            textTransform: "uppercase",
                            borderRadius: "5px",
                            fontSize: "13px",
                          }}
                          {...SubcriptionCsvLink}
                          className="buttoncss"
                          hidden
                        >
                          Export Subscription Data
                        </CSVLink>
                        <Tooltip
                          title={<span style={{ color: "white", fontSize: "16px" }}>Export Subscription data</span>}
                          arrow
                        >
                          <IconButton
                            className=""
                            style={{ backgroundColor: "#0E3F37", color: "#fff" }}
                            onClick={() => {
                              exportRef2.current.link.click();
                            }}
                          >
                            <TiExport />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </div>
                </Paper>
                {/* <Paper elevation={0} className="my-3">
                  <style>
                    {`
                        .react-date-picker__calendar{
                          z-index: 3 !important;
                        }
                      `}
                  </style>
                  <div className="d-flex  align-items-baseline ">
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
                        backgroundColor: ButtonColor.donation ? "#0e3f37" : "#c4c4c4",
                        // backgroundColor: ButtonColor.donation ? "#0e3f37" : "#c4c4c4",
                        color: "#fff",
                      }}
                      onClick={() => {
                        setButtonColor({ ...ButtonColor, donation: true, subscription: false });
                        setType("donation");
                      }}
                    >
                      Donation
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
                        backgroundColor: ButtonColor.subscription ? "#0e3f37" : "#c4c4c4",
                        // backgroundColor: ButtonColor.subscription ? "#0e3f37" : "#c4c4c4",
                        // color: "#fff",
                        color: "#fff",
                      }}
                      onClick={() => {
                        setButtonColor({ ...ButtonColor, donation: false, subscription: true });
                        setType("subscription");
                      }}
                    >
                      Subscription
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
                            {type === "donation" ? (
                              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Date</TableCell>
                            ) : (
                              ""
                            )}
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> User Name</TableCell>
                            {/* <TableCell
                            style={{ textAlign: "center", fontWeight: "bold" }}
                          >
                            Profile Image
                          </TableCell> */}
                            {type === "subscription" ? (
                              ""
                            ) : (
                              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Broadcast Name</TableCell>
                            )}
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> User Id</TableCell>

                            {type === "subscription" ? (
                              ""
                            ) : (
                              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}> Broadcast Id</TableCell>
                            )}
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Transaction Id</TableCell>
                            {type === "subscription" ? (
                              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Plan Price(&#163;)</TableCell>
                            ) : (
                              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Donation Price(&#163;)</TableCell>
                            )}
                            {type === "subscription" ? (
                              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Plan Name(&#163;)</TableCell>
                            ) : (
                              ""
                            )}
                            {type === "subscription" ? (
                              <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                                Issue Date <br /> Expiry Date
                              </TableCell>
                            ) : (
                              ""
                            )}
                            {/* <TableCell style={{textAlign:"center",fontWeight:"bold"}} >Doc</TableCell> */}
                            {/* <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Action</TableCell> */}
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
                                {type === "donation" ? (
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
                                    {moment(category.createdAt).format("MMM Do, YYYY")}
                                  </TableCell>
                                ) : (
                                  ""
                                )}
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  {type === "donation"
                                    ? category?.user_id
                                      ? category.user_id.first_name.toUpperCase().slice(0, 0) +
                                        category.user_id.first_name +
                                        " " +
                                        category.user_id.last_name
                                      : "N/A"
                                    : category.first_name
                                    ? category.first_name.toUpperCase().slice(0, 0) +
                                      category.first_name +
                                      " " +
                                      category?.last_name
                                    : "N/A"}
                                </TableCell>
                                {type === "subscription" ? (
                                  ""
                                ) : (
                                  <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                    {get(category, "brodcast_id.name", "N/A")}
                                  </TableCell>
                                )}
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  {/* {category?.user_id === null ? "N/A" : category.user_id} */}
                                  {type === "donation"
                                    ? category?.user_id
                                      ? category.user_id.second_id
                                      : "N/A"
                                    : get(category, "second_id", "N/A")}
                                </TableCell>
                                {type === "subscription" ? (
                                  ""
                                ) : (
                                  <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                    {get(category, "brodcast_id.second_id", "N/A")}
                                  </TableCell>
                                )}
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  {get(category, "transaction_id", "N/A")}
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  {type === "donation"
                                    ? get(category, "amount", "N/A")
                                    : get(category, "subscription_id.price", "N/A")}
                                </TableCell>
                                {type === "subscription" ? (
                                  <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                    {get(category, "subscription_id.plan_name", "N/A")}
                                  </TableCell>
                                ) : (
                                  ""
                                )}

                                {type === "donation" ? (
                                  ""
                                ) : (
                                  <TableCell style={{ textAlign: "center" }}>
                                    {category.subscription_validity
                                      ? //   new Date(category.subscription_validity.issueDate)
                                        //   // .toUTCString()
                                        //   .getUTCDate() +
                                        // "/" +
                                        // (new Date(category.subscription_validity.issueDate)
                                        //   // .toUTCString()
                                        //   .getUTCMonth() +
                                        //   1) +
                                        // "/" +
                                        // new Date(category.subscription_validity.issueDate)
                                        //   // .toUTCString()
                                        //   .getUTCFullYear()
                                        moment(category?.subscription_validity?.issueDate).format("MMM Do, YYYY")
                                      : "N/A"}
                                    <br />{" "}
                                    {category.subscription_validity
                                      ? // new Date(category.subscription_validity.expiryDate)
                                        //   // .toUTCString()
                                        //   .getUTCDate() +
                                        // "/" +
                                        // (new Date(category.subscription_validity.expiryDate)
                                        //   // .toUTCString()
                                        //   .getUTCMonth() +
                                        //   1) +
                                        // "/" +
                                        // new Date(category.subscription_validity.expiryDate)
                                        //   // .toUTCString()
                                        //   .getUTCFullYear()
                                        moment(category?.subscription_validity?.expiryDate).format("MMM Do, YYYY")
                                      : // moment.utc(category.createdAt).format("L")
                                        "N/A"}
                                  </TableCell>
                                )}
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
