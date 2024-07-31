import React, { Component, useEffect, useState } from "react";
import { Container, Row, Col } from "reactstrap";
import axios from "../../axios";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
// import SalesAnalytics from "./SalesAnalytics";
import MiniWidgets from "./MiniWidgets";

const StarterPage = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", function (event) {
      window.history.pushState(null, document.title, window.location.href);
      // Cookies.remove("admin_access_token");
    });
  }, []);
  const getCategory = async () => {
    try {
      const { data } = await axios.get("/admin/dashboard");
      setTableData(data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const breadcrumbItems = [
    { title: "Live Adhan", link: "#" },
    { title: "Dashboard", link: "#" },
  ];

  const reports = [
    // { icon : "ri-user-fill", title : "Total Number of Users", value : "75" },
    // { icon : "ri-user-fill", title : "Total Number of Subscription plan", value : "50" },
    {
      icon: "ri-user-line",
      title: "Total Number of User",
      value: tableData.user,
    },
    {
      icon: "ri-live-line",
      title: "Total Number of Added Broadcast",
      value: tableData.brodcast,
    },
    {
      icon: "ri-money-pound-circle-line",
      title: "Total Number of Amount Received",
      value: tableData.total_amount,
    },
    {
      icon: "ri-parent-line",
      title: "Total Number of Added Subscription",
      value: tableData.subscription,
    },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Dashboard" breadcrumbItems={breadcrumbItems} />
          <Row>
            <Col xl={12}>
              <Row>
                <MiniWidgets reports={reports} />
              </Row>

              {/* revenue Analytics
                                <RevenueAnalytics/> */}
            </Col>

            {/*<Col xl={4}>

                                {/* sales Analytics */}
            {/*<SalesAnalytics/>*/}

            {/* earning reports */}
            {/* <EarningReports/> */}

            {/*</Col>*/}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default StarterPage;
