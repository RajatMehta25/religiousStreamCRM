// import React from "react";
// import { NavLink, Link } from "react-router-dom";

// export const Modal = ({
//   content,
//   header,
//   width = 400,
//   show,
//   IsBorderRadiusModal,
//   onClose,
//   padding = 20,
//   modalResrict,
//   IsDullColor,
// }) => {
//   return (
//     <>
//       {show && (
//         <div className={`modal ${show && "fade show"} ${modalResrict && "modal-restrict"}`} tabIndex={-1} role="dialog">
//           <div onClick={onClose} className={`modal-backdrop fade ${show && " show"}`}></div>
//           <div className="modal-dialog modal-dialog-centered" role="document" style={{ maxWidth: width }}>
//             <div
//               className={`modal-content ${IsBorderRadiusModal ? "modal-border" : ""} ${IsDullColor ? "isDullModalColor" : ""}`}
//             >
//               {header && (
//                 <div className="modal-header">
//                   <h3>{header}</h3>
//                   <button type="button" onClick={onClose} className="close" data-dismiss="modal" aria-label="Close">
//                     <span aria-hidden="true">×</span>
//                   </button>
//                 </div>
//               )}
//               <div className="modal-body" style={{ padding: padding }}>
//                 {content}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

import React from "react";
import styled from "styled-components";

import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { AiOutlineClose } from "react-icons/ai";

// import Dialog from "@mui/material/Dialog";
// import DialogContent from "@mui/material/DialogContent";
// import DialogTitle from "@mui/material/DialogTitle";

// import "./modal.css";

const ModalWrap = styled.div`
  width: ${({ width }) => width};
  @media screen and (max-width: 768px) {
    width: 100%;
  }
`;

const noop = () => {};

export const ImageModal = ({
  isOpen = false,
  title = "title",
  content = "content",
  onClose = noop,
  maxWidth,
  width = "100%",
  setShowModal,
  backgroundModal,
  backgroundModalContent,
  isSure,
  isDetailModel,
  isBlackModal,
  noPadding,
  NoModalPaddingResponsive,
  image,
  transparent,
  setOpenModalImageZoom
}) => {
  // const classes = useStyles();
  return (
    <>
      {isOpen ? (
        // <Draggable>
        // <div style={{position:"relative"}}>
        //    <div className="">
        //       <AiOutlineClose
        //         style={{
        //           fontSize: "2rem",
        //           position: "absolute",
        //           top: -8,
        //           right: -8,
        //           color: "#fff",
        //           borderRadius: "50%",
        //           backgroundColor: "red",
        //           cursor: "pointer",
        //           zIndex:"9999999999999"
        //         }}
        //         onClick={() => {
        //           setOpenModalImageZoom(false);
        //           // setSelectedPetCategoryData(null);
        //         }}
        //       /></div>
        <Dialog
          // className="animate__animated animate__bounceInDown"
          open={isOpen}
          onClose={onClose}
          maxWidth={maxWidth}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          // style={{backgroundColor:"transparent"}}
        >
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
                  zIndex:"9999999999999"
                }}
                onClick={() => {
                  setOpenModalImageZoom(false);
                  // setSelectedPetCategoryData(null);
                }}
              /></div> */}
          <ModalWrap width={width}  style={{backgroundColor:"transparent"}}  >
         
            <DialogTitle
              style={{
                background: `${
                  backgroundModal
                    ? "transparent linear-gradient(180deg, #055F8F 0%, #0288D1 100%) 0% 0% no-repeat padding-box"
                    : isBlackModal
                    ? "#000000"
                    : ""
                }`,
                padding: `${noPadding ? "0rem" : "0.3rem"}`,
                borderBottom: `${isDetailModel ? "1px solid #E5E5E5" : ""}`,
              }}
            >
              {title}
            </DialogTitle>
            <DialogContent
              className={`${NoModalPaddingResponsive ? "" : "modal-padding"}`}
              style={{ background: "transparent", padding: `${isSure ? "0px" : ""}` }}
            >
              {content}
            </DialogContent>
            {/*<DialogActions>
                            <Button onClick={onClose}>Disagree</Button>
                            <Button onClick={onClose} autoFocus>
                                Agree
                            </Button>
                        </DialogActions>*/}
          </ModalWrap>
          {/* </div> */}
        </Dialog>
        // </div>
      ) : // </Draggable>
      null}
    </>
  );
};
