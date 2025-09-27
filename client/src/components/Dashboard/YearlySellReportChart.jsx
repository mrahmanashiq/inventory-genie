import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import React from "react";
import { Bar } from "react-chartjs-2";
import { useYearlySellReport } from "../../hooks/useProducts";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  indexAxis: "y",
  elements: {
    bar: {
      borderWidth: 2,
    },
  },
  responsive: true,
  plugins: {
    legend: {
      position: "right",
    },
    title: {
      display: true,
      text: "Chart.js Horizontal Bar Chart",
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

const months = [
  {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December",
  },
];

export function YearlySellReportChart() {
  const { data: apiData } = useYearlySellReport();

  //   const labels = apiData?.products?.map((product) => product?.name);
  const dataSets = apiData?.report?.map((product) => product?.totalSell);

  const labels = apiData?.report?.map((product) => {
    const month = months[0][product?.month - 1];
    return month;
  });

  const data = {
    labels,
    datasets: [
      {
        label: "total sell:",
        data: dataSets,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "red",
      },
    ],
  };

  return <Bar options={options} data={data} />;
}