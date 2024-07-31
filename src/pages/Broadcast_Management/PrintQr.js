import React, { useState, useEffect, useRef } from "react";
import { makeStyles } from "@material-ui/core/styles";
import classNames from "classnames";
import axios from "../../axios";
import { toast } from "react-toastify";
// import Switch from '@mui/material/Switch';
// import { styled } from '@mui/material/styles';
// import Skeleton from 'react-loading-skeleton'
// import 'react-loading-skeleton/dist/skeleton.css'
import { BsFilter } from "react-icons/bs";
import {
  Button,
  IconButton,
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

// import { Delete } from '@material-ui/icons';
import VisibilityIcon from "@material-ui/icons/Visibility";
import BlockIcon from "@material-ui/icons/Block";
// import ArrowBackIcon from "@material-ui/icons/ArrowBack";

// For Table
import SearchBar from "material-ui-search-bar";
import { get, sortBy } from "lodash";

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
import moment from "moment";
import NoDataFound from "../../components/NoDataFound";
import { TiExport } from "react-icons/ti";
import AddIcon from "@material-ui/icons/Add";
import CroppedText from "../../components/CroppedText";
import "./Broadcast.css";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { BsFillPrinterFill, BsFillShareFill } from "react-icons/bs";
import {
  EmailShareButton,
  FacebookShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WorkplaceShareButton,
} from "react-share";
import {
  EmailIcon,
  FacebookIcon,
  FacebookMessengerIcon,
  HatenaIcon,
  InstapaperIcon,
  LineIcon,
  LinkedinIcon,
  LivejournalIcon,
  MailruIcon,
  OKIcon,
  PinterestIcon,
  PocketIcon,
  RedditIcon,
  TelegramIcon,
  TumblrIcon,
  TwitterIcon,
  ViberIcon,
  VKIcon,
  WeiboIcon,
  WhatsappIcon,
  WorkplaceIcon,
} from "react-share";

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
    justifyContent: "center",
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
    // maxHeight: "59vh",
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

export default function PrintQr(props) {
  const classes = useStyles();
  const {
    location: { state },
  } = props;
  const [showShare, setShowShare] = useState(false);
  const [qrCode, setQRCode] = useState(!state ? "" : state.qr_code);
  const [displayButton, setDisplayButton] = useState(true);
  // const history=useHistory();
  const handlePrint = () => {
    setDisplayButton(false);
    Window.print();
  };
  const handleShare = () => {};
  console.log(qrCode);
  return (
    <React.Fragment>
      <div className="page-content">
        <div className={classes.root}>
          <Paper>
            <div className={classes.paperPaddingRightLeft}>
              <div>
                <div className="non-printable">
                  <div style={{ paddingTop: "1rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
                    <Button
                      variant="outlined"
                      aria-label="add"
                      className={classes.iconMargin}
                      onClick={() => {
                        props.history.push({
                          pathname: "/adminPanel/ViewBroadcast",
                          state: state,
                        });
                      }}
                    >
                      <ArrowBackIcon />
                    </Button>
                    <div style={{ display: "flex" }}>
                      <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Print</span>} arrow>
                        <IconButton
                          className=""
                          style={{ backgroundColor: "#0E3F37", color: "#fff", marginLeft: "5px" }}
                          onClick={() => window.print()}
                        >
                          <BsFillPrinterFill />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={<span style={{ color: "white", fontSize: "16px" }}>Share</span>} arrow>
                        <IconButton
                          className=""
                          style={{ backgroundColor: "#0E3F37", color: "#fff", marginLeft: "5px" }}
                          onClick={() => {
                            setShowShare(!showShare);
                          }}
                        >
                          <BsFillShareFill />
                        </IconButton>
                      </Tooltip>
                      {showShare ? (
                        <div
                          className="box Sharearrow-top"
                          style={{
                            display: "flex",
                            position: "absolute",
                            backgroundColor: "",
                            zIndex: 5,
                            borderRadius: "10px",
                            marginLeft: "60px",
                          }}
                        >
                          <EmailShareButton
                            subject={"QR"}
                            title="Mail"
                            body={qrCode}
                            // media="https://i.picsum.photos/id/367/200/300.jpg?hmac=9v6fvZlygxFPleXOePw645QmRd9ytp91VGVQaolJKIk"
                          >
                            {" "}
                            <EmailIcon size={38} round />
                          </EmailShareButton>
                        </div>
                      ) : (
                        false
                      )}
                      <div></div>
                    </div>
                  </div>
                </div>

                <Paper elevation={0} className={classNames(classes.paperHeading, classes.headingAlignment)}>
                  {/* <h3 style={{}}>QR CODE</h3> */}
                </Paper>

                <Paper
                  elevation={0}
                  style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}
                >
                  <h3>QR CODE</h3>
                  <img src={qrCode} alt="QR" width="50%" height="50%" />
                </Paper>
              </div>
            </div>
          </Paper>
        </div>
      </div>
    </React.Fragment>
  );
}
