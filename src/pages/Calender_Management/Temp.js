import React, { useState } from "react";
// import "./styles.css";
import * as XLSX from "xlsx";
import Dropzone from "react-dropzone";
// import { SpreadsheetComponent } from "react-spreadsheet-component";

export default function Calender_Management() {
  //     const [fileNames, setFileNames] = useState([]);
  //     const [files, setFiles] = useState();
  //   const handleDrop = (acceptedFiles) => {
  //     setFileNames(acceptedFiles.map((file) => file.name));
  //     acceptedFiles.forEach((file) => {
  //       const reader = new FileReader();
  //       reader.onabort = () => console.log("file reading was aborted");
  //       reader.onerror = () => console.log("file reading has failed");
  //       reader.onload = () => {
  //         // Do whatever you want with the file contents
  //         const binaryStr = reader.result;
  //         console.log(binaryStr);
  //         const wb = XLSX.read(binaryStr, { type: "binary" });
  //         /* Get first worksheet */
  //         const wsname = wb.SheetNames[0];
  //         const ws = wb.Sheets[wsname];
  //         /* Convert array of arrays */
  //         const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
  //           /* Update state */
  //           setFiles(data);
  //         console.log("Data>>>" + data);
  //       };
  //       reader.readAsArrayBuffer(file);
  //     });
  //   };
  //   return (
  //     <div className="App">
  //       <Dropzone
  //         onDrop={handleDrop}
  //         accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
  //         multiple={true}
  //         minSize={1024}
  //         maxSize={3072000}
  //       >
  //         {({ getRootProps, getInputProps }) => (
  //           <div {...getRootProps({ className: "dropzone" })}>
  //             <input {...getInputProps()} />
  //             <p>Drag'n'drop images, or click to select files</p>
  //           </div>
  //         )}
  //       </Dropzone>
  //       <div>
  //         <strong>Files:</strong>
  //         <ul>
  //           {fileNames.map((fileName) => (
  //             <li key={fileName}>{fileName}</li>
  //           ))}
  //               </ul>
  //           </div>
  //     </div>
  //   );
}
