import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
import exceldoc from "../../assets/images/exceldoc.png";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
// import ReactCardCarousel from "react-card-carousel";

// import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/css";
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
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
// import { Delete } from '@material-ui/icons';
import VisibilityIcon from "@material-ui/icons/Visibility";
import BlockIcon from "@material-ui/icons/Block";
// import ArrowBackIcon from "@material-ui/icons/ArrowBack";

// For Table
import SearchBar from "material-ui-search-bar";
import { sortBy } from "lodash";

//history
import { useHistory } from "react-router-dom";
// import AddEditCategory from "../AccountManagement/Account_Details";

// import './Category_Management.css' ;
import EditIcon from "@material-ui/icons/Edit";
import { DeleteForeverOutlined, DeleteOutline, DeleteOutlineOutlined, WidgetsOutlined } from "@material-ui/icons";
import ModalVideo from "react-modal-video";
// import 'node_modules/react-modal-video/scss/modal-video.scss';
import VideocamIcon from "@material-ui/icons/Videocam";
import { array } from "yup";
import { scaleService } from "chart.js";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";

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



export default function Calender_Management(props) {
  const classes = useStyles();
  const CONTAINER_STYLE = {
    position: "relative",
    height: "30vh",
    width: "100%",
    display: "flex",
    flex: 1,
    justifyContent: "center",
    alignItems: "middle",
  };
  const CARD_STYLE = {
    height: "200px",
    width: "200px",
    paddingTop: "80px",
    textAlign: "center",
    // background: "none",
    color: "#FFF",
    fontFamily: "sans-serif",
    fontSize: "12px",
    textTransform: "uppercase",
    borderRadius: "10px",
    boxSizing: "border-box",
    backgroundImage: `url(${exceldoc})`,
    backgroundSize: "contain",
    backgroundRepeat: " no-repeat",
  };
  // const history=useHistory();
  const [imagePath, setImagePath] = useState(""  );

  useEffect(() => {
    getCategoriesContent();
  }, []);

  const [excelData, setExcelData] = useState([
    { name: "abc", link: "https://go.microsoft.com/fwlink/?LinkID=521962" },
    { name: "abc1", link: "https://go.microsoft.com/fwlink/?LinkID=521962" },
    { name: "abc2", link: "https://go.microsoft.com/fwlink/?LinkID=521962" },
    { name: "abc3", link: "https://go.microsoft.com/fwlink/?LinkID=521962" },
    { name: "abc4", link: "https://go.microsoft.com/fwlink/?LinkID=521962" },
    { name: "abc5", link: "https://go.microsoft.com/fwlink/?LinkID=521962" },
  ]);
  const [shadow, setShadow] = useState(false);
  //get content
  const getCategoriesContent = async () => {
    try {
      const { data } = await axios.get("/admin/users");
      console.log(data);
      //   setTableData(data.data);
      //   setSearchedData(data.data);
      //   setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  // edit user

  var settings = {
    // className: "center",
    // centerMode: true,
    accessibility: true,
    // focusOnSelect: true,
    arrows: true,
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  // console.log({ ...excelData, active: true });

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
                  <h3 style={{}}>User Management</h3>
                </Paper>

                {/* //new design */}

                {/* <br /> */}

                {/* status end */}

                <Paper>
                  <div
                    style={{
                      display: "flex",
                      overflowX: "auto",
                      overflowY: "hidden",
                      // justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {excelData.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          backgroundImage: `url(${exceldoc})`,
                          backgroundSize: "contain",
                          backgroundRepeat: " no-repeat",
                          backgroundPositionX: "center",
                          backgroundPositionY: "center",
                          width: "200px",
                          height: "200px",
                          margin: "1rem",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          cursor: "pointer",
                          boxShadow: shadow
                            ? "0px 0px 30px 10px #0E3F37"
                            : "none",
                          // border: shadow?"1px solid #e3e3e3":"none",
                        }}
                        onClick={() => {
                          setImagePath(item.link);
                          setShadow(true);
                        }}
                      >
                        <label style={{ color: "#fff" }}>{item.name}</label>
                        {/* <DeleteOutlineIcon style={{color:"red",position:"sticky",bottom:0,right:0}}/> */}
                      </div>
                    ))}
                  </div>
                  {/* <div>
                    <Swiper
                      effect={"coverflow"}
                      grabCursor={true}
                      centeredSlides={true}
                      slidesPerView={"auto"}
                      coverflowEffect={{
                        rotate: 50,
                        stretch: 0,
                        depth: 100,
                        modifier: 1,
                        slideShadows: false,
                      }}
                      pagination={true}
                      className="mySwiper"
                    >
                      {excelData.map((item, index) => (
                        <SwiperSlide>
                          {({ isActive }) => (
                            <>
                              {console.log(item)}
                              {isActive ? setExcelData(...excelData, Active: isActive):null}
                              <img
                                width="150px"
                                height="150px"
                                src={exceldoc}
                                alt=""
                              />
                              <label>{item.name}</label>
                            </>
                          )}
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div> */}
                  {/* <div className="d-flex overflow-auto">
                    {excelData.map((item, index) => (
                      <div
                        className="d-flex flex-column align-items-center mx-2"
                        style={{
                          cursor: "pointer",
                          // boxShadow: shadow
                          //   ? "5px 0px 30px 10px rgba(14,63,55,1)"
                          //   : "",
                          // transform: shadow ? `scale(1)` : "",
                        }}
                        onClick={() => setShadow(true)}
                        key={index}
                      >
                        <img width="150px" height="150px" src={exceldoc} />
                        <label>{item.name}</label>
                      </div>
                    ))}
                  </div> */}
                  {/* <div style={CONTAINER_STYLE}>
                    <ReactCardCarousel
                      autoplay={false}
                      autoplay_speed={2500}
                      spread="wide"
                      // afterChange={() =>
                        
                      // console.log(this.Ca
                    // rousel.getCurrentIndex())
                      // }

                      // getCurrentIndex={(current) => console.log(current)}
                      disable_box_shadow={true}
                      // ref={Carou}
                    >
                      {excelData.map((item, index) => (<>
                                                <div style={CARD_STYLE} >{item.name}</div>
                        </>
                      ))}
                    </ReactCardCarousel>
                  </div> */}
                  {/* <Carousel >
                      <div >
                        <img src={exceldoc} alt="1" />
                        <p className="legend">Legend 1</p>
                      </div>
                      <div>
                        <img src={exceldoc} alt="2" />
                        <p className="legend">Legend 2</p>
                      </div>
                      <div>
                        <img src={exceldoc} alt="3" />
                        <p className="legend">Legend 3</p>
                      </div>
                    </Carousel> */}

                  {/* <div> <h2> Responsive </h2>
                    <Slider {...settings} slickGoTo={(e)=>console.log(e)}>
                      <div
                        className="d-flex flex-column align-items-center"
                        // onClick={alert("1")}
                      >
                        <img
                          width="150px"
                          height="150px"
                          src={exceldoc}
                          alt="1"
                        />
                        <h3>1</h3>
                      </div>

                      <div
                        className="d-flex flex-column align-items-center"
                        // onClick={alert("2")}
                      >
                        <img
                          width="150px"
                          height="150px"
                          src={exceldoc}
                          alt="5"
                        />
                        <h3>5</h3>
                      </div>
                      <div className="d-flex flex-column align-items-center">
                        <img
                          width="150px"
                          height="150px"
                          src={exceldoc}
                          alt="6"
                        />
                        <h3>6</h3>
                      </div>
                      <div className="d-flex flex-column align-items-center">
                        <img
                          width="150px"
                          height="150px"
                          src={exceldoc}
                          alt="7"
                        />
                        <h3>7</h3>
                      </div>
                      <div className="d-flex flex-column align-items-center">
                        <img
                          width="150px"
                          height="150px"
                          src={exceldoc}
                          alt="8"
                        />
                        <h3>8</h3>
                      </div>
                    </Slider>
                  </div>  */}

                  <br />
                  <br />
                  {console.log(imagePath)}
                  {imagePath !== "" && (
                    <>
                      <div>
                        <iframe
                          src={`https://view.officeapps.live.com/op/embed.aspx?src=${imagePath}`}
                          width="100%"
                          height="300px"
                          frameborder="0"
                        >
                          This is an embedded{" "}
                          <a target="_blank" href="http://office.com">
                            Microsoft Office
                          </a>{" "}
                          document, powered by{" "}
                          <a target="_blank" href="http://office.com/webapps">
                            Office Online
                          </a>
                          .
                        </iframe>
                        <div>
                          <a
                            href={`https://view.officeapps.live.com/op/embed.aspx?src=${imagePath}`}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            Preview Document
                          </a>
                        </div>
                      </div>
                    </>
                  )}
                </Paper>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </React.Fragment>
  );
}
