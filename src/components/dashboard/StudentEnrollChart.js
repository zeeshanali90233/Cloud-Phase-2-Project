import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import dynamic from "next/dynamic";
// import ReactApexChart from "react-apexcharts";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const StudentEnrollChart = ({ studentEnrollDate }) => {
  const chartoptions = {
    series: [
      {
        name: "Student Enrolled",
        data: studentEnrollDate,
      },
    ],
    options: {
      chart: {
        type: "area",
      },
      dataLabels: {
        enabled: false,
      },
      grid: {
        strokeDashArray: 3,
        borderColor: "rgba(0,0,0,0.1)",
      },

      stroke: {
        curve: "smooth",
        width: 1,
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "March",
          "April",
          "May",
          "June",
          "July",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
      },
    },
  };
  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">Enroll Summary</CardTitle>
        <CardSubtitle className="text-muted" tag="h6">
          Student Enroll Report
        </CardSubtitle>
        <Chart
          type="area"
          width="100%"
          height="390"
          options={chartoptions.options}
          series={chartoptions.series}
        />
      </CardBody>
    </Card>
  );
};

export default StudentEnrollChart;
