import React, { useState, useEffect } from "react";
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

const AddEditSects = (props) => {
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
      if (ele.innerText === "Manage Sects") {
        return ele;
      }
    });
    newres[0].classList.add("activate");
    console.log(newres);
    console.log(result);
  };
  console.log(state);
  //Validation Schema

  const validationSchema = yup.object({
    name: yup
      .string()
      .matches(/^[a-zA-Z ]+$/, "Name is invalid")
      .required("Name is Required!"),
    // desc: yup
    //   .string()
    //   .min(5, "too small!")
    //   .max(500, "Too Long String!")
    //   .required("Required!"),
  });

  // ADDING NEW CATEGORY

  const addNewSect = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.post("/admin/createsect", {
        sect_name: values.name,
      });
      props.history.push({
        pathname: "/adminPanel/Sects_Management",
      });
      toast.success("Sect created successfully", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
    } catch (error) {
      toast.error(error.response.data.message, { position: "top-right" });

      console.log(error.response.data.message);
    }
  };

  // Edit Category . update api

  const EditSect = async (values) => {
    try {
      console.log(values);

      const { data } = await axios.post("/admin/updatesect", {
        _id: state._id,
        sect_name: values.name,
        // is_active: state.is_active,
      });
      props.history.push({
        pathname: "/adminPanel/Sects_Management",
      });
      toast.success("Sect Updated", {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message, { position: "top-right" });
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
                            pathname: "/adminPanel/Sects_Management",
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
                      {!state ? `ADD SECT NAME` : `EDIT SECT NAME`}
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
                        name: get(state, "sect_name", ""),
                        // desc: get(state, "desc", ""),
                      }}
                      onSubmit={(values) => {
                        console.log(values);
                        if (state && state !== "") {
                          EditSect(values);
                        } else {
                          addNewSect(values);
                        }
                      }}
                    >
                      {({ values }) => (
                        <Form>
                          <label className="labelAddCategory" style={{ fontSize: "20px" }}>
                            {!state ? `Add Name` : `Edit Name`} :
                          </label>
                          <Field className="fieldAddCategory" name="name" type="text" />
                          <KErrorMessage name="name" />
                          <br /> <br />
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

export default AddEditSects;
