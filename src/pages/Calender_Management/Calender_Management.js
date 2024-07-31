import React, { useState, useEffect, useRef } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Select,
  Button,
  IconButton,
  Tooltip,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
// import Select from "../Select";
// import Overlay from "../Overlay";
// import { withRouter } from "react-router-dom";
// import { connect } from "react-redux";
// import * as actionTypes from "../../store/actions";
import * as xlsx from "xlsx";
import exceldoc from "../../assets/images/exceldoc.png";
import EditIcon from "@material-ui/icons/Edit";
import { ArrowDownward, DeleteOutline, VisibilityOutlined, WidgetsOutlined } from "@material-ui/icons";
import moment from "moment";

import { DashboardContainer, DashboardWrapper, DashboardHeading, DashHeading, MenuAndBack } from "./DashboardElements";
import axios from "../../axios";
import { toast } from "react-toastify";
import classNames from "classnames";
import RSelect from "react-select";
// import { Field } from "formik";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Formik, Field, Form } from "formik";
import KErrorMessage from "./KErrorMessage";
import { Close } from "@material-ui/icons";
import * as yup from "yup";
import SearchBar from "material-ui-search-bar";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { get, groupBy, filter } from "lodash";
import { CSVLink, CSVDownload } from "react-csv";
import { JsonToExcel } from "react-json-to-excel";
import ReactExport from "react-data-export";

import NoDataFound from "../../components/NoDataFound";
import AddIcon from "@material-ui/icons/Add";
import "./Calendar.css";
import * as download from "json-as-xlsx";
// import { ExcelFile, ExcelSheet } from "react-data-export";
const ExcelFile = ReactExport.ExcelFile;
const ExcelSheet = ReactExport.ExcelFile.ExcelSheet;
const ExcelColumn = ReactExport.ExcelFile.ExcelColumn;
// const ExcelRow = ReactExport.ExcelFile.ExcelRow;

