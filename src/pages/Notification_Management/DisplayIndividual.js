import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
import moment from "moment";
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
} from "@material-ui/core";
import DatePicker from "react-date-picker";
import DatePickerNew from "react-datepicker";
import Swal from "sweetalert2";
import { confirm } from "react-confirm-box";

// import { Delete } from '@material-ui/icons';
import VisibilityIcon from "@material-ui/icons/Visibility";
import BlockIcon from "@material-ui/icons/Block";
// import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import KErrorMessage from "./KErrorMessage";

// For Table
import SearchBar from "material-ui-search-bar";
import { get, identity, sortBy } from "lodash";

//history
import { useHistory } from "react-router-dom";
// import AddEditCategory from "../AccountManagement/Account_Details";
import * as yup from "yup";

// import './Category_Management.css' ;
import EditIcon from "@material-ui/icons/Edit";
import { Category, DeleteOutline, WidgetsOutlined } from "@material-ui/icons";
import ModalVideo from "react-modal-video";
// import 'node_modules/react-modal-video/scss/modal-video.scss';
import VideocamIcon from "@material-ui/icons/Videocam";
import { CSVLink, CSVDownload } from "react-csv";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Formik, Field, Form } from "formik";
import { Close, Search } from "@material-ui/icons";
// import "./UserManagement.css";
import "react-datepicker/dist/react-datepicker.css";
import RSelect from "react-select";
import "./ViewNotification.css";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

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
    // justifyContent: "space-between",
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

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&:before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&:after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
}));

export default function DisplayIndividual(props) {
  const classes = useStyles();
  const {
    location: { state },
  } = props;
  // const history=useHistory();
  const calref = useRef(null);
  const [tableData, setTableData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [calView, setCalView] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [UserCategoryData, setUserCategoryData] = useState();
  const [expiryDateExtend, setExpiryDateExtend] = useState();
  const [ButtonColor, setButtonColor] = useState({
    User: true,
    Broadcast: false,
  });
  const [type, setType] = useState("User");
  // status switch
  // const [checked, setChecked] = useState(true);

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
    getContent();
  }, [state]);

  //get content
  const getContent = async () => {
    try {
      const { data } = await axios.get(`/admin/getNotification?notificationType=${state[1]}&unique_id=${state[0]}`);
      console.log(data);
      setTableData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const sorting = () => {
    let sortedData = sortBy(tableData, [
      function (o) {
        return new Date(o.createdAt).getTime();
      },
    ]).reverse();
    return sortedData;
  };

  console.log("data", state);

  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper>
            <div className={classes.paperPaddingRightLeft}>
              <div className="">
                <Paper elevation={0} className={classNames(classes.paperHeading, classes.headingAlignment)}>
                  <Button
                    variant="outlined"
                    aria-label="add"
                    className={classes.iconMargin}
                    onClick={() => {
                      // props.history.push({
                      //   pathname: "/adminPanel/Subscription_Management",
                      //   // state: state.userType._id,
                      // });
                      props.history.goBack();
                    }}
                  >
                    <ArrowBackIcon />
                  </Button>
                  &emsp;
                  <h3 style={{}}>Individual List</h3>
                  {/* <Button
                    variant="contained"
                    className="buttoncss"
                    style={{ backgroundColor: "#0E3F37", color: "#fff" }}
                  > */}
                  {/* </Button> */}
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
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Sr. No.</TableCell>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>
                              {state[1] === "USER" ? "User Name" : "Mosque Name"}
                            </TableCell>
                            <TableCell style={{ textAlign: "center", fontWeight: "bold" }}>Email Id</TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {/* {isLoading?<TableRow ><Skeleton style={{width:"70vw",borderRadius:"20px"}} highlightColor="#fff" height="1rem" count={2} baseColor="#ebebeb"/></TableRow>:false} */}
                          {sorting()
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

                                <TableCell style={{ textAlign: "center" }}>
                                  {state[1] === "USER"
                                    ? category?.user_id?.first_name + " " + category?.user_id?.last_name
                                    : category?.brodcast_id?.name}
                                </TableCell>
                                <TableCell className={classes.textMiddle} style={{ textAlign: "center" }}>
                                  {state[1] === "USER" ? category?.user_id?.email_id : category?.brodcast_id?.email_id}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
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
