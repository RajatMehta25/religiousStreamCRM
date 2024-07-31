import React, { useState, useEffect } from "react";
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
import Swal from "sweetalert2";
import { confirm } from "react-confirm-box";

// import { Delete } from '@material-ui/icons';
import VisibilityIcon from "@material-ui/icons/Visibility";
import BlockIcon from "@material-ui/icons/Block";
// import ArrowBackIcon from "@material-ui/icons/ArrowBack";

// For Table
import SearchBar from "material-ui-search-bar";
import { get, identity, sortBy } from "lodash";

//history
import { useHistory } from "react-router-dom";
// import AddEditCategory from "../AccountManagement/Account_Details";

// import './Category_Management.css' ;
import EditIcon from "@material-ui/icons/Edit";
import { DeleteOutline, WidgetsOutlined } from "@material-ui/icons";
import ModalVideo from "react-modal-video";
// import 'node_modules/react-modal-video/scss/modal-video.scss';
import VideocamIcon from "@material-ui/icons/Videocam";
import { CSVLink, CSVDownload } from "react-csv";
import NoDataFound from "../../components/NoDataFound";
import "./Contact.css";
import { AiOutlineClose } from "react-icons/ai";
import { ImageModal } from "../../components/ImageModal";

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

export default function UserManagement(props) {
  const classes = useStyles();

  // const history=useHistory();
  const [openModalImageZoom,setOpenModalImageZoom]=useState(false);
const [imageZoomed,setImageZoomed]=useState("")
const [descriptionText, setDescriptionText] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isBroad, setIsBroad] = useState(false)

  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setOpen] = useState(false);
  const [ButtonColor, setButtonColor] = useState({
    user: true,
    broadcast: false,
  });
  const [type, setType] = useState("USER");
  // status switch
  // const [checked, setChecked] = useState(true);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(15);
  const [loader, setLoader] = useState(true);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  // useEffect(() => {
  //   getCategoriesContent();
  // }, []);

  //get content
  const getCategoriesContent = async () => {
    setLoader(true);
    try {
      const { data } = await axios.get(
        `/admin/contactUsList?contactBy=${type}`
      );
      console.log(data);
      setTableData(data.data);
      setSearchedData(data.data);
      setIsLoading(false);
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.log(error);
    }
  };
  // edit user

  // useEffect(() => {
  //    window.localStorage.setItem('query',JSON.stringify([]))

  // }, [])

  // For Search
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);

  const requestSearch = (searchedVal) => {
    console.log(searchedVal);

    const filteredRows = searchedData.filter((row) => {
      let name = row.name;
      let email = row.email_id;
      return (
        name.toLowerCase().includes(searchedVal.toLowerCase()) ||
        email.toLowerCase().includes(searchedVal.toLowerCase())
      );
    });
    setTableData(filteredRows);
  };

  const cancelSearch = () => {
    getCategoriesContent();
    // setSearched("");
    //  console.log(searchedData);
    //  requestSearch()
  };

  const sorting = () => {
    //   if(sort){
    //  let tableSortedData= sortBy(tableData,
    //     [function(o) { console.log(o); return new Date(o.postId.createdAt).getTime(); }])
    //     console.log(tableSortedData);
    // setTableData(tableSortedData);
    //   }else {
    //  let tableSortedData= sortBy(tableData,
    //     [function(o) { console.log(o); return new Date(o.postId.createdAt).getTime(); }],
    //     { reverse: true })
    //     setTableData(tableSortedData);
    //   }
    let sortedData = sortBy(tableData, [
      function (o) {
        // console.log(o);
        return new Date(o.createdAt).getTime();
      },
    ]).reverse();
    return sortedData;
  };

  useEffect(() => {
    getCategoriesContent();
  }, [type]);

  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper>
            <div className={classes.paperPaddingRightLeft}>
              <div className="">
                <Paper
                  elevation={0}
                  className={classNames(
                    classes.paperHeading,
                    classes.headingAlignment
                  )}
                >
                  <h3 style={{}}>Contact Us</h3>
                  <SearchBar
                    // value={searched}
                    className="heightfix"
                    onChange={(searchVal) => requestSearch(searchVal)}
                    onCancelSearch={() => cancelSearch()}
                    placeholder="Search by User Name/Email"
                  />
                  <div></div>
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
                <Paper elevation={0}>
                  <div style={{ display: "flex", margin: "20px 50px" }}>
                    <h5
                      className="payHeading"
                      style={{
                        flex: 1,
                        textAlign: "center",
                        // borderRight: "1px solid black",
                        padding: "20px",
                        // borderBottomLeftRadius: "15px",
                        // borderBottomRightRadius: "15px",
                        borderRadius: "5px 0px 0px 5px",
                        backgroundColor: ButtonColor.user
                          ? "#0e3f37"
                          : "#c4c4c4",
                        // backgroundColor: ButtonColor.donation ? "#0e3f37" : "#c4c4c4",
                        color: "#fff",
                      }}
                      onClick={() => {
                        setButtonColor({
                          ...ButtonColor,
                          user: true,
                          broadcast: false,
                        });
                        setTableData([])
                        setType("USER");
                      }}
                    >
                      User
                    </h5>
                    <h5
                      className="payHeading"
                      style={{
                        flex: 1,
                        textAlign: "center",
                        padding: "20px",
                        // borderBottomLeftRadius: "15px",
                        // borderBottomRightRadius: "15px",
                        borderRadius: "0px 5px 5px 0px",
                        backgroundColor: ButtonColor.broadcast
                          ? "#0e3f37"
                          : "#c4c4c4",
                        // backgroundColor: ButtonColor.subscription ? "#0e3f37" : "#c4c4c4",
                        // color: "#fff",
                        color: "#fff",
                      }}
                      onClick={() => {
                        setButtonColor({
                          ...ButtonColor,
                          user: false,
                          broadcast: true,
                        });
                        setTableData([])
                        setType("BROADCAST");
                      }}
                    >
                      Broadcast
                    </h5>
                  </div>
                </Paper>
                <Paper>
                  <div className="tablePadding">
                    <TableContainer className={classes.container}>
                      <Table className={classes.table} stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              Sr. No.
                            </TableCell>
                            <TableCell
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              Image
                            </TableCell>
                            {
                              ButtonColor.broadcast ? <TableCell
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              {" "}
                              Mosque Name
                            </TableCell> : "" 
                            }
                            <TableCell
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              {" "}
                              User Name
                            </TableCell>
                            
                            
                            {/* <TableCell
                            style={{ textAlign: "center", fontWeight: "bold" }}
                          >
                            Profile Image
                          </TableCell> */}
                            <TableCell
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              Email Id
                            </TableCell>
                            <TableCell
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              {" "}
                              Mobile Number
                            </TableCell>

                            <TableCell
                              style={{
                                textAlign: "center",
                                fontWeight: "bold",
                              }}
                            >
                              {" "}
                              Description
                            </TableCell>
                            {/* <TableCell
                            style={{ textAlign: "center", fontWeight: "bold" }}
                          >
                            Plan Name
                          </TableCell>
                          <TableCell
                            style={{ textAlign: "center", fontWeight: "bold" }}
                          >
                            Date of Joining
                          </TableCell> */}
                            {/* <TableCell style={{textAlign:"center",fontWeight:"bold"}} >Doc</TableCell> */}
                            {/* <TableCell
                            style={{ textAlign: "center", fontWeight: "bold" }}
                          >
                            Actions
                          </TableCell> */}
                            {/* <TableCell>User Type</TableCell>
                              <TableCell>Status</TableCell> */}
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {/* {isLoading?<TableRow ><Skeleton style={{width:"70vw",borderRadius:"20px"}} highlightColor="#fff" height="1rem" count={2} baseColor="#ebebeb"/></TableRow>:false} */}
                          {sorting()
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
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
                                <TableCell
                                  className={classes.textMiddle}
                                  style={{ textAlign: "center" }}
                                >
                                  {category?.image? <img
                                  onClick={()=>{setImageZoomed(category.image);setOpenModalImageZoom(true)}}
                                    src={category.image}
                                    alt="image"
                                    style={{ width: "35px", height: "35px",cursor:"pointer" }}
                                  />:"N/A"
                                  }
                                </TableCell>
                               {
                                ButtonColor.broadcast ?  <TableCell
                                  className={classes.textMiddle}
                                  style={{ textAlign: "center" }}
                                >
                                  {get(category, "broadcast_id.name", "")}
                                  {/* {category?.first_name
                                  ? category.first_name
                                      .charAt(0)
                                      .toUpperCase() +
                                    category.first_name.slice(1)
                                  : "N/A"}
                                &nbsp;
                                {category?.last_name
                                  ? category.last_name.charAt(0).toUpperCase() +
                                    category.last_name.slice(1)
                                  : "N/A"} */}
                                </TableCell> : ""
                               }
                                <TableCell
                                  className={classes.textMiddle}
                                  style={{ textAlign: "center" }}
                                >
                                  {get(category, "name", "")}
                                  {/* {category?.first_name
                                  ? category.first_name
                                      .charAt(0)
                                      .toUpperCase() +
                                    category.first_name.slice(1)
                                  : "N/A"}
                                &nbsp;
                                {category?.last_name
                                  ? category.last_name.charAt(0).toUpperCase() +
                                    category.last_name.slice(1)
                                  : "N/A"} */}
                                </TableCell>
                                <TableCell
                                  className={classes.textMiddle}
                                  style={{ textAlign: "center" }}
                                >
                                  {/* {category.profile_picture ? (
                                  <img
                                    src={category.profile_picture}
                                    alt="profile"
                                    style={{ width: "35px", height: "35px" }}
                                  />
                                ) : (
                                  <img
                                    src={require("../../assets/images/logo/ambulance.png")}
                                    alt="profile"
                                    style={{ width: "35px", height: "35px" }}
                                  />
                                )} */}
                                  {get(category, "email_id", "N/A")}
                                </TableCell>
                                <TableCell
                                  className={classes.textMiddle}
                                  style={{ textAlign: "center" }}
                                >
                                  {category?.mobile_number
                                    ? category?.country_code +
                                      category.mobile_number
                                    : "N/A"}
                                </TableCell>
                                <Tooltip title={descriptionText === category._id ? "Click to Hide" : "Click to View"} arrow>
                                  <TableCell
                                    onClick={() => setDescriptionText(descriptionText === category._id ? null : category._id)}
                                    style={{
                                       textAlign: "center",
                                      whiteSpace: descriptionText === category._id ? "" : "nowrap",
                                      maxWidth: "150px",
                                      overflow: descriptionText === category._id ? "" : "hidden",
                                      textOverflow: descriptionText === category._id ? "" : "ellipsis",
                                      cursor: "pointer",
                                    }}
                                    className={classes.textMiddle}
                                  >
                                    {get(category, "description", "N/A")}
                                    {/* <CroppedText text={`${get(category, "location", "N/A")}`} bool={locationText} /> */}
                                  </TableCell>
                                </Tooltip>
                                {/* <TableCell
                                  className={classes.textMiddle}
                                  style={{ textAlign: "center" }}
                                >
                                  {get(category, "description", "N/A")}
                                </TableCell> */}
                                {/* <TableCell
                                className={classes.textMiddle}
                                style={{ textAlign: "center" }}
                              >
                                {get(
                                  category,
                                  "subscription_id.plan_name",
                                  "N/A"
                                )}
                              </TableCell>

                              <TableCell style={{ textAlign: "center" }}>
                                {category.createdAt
                                  ? new Date(category.createdAt)
                                      // .toUTCString()
                                      .getUTCDate() +
                                    "/" +
                                    (new Date(category.createdAt)
                                      // .toUTCString()
                                      .getUTCMonth() +
                                      1) +
                                    "/" +
                                    new Date(category.createdAt)
                                      // .toUTCString()
                                      .getUTCFullYear()
                                  : // moment.utc(category.createdAt).format("L")
                                    "N/A"}
                              </TableCell> */}

                                {/* <TableCell style={{textAlign:"center"}}>{category.doc?<img src={category.doc} alt="doc" style={{width:"50px",height:"50px"}}/>:"No Doc"}</TableCell> */}
                                {/* <TableCell
                                className={classes.textMiddle}
                                style={{ textAlign: "center" }}
                              > */}
                                {/* <Button
                                  onClick={() => EditUser(category)}
                                  className=""
                                  style={{
                                    border: "1.5px solid #c4c4c4",
                                    margin: "0.5rem",
                                    color: "#2765B3",
                                  }}
                                >
                                  <Tooltip title="Edit User" arrow>
                                    <EditIcon />
                                  </Tooltip>
                                </Button> */}
                                {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}

                                {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}

                                {/* <Button
                                  className=""
                                  onClick={() =>
                                    category.is_blocked
                                      ? UnblockUser(category._id)
                                      : BlockUser(category._id)
                                  }
                                  style={{
                                    // border: "1.5px solid #c4c4c4",
                                    margin: "0.5rem",
                                    color: category.is_blocked
                                      ? "red"
                                      : "#696969",
                                  }}
                                >
                                  <Tooltip title="Block/Unblock User" arrow>
                                    <BlockIcon />
                                  </Tooltip>{" "}
                                </Button> */}
                                {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}
                                {/* <Button
                                  className=""
                                  onClick={() => DeleteUser(category._id)}
                                  style={{
                                    // border: "1.5px solid #c4c4c4",
                                    margin: "0.5rem",
                                    color: "#696969",
                                  }}
                                >
                                  <Tooltip title="Delete User" arrow>
                                    <DeleteOutline />
                                  </Tooltip>
                                </Button> */}
                                {/* </TableCell> */}
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                  {tableData.length === 0 ? (
                    <NoDataFound
                      TextToDisplay="No Data Found."
                      fontSize="24px"
                      Loading={loader}
                    />
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
       
        <ImageModal
        maxWidth="lg"
        width="540px"
        isOpen={openModalImageZoom}
        RoundedCorners={true}
        image={true}
        transparent={true}
        setOpenModalImageZoom={setOpenModalImageZoom}
        // isSure={true}
        noPadding={true}
        onClose={(event, reason) => {
          if (reason && (reason === "backdropClick" || "escapeKeyDown")) {
            console.log(reason);
            setOpenModalImageZoom(true);
          } else {
            setOpenModalImageZoom(false);
            // setSelectedPetCategoryData(null);
          }
          // setModalState({
          //   isAddEditTaxiSingle: false,
          // });
          // setSelectedTaxiDataAddEdit(null);
        }}
        backgroundModal={false}
      
        backgroundModalContent={false}
        title={
          <div>
          <div
            className="my-3"
            style={{ textAlign: "center", fontWeight: "bold", fontSize: "22px", fontFamily: "'DM Sans', sans-serif" }}
          >
            Image
          </div>
          <div className="">
            <AiOutlineClose
              style={{
                fontSize: "1.5rem",
                position: "absolute",
                top: 16,
                right: 16,
                color: "#fff",
                borderRadius: "50%",
                backgroundColor: "red",
                cursor: "pointer",
              }}
              onClick={() => {
                setOpenModalImageZoom(false);
                // setSelectedPetCategoryData(null);
              }}
            />
          </div>
        </div>
        }
        content={
          <>
          {/* <div style={{position:"relative"}}>
          <div className="">
              <AiOutlineClose
                style={{
                  fontSize: "2rem",
                  position: "absolute",
                  top: -8,
                  right: -8,
                  color: "#fff",
                  borderRadius: "50%",
                  backgroundColor: "red",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setOpenModalImageZoom(false);
                  // setSelectedPetCategoryData(null);
                }}
              />
            </div> */}
           <img src={imageZoomed} alt="Image" style={{width:"100%"}} />
           {/* </div> */}
          </>
        }
      />
     
      </div>
    </React.Fragment>
  );
}
