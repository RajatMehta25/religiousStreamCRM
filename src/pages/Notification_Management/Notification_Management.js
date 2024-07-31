import React, { useEffect, useState } from "react";
// import { Container, Row, Col } from "reactstrap";
import axios from "../../axios";
// import axios from "../../http-comman";
import classNames from "classnames";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Label from "reactstrap/lib/Label";
import Checkbox from "@material-ui/core/Checkbox";
import { IconButton, Tooltip } from "@material-ui/core";
// import { TextareaAutosize, TextField } from '@material-ui/core';
// import { lightGreen } from '@material-ui/core/colors';
// import Button from '@material-ui/core/Button';
import { toast } from "react-toastify";
// import { Row, Col } from "reactstrap";
import SearchBar from "material-ui-search-bar";

// For Table
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
// import TablePagination from '@material-ui/core/TablePagination';
// import { autofill } from 'redux-form';
// import { BsPersonFill } from 'react-icons/bs';
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { get, isEmpty } from "lodash";
import { Formik, Field, Form } from "formik";
import Input from "../../components/Input";
import { FeildManageValidatorNotification } from "../../utils/validators";
import TextArea from "../../components/TextArea";
// import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import RSelect from "react-select";
import Cookies from "js-cookie";
import { Button } from "@material-ui/core";
import { RiNotification2Line } from "react-icons/ri";

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
    justifyContent: "space-between",
    // padding: "10px",
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

