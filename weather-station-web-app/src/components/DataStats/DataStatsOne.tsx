import React from "react";
import { dataStats } from "@/types/dataStats";

interface DataStatsOneProps {
  currentValues: {
    temperature: string;
    humidity: string;
    pressure: string;
  };
  growthRates: {
    temperature: number;
    humidity: number;
    pressure: number;
  };
}

const DataStatsOne: ({currentValues, growthRates}: { currentValues: any; growthRates: any }) => React.JSX.Element = ({currentValues, growthRates} ) => {

  const dataStatsList = [
    {
      icon: (
          <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
          >
            <path
                d="M13 2.16675C12.0944 2.16675 11.3334 2.92774 11.3334 3.83342V15.4377C9.88004 16.1996 8.93774 17.6987 8.93774 19.3334C8.93774 21.5784 10.7554 23.3334 13 23.3334C15.245 23.3334 17.0627 21.5784 17.0627 19.3334C17.0627 17.6987 16.1204 16.1996 14.667 15.4377V3.83342C14.667 2.92774 13.906 2.16675 13 2.16675Z"
                fill="white"
            />
            <circle cx="13" cy="19.3334" r="2.16667" fill="white" />
          </svg>
      ),
      color: "#FF5C93",
      title: "Current temperature",
      value: currentValues.temperature,
      growthRate: growthRates.temperature,
    },
    {
      icon: (
          <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
          >
            <path
                d="M13 2C13.2761 2 13.5393 2.09763 13.731 2.27408C14.6128 3.07188 19 7.29167 19 12.4167C19 15.85 16.1763 19 13 19C9.82375 19 7 15.85 7 12.4167C7 7.29167 11.3872 3.07188 12.269 2.27408C12.4607 2.09763 12.7239 2 13 2ZM13 17.3333C14.5545 17.3333 16 15.3333 16 12.4167C16 9.79167 13.729 6.625 13 5.68542C12.271 6.625 10 9.79167 10 12.4167C10 15.3333 11.4455 17.3333 13 17.3333ZM10.25 20.3333C10.25 20.5561 10.1951 20.7753 10.0916 20.9686C9.98801 21.1619 9.83989 21.3238 9.6592 21.4397C9.47851 21.5556 9.27129 21.6218 9.0576 21.631C8.84391 21.6401 8.63215 21.5918 8.44233 21.4914C8.25252 21.391 8.09123 21.2414 7.97363 21.0581C7.85602 20.8748 7.78573 20.6642 7.77007 20.4454C7.75442 20.2265 7.79423 20.0076 7.88562 19.8081C7.977 19.6087 8.11712 19.4363 8.29303 19.306C8.46894 19.1756 8.67502 19.0901 8.89189 19.0576C9.10876 19.0251 9.32846 19.046 9.53285 19.1185C9.73724 19.191 9.91956 19.3122 10.064 19.4725C10.2085 19.6328 10.311 19.8265 10.3626 20.0378C10.4141 20.249 10.4121 20.4703 10.3571 20.6787C10.3021 20.8871 10.195 21.0764 10.0465 21.2284C9.89799 21.3804 9.71241 21.4892 9.50991 21.543C9.30741 21.5968 9.09334 21.5936 8.89462 21.5337C8.69589 21.4737 8.52164 21.3612 8.38893 21.2089C8.25623 21.0567 8.16927 20.87 8.13701 20.6723C8.10475 20.4746 8.12837 20.2714 8.20575 20.0873C8.28312 19.9032 8.41113 19.7468 8.57535 19.6325C8.73957 19.5182 8.93241 19.4516 9.13264 19.4406C9.33287 19.4296 9.53046 19.4746 9.70756 19.5707C9.88467 19.6668 10.0356 19.8104 10.141 19.9819C10.2463 20.1535 10.3035 20.3452 10.3071 20.5414C10.3106 20.7376 10.2606 20.9307 10.1642 21.1037C10.0677 21.2768 9.92934 21.4236 9.76141 21.533C9.59348 21.6424 9.4027 21.7112 9.20526 21.7342C9.00782 21.7572 8.80815 21.7339 8.6194 21.6652C8.43065 21.5966 8.25991 21.4858 8.11868 21.3402C7.97746 21.1947 7.87018 21.0198 7.80539 20.8289C7.74059 20.6379 7.71973 20.4358 7.74431 20.2359C7.7689 20.036 7.83842 19.8442 7.94741 19.6719C8.05639 19.4997 8.20206 19.352 8.3745 19.2387C8.54694 19.1255 8.74227 19.0483 8.94444 19.0137C9.14661 18.9792 9.35181 18.9872 9.55032 19.0376C9.74882 19.088 9.93606 19.1793 10.1011 19.3055C10.2661 19.4317 10.4056 19.5896 10.5106 19.767C10.6156 19.9443 10.6838 20.1365 10.7106 20.3333H10.25Z"
                fill="white"
            />
          </svg>
      ),
      color: "#18BFFF",
      title: "Current humidity",
      value: currentValues.humidity,
      growthRate: growthRates.humidity,
    },
    {
      icon: (
          <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="13" cy="13" r="9.5" stroke="white" strokeWidth="2" />
            <path
                d="M13 13L18 8"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M13 13L8 18"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <circle cx="13" cy="13" r="1.5" fill="white" />
          </svg>
      ),
      color: "#FF9C55",
      title: "Current pressure",
      value: currentValues.pressure,
      growthRate: growthRates.pressure,
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3 2xl:gap-7.5">
        {dataStatsList.map((item, index) => (
          <div
            key={index}
            className="rounded-[10px] bg-white p-6 shadow-1 dark:bg-gray-dark"
          >
            <div
              className="flex h-14.5 w-14.5 items-center justify-center rounded-full"
              style={{ backgroundColor: item.color }}
            >
              {item.icon}
            </div>

            <div className="mt-6 flex items-end justify-between">
              <div>
                <h4 className="mb-1.5 text-heading-6 font-bold text-dark dark:text-white">
                  {item.value}
                </h4>
                <span className="text-body-sm font-medium">{item.title}</span>
              </div>

              <span
                className={`flex items-center gap-1.5 text-body-sm font-medium ${
                  item.growthRate > 0 ? "text-green" : "text-red"
                }`}
              >
                {item.growthRate}%
                {item.growthRate > 0 ? (
                  <svg
                    className="fill-current"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.35716 2.3925L0.908974 5.745L5.0443e-07 4.86125L5 -5.1656e-07L10 4.86125L9.09103 5.745L5.64284 2.3925L5.64284 10L4.35716 10L4.35716 2.3925Z"
                      fill=""
                    />
                  </svg>
                ) : (
                  <svg
                    className="fill-current"
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5.64284 7.6075L9.09102 4.255L10 5.13875L5 10L-8.98488e-07 5.13875L0.908973 4.255L4.35716 7.6075L4.35716 7.6183e-07L5.64284 9.86625e-07L5.64284 7.6075Z"
                      fill=""
                    />
                  </svg>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default DataStatsOne;
