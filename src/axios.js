import axios from "axios";
import Cookies from "js-cookie";
import Swal from 'sweetalert2'

import { API_URL } from "./statics/constants";

const instance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-type": "application/json"
  }
});

instance.interceptors.request.use(
  async (config) => {
    console.log(instance.interceptors.request);
    const token = Cookies.get("admin_access_token");
    if (token) {
      console.log(token);
      console.log(config);
      config.headers["access_token"] = `${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// instance.interceptors.response.use(function (response) {
  
  // return response;
// }, function (error) {
//  console.log(error.response.status)
//   if (error.response.status === 403) {
//     alert("Session timed out ,Please login again.");
    // Swal.fire({
    //   icon: 'error',
    //   title: 'Oops...',
    //   text: 'Something went wrong!'})
    // Cookies.remove("admin_access_token");
    // window.location.href = "/adminPanel/login";
  // }else {
    // Cookies.remove("admin_access_token");
    // window.location.href = "/adminPanel/login";
  // }
  // return Promise.reject(error);
// });

export default instance;
