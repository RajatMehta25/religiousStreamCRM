import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
// import Switch from '@mui/material/Switch';
// import { styled } from '@mui/material/styles';
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
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
import WallpaperIcon from "@material-ui/icons/Wallpaper";

// import { Delete } from '@material-ui/icons';
import VisibilityIcon from "@material-ui/icons/Visibility";
import BlockIcon from "@material-ui/icons/Block";
// import ArrowBackIcon from "@material-ui/icons/ArrowBack";

// For Table
import SearchBar from "material-ui-search-bar";
import { orderBy } from "lodash";

//history
import { useHistory } from "react-router-dom";
// import AddEditCategory from "../AccountManagement/Account_Details";

import "./Azan_Management.css";
import EditIcon from "@material-ui/icons/Edit";
import { DeleteOutline, Wallpaper, WidgetsOutlined } from "@material-ui/icons";

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

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
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
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
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
}));

export default function Azan_Management(props) {
  const classes = useStyles();

  // const history=useHistory();

  const [tableData, setTableData] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  // status switch
  // const [checked, setChecked] = useState(true);

  // For Pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    // console.log(event);
    // console.log(newPage);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getCategoriesContent();
  }, []);

  //get content
  const getCategoriesContent = async () => {
    try {
      const { data } = await axios.get("/admin/getAzan");
      console.log(data);
      setTableData(data.data);
      setSearchedData(data.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  // edit category itself

  const EditAzan = (category) => {
    props.history.push({
      pathname: "/adminPanel/AddEditAzan",
      state: category,
    });
  };

  //edit  categories attribute

  const EditAttributeContent = (category) => {
    console.log(tableData);
    props.history.push({
      pathname: "/EditCategoryAttributes",
      state: category,
    });

    // delete category
  };
  const DeleteAzan = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete this azan?")) {
        const { data } = await axios.post("/admin/deleteAzan", {
          _id: id,
        });
        console.log(data);
        getCategoriesContent();
        toast.success(data.message, {
          position: toast.POSITION.TOP_RIGHT,
        });
      } else {
        toast.error("You have cancelled the operation", {
          position: toast.POSITION.TOP_RIGHT,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(error, {
        position: toast.POSITION.TOP_RIGHT,
      });
    }
  };

  // status switch

  const statusSwitch = async (e, id) => {
    try {
      console.log(id);

      const { data } = await axios.post("/admin/updateAzan", {
        _id: id,
        is_active: e.target.checked,
      });
      // props.history.push({
      //     pathname: "/Category_Management",
      //   });
      getCategoriesContent();
      toast.success(data.message, {
        position: toast.POSITION.TOP_RIGHT,
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }

    // console.log(e.target.checked);
    // console.log(checked);
    // console.log(id);
  };
  // useEffect(() => {
  //    window.localStorage.setItem('query',JSON.stringify([]))

  // }, [])

  // For Search
  const [searched, setSearched] = useState("");
  const [searchedData, setSearchedData] = useState([]);

  const requestSearch = (searchedVal) => {
    console.log(searchedVal);

    const filteredRows = searchedData.filter((row) => {
      let name = row.azan_name;
      return name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setTableData(filteredRows);
  };

  const cancelSearch = () => {
    getCategoriesContent();
    // setSearched("");
    //  console.log(searchedData);
    //  requestSearch()
  };

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
                  <h3 style={{}}>Manage Azan</h3>
                  <SearchBar
                    // value={searched}
                    className="heightfix"
                    onChange={(searchVal) => requestSearch(searchVal)}
                    onCancelSearch={() => cancelSearch()}
                    placeholder="Search by Azan Name"
                  />
                  <Button
                    variant="contained"
                    className="buttoncss"
                    style={{ backgroundColor: "#0e3f37", color: "#fff" }}
                    onClick={() => {
                      props.history.push({
                        pathname: "/adminPanel/AddEditAzan",
                      });
                    }}
                  >
                    {" "}
                    Add Azan Name
                  </Button>
                </Paper>

                {/* //new design */}

                {/* <br /> */}

                {/* status end */}

                <Paper>
                  <TableContainer className={classes.container}>
                    <Table className={classes.table} stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ fontWeight: "bold" }}>
                            Sr. No.
                          </TableCell>
                          <TableCell style={{ fontWeight: "bold" }}>
                            Icon
                          </TableCell>
                          <TableCell style={{ fontWeight: "bold" }}>
                            {" "}
                            Azan Name
                          </TableCell>
                          <TableCell
                            style={{ textAlign: "center", fontWeight: "bold" }}
                          >
                            Status
                          </TableCell>
                          <TableCell
                            style={{ textAlign: "center", fontWeight: "bold" }}
                          >
                            Actions
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
                        {tableData
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .reverse()
                          .map((category, index) => (
                            <TableRow hover key={index}>
                              <TableCell
                                component="th"
                                scope="row"
                                className={classes.textMiddle}
                              >
                                {index + 1 + page * rowsPerPage}
                              </TableCell>
                              <TableCell className={classes.textMiddle}>
                                {category.azan_icon ? (
                                  <img
                                    src={category.azan_icon}
                                    alt="icon"
                                    style={{ width: "25px", height: "25px" }}
                                  />
                                ) : (
                                  <WallpaperIcon
                                    style={{ width: "25px", height: "25px" }}
                                  />
                                )}
                              </TableCell>
                              <TableCell className={classes.textMiddle}>
                                {category.azan_name}
                              </TableCell>

                              <TableCell style={{ textAlign: "center" }}>
                                <IOSSwitch
                                  onChange={(e) => {
                                    statusSwitch(e, category._id);
                                  }}
                                  checked={category.is_active}
                                />
                              </TableCell>

                              <TableCell
                                className={classes.textMiddle}
                                style={{ textAlign: "center" }}
                              >
                                <Button
                                  onClick={() => EditAzan(category)}
                                  className=""
                                  style={{
                                    border: "1.5px solid #F6F6F6",
                                    margin: "0.5rem",
                                    color: "#0e3f37",
                                  }}
                                >
                                  <Tooltip title="Edit Azan" arrow>
                                    <EditIcon />
                                  </Tooltip>
                                </Button>
                                {/* <Button onClick={()=>BlockCategory} style={{backgroundColor:"#696969"}} >Manage</Button> */}

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

                                <Button
                                  className=""
                                  onClick={() => DeleteAzan(category._id)}
                                  style={{
                                    border: "1.5px solid #F6F6F6",
                                    margin: "0.5rem",
                                    color: "#696969",
                                  }}
                                >
                                  <Tooltip title="Delete Azan" arrow>
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
                  <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
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
