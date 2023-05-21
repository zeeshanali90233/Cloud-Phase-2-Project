import { Col, Row } from "reactstrap";
import SalesChart from "../../../src/components/dashboard/SalesChart";
import Feeds from "../../../src/components/dashboard/Feeds";
import ProjectTables from "../../../src/components/dashboard/ProjectTable";
import TopCards from "../../../src/components/dashboard/TopCards";
import Blog from "../../../src/components/dashboard/Blog";
import bg1 from "../../../src/assets/images/bg/bg1.jpg";
import bg2 from "../../../src/assets/images/bg/bg2.jpg";
import bg3 from "../../../src/assets/images/bg/bg3.jpg";
import bg4 from "../../../src/assets/images/bg/bg4.jpg";
import AdminLayout from "../../../src/layouts/AdminLayout";
import { useState, useEffect } from "react";
import { db } from "../../../src/Firebase/config";
import InfoCharts from "../../../src/components/InfoCharts";

const BlogData = [
  {
    image: bg1,
    title: "This is simple blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg2,
    title: "Lets be simple blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg3,
    title: "Don't Lamp blog",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
  {
    image: bg4,
    title: "Simple is beautiful",
    subtitle: "2 comments, 1 Like",
    description:
      "This is a wider card with supporting text below as a natural lead-in to additional content.",
    btnbg: "primary",
  },
];

export default function dashboard() {
  const [totalFees, setTotalFees] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);

  useEffect(() => {
    // Fetching the no of students and fees
    const fetchTotalStudentsAndFees = async () => {
      await db.collection("students").onSnapshot((snapshot) => {
        let totalFeesFirebase = 0;
        let totalStudentsFirebase = 0;
        snapshot.forEach((doc) => {
          totalFeesFirebase += Number(doc.data().totalfees);
          totalStudentsFirebase += 1;
        });
        setTotalStudents(totalStudentsFirebase);
        setTotalFees(totalFeesFirebase);
      });
    };

    // Calling Each Function
    fetchTotalStudentsAndFees();
  }, []);
  return (
    <AdminLayout>
      <div>
        {/***Top Cards***/}
        <Row>
          <Col sm="6" lg="3">
            <TopCards
              bg="bg-light-success text-success"
              title="Total Fees"
              subtitle="Total Earning"
              earning={`${totalFees.toLocaleString()}PKR`}
              icon="bi bi-wallet"
            />
          </Col>

          <Col sm="6" lg="3">
            <TopCards
              bg="bg-light-danger text-danger"
              title="Students"
              subtitle="Students"
              earning={`${totalStudents.toLocaleString()}`}
              icon="bi bi-person-video"
            />
          </Col>
        </Row>
        {/***Information Charts***/}
        <InfoCharts
          showFeeChart={true}
          showEnrollChart={true}
          showSalaryChart={false}
        />

        {/***Table ***/}
        <Row>
          <Col lg="12" sm="12">
            <ProjectTables />
          </Col>
        </Row>
        {/***Blog Cards***/}
        <Row>
          {BlogData.map((blg) => (
            <Col sm="6" lg="6" xl="3" key={blg.title}>
              <Blog
                image={blg.image}
                title={blg.title}
                subtitle={blg.subtitle}
                text={blg.description}
                color={blg.btnbg}
              />
            </Col>
          ))}
        </Row>
      </div>
    </AdminLayout>
  );
}