const useStyles = makeStyles((theme) => ({
  textMiddle: {
    verticalAlign: "middle !important",
    textAlign: "center",
  },
  tablePadding: {
    padding: "0.5rem",
    textAlign: "center",
    fontSize: "0.8rem",
  },
  paperTableHeight: {
    // height: "650px",
    width: "95%",
    marginLeft: "2rem",
    display: "flex",
    // justifyContent: "space-between",
    flexDirection: "column",
  },
  "@media (max-width: 780px)": {
    paperTableHeight: {
      marginLeft: "0.75rem",
    },
  },
  "@media (max-width: 480px)": {
    paperTableHeight: {
      marginLeft: "0.75rem",
    },
  },
  tablePaginationStyle: {
    border: "1px solid #0000001a",
    borderRadius: "0rem 0rem 0.4rem 0.4rem",
  },
  tableFlex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
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
const Dashboard = (props) => {
  const {
    location: { state },
  } = props;
  const refClick = useRef();
  const [downloadCsvData, setCSVData] = useState([]);
  const [downloadexcel, setDownloadExcelData] = useState([]);
  let settings = {
    fileName: "MySpreadsheet", // Name of the resulting spreadsheet
    extraLength: 3, // A bigger number means that columns will be wider
    writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
    writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
    RTL: true, // Display the columns from right-to-left (the default value is false)
  };
  // downloadCsvData.map((ele) => ({ date: "", start: "", end: "" }));

  const dataSet2 = [
    {
      name: "Johnson",
      total: 25,
      remainig: 16,
    },
    {
      name: "Josef",
      total: 25,
      remainig: 7,
    },
  ];

  const classes = useStyles();
  const excelfile = useRef(null);
  const [dataSetFajr1, setDataSetFajr1] = useState([]);
  const [dataDownload, setDataDownload] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [workBookData, setWorkBookData] = useState([]);
  const [menuData, setMenuData] = useState([]);
  const [sendData, setSendData] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [showpassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [editData, seteditData] = useState([]);
  const [yearData, setYearData] = useState([]);
  const [yearValue, setYearValue] = useState();
  const [JanState, setJanState] = useState([]);
  const [loader, setLoader] = useState(true);
  const [calendarYear, setCalenderYear] = useState(
    state && state !== undefined ? state.calendarYear : `${new Date().getFullYear()}`
  );
  // const [nameEdit, setNameEdit] = useState(false);
  // const [FileEdit, setFileEdit] = useState(false);
  const [editAll, setEditAll] = useState({
    name: false,
    file: false,

    // editboth: false,
    addboth: false,
  });
  const optionsMonth = [
    { value: "Jan", label: "January" },
    { value: "Feb", label: "February" },
    { value: "March", label: "March" },
    { value: "April", label: "April" },
    { value: "May", label: "May" },
    { value: "June", label: "June" },
    { value: "July", label: "July" },
    { value: "Aug", label: "August" },
    { value: "Sep", label: "September" },
    { value: "Oct", label: "October" },
    { value: "Nov", label: "November" },
    { value: "Dec", label: "December" },
  ];
  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  useEffect(() => {
    if (state && state !== undefined) {
      setYearValue(state.yearValue);
      getCalenderdata(state.calendarYear);
      getCalendarYears();
    } else {
      getCalenderdata();
      getCalendarYears();
    }
  }, [state]);
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const getCalenderdata = async (year = calendarYear) => {
    try {
      setLoader(true);
      const { data } = await axios.get(`/common/getAllCalendarName?year=${year}`);
      console.log(data);

      setExcelData(data.data);
      setSearchedData(data.data);
      setLoader(false);
    } catch (err) {
      setLoader(false);
      console.log(err);
    }
    // setCalenderData(data.data);
  };
  const getCalendarYears = async () => {
    const { data } = await axios.get("/common/getYearsOfCalendar");
    let yearsOptions = data.data.map((ele) => ({ label: ele, value: ele }));
    // yearsOptions.unshift({ label: "All", value: "" });
    setYearData(yearsOptions);

    console.log("calender yearsss", data);
  };

  // For Search
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);

  const requestSearch = (searchedVal) => {
    console.log(searchedVal);

    const filteredRows = searchedData.filter((row) => {
      let name = row.calendar_name;
      // let email = row.email_id;
      return name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setExcelData(filteredRows);
  };

  const cancelSearch = () => {
    getCalenderdata();
  };

  const getCalenderFiltereddata = async (id, Selectedmonth) => {
    const { data } = await axios.get(`/admin/getCalendar?calendar_id=${id}`);
    console.log(data);
    // setExcelData(data.data);
    if (Selectedmonth) {
      let fileteredCalenderData = data.data[0].sheet_data.filter((item) => item.month.includes(Selectedmonth));
      setMenuData(fileteredCalenderData.month_data);
    } else {
      setMenuData(data.data[0].sheet_data[0].month_data);
    }
  };

  // const readUploadFile = (e) => {
  //   e.preventDefault();
  //   if (e.target.files) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       const data = e.target.result;
  //       console.log(data);
  //       const workbook = xlsx.read(data, { type: "Array" });
  //       console.log(workbook);
  //       setWorkBookData(workbook);
  //       let arraySheetData = [];
  //       for (let i = 0; i < workbook.SheetNames.length; i++) {
  //         let mon = workbook.SheetNames[i].replace("2022", "");
  //         let object = {
  //           month: mon,
  //           year: workbook.SheetNames[0].substr(-4),
  //           data: [],
  //         };
  //         const sheetName = workbook.SheetNames[i];
  //         console.log(sheetName);
  //         const worksheet = workbook.Sheets[sheetName];
  //         console.log(worksheet);
  //         let Arrayd = worksheet;
  //         let row1 = {};
  //         console.log(Arrayd);
  //         Object.entries(Arrayd).forEach(([key, value], index) => {
  //           Object.assign(row1, { [key]: value.w });
  //         });

  //         const groupByCategory = [row1].reduce((group, product) => {
  //           console.log(group);
  //           console.log(product);
  //           let data = [];
  //           let rows = 33;
  //           for (let i = 0; i < rows; i++) {
  //             let object1 = {
  //               A1: product["A".concat("", i + 1)],
  //               B1: product["B".concat("", i + 1)],
  //               C1: product["C".concat("", i + 1)],
  //               D1: product["D".concat("", i + 1)],
  //               E1: product["E".concat("", i + 1)],
  //               F1: product["F".concat("", i + 1)],
  //               G1: product["G".concat("", i + 1)],
  //               H1: product["H".concat("", i + 1)],
  //               I1: product["I".concat("", i + 1)],
  //               J1: product["J".concat("", i + 1)],
  //               K1: product["K".concat("", i + 1)],
  //               L1: product["L".concat("", i + 1)],
  //               M1: product["M".concat("", i + 1)],
  //             };
  //             data.push(object1);
  //           }
  //           // for (let i = 0; i < rows; i++) {
  //           //   let object1 = {
  //           //     firstRow: product["A".concat("", i + 1)],
  //           //     date: product["A".concat("", i + 2)],
  //           //     day: product["B".concat("", i + 2)],
  //           //     fajrBegins: product["C".concat("", i + 2)],
  //           //     fajrJamat: product["D".concat("", i + 2)],

  //           //     zuhrSunrise: product["E".concat("", i + 2)],
  //           //     zuhrBegins: product["F".concat("", i + 2)],
  //           //     zuhrJamat: product["G".concat("", i + 2)],

  //           //     asrBegins: product["H".concat("", i + 2)],
  //           //     asrJamat: product["I".concat("", i + 2)],

  //           //     maghribbegins: product["J".concat("", i + 2)],
  //           //     maghribJamat: product["K".concat("", i + 2)],

  //           //     ishaBegins: product["L".concat("", i + 2)],
  //           //     ishaJamat: product["M".concat("", i + 2)],
  //           //   };
  //           //   data.push(object1);
  //           // }
  //           return data;
  //         }, {});
  //         console.log(data);
  //         object.month_data = groupByCategory;
  //         arraySheetData.push(object);
  //       }
  //       // setMenuData(groupByCategory);
  //       // const json = xlsx.utils.sheet_to_json(worksheet);

  //       for (let i = 0; i < arraySheetData.length; i++) {
  //         let data = arraySheetData[i].month_data;
  //         console.log(data[0]);
  //         if (
  //           data[0].C1 == "Fajr" ||
  //           data[0].F1 == "Zuhr" ||
  //           data[0].H1 == "Asr" ||
  //           data[0].J1 == "Maghrib" ||
  //           data[0].L1 == "Isha"
  //         ) {
  //           alert("file is ok");
  //           for (let i = 0; i < workbook.SheetNames.length; i++) {
  //             let mon = workbook.SheetNames[i].replace("2022", "");
  //             let object = {
  //               month: mon,
  //               year: workbook.SheetNames[0].substr(-4),
  //               data: [],
  //             };
  //             const sheetName = workbook.SheetNames[i];
  //             console.log(sheetName);
  //             const worksheet = workbook.Sheets[sheetName];
  //             console.log(worksheet);
  //             let Arrayd = worksheet;
  //             let row1 = {};
  //             console.log(Arrayd);
  //             Object.entries(Arrayd).forEach(([key, value], index) => {
  //               Object.assign(row1, { [key]: value.w });
  //             });

  //             const groupByCategory = [row1].reduce((group, product) => {
  //               let data = [];
  //               let rows = 33;
  //               for (let i = 0; i < rows; i++) {
  //                 let object1 = {
  //                   firstRow: product["A".concat("", i + 1)],
  //                   date: product["A".concat("", i + 2)],
  //                   day: product["B".concat("", i + 2)],
  //                   fajrBegins: product["C".concat("", i + 2)],
  //                   fajrJamat: product["D".concat("", i + 2)],

  //                   zuhrSunrise: product["E".concat("", i + 2)],
  //                   zuhrBegins: product["F".concat("", i + 2)],
  //                   zuhrJamat: product["G".concat("", i + 2)],

  //                   asrBegins: product["H".concat("", i + 2)],
  //                   asrJamat: product["I".concat("", i + 2)],

  //                   maghribbegins: product["J".concat("", i + 2)],
  //                   maghribJamat: product["K".concat("", i + 2)],

  //                   ishaBegins: product["L".concat("", i + 2)],
  //                   ishaJamat: product["M".concat("", i + 2)],
  //                 };
  //                 data.push(object1);
  //               }
  //               return data;
  //             }, {});
  //             console.log(data);
  //             object.month_data = groupByCategory;
  //             arraySheetData.push(object);
  //             setMenuData(arraySheetData);
  //             setSendData(arraySheetData);
  //           }
  //           return;
  //         } else {
  //           alert("file is not ok");
  //           return;
  //         }

  //         // }
  //       }

  //       // // uploadCalenderData(arraySheetData);
  //       setOpen(true);
  //     };
  //     reader.readAsArrayBuffer(e.target.files[0]);
  //   }
  // };
  const readUploadFiled = (e) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "Array" });
        setWorkBookData(workbook);
        let arraySheetData = [];
        for (let i = 0; i < workbook.SheetNames.length; i++) {
          let mon = workbook.SheetNames[i];
          let object = {
            month: mon,
            year: workbook.SheetNames[0].substr(-4),
            month_data: [],
          };
          const sheetName = workbook.SheetNames[i];
          const worksheet = workbook.Sheets[sheetName];
          let Arrayd = worksheet;
          let row1 = {};
          Object.entries(Arrayd).forEach(([key, value], index) => {
            Object.assign(row1, { [key]: value.w });
          });
          console.log(row1);

          let dataToCheck = [];
          let product = row1;
          console.log(product);
          let object1 = {
            A1: product["A1"],
            B1: product["B1"],
            C1: product["C1"],
            D1: product["D1"],
            E1: product["E1"],
            F1: product["F1"],
            G1: product["G1"],
            H1: product["H1"],
            I1: product["I1"],
            J1: product["J1"],
            K1: product["K1"],
            L1: product["L1"],
            M1: product["M1"],
          };
          dataToCheck.push(object1);

          console.log(dataToCheck);

          if (
            dataToCheck[0].C1 == "Fajr" &&
            dataToCheck[0].F1 == "Zuhr" &&
            dataToCheck[0].H1 == "Asr" &&
            dataToCheck[0].J1 == "Maghrib" &&
            dataToCheck[0].L1 == "Isha"
          ) {
            console.log(`file is correct for month ${mon}`);
            const groupByCategory = [row1].reduce((group, product) => {
              let data = [];
              let rows = 33;
              for (let i = 0; i < rows; i++) {
                if (i === 0) {
                  let object2 = {
                    A1: product["A1"],
                    B1: product["B1"],
                    C1: product["C1"],
                    D1: product["D1"],
                    E1: product["E1"],
                    F1: product["F1"],
                    G1: product["G1"],
                    H1: product["H1"],
                    I1: product["I1"],
                    J1: product["J1"],
                    K1: product["K1"],
                    L1: product["L1"],
                    M1: product["M1"],
                  };
                  data.push(object2);
                } else {
                  let object1 = {
                    date: product["A".concat("", i + 2)],
                    day: product["B".concat("", i + 2)],

                    fajrBegins: product["C".concat("", i + 2)],
                    fajrJamat: product["D".concat("", i + 2)],

                    sunrise: product["E".concat("", i + 2)],
                    zuhrBegins: product["F".concat("", i + 2)],
                    zuhrJamat: product["G".concat("", i + 2)],

                    asrBegins: product["H".concat("", i + 2)],
                    asrJamat: product["I".concat("", i + 2)],

                    maghribbegins: product["J".concat("", i + 2)],
                    maghribJamat: product["K".concat("", i + 2)],

                    ishaBegins: product["L".concat("", i + 2)],
                    ishaJamat: product["M".concat("", i + 2)],
                  };
                  data.push(object1);
                }
              }
              return data;
            }, {});
            object.month_data = groupByCategory;
            arraySheetData.push(object);
          } else {
            toast.error(`Please check file format for month ${mon}`, {
              position: toast.POSITION.TOP_RIGHT,
            });
          }
        }
        console.log("arraySheetData", arraySheetData);
        setMenuData(arraySheetData);
        setSendData(arraySheetData);
        setOpen(true);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  // const extractSheetMonthData = (e) => {
  //   let workbook = e.data;

  //   console.log(workbook);
  //   const sheetName = workbook.SheetNames[e.value];
  //   console.log(sheetName);
  //   const worksheet = workbook.Sheets[sheetName];
  //   console.log(worksheet);
  //   let Arrayd = worksheet;
  //   let row1 = {};
  //   console.log(Arrayd);
  //   Object.entries(Arrayd).forEach(([key, value], index) => {
  //     Object.assign(row1, { [key]: value.w });
  //   });

  //   const groupByCategory = [row1].reduce((group, product) => {
  //     let data = [];
  //     let rows = 33;
  //     for (let i = 0; i < rows; i++) {
  //       let object1 = {
  //         date: product["A".concat("", i + 2)],
  //         day: product["B".concat("", i + 2)],
  //         fajrBegins: product["C".concat("", i + 2)],
  //         fajrJamat: product["D".concat("", i + 2)],
  //         zuhrSunrise: product["E".concat("", i + 2)],
  //         zuhrBegins: product["F".concat("", i + 2)],
  //         asrJamat: product["G".concat("", i + 2)],
  //         asrBegins: product["H".concat("", i + 2)],
  //         maghribJamat: product["I".concat("", i + 2)],
  //         maghribbegins: product["J".concat("", i + 2)],
  //         ishaJamat: product["K".concat("", i + 2)],
  //         ishaBegins: product["L".concat("", i + 2)],
  //         ishaJamat2: product["M".concat("", i + 2)],
  //       };
  //       data.push(object1);
  //     }
  //     return data;
  //   }, {});
  //   setMenuData(groupByCategory);
  //   uploadCalenderData(groupByCategory);
  // };

  const options = [
    { value: "0", label: "January" },
    { value: "1", label: "February" },
    { value: "2", label: "March" },
    { value: "3", label: "April" },
    { value: "4", label: "May" },
    { value: "5", label: "June" },
    { value: "6", label: "July" },
    { value: "7", label: "August" },
    { value: "8", label: "September" },
    { value: "9", label: "October" },
    { value: "10", label: "November" },
    { value: "11", label: "December" },
  ];
  console.log(menuData);
  console.log(editData);
  const uploadCalenderData = async (e) => {
    // let sheet_data = {
    //   calendar_name: "test2",
    //   sheet_data: e,
    // };
    // console.log(sheet_data);
    // try {
    //   const { data } = await axios.post("/admin/createCalendar", sheet_data);
    //   toast.success(data.message, {
    //     position: toast.POSITION.TOP_RIGHT,
    //   });
    //   console.log(data);
    // } catch (error) {
    //   console.log(error.response.status);
    // }
  };

  const validationSchema = yup.object({
    // email: yup.string().required("Email is Required!"),
    name: yup
      .string()
      .matches(/^[a-zA-Z ]+$/, "Name is invalid")
      .required("Name is Required!"),
    // upload: yup.mixed().required("File is Required!"),
  });
  const valuesSubmit = async (values) => {
    let sheet_data = {
      calendar_name: values.name,
      sheet_data: sendData,
    };
    console.log(sheet_data);

    try {
      const { data } = await axios.post("/admin/createCalendar", sheet_data);
      console.log(sheet_data);
      setSendData([]);
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      setOpen(false);
      getCalenderdata();
      console.log(data);
    } catch (error) {
      console.log(error.response.status);
      console.log(error.response);
      if (error.response.status === 401) {
        toast.error(error.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
  };

  const ViewCalender = (id) => {
    let apiHit = {
      calendarYear: calendarYear,
      yearValue: yearValue,
      page: page + 1,
      limit: rowsPerPage,
    };
    props.history.push({
      pathname: "/adminPanel/CalenderView",
      state: [id, apiHit],
    });
  };

  const DeleteCalender = async (id) => {
    if (window.confirm("Are you sure you want to delete this Calender?")) {
      try {
        //  console.log(category);
        const { data } = await axios.post(`/admin/deleteCalendar`, {
          unique_id: id,
        });
        console.log(data);
        getCalenderdata();
        toast.success("Calendar Deleted", {
          position: toast.POSITION.TOP_RIGHT,
        });
      } catch (error) {
        console.log(error);
        if (error.response.status === 400) {
          toast.error(error.response.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          });
        }
      }
    } else {
      // toast.error("Operation Cancelled", {
      //   position: toast.POSITION.TOP_RIGHT,
      // });
    }
  };

  const getEditCalender = async (id) => {
    const { data } = await axios.get(`/admin/getCalendar?unique_id=${id}`);
    console.log(data.data);
    seteditData(data.data);
    setOpen(true);

    // seteditData(data.data);
    // console.log(data);
  };

  console.log("state", state);
  const valuesEditedCalender = async (values) => {
    try {
      const { data } = await axios.post(`/admin/updateCalendar`, {
        unique_id: editData[0].unique_id,
        calendar_name: values.name || editData[0].calendar_name,
        sheet_data: editAll.file ? sendData : [],
      });
      seteditData([]);
      setOpen(false);
      getCalenderdata();

      toast.success("Updated", {
        position: toast.POSITION.TOP_RIGHT,
      });
    } catch (error) {
      console.log(error);
      if (error.response.status === 401 || error.response.status === 400) {
        toast.error(error.response.data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    }
    console.log(sendData);
    console.log(values);
    console.log(editData);
    console.log(sendData);
  };
  // console.log(editData);
  const getEditCalenderName = async (id) => {};

  async function getCalenderFiltereddataCSV(id, Selectedmonth) {
    const { data } = await axios.get(`/admin/getCalendar?unique_id=${id}`);
    console.log(data.data);
    // setExcelData(data.data);
    if (Selectedmonth) {
      let fileteredCalenderData = data.data[Selectedmonth].azan_timing;
      // let finalData = fileteredCalenderData.unshift({ Lemon: "Pineapple" });
      console.log(fileteredCalenderData);
      setCSVData(fileteredCalenderData);
    } else {
      let FajrArray1;
      let ZuhrArray1;
      let AsrArray1;
      let MaghribArray1;
      let IshaArray1;
      let DateArray1;
      let SunriseArray1;
      setCSVData(data.data.map((ele) => ele.azan_timing));
      let MonthArray = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      for (let i = 0; i < MonthArray.length; i++) {
        //  let MonthArray[i] = data.data[i].azan_timing.map((ele) => ele)
      }
      let Jan = data.data[0].azan_timing.map((ele) => ele);

      let Feb = data.data[1].azan_timing.map((ele) => ele);
      let Mar = data.data[2].azan_timing.map((ele) => ele);
      let Apr = data.data[3].azan_timing.map((ele) => ele);
      let May = data.data[4].azan_timing.map((ele) => ele);
      let Jun = data.data[5].azan_timing.map((ele) => ele);
      let Jul = data.data[6].azan_timing.map((ele) => ele);
      let Aug = data.data[7].azan_timing.map((ele) => ele);
      let Sep = data.data[8].azan_timing.map((ele) => ele);
      let Oct = data.data[9].azan_timing.map((ele) => ele);
      let Nov = data.data[10].azan_timing.map((ele) => ele);
      let Dec = data.data[11].azan_timing.map((ele) => ele);

      // let loadedData1 = data.data[0].map((ele) => ele.azan_timing);
      console.log("loaded", Jan);
      FajrArray1 = Jan.map((ele) => ele.Fajr);
      let dataSetFajr1 = FajrArray1.map((ele) => ({ BeginFajr: ele.start, EndFajr: ele.end }));
      setDataSetFajr1(dataSetFajr1);
      SunriseArray1 = Jan.map((ele) => ele.sunrise);
      DateArray1 = Jan.map((ele) => ele.date);
      let DayArray1 = Jan.map((ele) => ele.day);
      console.log("fajrrr", FajrArray1);

      // console.log("fajrrr", dataSetFajr1);
      ZuhrArray1 = Jan.map((ele) => ele.Zuhr);
      let dataSetZuhr1 = ZuhrArray1.map((ele) => ({ BeginZuhr: ele.start, EndZuhr: ele.end }));

      AsrArray1 = Jan.map((ele) => ele.Asr);
      let dataSetAsr1 = AsrArray1.map((ele) => ({ BeginAsr: ele.start, EndAsr: ele.end }));

      MaghribArray1 = Jan.map((ele) => ele.Maghrib);
      let dataSetMaghrib1 = MaghribArray1.map((ele) => ({ BeginMaghrib: ele.start, EndMaghrib: ele.end }));

      IshaArray1 = Jan.map((ele) => ele.Isha);
      let dataSetIsha1 = IshaArray1.map((ele) => ({ BeginIsha: ele.start, EndIsha: ele.end }));

      console.log(data);

      let finalArray = [{}];
      let JanAllDataArray = [
        ...dataSetFajr1,
        ...dataSetZuhr1,
        ...dataSetAsr1,
        ...dataSetMaghrib1,
        ...dataSetIsha1,
        ...DateArray1,
        ...SunriseArray1,
      ];
      let content = Jan.map((ele, i) => ({
        date: DateArray1[i],
        day: DayArray1[i],
        beginFajr: dataSetFajr1[i].BeginFajr,
        endFajr: dataSetFajr1[i].EndFajr,
        sunriseFajr: SunriseArray1[i],
        beginZuhr: dataSetZuhr1[i].BeginZuhr,
        endZuhr: dataSetZuhr1[i].EndZuhr,
        beginAsr: dataSetAsr1[i].BeginAsr,
        endAsr: dataSetAsr1[i].EndAsr,
        beginMaghrib: dataSetMaghrib1[i].BeginMaghrib,
        endMaghrib: dataSetMaghrib1[i].EndMaghrib,
        beginIsha: dataSetIsha1[i].BeginIsha,
        endIsha: dataSetIsha1[i].EndIsha,
      }));
      let dataDownloadCopy = MonthArray.map((ele) => ({
        sheet: ele,
        columns: [
          { label: "Date", value: "date" }, // Top level data
          { label: "Day", value: "day" }, // Custom format
          { label: "Begin_Fajr", value: "beginFajr" }, // Run functions
          { label: "Jamat_Fajr", value: "endFajr" },
          { label: "Sunrise_Fajr", value: "sunriseFajr" },
          { label: "Begin_Zuhr", value: "beginZuhr" }, // Run functions
          { label: "Jamat_Zuhr", value: "endZuhr" },
          { label: "Begin_Asr", value: "beginAsr" }, // Run functions
          { label: "Jamat_Asr", value: "endAsr" },
          { label: "Begin_Maghrib", value: "beginMaghrib" }, // Run functions
          { label: "Jamat_Maghrib", value: "endMaghrib" },
          { label: "Begin_Isha", value: "beginIsha" }, // Run functions
          { label: "Jamat_Isha", value: "endIsha" },
        ],
        content: content,
      }));
      console.log("alldata", JanAllDataArray);
      let dataDownload = dataDownloadCopy;
      // let dataDownload = [
      //   {
      //     sheet: "Jan",
      //     columns: [
      //       { label: "Date", value: "date" }, // Top level data
      //       { label: "Day", value: "day" }, // Custom format
      //       { label: "Begin_Fajr", value: "beginFajr" }, // Run functions
      //       { label: "Jamat_Fajr", value: "endFajr" },
      //       { label: "Sunrise_Fajr", value: "sunriseFajr" },
      //       { label: "Begin_Zuhr", value: "beginZuhr" }, // Run functions
      //       { label: "Jamat_Zuhr", value: "endZuhr" },
      //       { label: "Begin_Asr", value: "beginAsr" }, // Run functions
      //       { label: "Jamat_Asr", value: "endAsr" },
      //       { label: "Begin_Maghrib", value: "beginMaghrib" }, // Run functions
      //       { label: "Jamat_Maghrib", value: "endMaghrib" },
      //       { label: "Begin_Isha", value: "beginIsha" }, // Run functions
      //       { label: "Jamat_Isha", value: "endIsha" },
      //     ],
      //     content: content,
      //   },
      //   {
      //     sheet: "Children",
      //     columns: [
      //       { label: "User", value: "user" }, // Top level data
      //       { label: "Age", value: "age", format: '# "years"' }, // Column format
      //       { label: "Phone", value: "more.phone", format: "(###) ###-####" }, // Deep props and column format
      //     ],
      //     content: [
      //       { user: "Manuel", age: 16, more: { phone: 9999999900 } },
      //       { user: "Ana", age: 17, more: { phone: 8765432135 } },
      //     ],
      //   },
      // ];
      setDownloadExcelData(dataDownload);
    }
  }
  console.log("january", dataSetFajr1);
  // let dataSetFajr1 = FajrArray?.map((ele) => ({ Begin: ele.start, End: ele.end }));
  //   [
  //   FajrArray?.map((ele) => ({ Begin: ele.start, End: ele.end })),
  //   {
  //     Begin: FajrArray?.map((ele) => ele.start),
  //     End: FajrArray?.map((ele) => ele.end),
  //   },
  // ];

  const csvData = downloadCsvData.map((item) => ({
    "Date of Joining": moment(item.createdAt).format("YYYY-MM-DD"),
    // new Date(item.createdAt).getDate() +
    // "/" +
    // new Date(item.createdAt).getMonth() +
    // "/" +
    // new Date(item.createdAt).getFullYear(),
    "Mosque Name": item.name,
    "Mobile Number": get(item, "country_code", "") + " " + get(item, "mobile_number", ""),
    "Email Id": item.email_id,
    Location: item.location,
    "Channel Name": item.channel_name,
    "Total Listeners": item.active_listener,
    Status: item.is_live ? "LIVE" : "NOT LIVE",
  }));
  const headers = [
    { label: "Date of Joining", key: "Date of Joining" },
    { label: "Mosque Name", key: "Mosque Name" },
    { label: "Mobile Number", key: "Mobile Number" },
    { label: "Email Id", key: "Email Id" },
    { label: "Location", key: "Location" },
    { label: "Channel Name", key: "Channel Name" },
    { label: "Total Listeners", key: "Total Listeners" },
    { label: "Status", key: "Status" },
  ];

  const csvLink = {
    filename: "Calender.csv",
    headers: headers,
    data: csvData,
  };

  console.log(downloadCsvData);
  console.log(yearData.filter((ele) => ele.value == new Date().getFullYear()));

  // const exportToExcel = () => {
  //   const fileType = "xlsx";
  //   const ws = XLSX.utils.json_to_sheet(data);
  //   const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
  //   const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  //   const newData = new Blob([excelBuffer], { type: fileType });
  //   FileSaver.saveas(data, "MyFile" + ".xlsx");
  // };

  console.log("editAll", editAll);
  return (
    <>
      <div className="page-content">
        <div className={classes.root}>
          <Paper>
            <div className={classes.paperPaddingRightLeft}>
              {/* <div className="py-4"> */}
              <div className="">
                <Paper elevation={0} className={classNames(classes.paperHeading, classes.headingAlignment)}>
                  <h3 style={{}}>Manage Calendar</h3>
                  <SearchBar
                    // value={searched}
                    className="heightfix"
                    onChange={(searchVal) => requestSearch(searchVal)}
                    onCancelSearch={() => cancelSearch()}
                    placeholder="Search by Calendar Name"
                  />
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ fontSize: "16px", fontWeight: "bolder", margin: "0px 5px" }}>Filter By Year:</div>

                    <div style={{ width: "150px", zIndex: 4 }}>
                      <RSelect
                        key={yearData}
                        placeholder="Year"
                        defaultValue={yearData.filter((ele) => ele.value == calendarYear)[0]}
                        isSearchable={false}
                        options={yearData}
                        value={yearValue}
                        onChange={(e) => {
                          setCalenderYear(e.value);
                          setYearValue(e);
                          getCalenderdata(e.value);
                        }}
                      />
                    </div>
                  </div>
                  {/* <Button
                    // type="button"
                    onClick={() => {
                      // excelfile.current.click();
                      setOpen(true);
                      // setFileEdit(true);
                      // setNameEdit(true);
                      setEditAll({
                        ...editAll,
                        addboth: true,
                        name: false,
                        file: false,
                      });
                    }}
                    variant="contained"
                    className="buttoncss"
                    style={{ backgroundColor: "#0e3f37", color: "#fff" }}
                  >
                    Add Calendar
                  </Button> */}
                  <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Add Calendar</span>} arrow>
                    <IconButton
                      className=""
                      style={{ backgroundColor: "#0E3F37", color: "#fff" }}
                      onClick={() => {
                        // excelfile.current.click();
                        setOpen(true);
                        // setFileEdit(true);
                        // setNameEdit(true);
                        setEditAll({
                          ...editAll,
                          addboth: true,
                          name: false,
                          file: false,
                        });
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Tooltip>
                  {/* <RSelect options={options} /> */}
                </Paper>

                <Paper className={classes.paperTableHeight}>
                  <>
                    {/* <TableContainer className={classes.tableContainerHeight}>
                      <Table stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell
                              className={classes.tablePadding}
                            ></TableCell>
                            <TableCell
                              className={classes.tablePadding}
                            ></TableCell>
                            <TableCell className={classes.tablePadding}>
                              Fajr
                            </TableCell>
                            <TableCell
                              className={classes.tablePadding}
                            ></TableCell>
                            <TableCell className={classes.tablePadding}>
                              Zhuhr
                            </TableCell>
                            <TableCell
                              className={classes.tablePadding}
                            ></TableCell>
                            <TableCell className={classes.tablePadding}>
                              Asr
                            </TableCell>
                            <TableCell
                              className={classes.tablePadding}
                            ></TableCell>
                            <TableCell className={classes.tablePadding}>
                              Maghrib
                            </TableCell>
                            <TableCell
                              className={classes.tablePadding}
                            ></TableCell>
                            <TableCell
                              className={classes.tablePadding}
                            ></TableCell>
                            <TableCell className={classes.tablePadding}>
                              Isha
                            </TableCell>
                            <TableCell
                              className={classes.tablePadding}
                            ></TableCell>
                            {console.log(menuData)}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {menuData
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((category, index) => (
                              <TableRow key={category._id}>
                                <TableCell
                                  component="th"
                                  scope="row"
                                  className={classes.textMiddle}
                                >
                                  <div>{category.date}</div>
                                </TableCell>
                                <TableCell className={classes.textMiddle}>
                                  <div>{category.day}</div>
                                </TableCell>
                                <TableCell className={classes.textMiddle}>
                                  <div>{category.fajrBegins}</div>
                                </TableCell>
                                <TableCell className={classes.textMiddle}>
                                  <div>{category.fajrJamat}</div>
                                </TableCell>
                                <TableCell className={classes.textMiddle}>
                                  <div>{category.zuhrSunrise}</div>
                                </TableCell>
                                <TableCell className={classes.textMiddle}>
                                  <div>{category.zuhrBegins}</div>
                                </TableCell>
                                <TableCell className={classes.textMiddle}>
                                  <div>{category.asrJamat}</div>
                                </TableCell>
                                <TableCell className={classes.textMiddle}>
                                  <div>{category.asrBegins}</div>
                                </TableCell>
                                <TableCell className={classes.textMiddle}>
                                  <div>{category.maghribJamat}</div>
                                </TableCell>
                                <TableCell className={classes.textMiddle}>
                                  <div>{category.maghribbegins}</div>
                                </TableCell>
                                <TableCell className={classes.textMiddle}>
                                  <div>{category.ishaJamat}</div>
                                </TableCell>
                                <TableCell className={classes.textMiddle}>
                                  <div>{category.ishaBegins}</div>
                                </TableCell>
                                <TableCell className={classes.textMiddle}>
                                  <div>{category.ishaJamat2}</div>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer> */}
                    <div className="tablePadding">
                      <TableContainer className={classes.container}>
                        <Table className={classes.table} stickyHeader size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "center",
                                }}
                              >
                                Sr. No.
                              </TableCell>
                              <TableCell
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "center",
                                }}
                              >
                                Calendar ID
                              </TableCell>
                              <TableCell
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "center",
                                  paddingRight: "70px",
                                }}
                              >
                                {" "}
                                Calendar Name
                              </TableCell>
                              <TableCell
                                style={{
                                  fontWeight: "bold",
                                  textAlign: "center",
                                }}
                              >
                                {" "}
                                Calendar Year
                              </TableCell>

                              <TableCell
                                style={{
                                  textAlign: "center",
                                  fontWeight: "bold",
                                }}
                              >
                                Action
                              </TableCell>
                              {/* <TableCell>User Type</TableCell>
                              <TableCell>Status</TableCell> */}
                            </TableRow>
                          </TableHead>

                          <TableBody>
                            {/* {isLoading ? (
                          <TableRow>
                            <Skeleton
                              style={{ width: "70vw", borderRadius: "20px" }}
                              highlightColor="#fff"
                              height="1rem"
                              count={2}
                              baseColor="#ebebeb"
                            />
                          </TableRow>
                        ) : (
                          false
                        )} */}
                            {excelData
                              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              // .reverse()
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
                                    {category.unique_id}
                                  </TableCell>

                                  <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                    {category.calendar_name
                                      ? category.calendar_name.charAt(0).toUpperCase() + category.calendar_name.slice(1)
                                      : "N/A"}
                                    <Button
                                      onClick={() => {
                                        // setNameEdit(true);
                                        // setFileEdit(false);
                                        setEditAll({
                                          ...editAll,
                                          name: true,
                                          file: false,
                                          addboth: false,
                                        });
                                        getEditCalender(category.unique_id);
                                      }}
                                      className=""
                                      style={{
                                        // border: "1.5px solid #F6F6F6",
                                        margin: "0.5rem",
                                        color: "#0e3f37",
                                      }}
                                    >
                                      <Tooltip title="Edit" arrow>
                                        <EditIcon />
                                      </Tooltip>
                                    </Button>
                                  </TableCell>
                                  <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                    <span
                                      style={{
                                        backgroundColor: "mediumseagreen",
                                        color: "white",
                                        padding: "7px 20px",
                                        borderRadius: "100px",
                                        boxShadow: "0 0.5em 1.5em -0.5em #14a73e98",
                                      }}
                                    >
                                      {category.year}
                                    </span>{" "}
                                  </TableCell>

                                  <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                    {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}{" "}
                                    {/* <button
                                    onClick={() => {
                                      getCalenderFiltereddataCSV(category.unique_id);
                                    }}
                                  >
                                    prepare download
                                  </button>
                                  <button
                                    onClick={() => {
                                      download(downloadexcel, settings);
                                    }}
                                  >
                                    down
                                  </button> */}
                                    {/* <div style={{ visibility: "" }}>
                                    <ExcelFile element={<button>down</button>}>
                                      <ExcelSheet data={dataSetFajr1} name="Employees">
                                        <ExcelColumn label="Begin" value="BeginFajr" />
                                        <ExcelColumn label="Jamat" value="EndFajr" />
                                      </ExcelSheet>
                                      <ExcelSheet data={dataSet2} name="Leaves">
                                        <ExcelColumn label="Name" value="name" />
                                        <ExcelColumn label="Total Leaves" value="total" />
                                        <ExcelColumn label="Remaining Leaves" value="remaining" />
                                      </ExcelSheet>
                                    </ExcelFile>
                                  </div> */}
                                    {/* <Tooltip title={"Download Calendar"}>
                                    <CSVLink
                                      style={{
                                        backgroundColor: "#0E3F37",
                                        color: "#fff",
                                        padding: "5px",
                                        textTransform: "uppercase",
                                        borderRadius: "5px",
                                        fontSize: "13px",
                                        marginRight: "10px",
                                      }}
                                      {...csvLink}
                                      className="buttoncss"
                                      onClick={() => {
                                        getCalenderFiltereddataCSV(category.unique_id);
                                      }}
                                    >
                                      <ArrowDownward />
                                    </CSVLink>
                                  </Tooltip>
                                  <JsonToExcel
                                    title="Download as Excel"
                                    data={downloadCsvData}
                                    fileName="sample-file"
                                    btnClassName="custom-classname"
                                  /> */}
                                    {/* <Button
                                  onClick={() => {
                                    props.history.push({
                                      pathname: "/EditCategoryAttributes",
                                      state: category._id,
                                    });
                                  }}
                                  className=""
                                  style={{
                                    border: "1.5px solid #F6F6F6",
                                    margin: "0.5rem",
                                    color: "#0e3f37",
                                  }}
                                >
                                  {" "}
                                  <Tooltip title="Manage Category" arrow>
                                    <WidgetsOutlined />
                                  </Tooltip>
                                </Button> */}
                                    {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}
                                    <Tooltip title="View Calendar" arrow>
                                      <Button
                                        style={{
                                          // border: "1.5px solid #F6F6F6",
                                          margin: "0.5rem",
                                        }}
                                      >
                                        <VisibilityIcon
                                          onClick={() => {
                                            ViewCalender(category.unique_id);
                                          }}
                                        />
                                      </Button>
                                    </Tooltip>
                                    <Button
                                      onClick={() => {
                                        // setNameEdit(false);
                                        // setFileEdit(true);
                                        setEditAll({
                                          ...editAll,
                                          file: true,
                                          name: false,
                                          addboth: false,
                                        });
                                        getEditCalender(category.unique_id);
                                      }}
                                      className=""
                                      style={{
                                        // border: "1.5px solid #F6F6F6",
                                        margin: "0.5rem",
                                        color: "#0e3f37",
                                      }}
                                    >
                                      <Tooltip title="Edit Calendar" arrow>
                                        <EditIcon />
                                      </Tooltip>
                                    </Button>
                                    <Button
                                      className=""
                                      onClick={() => DeleteCalender(category.unique_id)}
                                      style={{
                                        // border: "1.5px solid #F6F6F6",
                                        margin: "0.5rem",
                                        color: "#696969",
                                      }}
                                    >
                                      <Tooltip title="Delete Calendar" arrow>
                                        <DeleteOutline />
                                      </Tooltip>
                                    </Button>
                                    {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                    {excelData.length === 0 ? (
                      <NoDataFound TextToDisplay="No Data Found." fontSize="24px" Loading={loader} />
                    ) : (
                      false
                    )}
                    <TablePagination
                      className={classes.tablePaginationStyle}
                      rowsPerPageOptions={[15, 25, 100]}
                      component="div"
                      count={excelData.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </>
                </Paper>

                {/*<div className="d-flex justify-content-center my-4">
                  {" "}
                  {menuData.length > 0 ? (
                    <Button
                      //   className="text-center"
                      style={{
                        backgroundColor: "#0E3F37",
                        color: "#fff",
                      }}
                      variant="outlined"
                      onClick={() => {
                        uploadFile();
                      }}
                    >
                      Upload
                    </Button>
                  ) : null}
                    </div>*/}
                {/* </DashboardWrapper>
            </DashboardContainer> */}
              </div>
            </div>
          </Paper>
        </div>
        <Dialog
          open={open}
          // onClose={handleClose}

          fullWidth={true}
        >
          <DialogTitle style={{ display: "flex", justifyContent: "center" }}>
            <h4 className=""></h4>
          </DialogTitle>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {/* <img
              src={imageUrl}
              alt="..."
              style={{ width: "50px", height: "50px" }}
            /> */}
          </div>
          <Close
            onClick={() => {
              setOpen(false);
              seteditData([]);
            }}
            style={{
              position: "absolute",
              right: "5",
              top: "5",
              cursor: "pointer",
              color: "white",
              backgroundColor: "red",
              borderRadius: "50%",
            }}
          />
          <DialogContent>
            {/* <DialogContentText > */}

            <div>
              <Formik
                validationSchema={validationSchema}
                initialValues={{
                  // email:"",
                  name: get(editData[0], "calendar_name", ""),
                }}
                onSubmit={(values) => {
                  // if (editData.length > 1) {
                  if (!editAll.addboth) {
                    valuesEditedCalender(values);
                  } else {
                    valuesSubmit(values);
                  }
                }}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    <br />
                    <div className="container">
                      {editAll.name || editAll.addboth ? (
                        <div className="row">
                          {" "}
                          <div className="col-4">
                            <label className="" style={{}}>
                              Calendar Name : &nbsp;
                            </label>
                          </div>
                          <div className="col-4">
                            <Field
                              className=""
                              name="name"
                              // variant="outlined"
                              type="text"
                              // inputProps={{name: "name"}}
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
                            />
                            <KErrorMessage name="name" />
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      <br />
                      {editAll.file || editAll.addboth ? (
                        <div className="row">
                          <div className="col-4">
                            <label className="" style={{}}>
                              Choose Calendar File : &nbsp;
                            </label>
                          </div>
                          <div className="col-4">
                            <input
                              // ref={excelfile}
                              // hidden
                              accept=".xlsx, .xls"
                              type="file"
                              // as="file"
                              name="upload"
                              id="upload"
                              onChange={readUploadFiled}
                              required={true}
                            />
                            <KErrorMessage name="upload" />
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                      <br />
                      <div className="text-center">
                        <Button
                          type="submit"
                          variant="contained"
                          className="buttoncss"
                          style={{ backgroundColor: "#0e3f37", color: "#fff" }}
                        >
                          {editAll.name ? `Update Name` : false}
                          {editAll.file ? `Update Calendar ` : false}
                          {editAll.addboth ? `Add Calendar` : false}
                        </Button>
                      </div>
                      <br />
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
            {/* </DialogContentText> */}
          </DialogContent>
        </Dialog>
      </div>

      {/* {isLoading && <Overlay />} */}
    </>
  );
};

export default Dashboard;
