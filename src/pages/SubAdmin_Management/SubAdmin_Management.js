import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
// import Switch from '@mui/material/Switch';
// import { styled } from '@mui/material/styles';
// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'
import AddIcon from "@material-ui/icons/Add";

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
import VpnKeyIcon from "@material-ui/icons/VpnKey";
// import { Delete } from '@material-ui/icons';
import VisibilityIcon from "@material-ui/icons/Visibility";
import BlockIcon from "@material-ui/icons/Block";
// import ArrowBackIcon from "@material-ui/icons/ArrowBack";
// import Modal from '@material-ui/core/Modal';
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Formik, Field, Form } from "formik";
import KErrorMessage from "./KErrorMessage";
import * as yup from "yup";

// For Table
import SearchBar from "material-ui-search-bar";
import { orderBy } from "lodash";

//history
// import {useHistory} from 'react-router-dom'
// import AddEditCategory from "../AccountManagement/Account_Details";

// import './Category_Management.css' ;
import EditIcon from "@material-ui/icons/Edit";
import { Close, DeleteOutline, Description, Notifications, Send, WidgetsOutlined } from "@material-ui/icons";
import Block from "@material-ui/icons/Block";
import { get } from "lodash";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import Visibility from "@material-ui/icons/Visibility";
import Cookies from "js-cookie";
import NoDataFound from "../../components/NoDataFound";
import { sassTrue } from "sass";
import "./SubAdmin.css";

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

