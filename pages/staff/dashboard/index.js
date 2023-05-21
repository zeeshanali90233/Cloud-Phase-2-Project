import { Col, Row } from "reactstrap";
import Feeds from "../../../src/components/dashboard/Feeds";
import ProjectTables from "../../../src/components/dashboard/ProjectTable";
import Blog from "../../../src/components/dashboard/Blog";
import bg1 from "../../../src/assets/images/bg/bg1.jpg";
import bg2 from "../../../src/assets/images/bg/bg2.jpg";
import bg3 from "../../../src/assets/images/bg/bg3.jpg";
import bg4 from "../../../src/assets/images/bg/bg4.jpg";
import StaffLayout from "../../../src/layouts/StaffLayout";
import TopInfoPanels from "../../../src/components/TopInfoPanels";
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

  return (
    <StaffLayout>


      <div>
        
        {/* Information Panels */}
        <TopInfoPanels showTotalSalary={false} showProfitLoss={false} showTotalEmployees={false}/>
        

          {/***Information Charts***/}
          <InfoCharts
          showFeeChart={true}
          showEnrollChart={true}
          showSalaryChart={false}
        />

        {/***Sales & Feed***/}
        <Row>
         
          <Col sm="12" lg="6" xl="5" xxl="4">
            <Feeds />
          </Col>
        </Row>
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
    </StaffLayout>
  );
}
