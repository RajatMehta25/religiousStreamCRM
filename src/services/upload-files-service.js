import axios from "../axios";
import { react, useState } from "react";

// const [progress, setProgress] = useState(0);
export async function handleImageUpload(file) {
  const formData = new FormData();
  formData.append("media", file);
  console.log(file);
  const config = {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      const progress = (progressEvent.loaded / progressEvent.total) * 50;
      // setProgress(progress);
      console.log(progressEvent.loaded);
      console.log(progress);
    },
    onDownloadProgress: (progressEvent) => {
      const progress = 50 + (progressEvent.loaded / progressEvent.total) * 50;
      console.log(progress);
      // setProgress(progress);
    },
  };
  // const [progress, setProgress] = useState(0);
  try {
    const { data } = await axios.post("/common/imgUpload", formData, config);
    console.log(data);

    return data.path;
    //{ location: data.result.file, };
  } catch (err) {
    return err;
  }
}
// import { useState } from "react";
// import axios from "axios";

// export const useUploadForm = (url) => {
//   const [isSuccess, setIsSuccess] = useState(false);
//   const [progress, setProgress] = useState(0);

//   const uploadForm = async (formData) => {
//     setIsLoading(true);
//     await axios.post(url, formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//       onUploadProgress: (progressEvent) => {
//         const progress = (progressEvent.loaded / progressEvent.total) * 50;
//         setProgress(progress);
//       },
//       onDownloadProgress: (progressEvent) => {
//         const progress = 50 + (progressEvent.loaded / progressEvent.total) * 50;
//         console.log(progress);
//         setProgress(progress);
//       },
//     });
//     setIsSuccess(true);
//   };

//   return { uploadForm, isSuccess, progress };
// };
