import React, { useState, useRef, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import { Paper } from "@material-ui/core";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";
import KErrorMessage from "./KErrorMessage";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import axios from "../../axios";
import { toast } from "react-toastify";
import { get } from "lodash";
import { handleImageUpload } from "../../services/upload-files-service";
import WallpaperIcon from "@material-ui/icons/Wallpaper";
import DatePicker from "react-date-picker";
import DatePickerNew from "react-datepicker";

// import "./AddEditIslamicEvent.css";

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

const EditIslamicEvent = (props) => {
  const classes = useStyles();

  //  data from previous page
  const {
    location: { state },
  } = props;
  console.log(props);
  useEffect(() => {
    // getactivemenuitem();
    // setStartDate(state[0].start_date);
    // setEndDate(state[0].end_date);
  }, []);

  const getactivemenuitem = () => {
    const result = [...document.getElementsByTagName("a")];
    const newres = result.filter((ele) => {
      if (ele.innerText === "Manage Azan") {
        return ele;
      }
    });
    newres[0].classList.add("activate");
    console.log(newres);
    console.log(result);
  };
  console.log(state);
  //Validation Schema
  //   const [profileImagepath, setProfileImagepath] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const fileRef = useRef(null);
  const validationSchema = yup.object({
    eventType: yup
      .string()
      //   .matches(/^[a-zA-Z ]+$/, "Name is invalid")
      .required("Event Type is Required!"),
    // file1: yup.string().required("Icon is Required!"),
    title: yup.string().required("Title is Required!"),
    startDate: yup.date().required("Start Date is Required!"),
    endDate: yup.date().required("End Date is Required!"),
    // desc: yup
    //   .string()
    //   .min(5, "too small!")
    //   .max(500, "Too Long String!")
    //   .required("Required!"),
  });

  // ADDING NEW CATEGORY

  const addNewAzan = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.post("/admin/createAzan", {
        azan_name: values.name,
        azan_icon: values.file1,
      });
      props.history.push({
        pathname: "/adminPanel/Azan_Management",
      });
      toast.success("Azan created successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Edit Category . update api

  const EditIslamicEvent = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.post("/admin/updateEvent", {
        _id: state[0]._id,
        brodcast_id: state[1],
        start_date: values.startDate,
        end_date: values.endDate,
        event_type: values.eventType,
        title: values.title,
      });
      props.history.push({
        pathname: "/adminPanel/IslamicEvent",
        state: state[1],
      });
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const eventType = [
    "Shab e Miraj",
    "Shab e Barat",
    "Ramadan",
    "Eid ul Fitr",
    "Hajj",
    "Eid ul Adha",
    "Ashura",
    "Eid Milad un Nabi",
  ];

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
                            pathname: "/adminPanel/IslamicEvent",
                            state: state[1],
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
                      {!state ? `Edit Islamic Event` : `Edit Islamic Event`}
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
                  <div style={{ margin: "2rem 2rem 2rem 2rem" }}>
                    <Formik
                      validationSchema={validationSchema}
                      initialValues={{
                        eventType: get(state[0], "event_type", "N/A"),
                        title: get(state[0], "title", "N/A"),
                        startDate: new Date(state[0].start_date),
                        endDate: new Date(state[0].end_date),
                        // file1: get(state[0], "azan_icon", ""),
                        // desc: get(state[0], "desc", ""),
                      }}
                      onSubmit={(values) => {
                        console.log(values);
                        if (state[0] && state[0] !== "") {
                          EditIslamicEvent(values);
                        } else {
                          //   addNewAzan(values);
                        }
                      }}
                    >
                      {({ values, setFieldValue }) => (
                        <Form>
                          <div className="row my-3">
                            <div className="col-5  text-capitalize">
                              <label className="" style={{ fontSize: "20px" }}>
                                Event Type :
                              </label>
                            </div>
                            <div className="col-7">
                              <Field
                                style={{
                                  width: "75%",
                                  height: "35px",
                                  borderRadius: "5px",
                                  border: "1px solid #c4c4c4",
                                  outline: "none",
                                  paddingInlineStart: 10,
                                }}
                                className=""
                                name="eventType"
                                type="text"
                                as="select"
                              >
                                <option value="">Select</option>
                                {eventType.map((e, i) => (
                                  <option key={i} value={e}>
                                    {e}
                                  </option>
                                ))}
                              </Field>
                              <KErrorMessage name="eventType" />
                            </div>
                          </div>
                          <div className="row my-3">
                            <div className="col-5  text-capitalize">
                              <label className="" style={{ fontSize: "20px" }}>
                                Title :
                              </label>
                            </div>
                            <div className="col-7">
                              <Field
                                style={{
                                  width: "75%",
                                  height: "35px",
                                  borderRadius: "5px",
                                  border: "1px solid #c4c4c4",
                                  outline: "none",
                                  paddingInlineStart: 10,
                                }}
                                className=""
                                name="title"
                                type="text"
                              />
                              <KErrorMessage name="title" />
                            </div>
                          </div>
                          <div className="row my-3">
                            <div className="col-5  text-capitalize">
                              <label className="" style={{ fontSize: "20px" }}>
                                Start Date :
                              </label>
                            </div>
                            <div className="col-7">
                              <DatePicker
                                value={!startDate ? new Date(state[0].start_date) : startDate}
                                minDate={new Date()}
                                onChange={(e) => {
                                  setStartDate(e);
                                  setFieldValue("startDate", e);
                                }}
                                className="w-75"
                                clearIcon={null}
                              />
                              {/* <DatePickerNew
                                // ref={calref}
                                placeholderText="Select date"
                                selected={startDate}
                                // dateFormat="dd-MM-yyyy"
                                onChange={(date) => {
                                  // let newDate = new Date(date);
                                  // changeExpiryDate(category, date);
                                  console.log(date);
                                  setFieldValue("startDate", date);
                                  setStartDate(date);
                                }}
                                // withPortal={true}
                                // popperClassName="heightControl"
                                // withPortal
                                minDate={new Date()}
                                // className="d-none"
                              /> */}
                              <KErrorMessage name="startDate" />
                            </div>
                          </div>
                          <div className="row my-3">
                            <div className="col-5  text-capitalize">
                              <label className="" style={{ fontSize: "20px" }}>
                                End Date :
                              </label>
                            </div>
                            <div className="col-7">
                              <DatePicker
                                value={!endDate ? new Date(state[0].end_date) : endDate}
                                minDate={values.startDate}
                                onChange={(e) => {
                                  console.log(new Date(e));
                                  setEndDate(e);
                                  setFieldValue("endDate", e);
                                }}
                                className="w-75"
                                clearIcon={null}
                              />
                              {/* <DatePickerNew
                                // ref={calref}
                                placeholderText="Select date"
                                selected={endDate}
                                // dateFormat="dd-MM-yyyy"
                                onChange={(date) => {
                                  // let newDate = new Date(date);
                                  // changeExpiryDate(category, date);
                                  console.log(date);
                                  setFieldValue("endDate", date);
                                  setEndDate(date);
                                }}
                                // withPortal={true}
                                // popperClassName="heightControl"
                                // withPortal
                                minDate={new Date(state[0]?.start_date)}
                                // className="d-none"
                              /> */}
                              <KErrorMessage name="endDate" />
                            </div>
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
                                backgroundColor: "#0e3f37",
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

export default EditIslamicEvent;
