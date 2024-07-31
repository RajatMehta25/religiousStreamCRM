import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import { Paper, Switch, styled, Tooltip } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import KErrorMessage from "./KErrorMessage";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import axios from "../../axios";
import { toast } from "react-toastify";
import { get } from "lodash";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { handleImageUpload } from "../../services/upload-files-service";
import { logDOM } from "@testing-library/dom";
import Visibility from "@material-ui/icons/Visibility";
import { VisibilityOff } from "@material-ui/icons";
import WallpaperIcon from "@material-ui/icons/Wallpaper";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import DateTimePicker from "react-datetime-picker";
import moment from "moment";
import TimePicker from "react-time-picker";
import { RiLockPasswordFill } from "react-icons/ri";
import "./timepicker.css";
// import './AddEditCategory.css'

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

const AddEditBroadcast = (props) => {
  const classes = useStyles();

  //  data from previous page

  useEffect(() => {
    // getactivemenuitem();
  }, []);
  const {
    location: { state },
  } = props;
  console.log(props);
  const getactivemenuitem = () => {
    const result = [...document.getElementsByTagName("a")];
    const newres = result.filter((ele) => {
      if (ele.innerText === "Manage Broadcast") {
        return ele;
      }
    });
    newres[0].classList.add("activate");
    console.log(newres);
    console.log(result);
  };
  console.log(state);
  const fileRef = useRef(null);

  const [phone, setPhone] = useState("");
  console.log(phone);
  const [DialCode, setDialCode] = useState(!state ? "" : state.country_code.replace(`+`, ""));
  const [profileImagepath, setProfileImagepath] = useState("");
  //Validation Schema

  const validationSchema = yup.object({
    name: yup.string().required("Name is Required!"),
    email: yup.string().email("Invalid Email").required("Email is Required!"),
    password: yup
      .string()
      .matches(/^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z]).*$/, "Must Contain 8 Characters including 1 Uppercase and Lowercase")
      .required("Password is Required!"),

    // Rnumber: yup.string().min(10, "Minimum 10 digits required!").required("Mobile Number is Required!"),
    location: yup.string().required("Location is Required!"),
    sects: yup.string().required("Sects is Required!"),
    calendar: yup.string().required("calendar is Required!"),
    // file1: yup.string().required("Image is Required!"),
    // startTime: yup.string().typeError("Required!").required("Required!"),
    // endTime: yup.string().typeError("Required!").required("Required!"),
    //    desc: yup
    //    .string()
    //    .min(5, "too small!")
    //    .max(500, "Too Long String!")
    //    .required("Required!")
    //test
  });
  const validationSchema2 = yup.object({
    name: yup.string().required("Name is Required!"),

    // Rnumber: yup.string().min(10, "Minimum 10 digits required!").required("Mobile Number is Required!"),
    location: yup.string().required("Location is Required!"),
    sects: yup.string().required("Sects is Required!"),
    calendar: yup.string().required("calendar is Required!"),

    // file1: yup.string().required("Image is Required!"),
    // startTime: yup.string().typeError("Required!").required("Required!"),
    // endTime: yup.string().typeError("Required!").required("Required!"),
    //    desc: yup
    //    .string()
    //    .min(5, "too small!")
    //    .max(500, "Too Long String!")
    //    .required("Required!"),
  });

  useEffect(() => {
    getSects();
    getcalendardata();
  }, []);
  const [sections, setSections] = useState([]);
  const [calendarData, setcalendarData] = useState([]);
  const getSects = async () => {
    const { data } = await axios.get("/admin/getSects");
    let filteredSect = data.data.filter((ele) => ele.is_active === true);
    setSections(filteredSect);
  };
  const getcalendardata = async () => {
    const { data } = await axios.get("/common/getAllCalendarName");
    console.log(data);
    setcalendarData(data.data);
  };

  // ADDING NEW CATEGORY

  const addNewCategory = async (values) => {
    let timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log(timeZone);
    if (values.lat && values.long) {
      let phone = values.Rnumber.replace(`${DialCode}`, "");
      try {
        console.log(values);
        console.log(DialCode);
        console.log(values.Rnumber.slice(DialCode.length));
        const { data } = await axios.post("/admin/createBrodcast", {
          image: values.file1,
          calendar: values.calendar,
          name: values.name,
          email_id: values.email,
          country_code: `+${DialCode}`,
          mobile_number: phone,
          // "gender":"Male",
          location: values.location,
          sect: values.sects,
          password: values.password,
          lat: values.lat,
          long: values.long,
          calendar: values.calendar,
          // channel_name: values.channel_name,
          is_qrcode: true,
          jumma: {
            start: moment(values.startTime, ["HH:mm"]).local().format("hh:mm A"),
            end: moment(values.endTime, ["HH:mm"]).local().format("hh:mm A"),
          },
          paypal_link: values.paypal_link,
          client_id: values.paypal_link,
          timezone: timeZone,
          // device_type: "Web",
          // device_token: "useless",
        });
        props.history.push({
          pathname: "/adminPanel/Broadcast_Management",
        });
        toast.success("Created Successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        console.log(data);
        // sendEmail(values);
      } catch (error) {
        console.log(error.response);
        // if (error.response.status === 403) {
        toast.error(error.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
        // }
      }
    } else {
      toast.error("Please select location first", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };
  // const sendEmail = async (values) => {
  //   if (!state) {
  //     try {
  //       const { data } = await axios.post("/common/sendEmail", {
  //         to: values.email,
  //         subject: "Welcome to Eadhan",
  //         message: `Hello,<br/>
  //                  <p>Thanks for choosing Eadhan, your mosque ${values.name} has been been successfully created now you can login in Broadcast app with given password.<br/>
  //                  Your password is : <b>${values.password}</b>.</p>
  //                  <br/>
  //                  <br/>
  //                  Kind regards
  //                  <br/>
  //                  Eadhan Support`,
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   } else {
  //     try {
  //       const { data } = await axios.post("/common/sendEmail", {
  //         to: values.email,
  //         subject: "Account Updation Eadhan",
  //         message: `Hello,<br/>
  //                   <p>This is to let you know that your email was just changed now you can login in Broadcast app with given credentials.<br/>
  //                   Your login credentials are :</p>
  //                   </br/>
  //                   Email : <b>${values.email}</b>
  //                   <br/>
  //                   Password : <b>${state.plain_password}</b>
  //                   <br/>
  //                   <br/>
  //                  Kind regards
  //                  <br/>
  //                  Eadhan Support`,
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  // };
  // Edit Category . update api

  const EditCategory = async (values) => {
    if (values.lat && values.long) {
      let phone = values.Rnumber.replace(`${DialCode}`, "");
      try {
        console.log(DialCode, DialCode.replace(/^[\+]+/, ""));
        console.log(values.Rnumber.slice(DialCode.length));
        const { data } = await axios.post(`/admin/updateBrodcast`, {
          _id: state._id,
          image: values.file1,
          calendar: values.calendar,
          name: values.name,
          email_id: values.email,
          country_code: `+${DialCode}`,
          mobile_number: phone,
          // "gender":"Male",
          location: values.location,
          sect: values.sects,
          password: values.password,
          lat: values.lat,
          long: values.long,
          calendar: values.calendar,
          // channel_name: values.channel_name,
          is_qrcode: true,
          jumma: {
            start: moment(values.startTime, ["HH:mm"]).local().format("hh:mm A"),
            end: moment(values.endTime, ["HH:mm"]).local().format("hh:mm A"),
          },
          paypal_link: values.paypal_link,
          client_id: values.paypal_link,
          timezone: state.timezone || values.timezone,
        });
        props.history.push({
          pathname: "/adminPanel/Broadcast_Management",
        });
        toast.success("Broadcast Updated", {
          position: toast.POSITION.TOP_RIGHT,
        });
        // sendEmail(values);
        console.log(data);
      } catch (error) {
        console.log(error.response);
        // if (error.response.status === 403) {
        toast.error(error.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } else {
      toast.error("Please select location first", {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  console.log(DialCode.length);

  function generateP() {
    var pass = "";
    var str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ" + "abcdefghijklmnopqrstuvwxyz0123456789@#$";

    for (let i = 1; i <= 8; i++) {
      var char = Math.floor(Math.random() * str.length + 1);

      pass += str.charAt(char);
    }

    return pass;
  }

  const statusSwitch = (e) => {
    console.log(e.target.checked);
  };

  const [showpassword, setShowPassword] = useState(false);

  console.log(get(state, "jumma.start", null));
  console.log(get(state, "image", ""));
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
                        if (window.confirm("Leave without saving changes?")) {
                          props.history.push({
                            pathname: "/adminPanel/Broadcast_Management",
                          });
                        }
                      }}
                    >
                      <ArrowBackIcon />
                    </Button>
                  </div>
                  <div className={classNames(classes.addNewCategoryHeading)}>
                    {" "}
                    <h3 className={classNames(classes.MarginControl)} style={{ marginBottom: "-0.5rem", marginLeft: "-135px" }}>
                      {console.log(state)}
                      {!state ? `CREATE BROADCAST` : `EDIT BROADCAST`}
                    </h3>
                  </div>
                </Paper>

                {/* //new design */}

                {/* status end */}

                <Paper
                  style={{
                    display: "flex",
                    // alignItems: "center",
                    flexDirection: "column",
                  }}
                  elevation={0}
                >
                  <div style={{ margin: "2rem 0 2rem 0" }}>
                    <Formik
                      validationSchema={!state ? validationSchema : validationSchema2}
                      initialValues={{
                        name: get(state, "name", ""),
                        // Rnumber: get(state, "country_code", "") + get(state, "mobile_number", ""),
                        Rnumber: !state ? "" : state?.country_code.replace(`+`, "") + get(state, "mobile_number", ""),
                        email: get(state, "email_id", ""),
                        password: get(state, "password", ""),
                        // gender:get(state,"gender",""),
                        location: get(state, "location", ""),
                        sects: get(state, "sect._id", ""),
                        calendar: get(state, "calendar", ""),
                        file1: get(state, "image", "") !== "" ? get(state, "image", "") : "",
                        startTime:
                          get(state, "jumma.start", null) && get(state, "jumma.start", null) !== "Invalid date"
                            ? moment(get(state, "jumma.start", null), ["hh:mm A"]).local().format("HH:mm")
                            : null,
                        endTime:
                          get(state, "jumma.end", null) && get(state, "jumma.end", null) !== "Invalid date"
                            ? moment(get(state, "jumma.end", null), ["hh:mm A"]).local().format("HH:mm")
                            : null,
                        checkTime: "",
                        // qr: get(state, "qr", false),
                        //   desc: get(state, "desc", ""),
                        paypal_link: get(state, "client_id", ""),
                        // channel_name: get(state, "channel_name", ""),
                        lat: get(state, "lat", ""),
                        long: get(state, "long", ""),
                      }}
                      onSubmit={(values) => {
                        console.log(values);
                        if (state && state !== "undefined") {
                          EditCategory(values);
                        } else {
                          addNewCategory(values);
                        }
                      }}
                    >
                      {({ values, setFieldValue }) => (
                        <Form className="vw-50">
                          {/* Bootstrap */}
                          <div className="container-fluid">
                            {/* row 1 */}
                            <div className="row my-3 align-items-center">
                              <div className="col-6 d-flex flex-column">
                                <div className="">
                                  <label className="" style={{ fontSize: "16px" }}>
                                    Mosque Name :
                                  </label>
                                </div>
                                <div className="">
                                  <Field
                                    style={{
                                      width: "100%",
                                      height: "35px",
                                      borderRadius: "5px",
                                      border: "1px solid #c4c4c4",
                                      outline: "none",
                                      paddingInlineStart: 10,
                                    }}
                                    className=""
                                    name="name"
                                    type="name"
                                  />
                                  <KErrorMessage name="name" />
                                </div>
                              </div>
                              <div className="col-6 d-flex flex-column">
                                <div className="">
                                  <label className="" style={{ fontSize: "16px" }}>
                                    Phone Number :
                                  </label>
                                </div>
                                <div className="customPhone">
                                  <PhoneInput
                                    country={"gb"}
                                    countryCodeEditable={false}
                                    // name="Rnumber"

                                    style={{ display: "flex" }}
                                    inputProps={{
                                      name: "Rnumber",
                                      required: true,
                                      // width:"50%"
                                      // autoFocus: true
                                    }}
                                    value={values.Rnumber}
                                    onChange={(phonenumber, data, event, formattedValue) => {
                                      setPhone(phonenumber);
                                      setDialCode(data.dialCode);
                                      setFieldValue("Rnumber", phonenumber);
                                    }}
                                  />
                                  <KErrorMessage name="Rnumber" />
                                </div>
                              </div>
                            </div>
                            {/* row 2 */}
                            <div className="row my-3 align-items-center">
                              <div className="col-6 d-flex flex-column">
                                <div className="">
                                  <label className="" style={{ fontSize: "16px" }}>
                                    Email ID :
                                  </label>
                                </div>
                                <div className="">
                                  <Field
                                    style={{
                                      width: "100%",
                                      height: "35px",
                                      borderRadius: "5px",
                                      border: "1px solid #c4c4c4",
                                      outline: "none",
                                      paddingInlineStart: 10,
                                    }}
                                    className=""
                                    name="email"
                                    type="email"
                                    autoComplete="off"
                                  />
                                  <KErrorMessage name="email" />
                                </div>
                              </div>
                              <div className="col-6 d-flex flex-column">
                                <div className="">
                                  <label className="" style={{ fontSize: "16px" }}>
                                    Password :
                                  </label>
                                </div>
                                <div className="">
                                  <div className="d-flex align-items-center" style={{ pointerEvents: !state ? "" : "none" }}>
                                    <Field
                                      style={{
                                        width: "100%",
                                        height: "35px",
                                        borderRadius: "5px",
                                        border: "1px solid #c4c4c4",
                                        outline: "none",
                                        paddingInlineStart: 10,
                                      }}
                                      className=""
                                      name="password"
                                      type={showpassword ? "text" : "password"}
                                      disabled={!state ? false : true}
                                      autoComplete="off"
                                    />
                                    {showpassword ? (
                                      <Visibility
                                        onClick={() => setShowPassword(false)}
                                        style={{ cursor: "pointer", fontSize: "18px" }}
                                      />
                                    ) : (
                                      <VisibilityOff
                                        onClick={() => setShowPassword(true)}
                                        style={{ cursor: "pointer", fontSize: "18px" }}
                                      />
                                    )}{" "}
                                    <Tooltip title="Auto Generate Password" arrow>
                                      <Button
                                        disabled={!state ? false : true}
                                        onClick={() => {
                                          setFieldValue("password", generateP());
                                        }}
                                      >
                                        <RiLockPasswordFill style={{ fontSize: "20px" }} />
                                      </Button>
                                    </Tooltip>
                                  </div>

                                  <KErrorMessage name="password" />
                                </div>
                              </div>
                            </div>
                            {/* row 3 */}

                            {/* <div className="row my-3"></div> */}

                            <div className="row my-3 align-items-center">
                              <div className="col-6 d-flex flex-column">
                                <div className="">
                                  <label className="" style={{ fontSize: "16px" }}>
                                    Location :
                                  </label>
                                </div>
                                <div className="">
                                  <PlacesAutocomplete
                                    value={values.location}
                                    onChange={(e) => {
                                      setFieldValue("lat", "");
                                      setFieldValue("long", "");
                                      setFieldValue("location", e);
                                    }}
                                    onSelect={async (value) => {
                                      console.log(value);
                                      const results = await geocodeByAddress(value);
                                      const ll = await getLatLng(results[0]);
                                      console.log(ll);
                                      setFieldValue("location", value);
                                      setFieldValue("lat", ll.lat);
                                      setFieldValue("long", ll.lng);
                                    }}
                                  >
                                    {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                      <div style={{ width: "100%" }}>
                                        <textarea
                                          {...getInputProps({
                                            // placeholder: "Enter Location ...",
                                            className: "location-search-input",
                                          })}
                                          className="form-control"
                                        />
                                        <div
                                          className="autocomplete-dropdown-container location-dropdown "
                                          style={{
                                            border: "1px solid #c4c4c4",
                                            position: "absolute",
                                            zIndex: 99,
                                            borderRadius: "5px",
                                          }}
                                        >
                                          {loading && <div>Loading...</div>}
                                          {suggestions.map((suggestion, i) => {
                                            const className = suggestion.active ? "suggestion-item--active" : "suggestion-item";
                                            // inline style for demonstration purpose
                                            const style = suggestion.active
                                              ? {
                                                  backgroundColor: "#fafafa",
                                                  cursor: "pointer",
                                                }
                                              : {
                                                  backgroundColor: "#ffffff",
                                                  cursor: "pointer",
                                                };
                                            return (
                                              <div
                                                key={i}
                                                {...getSuggestionItemProps(suggestion, {
                                                  className,
                                                  style,
                                                })}
                                              >
                                                <span>{suggestion.description}</span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </PlacesAutocomplete>

                                  <KErrorMessage name="location" />
                                </div>
                              </div>
                              <div className="col-6 d-flex flex-column">
                                <div className="">
                                  <label className="" style={{ fontSize: "16px" }}>
                                    Paypal id :
                                  </label>
                                </div>
                                <div className="">
                                  <Field
                                    style={{
                                      width: "100%",
                                      height: "60px",
                                      borderRadius: "5px",
                                      border: "1px solid #c4c4c4",
                                      outline: "none",
                                      paddingInlineStart: 10,
                                    }}
                                    className=""
                                    name="paypal_link"
                                    as="textarea"
                                  />

                                  <KErrorMessage name="paypal_link" />
                                </div>
                              </div>
                            </div>
                            {/* row 4 */}
                            {/* {!state ? <div className="row my-5"></div> : ""} */}
                            {/* row 5 */}

                            {/* <div className="row my-3"></div> */}
                            <div className="row my-3 align-items-center">
                              <div className="col-6 d-flex flex-column">
                                <div className="">
                                  <label className="" style={{ fontSize: "16px" }}>
                                    Sects :
                                  </label>
                                </div>
                                <div className="">
                                  <Field
                                    style={{
                                      width: "100%",
                                      height: "35px",
                                      borderRadius: "5px",
                                      border: "1px solid #c4c4c4",
                                      paddingInlineStart: 10,
                                      outline: "none",
                                    }}
                                    className=""
                                    name="sects"
                                    as="select"
                                  >
                                    <option value="">Select Sects</option>
                                    {sections.map((item, index) => (
                                      <option key={index} value={item._id}>
                                        {item.sect_name}
                                      </option>
                                    ))}
                                  </Field>
                                  <KErrorMessage name="sects" />
                                </div>
                              </div>
                              <div className="col-6 d-flex flex-column">
                                <div className="">
                                  <label className="" style={{ fontSize: "16px" }}>
                                    Calendar :
                                  </label>
                                </div>
                                <div className="">
                                  <Field
                                    style={{
                                      width: "100%",
                                      height: "35px",
                                      borderRadius: "5px",
                                      border: "1px solid #c4c4c4",
                                      paddingInlineStart: 10,
                                    }}
                                    className=""
                                    name="calendar"
                                    as="select"
                                  >
                                    <option value="">Select Calendar</option>
                                    {calendarData.map((item, index) => (
                                      <option key={index} value={item.unique_id}>
                                        {item.calendar_name}
                                      </option>
                                    ))}
                                  </Field>
                                  <KErrorMessage name="calendar" />
                                </div>
                              </div>
                            </div>
                            {/* <div className="row my-3 align-items-center">
                              <div className="col-6 d-flex flex-column">
                                <div className="">
                                  <label className="" style={{ fontSize: "16px" }}>
                                    Channel Name :
                                  </label>
                                </div>
                                <div className="">
                                  <Field
                                    style={{
                                      width: "100%",
                                      height: "35px",
                                      borderRadius: "5px",
                                      border: "1px solid #c4c4c4",
                                      outline: "none",
                                      paddingInlineStart: 10,
                                    }}
                                    className=""
                                    name="channel_name"
                                    type="channel_name"
                                  />
                                  <KErrorMessage name="channel_name" />
                                </div>
                              </div>
                              <div className="col-6 d-flex flex-column"></div>
                            </div> */}
                            {/* time */}
                            <div className="row my-3 align-items-center">
                              <div className="col-6 d-flex flex-column ">
                                <div className="">
                                  <label className="" style={{ fontSize: "16px" }}>
                                    Jumu'ah :
                                  </label>
                                </div>
                                <div className="d-flex justify-content-around">
                                  <div className=" d-flex flex-column">
                                    <label>First Jamat</label>
                                    <div className="">
                                      <TimePicker
                                        // disableCalendar={true}
                                        // format="hh:mm a"
                                        onChange={(e) => {
                                          // setFieldValue("checkTime", e);
                                          // setFieldValue(
                                          //   "startTime",
                                          //   moment(e).format("HH:mm")
                                          // );
                                          console.log(e);

                                          setFieldValue("startTime", e);
                                        }}
                                        name="startTime"
                                        value={values.startTime}
                                      />
                                    </div>
                                    <KErrorMessage name="startTime" />
                                  </div>
                                  <div className=" d-flex flex-column ">
                                    <label>Second Jamat</label>
                                    <div className="">
                                      {" "}
                                      <TimePicker
                                        // disableCalendar={true}
                                        // format="hh:mm a"
                                        // minDate={values.checkTime}
                                        onChange={(e) => {
                                          setFieldValue("endTime", e);
                                        }}
                                        value={values.endTime}
                                        name="endTime"
                                        minTime={values.startTime}
                                      />
                                    </div>

                                    <KErrorMessage name="endTime" />
                                  </div>
                                </div>
                              </div>
                              <div className="col-6 d-flex flex-column">
                                <div className="">
                                  <label className="" style={{ fontSize: "16px" }}>
                                    Upload Image :
                                  </label>
                                </div>
                                <div className="d-flex justify-content-around align-items-center">
                                  <div className="">
                                    <input
                                      ref={fileRef}
                                      name="file1"
                                      hidden
                                      type="file"
                                      accept="image/png, image/jpeg , image/jpg"
                                      onChange={async (e) => {
                                        let data = await handleImageUpload(e.target.files[0]);
                                        // console.log(data);
                                        // console.log(e.target.files[0]);
                                        console.log(data);
                                        setFieldValue("file1", data);
                                        setProfileImagepath(data);
                                      }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        fileRef.current.click();
                                      }}
                                      style={{
                                        borderRadius: "5px",
                                        backgroundColor: "#0E3F37",
                                        color: "white",
                                        border: "none",
                                        padding: "5px",
                                      }}
                                    >
                                      Upload
                                    </button>
                                  </div>

                                  <div className="">
                                    {!state && profileImagepath === "" && (
                                      <WallpaperIcon style={{ width: "70px", height: "70px" }} />
                                    )}
                                    {
                                      //  !state&&profileImagepath==="" &&( <WallpaperIcon/>)

                                      !state && profileImagepath !== "" && (
                                        <img
                                          src={profileImagepath}
                                          alt="..."
                                          style={{
                                            width: "70px",
                                            height: "70px",
                                          }}
                                        />
                                      )
                                    }
                                    {state && values.file1 !== "" && (
                                      <img src={values.file1} alt="..." style={{ width: "70px", height: "70px" }} />
                                    )}
                                    <KErrorMessage name="file1" />
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* <div className="row my-5"></div> */}

                            <div className="row my-3 align-items-center"></div>
                          </div>

                          <br />
                          <br />
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "center",
                            }}
                          >
                            <button
                              type="submit"
                              className="buttoncss"
                              style={{
                                borderRadius: "1.5rem",
                                border: "none",
                                fontSize: "1rem",
                                width: "15vw",
                                height: "5vh",
                                backgroundColor: "#0E3F37",
                                color: "#fff",
                              }}
                            >
                              SAVE
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </Paper>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </React.Fragment>
  );
};

export default AddEditBroadcast;
