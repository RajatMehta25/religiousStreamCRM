import React, { useRef, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Checkbox, Tooltip } from "@material-ui/core";
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

import Cookies from "js-cookie";
import { handleImageUpload } from "../../services/upload-files-service";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import startsWith from "lodash.startswith";
import { Description } from "@material-ui/icons";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
// import startsWith from "lodash.startswith";
import TextField from "@material-ui/core/TextField";
import Visibility from "@material-ui/icons/Visibility";
// import ReverseMd5 from "reverse-md5";
// import useNewHook from "../../services/NewHook";

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

const AddEdit_SubAdmin = (props) => {
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
      if (ele.innerText === "Manage SubAdmin") {
        return ele;
      }
    });
    newres[0].classList.add("activate");
    console.log(newres);
    console.log(result);
  };
  const [showpassword, setShowPassword] = useState(false);
  const [dialCode, setdialCode] = useState("");

  const fileRef = useRef(null);
  const fileRef1 = useRef(null);
  const SUPPORTED_FORMATS = ["image/jpeg", "image/png", "image/jpg"];
  const Panes = [
    { panelName: "Manage User" },

    { panelName: "Manage Sects" },

    { panelName: "Manage Broadcast" },
    { panelName: "Manage Calendar" },
    { panelName: "Manage Subscription" },
    { panelName: "Manage FAQ" },
    { panelName: "Manage Settings" },
    { panelName: "Manage Notification" },
    { panelName: "Manage Payment" },
  ];
  const [panesData, setPanesData] = useState(Panes);
  const [PanesDataFinal, setPanesDataFinal] = useState([]);
  var FinalData;
  const [profileImagepath, setProfileImagepath] = useState("");
  const [documentPath1, setDocumentpath1] = useState("");
  const token = Cookies.get("admin_access_token");
  //Validation Schema

  const validationSchema = yup.object({
    name: yup.string().required("Name is Required!"),
    email: yup.string().email("Invalid Email").required("Email is Required!"),
    phone: yup.string().min(10, "Minimum 10 digits required!").required("Phone is Required!"),
    //  yup
    //  .number()
    //  .min(1000000000, "Not Valid Phone Number!")
    //  .max(9999999999, "Not Valid Phone Number!")
    //  .required("Phone is Required!"),
    password: yup
      .string()
      .matches(/^(?=.{8,}$)(?=.*[a-z])(?=.*[A-Z]).*$/, "Must Contain 8 Characters, One Uppercase, One Lowercase")
      // .matches(
      //   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      //   "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      // )
      .required("Password is Required!"),

    file1: yup
      .string()
      // .nullable()
      .required("Required!"),
    // .test(
    //   "FILE_SIZE",
    //   "File is too Big!",
    //   (value) => !value || (value && value.size <= 1024 * 1024 * 5)
    // )
    // .test(
    //   "FILE_FORMAT",
    //   "File is not in the correct format!",
    //   (value) => !value || (value && SUPPORTED_FORMATS.includes(value?.type))
    // )
    // file2: yup
    //   .string()
    //   // .nullable()
    //   .required("Required!"),
    // .test(
    //   "FILE_SIZE",
    //   "File is too Big!",
    //   (value) => !value || (value && value.size <= 1024 * 1024 * 5)
    // )
    // .test(
    //   "FILE_FORMAT",
    //   "File is not in the correct format!",
    //   (value) => !value || (value && SUPPORTED_FORMATS.includes(value?.type))
    // )
    // sub_admin_id: yup.string().required("SubAdmin Id is Required!"),
    // mincheck:yup.array().min(1,"Atleast one checkbox is required!"),
  });

  // Edit Category . update api

  // handle checkbox click
  const handleCheckboxClick = (e) => {
    console.log(e.target);
    const { name, checked } = e.target;
    // console.log(id);

    console.log(name);

    if (name === "ALL") {
      let tempuser = panesData.map((user) => {
        return { ...user, isChecked: checked };
      });
      console.log(tempuser);
      setPanesData(tempuser);
      let SubAdminPanesData = tempuser.filter((user) => user?.isChecked === true);
      FinalData = SubAdminPanesData.map((user) => user?.panelName);
      setPanesDataFinal(FinalData);
      //   var SubAdminPanesDataID=SubAdminPanesData.map(user=>user._id);
    } else {
      let tempuser = panesData.map((user) => (user.panelName === name ? { ...user, isChecked: checked } : user));

      setPanesData(tempuser);
      let SubAdminPanesData = tempuser.filter((user) => user?.isChecked === true);
      FinalData = SubAdminPanesData.map((user) => user?.panelName);
      setPanesDataFinal(FinalData);

      console.log(FinalData);
      console.log(SubAdminPanesData);
    }
  };

  //handle state checkbox click
  // handle checkbox click
  useEffect(() => {
    state && getcheckboxdata();
  }, []);

  const getcheckboxdata = () => {
    let checkbox0 = state.module_access.map((user) => {
      return { panelName: user, isChecked: true };
    });

    let merged = [...checkbox0, ...Panes.filter((user) => !state.module_access.includes(user.panelName))];
    setPanesDataFinal(state.module_access);

    // let checkbox1=checkbox0.concat(Panes)
    // console.log(checkbox1);

    console.log(merged);
    setPanesData(merged);
  };
  //  var data1;
  const handleSateCheckboxClick = (e) => {
    console.log(e.target);
    const { name, checked, value } = e.target;
    // console.log(id);
    console.log(value);
    console.log(checked);
    console.log(name);

    if (name === "ALL") {
      let tempuser = panesData.map((user) => {
        return { ...user, isChecked: checked };
      });
      console.log(tempuser);
      setPanesData(tempuser);
      let SubAdminPanesData = tempuser.filter((user) => user?.isChecked === true);
      FinalData = SubAdminPanesData.map((user) => user?.panelName);

      setPanesDataFinal(FinalData);
    } else {
      let tempuser = panesData.map((user) => (user.panelName === name ? { ...user, isChecked: checked } : user));

      setPanesData(tempuser);
      let SubAdminPanesData = tempuser.filter((user) => user?.isChecked === true);
      console.log(SubAdminPanesData);
      FinalData = SubAdminPanesData.map((user) => user?.panelName);
      console.log(FinalData);
      setPanesDataFinal(FinalData);

      console.log();
      console.log(SubAdminPanesData);
    }
  };

  // ADDING NEW SUB-ADMIN

  const addNewSubAdmin = async (values) => {
    try {
      let profileimageurl = profileImagepath;
      let documentimageurl = documentPath1;
      console.log(profileimageurl);
      console.log(documentimageurl);

      console.log(values);

      console.log(PanesDataFinal);
      const { data } = await axios.post("/admin/createSubAdmin", {
        username: values.name,
        email: values.email,
        mobile_number: values.phone,
        password: values.password,
        // subAdmin_id: values.sub_admin_id,
        img: profileimageurl,
        country_code: `+${dialCode}`,

        module_access: PanesDataFinal,
      });
      props.history.push({
        pathname: "/adminPanel/SubAdmin_Management",
      });
      toast.success("SubAdmin created successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  //Edit SubAdmin
  console.log(PanesDataFinal);
  const EditSubAdmin = async (values) => {
    try {
      let profileimageurl = values.file1;
      let documentimageurl = values.file2;
      console.log(profileimageurl);
      console.log(documentimageurl);

      console.log(values);

      console.log(PanesDataFinal);
      const { data } = await axios.post("/admin/updateSubAdmin", {
        _id: state._id,
        username: values.name || state.username,
        email: values.email || state.email,
        mobile_number: values.phone || state.mobile_number,
        // subAdmin_id: values.sub_admin_id || state.subAdmin_id,
        password: values.password || state.password,
        img: profileimageurl || state.img,
        country_code: state.country_code || `+${dialCode}`,
        // sub_admin_document: documentimageurl,
        module_access: PanesDataFinal,
      });
      props.history.push({
        pathname: "/adminPanel/SubAdmin_Management",
      });
      toast.success("Updated", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  const decodepass = async (pass) => {};
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
                            pathname: "/adminPanel/SubAdmin_Management",
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
                      {!state ? `ADD NEW SUB-ADMIN` : `EDIT SUB-ADMIN`}
                    </h3>
                  </div>
                </Paper>

                {/* //new design */}

                {/* status end */}

                <Paper
                  style={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  <div style={{ margin: "2rem 0 2rem 0" }}>
                    <Formik
                      // validationSchema={validationSchema}
                      initialValues={{
                        name: get(state, "username", ""),
                        email: get(state, "email", ""),
                        password: get(state, "password", ""),
                        phone: get(state, "mobile_number", ""),
                        // sub_admin_id: get(state, "subAdmin_id", ""),
                        file1: get(state, "img", ""),
                        // file2: get(state, "sub_admin_document", ""),
                        //  all: get(state, "access", ""),
                      }}
                      onSubmit={(values) => {
                        console.log(values);
                        if (state && state !== "") {
                          if (PanesDataFinal.length < 1) {
                            alert("Please Select atleast one Panel");
                          } else {
                            EditSubAdmin(values);
                          }
                        } else if (PanesDataFinal.length < 1) {
                          alert("Please Select atleast one Panel");
                        } else {
                          addNewSubAdmin(values);
                        }
                      }}
                    >
                      {({ values, setFieldValue }) => (
                        <Form>
                          <Paper elevation={0} className="px-5">
                            <br />
                            <br />
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-evenly",
                                gap: "1.5%",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "space-evenly",
                                  gap: "0.5%",
                                  alignItems: "baseline",
                                }}
                              >
                                {/* <br /> */}
                                <label className="" style={{}}>
                                  Email:
                                </label>

                                <Field
                                  className=""
                                  name="email"
                                  type="email"
                                  autoComplete="off"
                                  style={{
                                    width: 300,
                                    height: 35,
                                    borderRadius: 5,
                                    borderColor: "#d3d3d3",
                                    borderStyle: "solid",
                                    borderWidth: 1,
                                    paddingInlineStart: 10,
                                  }}
                                  disabled={!state ? false : true}
                                />

                                <KErrorMessage name="email" />
                                <br />
                                {/* <br /> */}
                              </div>
                            </div>
                          </Paper>
                          {/* <br />
                          <br /> */}
                          <Paper elevation={0}>
                            <br />
                            <br />
                            <label
                              style={{
                                fontSize: "20px",
                                display: "block",
                                textAlign: "center",
                              }}
                            >
                              Access for Panels :
                            </label>
                            <br />
                            <div
                              style={{
                                // display:"flex",flexWrap:"wrap",justifyContent:"space-between",gap:"10%",margin:"5px 20px 5px 20px"
                                display: "grid",
                                gridTemplateColumns: "auto auto auto",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  marginRight: 20,
                                  marginLeft: 20,
                                  alignItems: "center",
                                }}
                              >
                                <Checkbox
                                  // className="checkedcolor"

                                  color="primary"
                                  name="ALL"
                                  checked={panesData.filter((user) => user?.isChecked !== true).length < 1}
                                  onChange={handleCheckboxClick}
                                />

                                <label style={{}}>Select All</label>
                              </div>
                              {!state
                                ? panesData.map((pane, index) => (
                                    <>
                                      <div
                                        style={{
                                          display: "flex",
                                          marginRight: 20,
                                          marginLeft: 20,
                                          alignItems: "center",
                                        }}
                                      >
                                        <Checkbox
                                          key={index}
                                          // className="checkedcolor"
                                          color="primary"
                                          name={pane.panelName}
                                          checked={pane?.isChecked || false}
                                          onChange={handleCheckboxClick}
                                        />
                                        <label style={{ display: "block" }} key={index + 1}>
                                          {pane.panelName}
                                        </label>
                                      </div>
                                    </>
                                  ))
                                : panesData.map((pane, index) => (
                                    <>
                                      <div
                                        style={{
                                          display: "flex",
                                          marginRight: 20,
                                          marginLeft: 20,
                                          alignItems: "center",
                                        }}
                                      >
                                        <Checkbox
                                          key={index}
                                          color="primary"
                                          name={pane.panelName}
                                          checked={pane?.isChecked || false}
                                          onChange={handleSateCheckboxClick}
                                          value={pane.panelName}
                                        />
                                        <label style={{ display: "block" }} key={index + 1}>
                                          {pane.panelName}
                                        </label>
                                      </div>
                                    </>
                                  ))}
                            </div>
                            <br />
                            <br />
                          </Paper>
                          {/* <KErrorMessage  /> */}
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

export default AddEdit_SubAdmin;
