import React, { Component } from "react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Cookies from "js-cookie";
//i18n
import { withNamespaces } from "react-i18next";

import { connect } from "react-redux";
import { changeLayout, changeLayoutWidth, changeSidebarTheme, changeSidebarType, changePreloader } from "../../store/actions";

class SidebarContent extends Component {
  constructor(props) {
    let cookies = Cookies.get("access");

    var rolesAccess = [];
    if (cookies !== undefined) {
      rolesAccess = JSON.parse(cookies);
    } else {
      rolesAccess = [];
    }

    super(props);
    this.state = { rolesAccess: rolesAccess, backgroundColorSideBar: `rgba(50, 122, 50, 0.5)` };
  }

  componentDidMount() {
    this.initMenu();
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      if (this.props.type !== prevProps.type) {
        this.initMenu();
      }
    }
  }

  initMenu() {
    new MetisMenu("#side-menu");

    var matchingMenuItem = null;
    var ul = document.getElementById("side-menu");
    var items = ul.getElementsByTagName("a");
    for (var i = 0; i < items.length; ++i) {
      if (this.props.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i];
        break;
      }
    }
    if (matchingMenuItem) {
      this.activateParentDropdown(matchingMenuItem);
    }
  }

  activateParentDropdown = (item) => {
    item.classList.add("active");
    const parent = item.parentElement;

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show");

        const parent3 = parent2.parentElement;

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement;
          if (parent4) {
            parent4.classList.add("mm-active");
          }
        }
      }
      return false;
    }
    return false;
  };

  render() {
    return (
      <React.Fragment>
        <div id="sidebar-menu">
          <ul className="metismenu list-unstyled" id="side-menu">
            <li className="menu-title">{this.props.t("Menu")}</li>
            {/* {(this.state.rolesAccess.includes("ALL") ||
              this.state.rolesAccess.includes("Dashboard")) && ( */}
            <li>
              <NavLink
                to="/adminPanel/dashboard"
                className="waves-effect"
                style={{
                  fontSize: 16,
                  display: "flex",
                  alignItems: "flex-start",
                  fontWeight: this.props.history.location.pathname === "/adminPanel/dashboard" ? "	bold" : "",
                  backgroundColor:
                    this.props.history.location.pathname === "/adminPanel/dashboard" ? this.state.backgroundColorSideBar : "",
                  // alignItems: "center",
                }}
              >
                <i className="ri-dashboard-line"></i>
                {/*<span className="badge badge-pill badge-success float-right">3</span>*/}
                <span className="ml-1">{this.props.t("Dashboard")}</span>
              </NavLink>
            </li>
            {/* )} */}
            {(this.state.rolesAccess.includes("ALL") || this.state.rolesAccess.includes("Manage User")) && (
              <li>
                <NavLink
                  to="/adminPanel/user-management"
                  className="waves-effect"
                  style={{
                    fontSize: 16,
                    display: "flex",
                    alignItems: "flex-start",
                    backgroundColor:
                      this.props.history.location.pathname === "/adminPanel/user-management"
                        ? this.state.backgroundColorSideBar
                        : "",
                    fontWeight: this.props.history.location.pathname === "/adminPanel/user-management" ? "	bold" : "",
                    // alignItems: "center",
                  }}
                >
                  <i className="ri-user-line"></i>
                  <span className="ml-1">{this.props.t("Manage User")}</span>
                </NavLink>
              </li>
            )}
            {(this.state.rolesAccess.includes("ALL") || this.state.rolesAccess.includes("Manage Broadcast")) && (
              <li>
                <NavLink
                  to="/adminPanel/Broadcast_Management"
                  className="waves-effect"
                  style={{
                    fontSize: 16,
                    display: "flex",
                    alignItems: "flex-start",
                    backgroundColor:
                      this.props.history.location.pathname === "/adminPanel/Broadcast_Management" ||
                      this.props.history.location.pathname === "/adminPanel/AddEditBroadcast" ||
                      this.props.history.location.pathname === "/adminPanel/ViewBroadcast" ||
                      this.props.history.location.pathname === "/adminPanel/Qr" ||
                      this.props.history.location.pathname === "/adminPanel/IslamicEvent"
                        ? this.state.backgroundColorSideBar
                        : "",
                    fontWeight:
                      this.props.history.location.pathname === "/adminPanel/Broadcast_Management" ||
                      this.props.history.location.pathname === "/adminPanel/AddEditBroadcast" ||
                      this.props.history.location.pathname === "/adminPanel/ViewBroadcast" ||
                      this.props.history.location.pathname === "/adminPanel/Qr" ||
                      this.props.history.location.pathname === "/adminPanel/IslamicEvent"
                        ? "	bold"
                        : "",
                    // alignItems: "center",
                  }}
                >
                  <i class="ri-live-line"></i>
                  <span className="ml-1">{this.props.t("Manage Broadcast")}</span>
                </NavLink>
              </li>
            )}
            {/* <li>
              <NavLink
                to="/adminPanel/Azan_Management"
                className="waves-effect"
                style={{
                  fontSize: 16,
                  display: "flex",
                  alignItems: "flex-start",
                  // alignItems: "center",
                }}
              >
                <i class="ri-book-open-line"></i>{" "}
                <span className="ml-1">{this.props.t("Manage Azan")}</span>
              </NavLink>
            </li> */}
            {(this.state.rolesAccess.includes("ALL") || this.state.rolesAccess.includes("Manage Sects")) && (
              <li>
                <NavLink
                  to="/adminPanel/Sects_Management"
                  className="waves-effect"
                  style={{
                    fontSize: 16,
                    display: "flex",
                    alignItems: "flex-start",
                    backgroundColor:
                      this.props.history.location.pathname === "/adminPanel/Sects_Management" ||
                      this.props.history.location.pathname === "/adminPanel/AddEditSects"
                        ? this.state.backgroundColorSideBar
                        : "",
                    fontweight:
                      this.props.history.location.pathname === "/adminPanel/Sects_Management" ||
                      this.props.history.location.pathname === "/adminPanel/AddEditSects"
                        ? "	bold"
                        : "",
                    // alignItems: "center",
                  }}
                >
                  <i class="ri-parent-line"></i> <span className="ml-1">{this.props.t("Manage Sects")}</span>
                </NavLink>
              </li>
            )}
            {(this.state.rolesAccess.includes("ALL") || this.state.rolesAccess.includes("Manage Calendar")) && (
              <li>
                <NavLink
                  to="/adminPanel/Calender_Management"
                  className="waves-effect"
                  style={{
                    fontSize: 16,
                    display: "flex",
                    alignItems: "flex-start",
                    backgroundColor:
                      this.props.history.location.pathname === "/adminPanel/Calender_Management" ||
                      this.props.history.location.pathname === "/adminPanel/CalenderView"
                        ? this.state.backgroundColorSideBar
                        : "",
                    fontWeight:
                      this.props.history.location.pathname === "/adminPanel/Calender_Management" ||
                      this.props.history.location.pathname === "/adminPanel/CalenderView"
                        ? "	bold"
                        : "",
                    // alignItems: "center",
                  }}
                >
                  <i className="ri-calendar-2-line"></i>
                  <span
                    className="ml-1"
                    // style={{ fontSize: 18, display: "content" }}
                  >
                    {this.props.t("Manage Calendar")}
                  </span>
                </NavLink>
              </li>
            )}
            {(this.state.rolesAccess.includes("ALL") || this.state.rolesAccess.includes("Manage Subscription")) && (
              <li>
                <NavLink
                  to="/adminPanel/Subscription_Management"
                  className="waves-effect"
                  style={{
                    fontSize: 16,
                    display: "flex",
                    alignItems: "flex-start",
                    backgroundColor:
                      this.props.history.location.pathname === "/adminPanel/Subscription_Management" ||
                      this.props.history.location.pathname === "/adminPanel/AddEditSubscription"
                        ? this.state.backgroundColorSideBar
                        : "",
                    fontWeight:
                      this.props.history.location.pathname === "/adminPanel/Subscription_Management" ||
                      this.props.history.location.pathname === "/adminPanel/AddEditSubscription"
                        ? "	bold"
                        : "",
                    // alignItems: "center",
                  }}
                >
                  <i class="ri-money-pound-circle-line"></i>
                  <span className="ml-1">{this.props.t("Manage Subscription")}</span>
                </NavLink>
              </li>
            )}
            {(this.state.rolesAccess.includes("ALL") || this.state.rolesAccess.includes("Manage FAQ")) && (
              <li>
                <NavLink
                  to="/adminPanel/FAQ_Management"
                  className="waves-effect"
                  style={{
                    fontSize: 16,
                    display: "flex",
                    alignItems: "flex-start",
                    backgroundColor:
                      this.props.history.location.pathname === "/adminPanel/FAQ_Management" ||
                      this.props.history.location.pathname === "/adminPanel/AddEditFAQ"
                        ? this.state.backgroundColorSideBar
                        : "",
                    fontWeight:
                      this.props.history.location.pathname === "/adminPanel/FAQ_Management" ||
                      this.props.history.location.pathname === "/adminPanel/AddEditFAQ"
                        ? "	bold"
                        : "",
                    // alignItems: "center",
                  }}
                >
                  <i class="ri-question-answer-line"></i>
                  <span className="ml-1">{this.props.t("Manage FAQ")}</span>
                </NavLink>
              </li>
            )}
            {/* <li>
                  <NavLink
                    to="/adminPanel/Notification_Management"
                    className="waves-effect"
                  >
                    <i className="ri-account-circle-line"></i>
                    <span className="ml-1">
                      {this.props.t("Notification Management")}
                    </span>
                  </NavLink>
                </li> */}
            {(this.state.rolesAccess.includes("ALL") || this.state.rolesAccess.includes("Manage Settings")) && (
              <li>
                <NavLink
                  to="/adminPanel/Content_Management"
                  className="waves-effect"
                  style={{
                    fontSize: 16,
                    display: "flex",
                    alignItems: "flex-start",
                    backgroundColor:
                      this.props.history.location.pathname === "/adminPanel/Content_Management"
                        ? this.state.backgroundColorSideBar
                        : "",
                    fontWeight: this.props.history.location.pathname === "/adminPanel/Content_Management" ? "	bold" : "",
                    // alignItems: "center",
                  }}
                >
                  <i class="ri-settings-5-line"></i>
                  <span className="ml-1">{this.props.t("Manage Settings")}</span>
                </NavLink>
              </li>
            )}
            {(this.state.rolesAccess.includes("ALL") || this.state.rolesAccess.includes("Manage SubAdmin")) && (
              <li>
                <NavLink
                  to="/adminPanel/SubAdmin_Management"
                  className="waves-effect"
                  style={{
                    fontSize: 16,
                    display: "flex",
                    alignItems: "flex-start",
                    backgroundColor:
                      this.props.history.location.pathname === "/adminPanel/SubAdmin_Management" ||
                      this.props.history.location.pathname === "/adminPanel/AddEdit_SubAdmin"
                        ? this.state.backgroundColorSideBar
                        : "",
                    fontWeight:
                      this.props.history.location.pathname === "/adminPanel/SubAdmin_Management" ||
                      this.props.history.location.pathname === "/adminPanel/AddEdit_SubAdmin"
                        ? "	bold"
                        : "",

                    // alignItems: "center",
                  }}
                >
                  <i class="ri-user-settings-line"></i>
                  <span className="ml-1">{this.props.t("Manage SubAdmin")}</span>
                </NavLink>
              </li>
            )}
            {(this.state.rolesAccess.includes("ALL") || this.state.rolesAccess.includes("Manage Notification")) && (
              <li>
                <NavLink
                  to="/adminPanel/Notification_Management"
                  className="waves-effect"
                  style={{
                    fontSize: 16,
                    display: "flex",
                    alignItems: "flex-start",
                    backgroundColor:
                      this.props.history.location.pathname === "/adminPanel/Notification_Management" ||
                      this.props.history.location.pathname === "/adminPanel/ViewNotification"
                        ? this.state.backgroundColorSideBar
                        : "",
                    fontWeight:
                      this.props.history.location.pathname === "/adminPanel/Notification_Management" ||
                      this.props.history.location.pathname === "/adminPanel/ViewNotification"
                        ? "	bold"
                        : "",

                    // alignItems: "center",
                  }}
                >
                  <i class="ri-notification-3-line"></i>
                  <span className="ml-1">{this.props.t("Manage Notification")}</span>
                </NavLink>
              </li>
            )}
            {(this.state.rolesAccess.includes("ALL") || this.state.rolesAccess.includes("Manage Payment")) && (
              <li>
                <NavLink
                  to="/adminPanel/Payment_Management"
                  className="waves-effect"
                  style={{
                    fontSize: 16,
                    display: "flex",
                    alignItems: "flex-start",
                    backgroundColor:
                      this.props.history.location.pathname === "/adminPanel/Payment_Management"
                        ? this.state.backgroundColorSideBar
                        : "",
                    fontWeight: this.props.history.location.pathname === "/adminPanel/Payment_Management" ? "	bold" : "",
                    // alignItems: "center",
                  }}
                >
                  <i class="ri-bank-card-line"></i>
                  <span className="ml-1">{this.props.t("Manage Payment")}</span>
                </NavLink>
              </li>
            )}
            <li>
              <NavLink
                to="/adminPanel/ContactUs"
                className="waves-effect"
                style={{
                  fontSize: 16,
                  display: "flex",
                  alignItems: "flex-start",
                  backgroundColor:
                    this.props.history.location.pathname === "/adminPanel/ContactUs" ? this.state.backgroundColorSideBar : "",
                  fontWeight: this.props.history.location.pathname === "/adminPanel/ContactUs" ? "	bold" : "",
                  // alignItems: "center",
                }}
              >
                <i className="ri-contacts-book-2-line"></i>
                {/*<span className="badge badge-pill badge-success float-right">3</span>*/}
                <span className="ml-1">{this.props.t("Contact Us")}</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </React.Fragment>
    );
  }
}

const mapStatetoProps = (state) => {
  return { ...state.Layout };
};

export default withRouter(
  connect(mapStatetoProps, {
    changeLayout,
    changeSidebarTheme,
    changeSidebarType,
    changeLayoutWidth,
    changePreloader,
  })(withNamespaces()(SidebarContent))
);