export default function SubAdmin_Management(props) {
  const classes = useStyles();

  // const history=useHistory();

  const [tableData, setTableData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [showpassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(true);
  //validation pop up
  const validationSchema = yup.object({
    // email: yup.string().required("Email is Required!"),

    password: yup
      .string()
      // .matches(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      //   "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      // )
      .required("Password is Required!"),
  });

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
    getCategoriesContent();
  }, []);

  //get content
  const getCategoriesContent = async () => {
    setLoader(true);
    try {
      const { data } = await axios.get("/admin/getSubAdmins");
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
  // edit category itself

  const EditSubAdmin = (category) => {
    props.history.push({
      pathname: "/adminPanel/AddEdit_SubAdmin",
      state: category,
    });
  };

  const DeleteSubAdmin = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this SubAdmin?")) {
        const { data } = await axios.post("/admin/deleteSubAdmin", {
          _id: id,
        });
        console.log(data);
        getCategoriesContent();
        toast.success("Deleted", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error("You have cancelled the operation", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  // For Search
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);

  const requestSearch = (searchedVal) => {
    console.log(searchedVal);

    const filteredRows = searchedData.filter((row) => {
      let name = row.username;
      let email = row.email;
      return email.toLowerCase().includes(searchedVal.toLowerCase()) || name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setTableData(filteredRows);
  };

  const cancelSearch = () => {
    getCategoriesContent();
  };

  //for blocking

  const BlockSubAdmin = async (e) => {
    console.log(e);
    if (e.is_blocked === true) {
      if (window.confirm("Are you sure you want to unblock this SubAdmin?")) {
        try {
          await axios.post("/admin/updateSubAdmin", {
            _id: e._id,
            is_blocked: false,
          });
          getCategoriesContent();
          toast.success("SubAdmin unblocked successfully", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        // getCategoriesContent();
      }
    } else if (e.is_blocked === false) {
      if (window.confirm("Are you sure you want to block this SubAdmin?")) {
        try {
          await axios.post("/admin/updateSubAdmin", {
            _id: e._id,
            is_blocked: true,
          });
          getCategoriesContent();
          toast.success("SubAdmin blocked successfully", {
            position: toast.POSITION.TOP_RIGHT,
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        // getCategory();
      }
    } else {
      return "error";
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
                  <h3 style={{}}>Manage SubAdmin</h3>
                  <SearchBar
                    // value={searched}
                    className="heightfix"
                    onChange={(searchVal) => requestSearch(searchVal)}
                    onCancelSearch={() => cancelSearch()}
                    placeholder="Search By SubAdmin Name/Email"
                  />
                  {/* <Button
                    variant="contained"
                    className="buttoncss"
                    style={{ backgroundColor: "#0e3f37", color: "#fff" }}
                    onClick={() => {
                      props.history.push({
                        pathname: "/adminPanel/SubAdmin_Notification",
                      });
                    }}
                  >
                    Send Notification&nbsp;
                    <Notifications style={{ fontSize: "20px" }} />
                    <Send
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 8,
                        opacity: 0.7,
                        fontSize: 15,
                        transform: "rotate(-45deg)",
                      }}
                    />{" "}
                  </Button> */}
                  {/* <Button
                    variant="contained"
                    className="buttoncss"
                    style={{ backgroundColor: "#0e3f37", color: "#fff" }}
                    onClick={() => {
                      props.history.push({
                        pathname: "/adminPanel/AddEdit_SubAdmin",
                      });
                    }}
                  >
                    {" "}
                    ADD SubAdmin
                  </Button> */}
                  <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Add SubAdmin</span>} arrow>
                    <IconButton
                      className=""
                      style={{ backgroundColor: "#0E3F37", color: "#fff" }}
                      onClick={() => {
                        props.history.push({
                          pathname: "/adminPanel/AddEdit_SubAdmin",
                        });
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
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
                            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Sr. No.</TableCell>
                            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>SubAdmin Name</TableCell>
                            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>SubAdmin Image </TableCell>
                            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Email</TableCell>
                            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Contact</TableCell>
                            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>SubAdmin Id</TableCell>
                            {/* <TableCell
                            style={{ fontWeight: "bold", textAlign: "center" }}
                          >
                            Document
                          </TableCell> */}
                            {/* <TableCell style={{textAlign:"center",fontWeight:"bold"}} >Status</TableCell> */}
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Action</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {/* {isLoading?<TableRow ><Skeleton style={{width:"70vw",borderRadius:"20px"}} highlightColor="#fff" height="1rem" count={2} baseColor="#ebebeb"/></TableRow>:false} */}
                          {tableData
                            .reverse()
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
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  {get(category, "username", "")}
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  <img src={get(category, "img", "")} alt="..." width="50px" height="50px" />
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  {get(category, "email", "")}
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  +{get(category, "mobile_number", "")}
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  {get(category, "_id", "")}
                                </TableCell>
                                {/* <TableCell
                                className={classes.textMiddle}
                                style={{ textAlign: "center" }}
                              >
                                <a
                                  href={get(category, "sub_admin_document", "")}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Tooltip title="Click to View" arrow>
                                    <Description />
                                  </Tooltip>
                                </a>
                              </TableCell> */}

                                {/* 
                                  <TableCell style={{textAlign:"center"}}>      

</TableCell> */}

                                <TableCell
                                  className={classes.textMiddle}
                                  style={{
                                    textAlign: "center",
                                    display: "flex",
                                    justifyContent: "center",
                                  }}
                                >
                                  <Button
                                    className=""
                                    //  onClick={()=>EditSubAdmin(category)}
                                    onClick={() => {
                                      // setOpen(true);
                                      // setImageurl(category.profile_image);
                                      // setExtractedAdminName(category.name);
                                      // setAllData(category);
                                      EditSubAdmin(category);
                                    }}
                                    style={{
                                      // border: "1.5px solid #F6F6F6",
                                      margin: "0.5rem",
                                      color: "#0e3f37",
                                    }}
                                  >
                                    <Tooltip title="Edit" arrow>
                                      <EditIcon
                                        onClick={() => {
                                          // setOpen(true);
                                          // setImageurl(category.profile_image);
                                          // setExtractedAdminName(category.name);
                                          // setAllData(category);
                                          EditSubAdmin(category);
                                        }}
                                        style={{
                                          // border: "1.5px solid #F6F6F6",
                                          margin: "0.5rem",
                                          color: "#0e3f37",
                                        }}
                                      />
                                    </Tooltip>
                                  </Button>
                                  {/* </TableCell> */}
                                  {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}
                                  {/* <TableCell className={classes.textMiddle} style={{textAlign:"center",border:"none"}}> */}
                                  <Button
                                    className=""
                                    onClick={() => {
                                      BlockSubAdmin({
                                        _id: category._id,
                                        is_blocked: category.is_blocked,
                                      });
                                    }}
                                    style={{
                                      // border: "1.5px solid #F6F6F6",
                                      margin: "0.5rem",
                                    }}
                                  >
                                    {" "}
                                    <Tooltip title="Block/Unblock Access" arrow>
                                      <Block
                                        style={{
                                          color: category.is_blocked === true ? "red" : "#696969",
                                        }}
                                      />
                                    </Tooltip>
                                  </Button>
                                  {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}
                                  {/* </TableCell> */}
                                  {/* <TableCell className={classes.textMiddle} style={{textAlign:"center",border:"none"}}> */}
                                  <Button
                                    className=""
                                    onClick={() => DeleteSubAdmin(category._id)}
                                    style={{
                                      border: "1.5px solid #F6F6F6",
                                      margin: "0.5rem",
                                      color: "#696969",
                                    }}
                                  >
                                    <Tooltip title="Delete" arrow>
                                      <DeleteOutline />
                                    </Tooltip>{" "}
                                  </Button>
                                  {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}
                                  {/* </TableCell> */}
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
