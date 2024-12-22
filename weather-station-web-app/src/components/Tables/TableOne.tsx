"use client";

import React, { useState } from "react";

// Assuming the `SensorData` type is like this:
interface SensorData {
    value: number;
    timestamp: string;
}

interface TableOneProps {
    temperaturePairs: SensorData[];
    humidityPairs: SensorData[];
    pressurePairs: SensorData[];
}

const TableOne = ({ temperaturePairs, humidityPairs, pressurePairs }: TableOneProps) => {
    // Prepare the latest data with timestamp as date
    const latestData: ({ title: string; value: string | undefined; date: string; data: SensorData[] })[] = [
        {
            title: "Temperature",
            value: temperaturePairs[temperaturePairs.length - 1]?.value.toFixed(2),
            date: temperaturePairs[temperaturePairs.length - 1]?.timestamp || "No date",
            data: temperaturePairs, // All temperature data
        },
        {
            title: "Humidity",
            value: humidityPairs[humidityPairs.length - 1]?.value.toFixed(2),
            date: humidityPairs[humidityPairs.length - 1]?.timestamp || "No date",
            data: humidityPairs, // All humidity data
        },
        {
            title: "Pressure",
            value: pressurePairs[pressurePairs.length - 1]?.value.toFixed(2),
            date: pressurePairs[pressurePairs.length - 1]?.timestamp || "No date",
            data: pressurePairs, // All pressure data
        },
    ];

    const [expandedRow, setExpandedRow] = useState<number | null>(null);

    const toggleRow = (index: number) => {
        setExpandedRow(expandedRow === index ? null : index);
    };

    return (
      <div className="rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card">
          <h4 className="mb-5.5 text-body-2xlg font-bold text-dark dark:text-white">
              History
          </h4>

          <div className="flex flex-col">
              <div className="grid grid-cols-3 sm:grid-cols-5">
                  <div className="px-2 pb-3.5">
                      <h5 className="text-sm font-medium uppercase xsm:text-base">TYPE</h5>
                  </div>
                  <div className="px-2 pb-3.5 text-center">
                      <h5 className="text-sm font-medium uppercase xsm:text-base">VALUE</h5>
                  </div>
                  <div className="px-2 pb-3.5 text-center">
                      <h5 className="text-sm font-medium uppercase xsm:text-base">DATE</h5>
                  </div>
                  <div className="hidden px-2 pb-3.5 text-center sm:block">
                      <h5 className="text-sm font-medium uppercase xsm:text-base">HISTORY</h5>
                  </div>
              </div>

              {latestData.map((data, index) => (
                <div key={index} className="border-b border-stroke dark:border-dark-3">
                    {/* Main Row */}
                    <div
                      className="grid cursor-pointer grid-cols-3 items-center sm:grid-cols-5"
                      onClick={() => toggleRow(index)}
                    >
                        <div className="flex items-center gap-3.5 px-2 py-4">
                            <p className="hidden font-medium text-dark dark:text-white sm:block">
                                {data.title}
                            </p>
                        </div>

                        <div className="flex items-center justify-center px-2 py-4">
                            <p className="font-medium text-dark dark:text-white">{data.value}</p>
                        </div>

                        <div className="flex items-center justify-center px-2 py-4">
                            <p className="font-medium text-green-light-1">{data.date}</p>
                        </div>

                        <div className="hidden items-center justify-center px-2 py-4 sm:flex">
                            <p className="text-blue-500 hover:underline">Show history</p>
                        </div>
                    </div>

                    {/* Expanded Row */}
                    {expandedRow === index && (
                      <div className="bg-gray-50 px-4 py-4 dark:bg-dark-2">
                          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                              {data.data.map((entry, idx) => (
                                <li key={idx}>
                                    <p><strong>Value:</strong> {entry.value.toFixed(2)}
                                        <strong> Date:</strong> {entry.timestamp}</p>
                                </li>
                              ))}
                          </ul>
                      </div>
                    )}
                </div>
              ))}
          </div>
      </div>
    );
};

export default TableOne;
