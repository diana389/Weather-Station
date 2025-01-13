import { ApexOptions } from "apexcharts";
import React from "react";
import ReactApexChart from "react-apexcharts";

// Define the props interface to accept the title dynamically
interface SensorData {
  value: number;
  timestamp: string;
}

interface ChartOneProps {
  title: string; // Title of the chart
  description: string; // Description for the chart
  data: SensorData[]; // Data with timestamp and value
  average: number; // Average value for the chart
}

const ChartOne: React.FC<ChartOneProps> = ({
  title,
  description,
  data,
  average,
}) => {
  // Extract values and timestamps from the data
  const values = data.map((item) => item.value);
  const timestamps = data.map((item) => item.timestamp);

  // Calculate the interval for displaying 10 labels
  const interval = Math.floor(timestamps.length / 10);

  // Create a new array for x-axis labels, setting labels as empty string for most data points
  const xAxisLabels = timestamps.map(
    (timestamp, index) => (index % interval === 9 ? timestamp : " "), // Use empty string instead of null
  );

  const options: ApexOptions = {
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#5750F1"], // Only one color for one line
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 420, // Increase height of the chart
      type: "area",
      toolbar: {
        show: false,
      },
      margin: {
        top: 20, // Adjust if needed
        right: 20,
        bottom: 100, // Increased bottom margin to give more space for the tilted labels
        left: 20,
      },
    },
    fill: {
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 350, // Adjust height for smaller screens
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 370, // Adjust height for larger screens
          },
        },
      },
    ],
    stroke: {
      curve: "smooth",
    },
    markers: {
      size: 0,
    },
    grid: {
      strokeDashArray: 5,
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      fixed: {
        enabled: false,
      },
      x: {
        show: false,
      },
      y: {
        title: {
          formatter: function () {
            return "";
          },
        },
      },
      marker: {
        show: false,
      },
    },
    xaxis: {
      type: "category",
      categories: xAxisLabels, // Use the new x-axis labels array
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        rotate: -45, // Tilt the labels by -45 degrees
        style: {
          fontSize: "12px",
          colors: "#000",
        },
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
    },
  };

  return (
    <div className="col-span-12 rounded-[10px] bg-white px-7.5 pb-6 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card xl:col-span-7">
      <div className="mb-3.5 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="text-body-2xlg font-bold text-dark dark:text-white">
            {title} {/* Render the title dynamically */}
          </h4>
        </div>
      </div>
      <div>
        <div className="-ml-4 -mr-5" style={{ width: "100%" }}>
          <ReactApexChart
            options={options}
            series={[{ name: description, data: values }]} // Use all data for the series
            type="area"
            height={420} // Set the height here to match the increased chart height
          />
        </div>
      </div>

      {/* Adjusted description position */}
      <div className="mt-6 flex flex-col gap-2 text-center xsm:flex-row xsm:gap-0">
        {" "}
        {/* Added mt-6 to move the description lower */}
        <div className="xsm:w-1/2">
          <p className="font-medium">
            {description} {/* Render the description dynamically */}
          </p>
          <h4 className="mt-1 text-xl font-bold text-dark dark:text-white">
            {average.toFixed(2)} {/* Render the average dynamically */}
          </h4>
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
