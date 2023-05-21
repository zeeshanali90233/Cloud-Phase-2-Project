import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import dynamic from "next/dynamic";
// import ReactApexChart from "react-apexcharts";
const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const FeePieChart = ({ feepaid, feenotpaid }) => {
  const chartoptions = {
    series: [feenotpaid, feepaid],
    options: {
      chart: {
        type: "pie",
      },
      labels: ["Not Paid", "Paid"],
    },
  };

  return (
    <Card>
      <CardBody>
        <CardTitle tag="h5">Fees Summary</CardTitle>
        <CardSubtitle className="text-muted" tag="h6">
          Total Fee Report
        </CardSubtitle>
        <Chart
          type="pie"
          width="100%"
          height="390"
          options={chartoptions.options}
          series={chartoptions.series}
        />
      </CardBody>
    </Card>
  );
};

export default FeePieChart;
