import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";

// Define props interface to accept dynamic title and data
interface ChartThreeProps {
  title: string; // Title for the chart
  series: number[]; // Data for the chart
  labels: string[]; // Labels for the segments
}

const ChartThree: React.FC<ChartThreeProps> = ({ title, series, labels }) => {
  // Validation: Labels should not include "NaN - NaN", and series should not include NaN values
  const isValidData =
    labels.length > 0 &&
    series.every((value) => !isNaN(value)) &&
    labels.every((label) => label !== "NaN - NaN");

  const options: ApexOptions = {
    chart: {
      fontFamily: "Satoshi, sans-serif",
      type: "donut",
    },
    colors: ["#5750F1", "#5475E5", "#8099EC", "#ADBCF2"],
    // labels: labels,
    legend: {
      show: false,
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          background: "transparent",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: "Data analized",
              fontSize: "16px",
              fontWeight: "400",
            },
            value: {
              show: true,
              fontSize: "28px",
              fontWeight: "bold",
            },
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 415,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  console.log("series:", series);
  console.log("labels:", labels);

  if (!isValidData) {
    return (
      <div className="text-center text-dark dark:text-white">
        Loading valid data...
      </div>
    );
  }

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-7 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-5">
      <div className="mb-9 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            {title}
          </h4>
        </div>
      </div>

      <div className="mb-8">
        <div className="mx-auto flex justify-center">
          <ReactApexChart options={options} series={series} type="donut" />
        </div>
      </div>

      <div className="mx-auto w-full max-w-[350px]">
        <div className="-mx-7.5 flex flex-wrap items-center justify-center gap-y-2.5">
          {labels.map((label, index) => (
            // Render only if the value is not NaN
            // (series[index] != 0) && (
            <div key={label} className="w-full px-7.5 sm:w-1/2">
              <div className="flex w-full items-center">
                <p className="flex w-full justify-between text-body-sm font-medium text-dark dark:text-dark-6">
                  <span>{label}</span>
                  <span>{series[index]}%</span> {/* Display series data */}
                </p>
              </div>
            </div>
            // )
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartThree;
