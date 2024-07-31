import React, { useState, useEffect, Component, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
// import Switch from '@mui/material/Switch';
// import { styled } from '@mui/material/styles';
// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'
import {
  Button,
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
  Select,
} from "@material-ui/core";
import JoditEditor from "jodit-react";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
// import { Formik } from "formik";
import { Formik, Form, Field } from "formik";
import { indexOf } from "lodash";
import { submit } from "redux-form";
import * as yup from "yup";
import "./Content_Management.css";
import RSelect from "react-select"
// import { Delete } from '@material-ui/icons';
// import VisibilityIcon from '@material-ui/icons/Visibility';
// import BlockIcon from '@material-ui/icons/Block';
// import ArrowBackIcon from "@material-ui/icons/ArrowBack";

// For Table
// import SearchBar from "material-ui-search-bar";
// import { orderBy } from "lodash";

//history
// import {useHistory} from 'react-router-dom'
// import AddEditCategory from "../AccountManagement/Account_Details";

// import './Category_Management.css' ;
// import EditIcon from '@material-ui/icons/Edit';
// import { DeleteOutline, WidgetsOutlined } from "@material-ui/icons";
// import React, { Component } from 'react';
// import { Editor } from 'react-draft-wysiwyg';
// import { EditorState, convertToRaw, ContentState } from 'draft-js';
// import draftToHtml from 'draftjs-to-html';
// import htmlToDraft from 'html-to-draftjs';
// import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import '../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
// import QNA from './QNA_Component';

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
    maxHeight: "58vh",
  },
  paperPaddingRightLeft: {
    padding: "0rem 1rem",
  },
}));

