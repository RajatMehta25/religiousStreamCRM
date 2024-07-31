import React from "react";
import { Redirect } from "react-router-dom";
import Cookies from "js-cookie";

// Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";
import ForgetPwd from "../pages/Authentication/ForgetPassword";
import AuthLockScreen from "../pages/Authentication/AuthLockScreen";

// Dashboard
import Dashboard from "../pages/Dashboard/index";
import UserManagement from "../pages/UserManagement/UserManagement";
import AccountManagement from "../pages/AccountManagement/Account_Management";
import AccountDetails from "../pages/AccountManagement/Account_Details";
import changePassword from "../pages/Authentication/changePasword";
import AddEditUser from "../pages/UserManagement/AddEditUser";
// import JobManagement from "../pages/JobManagement/JobManagement";

import Notification_Management from "../pages/Notification_Management/Notification_Management";
import ViewNotification from "../pages/Notification_Management/ViewNotification";
import Content_Management from "../pages/Content_Management/Content_Management";
import CustomChangePassword from "../pages/CustomChangePassword/CustomChangePassword";
import Azan_Management from "../pages/Azan_Management/Azan_Management";
import AddEditAzan from "../pages/Azan_Management/AddEditAzan";
import Calender_Management from "../pages/Calender_Management/Calender_Management";
import CalenderView from "../pages/Calender_Management/CalenderView";
import Broadcast_Management from "../pages/Broadcast_Management/Broadcast_Management";
import AddEditBroadcast from "../pages/Broadcast_Management/AddEditBroadcast";
import Sects_Management from "../pages/Sects_Management/Sects_Management";
import AddEditSects from "../pages/Sects_Management/AddEditSects";
import ViewBroadcast from "../pages/Broadcast_Management/ViewBroadcast";
import Subscription_Management from "../pages/Subscription_Management/Subscription_Management";
import AddEditSubscription from "../pages/Subscription_Management/AddEditSubscription";
import FAQ_Management from "../pages/FAQ_Management/FAQ_Management";
import AddEditFAQ from "../pages/FAQ_Management/AddEditFAQ";
import SubAdmin_Management from "../pages/SubAdmin_Management/SubAdmin_Management";
import AddEdit_SubAdmin from "../pages/SubAdmin_Management/AddEdit_SubAdmin";
import ContactUs from "../pages/ContactUs/ContactUs";
import Payment_Management from "../pages/Payment_Management/Payment_Management";
import DisplayIndividual from "../pages/Notification_Management/DisplayIndividual";
import IslamicEvent from "../pages/Broadcast_Management/IslamicEvent";
import EditIslamicEvent from "../pages/Broadcast_Management/EditIslamicEvent";
import PrintQr from "../pages/Broadcast_Management/PrintQr";

const adminToken = Cookies.get("admin_access_token");

const authProtectedRoutes = [
  { path: "/adminPanel/dashboard", component: Dashboard },

  //new routes
  { path: "/adminPanel/user-management", component: UserManagement },
  { path: "/adminPanel/account-management", component: AccountManagement },
  { path: "/adminPanel/account-details", component: AccountDetails },
  //   { path: "/adminPanel/changePassword", component: changePassword },
  // { path: "/adminPanel/AddEditUser", component: AddEditUser },
  // { path: "/adminPanel/job-management", component: JobManagement },

  { path: "/adminPanel/CustomChangePassword", component: CustomChangePassword },

  {
    path: "/adminPanel/Notification_Management",
    component: Notification_Management,
  },
  { path: "/adminpanel/ViewNotification", component: ViewNotification },
  { path: "/adminPanel/DisplayIndividual", component: DisplayIndividual },
  { path: "/adminPanel/Azan_Management", component: Azan_Management },
  { path: "/adminPanel/AddEditAzan", component: AddEditAzan },

  { path: "/adminPanel/Calender_Management", component: Calender_Management },
  { path: "/adminPanel/CalenderView", component: CalenderView },

  { path: "/adminPanel/Broadcast_Management", component: Broadcast_Management },
  { path: "/adminPanel/AddEditBroadcast", component: AddEditBroadcast },
  { path: "/adminPanel/ViewBroadcast", component: ViewBroadcast },
  { path: "/adminPanel/IslamicEvent", component: IslamicEvent },
  { path: "/adminPanel/EditIslamicEvent", component: EditIslamicEvent },
  { path: "/adminPanel/Qr", component: PrintQr },

  { path: "/adminPanel/Sects_Management", component: Sects_Management },
  { path: "/adminPanel/AddEditSects", component: AddEditSects },

  {
    path: "/adminPanel/Subscription_Management",
    component: Subscription_Management,
  },
  {
    path: "/adminPanel/AddEditSubscription",
    component: AddEditSubscription,
  },
  { path: "/adminPanel/Content_Management", component: Content_Management },

  { path: "/adminPanel/FAQ_Management", component: FAQ_Management },
  { path: "/adminPanel/AddEditFAQ", component: AddEditFAQ },

  { path: "/adminPanel/SubAdmin_Management", component: SubAdmin_Management },
  { path: "/adminPanel/AddEdit_SubAdmin", component: AddEdit_SubAdmin },
  { path: "/adminPanel/ContactUs", component: ContactUs },
  { path: "/adminPanel/Payment_Management", component: Payment_Management },

  // { path: "*", component: Dashboard },

  {
    path: "/",
    exact: true,
    component: () =>
      adminToken && adminToken !== "" ? <Redirect to="/adminPanel/dashboard" /> : <Redirect to="/adminPanel/login" />,
  },
];