const Notification_Management = (props) => {
  const classes = useStyles();

  const [display, setDisplay] = useState(false);
  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(500);

  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [type, setType] = useState("USER");

  // For Search
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);

  useEffect(() => {
    const typeFromCookie = Cookies.get("type");

    //   setType(typeFromCookie);
    // Cookies.set("type", "USER", {
    //   expires: 365,
    // });
    typeFromCookie === "BROADCAST" ? getUsers(1) : getUsers();
  }, []);

  // useEffect(() => {
  //   const typeFromCookie = Cookies.get("type");
  //   console.log(typeFromCookie);
  //   setType(typeFromCookie);
  //   getUsers(typeFromCookie === "USER" ? getUsers(0) : getUsers(1));
  // }, [type]);

  const requestSearch = (searchedVal) => {
    // console.log(searchedVal);
    if (type === "USER") {
      const filteredRows = searchedData.filter((row) => {
        // console.log(searchedVal);
        //   console.log(row);
        return row.first_name.toLowerCase().includes(searchedVal.toLowerCase());
      });
      setUsers(filteredRows);
    } else if (type === "BROADCAST") {
      const filteredRows = searchedData.filter((row) => {
        // console.log(searchedVal);
        // console.log(row);
        return row.name.toLowerCase().includes(searchedVal.toLowerCase());
      });
      setUsers(filteredRows);
    }
  };

  const getUsers = async (value = 0) => {
    if (value === 0) {
      try {
        const { data } = await axios.get("/admin/getUsers");
        setUsers(data.data);
        console.log(data.data);
        setSearchedData(data.data);
        setType("USER");
        Cookies.set("type", "USER", {
          expires: 365,
        });
        console.log(data.data);
      } catch (error) {
        console.log(error);
      }
    } else if (value === 1) {
      try {
        const { data } = await axios.get("/admin/getBrodcast");
        setUsers(data.data);
        console.log(data.data);
        setSearchedData(data.data);
        setType("BROADCAST");
        Cookies.set("type", "BROADCAST", {
          expires: 365,
        });
        console.log(data.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  // useEffect(() => {
  //   getUsers();
  // }, []);

  const cancelSearch = () => {
    setSearched("");
    if (type === "USER") {
      getUsers(0);
    } else if (type === "BROADCAST") {
      getUsers(1);
    }
  };

  // console.log(checkId.map((val) => val.id));

  const Submit = async (value) => {
    console.log(value);

    if (value.Notification === "individual") {
      if (value.title && value.description && !isEmpty(allNotificationsUser)) {
        try {
          await axios.post("/admin/notificationManagement", {
            user_ids: allNotificationsUser,
            message: value.description,
            title: value.title,
            module_type: type === "USER" ? 0 : 1,
            device_type: 3,
          });
          toast.success("Notification sent successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
          // console.log(allNotificationsUser);
          // console.log(value.description);
          // console.log(value.title);
          value.description = "";
          value.title = "";
          setSelected("");
          setSellerSelected("");
          setDeliverySelected("");
          window.location.reload();
        } catch (error) {
          console.log(error);
        }
      } else if (type === "USER" && isEmpty(allNotificationsUser)) {
        toast.error("Please Select a User", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else if (type === "BROADCAST" && isEmpty(allNotificationsUser)) {
        toast.error("Please Select a Mosque", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
    if (value.Notification === "All") {
      if (value.title && value.description) {
        try {
          await axios.post("/admin/notificationManagement", {
            user_ids: [],
            message: value.description,
            title: value.title,
            module_type: type === "USER" ? 0 : 1,
            device_type: 4,
          });
          toast.success("Notification sent successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
          // console.log(allNotificationsUser);
          // console.log(value.description);
          // console.log(value.title);
          value.description = "";
          value.title = "";
          setSelected("");
          setSellerSelected("");
          setDeliverySelected("");
          window.location.reload();
        } catch (error) {
          console.log(error);
        }
      }
    }

    if (value.Notification === "Web") {
      if (value.title && value.description) {
        try {
          await axios.post("/admin/notificationManagement", {
            user_ids: [],
            message: value.description,
            title: value.title,
            module_type: type === "USER" ? 0 : 1,
            device_type: 5,
          });
          toast.success("Notification sent successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
          // console.log(allNotificationsUser);
          // console.log(value.description);
          // console.log(value.title);
          value.description = "";
          value.title = "";
          setSelected("");
          setSellerSelected("");
          setDeliverySelected("");
          window.location.reload();
        } catch (error) {
          console.log(error);
        }
      }
    }

    if (value.Notification === "Android") {
      if (value.title && value.description) {
        try {
          await axios.post("/admin/notificationManagement", {
            user_ids: [],
            message: value.description,
            title: value.title,
            module_type: type === "USER" ? 0 : 1,
            device_type: 1,
          });
          toast.success("Notification sent successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
          // console.log(allNotificationsUser);
          // console.log(value.description);
          // console.log(value.title);
          value.description = "";
          value.title = "";
          setSelected("");
          setSellerSelected("");
          setDeliverySelected("");
          window.location.reload();
        } catch (error) {
          console.log(error);
        }
      }
    }

    if (value.Notification === "iOS") {
      if (value.title && value.description) {
        try {
          await axios.post("/admin/notificationManagement", {
            user_ids: [],
            message: value.description,
            title: value.title,
            module_type: type === "USER" ? 0 : 1,
            device_type: 2,
          });
          toast.success("Notification sent successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
          // console.log(allNotificationsUser);
          // console.log(value.description);
          // console.log(value.title);
          value.description = "";
          value.title = "";
          setSelected("");
          setSellerSelected("");
          setDeliverySelected("");
          window.location.reload();
        } catch (error) {
          console.log(error);
        }
      }
    }

    // setType(type);
  };

  //Select Checkbox

  const [selected, setSelected] = React.useState([]);

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = users.map((n) => n._id);
      setSelected(newSelecteds);
      setAllUsers((allUsers) => [...allUsers, selected[0]]);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
    }

    setSelected(newSelected);
  };
  const isSelected = (name) => selected.indexOf(name) !== -1;

  // Seller code

  //Select Checkbox

  const [sellerSelected, setSellerSelected] = React.useState([]);

  //  Delivery Boy Code

  //Select Checkbox

  const [deliverySelected, setDeliverySelected] = React.useState([]);

  var allNotifications = [selected, sellerSelected, deliverySelected];
  var allNotificationsUser = allNotifications.flat(2).filter((item) => item !== "");

  const options = [
    { label: "USER", value: 0 },
    { label: "BROADCAST", value: 1 },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper>
            <div className={classNames(classes.paperPaddingRightLeft)}>
              <div className="">
                <Paper elevation={0} className={classNames(classes.paperHeading, classes.headingButton)}>
                  {/* <Button
                      variant="outlined"
                      aria-label="add"
                      className={classes.iconMargin}
                      onClick={() => {
                        if (window.confirm("Leave this page?")) {
                          props.history.push({
                            pathname: "/adminPanel/SubAdmin_Management",
                          });
                        }
                      }}
                    >
                      <ArrowBackIcon />
                    </Button> */}
                  <h3>Manage Notification</h3>
                  <div style={{ width: "200px" }}>
                    {" "}
                    <RSelect
                      options={options}
                      defaultValue={Cookies.get("type") === "BROADCAST" ? options[1] : options[0]}
                      onChange={(e) => {
                        getUsers(e.value);
                      }}
                    />
                  </div>
                  {/* <Button
                    variant="contained"
                    className="buttoncss"
                    style={{ backgroundColor: "#0E3F37", color: "#fff" }}
                    onClick={() => {
                      props.history.push({
                        pathname: "/adminPanel/ViewNotification",
                      });
                    }}
                  >
                    {" "}
                    Notification History
                  </Button> */}
                  <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}> Notification History</span>} arrow>
                    <IconButton
                      className=""
                      style={{ backgroundColor: "#0E3F37", color: "#fff" }}
                      onClick={() => {
                        props.history.push({
                          pathname: "/adminPanel/ViewNotification",
                        });
                      }}
                    >
                      <RiNotification2Line />
                    </IconButton>
                  </Tooltip>
                </Paper>
                <Paper elevation={0} className={classes.paperTableHeight}>
                  <TableContainer style={{ overflowX: "hidden" }}>
                    <Table stickyHeader>
                      <div className={classNames("row with_label", classes.borderAll)}>
                        <div
                          className={
                            display ? classNames("col-md-6", classes.borderFor) : classNames("col-md-12", classes.borderFor)
                          }
                        >
                          <Formik
                            enableReinitialize
                            initialValues={{
                              title: "",
                              description: "",
                              Notification: "",
                            }}
                            validate={(values) => FeildManageValidatorNotification(values)}
                            validateOnChange
                            onSubmit={Submit}
                          >
                            {(formikBag) => {
                              return (
                                <Form>
                                  <div>
                                    <Field name="title">
                                      {({ field }) => (
                                        <div className="form-group mt-4 mx-3">
                                          <label htmlFor="title">Notification Title</label>
                                          <Input
                                            {...field}
                                            type="text"
                                            className="form-control py-5"
                                            value={formikBag.values.title}
                                            // required
                                            onChange={(e) => {
                                              console.log(formikBag);
                                              formikBag.setFieldValue("title", e.target.value);
                                            }}
                                            error={
                                              formikBag.touched.title && formikBag.errors.title ? formikBag.errors.title : null
                                            }
                                          />
                                        </div>
                                      )}
                                    </Field>
                                  </div>

                                  <div>
                                    <Field name="description">
                                      {({ field }) => (
                                        <div className="mt-4 mx-3">
                                          <label>Notification Description</label>
                                          <TextArea
                                            {...field}
                                            type="text"
                                            rows="10"
                                            value={formikBag.values.description}
                                            className="form-control"
                                            onChange={(e) => {
                                              formikBag.setFieldValue("description", e.target.value);
                                            }}
                                            error={
                                              formikBag.touched.description && formikBag.errors.description
                                                ? formikBag.errors.description
                                                : null
                                            }
                                          />
                                        </div>
                                      )}
                                    </Field>
                                  </div>

                                  <br />
                                  <div
                                    // className="d-flex justify-content-around align-items-center"
                                    className={
                                      type === "USER"
                                        ? "d-flex justify-content-around align-items-center"
                                        : "d-flex justify-content-center align-items-center"
                                    }
                                  >
                                    <div className="d-flex mx-2">
                                      <Field
                                        type="radio"
                                        name="Notification"
                                        value="All"
                                        style={{
                                          width: 20,
                                          height: 20,
                                          borderRadius: 5,
                                          borderColor: "#d3d3d3",
                                          borderStyle: "solid",
                                          borderWidth: 1,
                                          paddingInlineStart: 10,
                                        }}
                                        onClick={() => {
                                          setDisplay(false);
                                        }}
                                      />
                                      <label className="ml-1">All</label>
                                    </div>

                                    <div className={type === "USER" ? "d-flex" : "d-none"}>
                                      <Field
                                        type="radio"
                                        name="Notification"
                                        value="Android"
                                        style={{
                                          width: 20,
                                          height: 20,
                                          borderRadius: 5,
                                          borderColor: "#d3d3d3",
                                          borderStyle: "solid",
                                          borderWidth: 1,
                                          paddingInlineStart: 10,
                                        }}
                                        onClick={() => {
                                          setDisplay(false);
                                        }}
                                      />
                                      <label className="ml-1">Android</label>
                                    </div>
                                    <div className={type === "USER" ? "d-flex" : "d-none"}>
                                      <Field
                                        type="radio"
                                        name="Notification"
                                        value="iOS"
                                        style={{
                                          width: 20,
                                          height: 20,
                                          borderRadius: 5,
                                          borderColor: "#d3d3d3",
                                          borderStyle: "solid",
                                          borderWidth: 1,
                                          paddingInlineStart: 10,
                                        }}
                                        onClick={() => {
                                          setDisplay(false);
                                        }}
                                      />
                                      <label className="ml-1">iOS</label>
                                    </div>

                                    {/* <div className="d-flex "><Field type="radio"   name="Notification"     value="Web"     style={{ width: 20, height: 20 ,borderRadius:5,borderColor:"#d3d3d3",borderStyle:"solid",borderWidth:1,paddingInlineStart:10 }} onClick={()=>{setDisplay(false)}}/><label className="ml-1">Web</label></div> */}
                                    <div className="d-flex mx-2">
                                      <Field
                                        type="radio"
                                        name="Notification"
                                        value="individual"
                                        style={{
                                          width: 20,
                                          height: 20,
                                          borderRadius: 5,
                                          borderColor: "#d3d3d3",
                                          borderStyle: "solid",
                                          borderWidth: 1,
                                          paddingInlineStart: 10,
                                        }}
                                        onClick={() => {
                                          setDisplay(true);
                                        }}
                                      />
                                      <label className="ml-1">Individual</label>
                                    </div>
                                    <div
                                      style={{
                                        color: "red",
                                        display: "block",
                                      }}
                                    >
                                      {formikBag.errors.Notification ? formikBag.errors.Notification : null}
                                    </div>
                                  </div>
                                  <br />
                                  <div className={classNames("text-center", "my-3", classes.submitBtn)}>
                                    <button
                                      type="submit"
                                      style={{
                                        backgroundColor: "#0e3f37",
                                        borderColor: "#0e3f37",
                                      }}
                                      className="btn btn-success"
                                    >
                                      Send Notification
                                    </button>
                                  </div>
                                </Form>
                              );
                            }}
                          </Formik>
                        </div>

                        {display && (
                          <div className={classNames("col-md-6 ", classes.borderFor)}>
                            <div className={classNames(classes.container, "mt-4")}>
                              <Paper className={classes.searchBox}>
                                <SearchBar
                                  style={{ width: "97%", boxShadow: "none" }}
                                  value={searched}
                                  placeholder={type === "USER" ? "Search by User Name" : "Search by Mosque Name"}
                                  onChange={(searchVal) => requestSearch(searchVal)}
                                  onCancelSearch={() => cancelSearch()}
                                  className={classes.searchHeight}
                                />
                              </Paper>
                              <TableContainer
                                className={classNames("mt-3")}
                                style={{
                                  overflowY: "scroll",
                                  overflowX: "hidden",
                                  height: "63vh",
                                }}
                              >
                                <Table stickyHeader>
                                  <TableHead>
                                    <TableRow>
                                      <TableCell className={classes.textMiddle}></TableCell>
                                      <TableCell className={classes.textMiddle}></TableCell>
                                      <TableCell className={classes.textRight}>
                                        <div>
                                          <b style={{ color: "#B0B0B0" }}>Select All</b>
                                        </div>
                                      </TableCell>
                                      <TableCell className={classes.textMiddle}>
                                        {console.log(users)}
                                        <Checkbox
                                          color="primary"
                                          // indeterminate={numSelected > 0 && numSelected < data.length  }
                                          indeterminate={selected.length > 0 && selected.length < users.length}
                                          checked={users.length > 0 && selected.length === users.length}
                                          onChange={handleSelectAllClick}
                                        />
                                      </TableCell>
                                    </TableRow>
                                  </TableHead>
                                  <TableBody>
                                    {users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user, index) => {
                                      const isItemSelected = isSelected(user._id);

                                      return (
                                        <TableRow
                                          key={user._id}
                                          hover
                                          onClick={(event) => handleClick(event, user._id)}
                                          role="checkbox"
                                          tabIndex={-1}
                                          selected={isItemSelected}
                                        >
                                          <TableCell component="th" scope="row" className={classes.textMiddle}>
                                            {/* <BsPersonFill className={classes.personIcon}/> */}
                                            {/* <img src={get(user,"profile_image","")} alt="profile" style={{width:"30px",height:"30px"}}/> */}
                                            <AccountCircleIcon />
                                          </TableCell>
                                          <TableCell className={classes.textMiddle}>
                                            {type === "USER" ? get(user, "first_name", "") : get(user, "name", "")}
                                          </TableCell>
                                          <TableCell className={classes.textMiddle}>{get(user, "email_id", "")}</TableCell>
                                          <TableCell className={classes.textMiddle}>
                                            <Checkbox color="primary" checked={isItemSelected} />
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </div>
                          </div>
                        )}
                      </div>
                    </Table>
                  </TableContainer>
                </Paper>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Notification_Management;
