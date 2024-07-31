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

// import "./AddEditAzan.css";

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

const AddEditAzan = (props) => {
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
  const [profileImagepath, setProfileImagepath] = useState("");

  const fileRef = useRef(null);
  const validationSchema = yup.object({
    name: yup
      .string()
      .matches(/^[a-zA-Z ]+$/, "Name is invalid")
      .required("Name is Required!"),
    file1: yup.string().required("Icon is Required!"),
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

  const EditAzan = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.post("/admin/updateAzan", {
        _id: state._id,
        azan_name: values.name,
        azan_icon: values.file1,
        // is_active: state.is_active,
      });
      props.history.push({
        pathname: "/adminPanel/Azan_Management",
      });
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

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
                            pathname: "/adminPanel/Azan_Management",
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
                      {!state ? `ADD AZAN NAME` : `EDIT AZAN NAME`}
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
                      validationSchema={validationSchema}
                      initialValues={{
                        name: get(state, "azan_name", ""),
                        file1: get(state, "azan_icon", ""),
                        // desc: get(state, "desc", ""),
                      }}
                      onSubmit={(values) => {
                        console.log(values);
                        if (state && state !== "") {
                          EditAzan(values);
                        } else {
                          addNewAzan(values);
                        }
                      }}
                    >
                      {({ values, setFieldValue }) => (
                        <Form>
                          <label className="labelAddCategory" style={{ fontSize: "20px" }}>
                            {!state ? `Add Name` : `Edit Name`} :
                          </label>
                          <Field className="fieldAddCategory" name="name" type="text" />
                          <KErrorMessage name="name" />
                          <br /> <br />
                          <div className="row my-5 align-items-center">
                            <div className="col-lg-4">
                              <label className="" style={{ fontSize: "20px" }}>
                                Upload Icon :
                              </label>
                            </div>
                            <div className="col-lg-4">
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

                            <div className="col-lg-4">
                              {!state && profileImagepath === "" && (
                                <WallpaperIcon style={{ width: "100px", height: "100px" }} />
                              )}
                              {
                                //  !state&&profileImagepath==="" &&( <WallpaperIcon/>)

                                !state && profileImagepath !== "" && (
                                  <img
                                    src={profileImagepath}
                                    alt="..."
                                    style={{
                                      width: "100px",
                                      height: "100px",
                                    }}
                                  />
                                )
                              }
                              {state && values.file1 !== "" && (
                                <img src={values.file1} alt="..." style={{ width: "100px", height: "100px" }} />
                              )}
                              <KErrorMessage name="file1" />
                            </div>
                          </div>
                          {/* <label
                            className="labelAddCategory"
                            style={{ fontSize: "20px" }}
                          >
                            Description of Category:
                          </label>
                          <Field
                            className="fieldAddCategory custom_height"
                            name="desc"
                            as="textarea"
                          />
                          <KErrorMessage name="desc" />
                          <br /> <br /> */}
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

export default AddEditAzan;