const dynamicRoutes = () => {
  let cookies = Cookies.get("access");

  var rolesAccess = [];
  if (cookies !== undefined) {
    rolesAccess = JSON.parse(cookies);
  } else {
    rolesAccess = [];
  }
  // alert(rolesAccess)
  // const adminOrSubAdmin = Cookies.get("isSuperAdmin")
  //   ? JSON.parse(Cookies.get("isSuperAdmin"))
  //   : [];
  // console.log(rolesAccess);
  // const adminToken = Cookies.get("admin_access_token");

  let routesToMap = [];
  console.log(rolesAccess);
  if (rolesAccess.includes("ALL")) {
    // if (JSON.stringify(adminOrSubAdmin) === "true") {
    // 	routesToMap.push(
    // 		{ path: "/adminPanel/AddEdit_SubAdmin", component: AddEdit_SubAdmin },
    // 	)
    // }
    routesToMap.push(...authProtectedRoutes);
  } else {
    if (rolesAccess.includes("Manage User")) {
      routesToMap.push({
        path: "/adminPanel/user-management",
        component: UserManagement,
      });
    }

    if (rolesAccess.includes("Manage Azan")) {
      routesToMap.push(
        {
          path: "/adminPanel/Azan_Management",
          component: Azan_Management,
        },
        { path: "/adminPanel/AddEditAzan", component: AddEditAzan }
      );
    }
    if (rolesAccess.includes("Manage Calendar")) {
      routesToMap.push(
        {
          path: "/adminPanel/Calender_Management",
          component: Calender_Management,
        },
        { path: "/adminPanel/CalenderView", component: CalenderView }
      );
    }
    // if (rolesAccess.includes("Sub Category Management")) {
    // 	routesToMap.push({ path: "/adminPanel/subCategory", component: Show_Sub_Category_List },
    // 	{ path: "/adminPanel/addSubCategory", component: Add_Edit_Sub_Category },
    // 	{ path: "/adminPanel/editSubCategory", component: Add_Edit_Sub_Category }

    // 	)
    // }
    if (rolesAccess.includes("Manage Broadcast")) {
      routesToMap.push(
        {
          path: "/adminPanel/Broadcast_Management",
          component: Broadcast_Management,
        },
        { path: "/adminPanel/AddEditBroadcast", component: AddEditBroadcast },
        { path: "/adminPanel/ViewBroadcast", component: ViewBroadcast },
        { path: "/adinPanel/IslamicEvent", component: IslamicEvent },
        { path: "/adminPanel/EditIslamicEvent", component: EditIslamicEvent },
        { path: "/adminPanel/Qr", component: PrintQr }
      );
    }
    if (rolesAccess.includes("Manage Sects")) {
      routesToMap.push(
        { path: "/adminPanel/Sects_Management", component: Sects_Management },
        { path: "/adminPanel/AddEditSects", component: AddEditSects }
      );
    }
    if (rolesAccess.includes("Manage Content")) {
      routesToMap.push({
        path: "/adminPanel/Content_Management",
        component: Content_Management,
      });
    }
    if (rolesAccess.includes("Manage FAQ")) {
      routesToMap.push(
        { path: "/adminPanel/FAQ_Management", component: FAQ_Management },
        {
          path: "/adminPanel/AddEditFAQ",
          component: AddEditFAQ,
        }
      );
    }

    if (rolesAccess.includes("Manage Notification")) {
      routesToMap.push(
        {
          path: "/adminPanel/notification-management",
          component: Notification_Management,
        },
        { path: "/adminPanel/ViewNotification", component: ViewNotification },
        { path: "/adminPanel/DisplayIndividual", component: DisplayIndividual }
      );
    }

    if (rolesAccess.includes("Manage SubAdmin")) {
      routesToMap.push(
        {
          path: "/adminPanel/SubAdmin_Management",
          component: SubAdmin_Management,
        },
        { path: "/adminPanel/AddEdit_SubAdmin", component: AddEdit_SubAdmin }
      );
    }
    if (rolesAccess.includes("Manage Subscription")) {
      routesToMap.push(
        {
          path: "/adminPanel/Subscription_Management",
          component: Subscription_Management,
        },
        {
          path: "/adminPanel/AddEditSubscription",
          component: AddEditSubscription,
        }
      );
    }
    if (rolesAccess.includes("Manage Settings")) {
      routesToMap.push({
        path: "/adminPanel/Content_Management",
        component: Content_Management,
      });
    }
    if (rolesAccess.includes("Manage Payment")) {
      routesToMap.push({
        path: "/adminPanel/Payment_Management",
        component: Payment_Management,
      });
    }

    // routesToMap.push({ path: "/adminPanel/changePassword", component: changePassword })
    routesToMap.push(
      {
        path: "/adminPanel/dashboard",
        component: Dashboard,
      },
      {
        path: "/adminPanel/CustomChangePassword",
        component: CustomChangePassword,
      },
      {
        path: "/adminPanel/ContactUs",
        component: ContactUs,
      }
    );

    routesToMap.push({
      path: "/",
      exact: true,
      component: () =>
        adminToken && adminToken !== "" ? <Redirect to="/adminPanel/dashboard" /> : <Redirect to="/adminPanel/login" />,
    });
  }
  // }
  return routesToMap;
};

const publicRoutes = [
  { path: "/adminPanel/login", component: Login },
  { path: "/adminPanel/logout", component: Logout },
  { path: "/adminPanel/forgot-password", component: ForgetPwd },
  { path: "/adminPanel/register", component: Register },
  { path: "/adminPanel/auth-lock-screen", component: AuthLockScreen },
];

export { authProtectedRoutes, publicRoutes, dynamicRoutes };
