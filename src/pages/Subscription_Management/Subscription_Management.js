import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
// import Switch from '@mui/material/Switch';
// import { styled } from '@mui/material/styles';
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

import EditIcon from "@material-ui/icons/Edit";
import { DeleteOutline, WidgetsOutlined } from "@material-ui/icons";
import "./Subscription_Management.css";
import NoDataFound from "../../components/NoDataFound";

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
    backgroundColor: "#0e3f37 !important",
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

const IOSSwitch = styled((props) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)(
  ({ theme }) => ({
    width: 42,
    height: 26,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
          opacity: 1,
          border: 0,
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[600],
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 22,
      height: 22,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
    },
  })
);
export default function Subscription_Management(props) {
  const classes = useStyles();

  const {
    location: { state },
  } = props;
  // const history=useHistory();

  const [tableData, setTableData] = useState([]);

  //User Type
  const [userType, setUserType] = useState([]);
  // capture ID on click
  const [changeid, setChangeId] = useState(null);
  // status switch
  // const [checked, setChecked] = useState(true);

  // color for button
  const [colorid, setColorid] = useState("");
  // title name
  const [titlename, setTitle] = useState("");
  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const [loader, setLoader] = useState(true);

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
    // getUserTypes();
    getSubscriptionPlans();
  }, []);

  //get content

  // const getUserTypes = async () => {
  //   try {
  //     const { data } = await axios.get("/admin/get_users_types");
  //     // console.log(data);
  //     setUserType(data.userType);

  //     console.log(data.userType);
  //   } catch (error) {
  //     console.log(error);
  //     // setIsloading(false);
  //   }
  // };
  // get data

  const getSubscriptionPlans = async (id) => {
    try {
      setLoader(true);
      // if (id && id !== "") {
      const { data } = await axios.get("/admin/getSubscription");
      console.log(data);
      console.log(data.plan);
      setTableData(data.data);
      setSearchedData(data.data);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  //   let newTableData = data.plan.filter((item) => item.userType._id === id);
  //   setTableData(
  //     orderBy(newTableData, (o) => new Date(o.createdAt).getTime(), [
  //       "desc",
  //     ])
  //   );
  //   setSearchedData(newTableData);

  //   setColorid(id);
  //   console.log(data.plan);
  // } else {
  //   const { data } = await axios.get("/admin/get_subscription_plans");
  //   console.log(data);
  //   console.log(data.plan);
  //   if (state && state !== "undefined") {
  //     console.log(state);
  //     console.log(data.plan);
  //     let newTableData = data.plan.filter(
  //       (item) => item.userType._id === state
  //     );
  //     console.log(newTableData);
  //     let titleFind = data.plan.find((item) => item.userType._id === state)
  //       ?.userType.title;
  // let whenNoTitle=userType.find((item) => item._id === state).title
  // console.log(whenNoTitle);
  //         console.log(titleFind);
  //         setTableData(
  //           orderBy(newTableData, (o) => new Date(o.createdAt).getTime(), [
  //             "desc",
  //           ])
  //         );
  //         setSearchedData(newTableData);
  //         setColorid(state);
  //         switch (state) {
  //           case "61b0df509d05e9e75bdf4fc3":
  //             setChangeId({
  //               userType: { title: "Individual User", _id: state },
  //               Operation: "Add",
  //             });
  //             break;
  //           case "61b0df509d05e9e75bdf4fc4":
  //             setChangeId({
  //               userType: { title: "Agent Reprensentative", _id: state },
  //               Operation: "Add",
  //             });
  //             break;
  //           case "61b0df509d05e9e75bdf4fc5":
  //             setChangeId({
  //               userType: {
  //                 title: "Management Company Representative",
  //                 _id: state,
  //               },
  //               Operation: "Add",
  //             });
  //             break;
  //           case "61b0df509d05e9e75bdf4fc6":
  //             setChangeId({
  //               userType: { title: "Lawyer", _id: state },
  //               Operation: "Add",
  //             });
  //             break;
  //           case "61b0df509d05e9e75bdf4fc7":
  //             setChangeId({
  //               userType: { title: "Production", _id: state },
  //               Operation: "Add",
  //             });
  //             break;
  //           case "61b0df509d05e9e75bdf4fc8":
  //             setChangeId({
  //               userType: { title: "Subscriber Staff Member", _id: state },
  //               Operation: "Add",
  //             });
  //             break;
  //           default:
  //             setChangeId({
  //               userType: { title: titleFind, _id: state },
  //               Operation: "Add",
  //             });
  //             break;
  //         }
  //       } else {
  //         let newTableData = data.plan.filter(
  //           (item) => item.userType._id === "61b0df509d05e9e75bdf4fc3"
  //         );
  //         setTableData(
  //           orderBy(newTableData, (o) => new Date(o.createdAt).getTime(), [
  //             "desc",
  //           ])
  //         );
  //         setSearchedData(newTableData);
  //         setChangeId({
  //           userType: {
  //             title: "Individual User",
  //             _id: "61b0df509d05e9e75bdf4fc3",
  //           },
  //           Operation: "Add",
  //         });
  //         setColorid("61b0df509d05e9e75bdf4fc3");
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  //edit  categories attribute

  // delete category

  // For Search
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);

  const requestSearch = (searchedVal) => {
    console.log(searchedVal);

    const filteredRows = searchedData.filter((row) => {
      let name = row.plan_name;
      return name.toLowerCase().includes(searchedVal.toLowerCase());
      console.log(name);
    });
    setTableData(filteredRows);
  };

  const cancelSearch = () => {
    getSubscriptionPlans(colorid);
    // setSearched("");
    //  console.log(searchedData);
    //  requestSearch()
  };

  //delete subscription
  const deleteSubscription = async (id) => {
    try {
      const { data } = await axios.post("/admin/remove_subscription_plan", {
        planId: id,
      });
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      getSubscriptionPlans(state);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const statusSwitch = async (e, category) => {
    try {
      // console.log(e);
      console.log(category);

      const { data } = await axios.post("/admin/updateSubscription", {
        _id: category._id,
        is_active: e.target.checked,
      });
      // props.history.push({
      //     pathname: "/Category_Management",
      //   });
      getSubscriptionPlans();
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      // console.log(data);
    } catch (error) {
      console.log(error);
    }

    // console.log(e.target.checked);
    // console.log(checked);
    // console.log(id);
  };
  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper>
            <div className={classes.paperPaddingRightLeft}>
              <div className="">
                <Paper elevation={0} className={classNames(classes.paperHeading, classes.headingAlignment)}>
                  <h3 style={{}}>Manage Subscription</h3>
                  <SearchBar
                    // value={searched}
                    className="heightfix"
                    onChange={(searchVal) => requestSearch(searchVal)}
                    onCancelSearch={() => cancelSearch()}
                    placeholder="Search by Plan Name"
                  />
                  {/* <Button
                    variant="contained"
                    className="buttoncss"
                    style={{ backgroundColor: "#0e3f37", color: "#fff" }}
                    onClick={() => {
                      props.history.push({
                        pathname: "/adminPanel/AddEditSubscription",
                        // state: changeid,
                      });
                    }}
                  >
                    {" "}
                    ADD Subscription
                  </Button> */}
                  <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Add Subscription</span>} arrow>
                    <IconButton
                      className=""
                      style={{ backgroundColor: "#0E3F37", color: "#fff" }}
                      onClick={() => {
                        props.history.push({
                          pathname: "/adminPanel/AddEditSubscription",
                          // state: changeid,
                        });
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                </Paper>

                {/* //new design */}
                {/* <Paper
                  elevation={0}
                  className={classNames(
                    classes.paperHeading,
                    classes.headingButton
                  )}
                >
                  <div>
                    {userType.map((type, i) => (
                      <Button
                        variant="contained"
                        //color="primary"
                        aria-label="add"
                        className={
                          classes.iconMargin +
                          " " +
                          (colorid === type._id ? classes.iconcolor : "")
                        }
                        key={i + 1}
                        onClick={() => { */}
                {/* // localStorage.removeItem('savemaindata');
                          // showStatusButton(type._id)
                          // getCategory(type._id)
                          //                           setChangeId(type._id)

                          // localStorage.removeItem('maindata') */}
                {/* setChangeId({
                            userType: { title: type.title, _id: type._id },
                            Operation: "Add",
                          });
                          console.log(type._id);
                          getSubscriptionPlans(type._id);
                        }}
                      >
                        {type.title}
                      </Button>
                    ))}
                  </div>
                </Paper> */}

                {/* <br /> */}

                {/* status end */}

                <Paper>
                  <div className="tablePadding">
                    <TableContainer className={classes.container}>
                      <Table className={classes.table} stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Sr. No.</TableCell>
                            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Plan Name</TableCell>
                            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Plan Type</TableCell>
                            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Price(&#163;)</TableCell>
                            <TableCell style={{ fontWeight: "bold", textAlign: "center" }}>Status</TableCell>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Action</TableCell>
                            {/* <TableCell>User Type</TableCell>
                              <TableCell>Status</TableCell> */}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {tableData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((category, index) => (
                            <TableRow key={index}>
                              <TableCell
                                component="th"
                                scope="row"
                                className={classes.textMiddle}
                                style={{ textAlign: "center" }}
                              >
                                {index + 1 + page * rowsPerPage}
                              </TableCell>
                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                {category.plan_name}
                              </TableCell>

                              <TableCell style={{ textAlign: "center" }}>
                                {category.plan_type === 0 ? "Month" : category.plan_type === 1 ? "Year" : "Life Time"}
                              </TableCell>
                              <TableCell style={{ textAlign: "center" }}>{category.price}</TableCell>
                              <TableCell style={{ textAlign: "center" }}>
                                <Tooltip title="Active/Inactive" arrow>
                                  <IOSSwitch
                                    onChange={(e) => {
                                      statusSwitch(e, category);
                                    }}
                                    checked={category.is_active}
                                  />
                                </Tooltip>
                              </TableCell>

                              <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                <Button
                                  onClick={() => {
                                    props.history.push({
                                      pathname: "/adminPanel/AddEditSubscription",
                                      state: category,
                                    });
                                  }}
                                  className=""
                                  style={{
                                    // border: "1.5px solid #c4c4c4",
                                    margin: "0.5rem",
                                    color: "#0e3f37",
                                  }}
                                >
                                  <Tooltip title="Edit Plan" arrow>
                                    <EditIcon />
                                  </Tooltip>
                                </Button>
                                {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}

                                {/* <Button  className="" style={{border:"1.5px solid #c4c4c4",margin:"0.5rem",color:"#0e3f37"}} > <Tooltip title="Manage Category" arrow><WidgetsOutlined /></Tooltip></Button> */}
                                {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}

                                {/* <Button
                                  className=""
                                  onClick={() => {
                                    deleteSubscription(category._id);
                                  }}
                                  style={{
                                    border: "1.5px solid #c4c4c4",
                                    margin: "0.5rem",
                                    color: "#696969",
                                  }}
                                >
                                  <Tooltip title="Delete Plan" arrow>
                                    <DeleteOutline />
                                  </Tooltip>
                                </Button> */}
                                {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}
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