export default function Content_Management(props) {
  const classes = useStyles();
  //   const registrationForm = useRef();
  //   const [persons,setPerson] = useState([<QNA key={0} />]);
  // const [AllData,setAllData] = useState([]);
  const config = {
    // minHeight: 500,
    buttons: [
      "bold",
      "italic",
      "underline",
      "source",
      "|",
      "image",
      "video",
      "link",
      "|",
      "font",
      "fontsize",
      "brush",
      "eraser",
      "|",
      "align",
      "|",
      "ul",
      "ol",
      "|",
      "undo",
      "redo",
      "|",
      "cut",
      "copy",
      "paste",
      "|",
      "|",
      "about",
    ],
  };
  // const history=useHistory();
  const [inputData, setInputData] = useState();
  const [htmlData, setHtmlData] = useState("");
  //   const [tableData, setTableData] = useState([]);
  const [panelName, setPanelName] = useState("USER");
  const [heading, setHeading] = useState("privacyPolicy");
  const panelOptions=[{label:"USER",value:"USER"},{label:"BROADCAST",value:"BRODCAST"}]
 const headingOptions=[{label:"PRIVACY POLICY",value:"privacyPolicy"},{label:"TERMS AND CONDITIONS",value:"termsAndConditions"},{label:"ABOUT US",value:"aboutUs"},{label:"HELP",value:"help"}]
  const panelData = ["USER", "BRODCAST"];
  const initial_values={
    select1: "privacyPolicy",
    select2: "USER",
  }
  // const[isLoading,setIsLoading]=useState(true);

  // status switch
  // const [checked, setChecked] = useState(true);

  //handle add QnA component

  //   // For Pagination
  //   const [page, setPage] = React.useState(0);
  //   const [rowsPerPage, setRowsPerPage] = React.useState(10);

  //   const handleChangePage = (event, newPage) => {
  // console.log(event);
  // console.log(newPage);
  // setPage(newPage);
  //   };

   useEffect(() => {getContent(initial_values)} , []);

  //get content
  const getContent = async (values) => {
    // setInputData("");
    console.log(values)
    if (values?.select1 !== "" && values?.select2 !== "") {
      try {
        const { data } = await axios.get(
          `/admin/readContent?createdFor=${values.select2}&contentHeading=${values.select1}`
        );
        console.log(data);
        setInputData(data);
        // setTableData(data.data)
        // setSearchedData(data.user)
        // setIsLoading(false)
      } catch (error) {
        console.log(error);
      }
    } else if (values.select2 === "") {
      toast.info("Please Select Panel", {
        position: "top-right",
      });
      setInputData("");
    } else if (values.select1 === "") {
      toast.info("Please Select Heading", {
        position: "top-right",
      });
      setInputData("");
    }
  };

  // creation and updation
  const Create_Update = async (values) => {
    if (
      inputData !== "" &&
      inputData !== "<p><br></p>" &&
      heading &&
      panelName
    ) {
      try {
        console.log(heading,panelName);

        const { data } = await axios.post(
          `/admin/createContent?contentHeading=${heading}`,
          {
            // contentId:,
            contentText: `${inputData}`,
            createdFor: panelName,
          }
        );
        console.log(data);
        toast.success("Content Saved Successfully");
        getContent();
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Text and Selection fields cannot be blank");
    }
  };

  //edit  categories attribute

  // status switch

  // useMemo(() => {
  //   const SettingData = (newContent) => {
  //     // setInputData(JSON.stringify(newContent));
  //     setInputData(newContent);
  //     console.log(newContent);
  //   }
  // }, [newContent]);

  const SettingData = (newContent) => {
    // setInputData(JSON.stringify(newContent));
    setInputData(newContent);
    console.log(newContent);
  };

  let validationSchema = yup.object().shape({
    select1: yup.string().required("heading is required"),
    select2: yup.string().required("panel is required"),
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper>
            <div className={classes.paperPaddingRightLeft}>
              <div className="py-4">
                <Paper
                  elevation={0}
                  className={classNames(
                    classes.paperHeading,
                    classes.headingAlignment
                  )}
                >
                  <h3 style={{}}>Manage Settings</h3>

                  <Formik
                    //   validationSchema={validationSchema}
                    initialValues={initial_values}
                    onSubmit={(values) => {
                      if (values.select1 === "" && values.select2 === "") {
                        toast.info("Please select Panel and Heading", {
                          position: toast.POSITION.TOP_RIGHT,
                        });
                      } else {
                        getContent(values);
                      }

                      console.log(values);
                    }}
                  >
                    {({ values, setFieldValue, handleSubmit }) => (
                      <Form style={{display:"flex",gap:"0.5em"}}>
                        {/* <label className="" style={{ }}>
                                Name:
                              </label> */}
                        &emsp;
                        <div  style={{
                            width: "200px",
                           
                          }}><RSelect   
                        defaultValue={{label:"USER",value:"USER"}}
                        
                           options={panelOptions}  
                            onChange={(e) => {
                            setFieldValue("select2", e.value);
                            setPanelName(e.value);
                            handleSubmit();
                          }} isSearchable={false}/></div>
                         <div  style={{
                            width: "200px",
                           
                          }}><RSelect 
                          defaultValue={{label:"PRIVACY POLICY",value:"privacyPolicy"}}
                        
                        options={headingOptions}
                         isSearchable={false}
                         onChange={(e) => {
                          setFieldValue("select1", e.value);
                          setHeading(e.value);
                          handleSubmit();
                        }}
                         /></div>
                       
                        {/* <Field
                          className=""
                          name="select2"
                          // variant="outlined"
                          as="select"
                          // inputProps={{name: "name"}}
                          onChange={(e) => {
                            setFieldValue("select2", e.target.value);
                            setPanelName(e.target.value);
                            handleSubmit();
                          }}
                         
                          style={{
                            width: 200,
                            height: 35,
                            borderRadius: 5,
                            borderColor: "#d3d3d3",
                            borderStyle: "solid",
                            borderWidth: 1,
                            paddingInlineStart: 10,
                          }}
                        >
                          <option value="">Select Panel</option>
                          <option value="USER">USER</option>
                          <option value="BRODCAST">BROADCAST</option>
                       
                        </Field> */}
                        {/* &emsp; */}
                        {/* <Field
                          className=""
                          name="select1"
                          // variant="outlined"
                          as="select"
                          // inputProps={{name: "name"}}
                          onChange={(e) => {
                            setFieldValue("select1", e.target.value);
                            setHeading(e.target.value);
                            handleSubmit();
                          }}
                         
                          style={{
                            width: 200,
                            height: 35,
                            borderRadius: 5,
                            borderColor: "#d3d3d3",
                            borderStyle: "solid",
                            borderWidth: 1,
                            paddingInlineStart: 10,
                          }}
                        >
                          <option value="">Select Heading</option>
                          <option value="privacyPolicy">PRIVACY POLICY</option>
                          <option value="termsAndConditions">
                            TERMS AND CONDITIONS
                          </option>
                          <option value="aboutUs">ABOUT US</option>
                          <option value="help">HELP</option>
                        
                        </Field> */}
                       
                        <br />
                      </Form>
                    )}
                  </Formik>
                </Paper>

                {/* //new design */}

                {/* <br /> */}

                {/* status end */}

                <Paper>
                  <div className="customHeight">
                    <JoditEditor
                      config={{
                        askBeforePasteFromWord: false,
                        askBeforePasteHTML: false,
                        defaultActionOnPaste: "insert_only_text",
                        readonly: false,
                      }}
                      value={inputData}
                      onBlur={(newContent) => {
                        SettingData(newContent);
                      }}

                      // value={category.data?.answer}
                      // config={config}
                      // ref={editor}
                      // value={content}
                      // config={config}
                      //tabIndex={1} // tabIndex of textarea
                      //onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                    />
                  </div>
                  <br />
                  <Button
                    variant="contained"
                    style={{ color: "white", backgroundColor: "#0e3f37" }}
                    onClick={() => {
                      Create_Update();
                    }}
                  >
                    Save
                  </Button>
                  <br />
                  <br />
                </Paper>
                <Paper></Paper>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </React.Fragment>
  );
}
