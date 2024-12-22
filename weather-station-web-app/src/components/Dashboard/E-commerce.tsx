"use client";
import React, { useEffect, useState } from "react";
import ChartThree from "../Charts/ChartThree";
import TableOne from "../Tables/TableOne";
import DataStatsOne from "@/components/DataStats/DataStatsOne";
import ChartOne from "@/components/Charts/ChartOne";
import { get, onValue, ref, set } from "@firebase/database";
import database from "@/app/firebaseConfig";
import AlertError from "@/components/Alerts/AlertError";
import ButtonDefault from "@/components/Buttons/ButtonDefault";
import { limitToLast, push, query } from "firebase/database";

interface SensorData {
  value: number;
  timestamp: string;
}

const ECommerce: React.FC = () => {

  const temperatureUpperBound = 30;
  const temperatureLowerBound = 24;
  const humidityUpperBound = 70;
  const humidityLowerBound = 30;
  const pressureUpperBound = 1018;
  const pressureLowerBound = 1000;

  let errorMessage = "";

  const [temperatureData, setTemperatureData] = useState<number[]>([]);
  const [humidityData, setHumidityData] = useState<number[]>([]);
  const [pressureData, setPressureData] = useState<number[]>([]);
  const [temperaturePairs, setTemperaturePairs] = useState<SensorData[]>([]);
  const [humidityPairs, setHumidityPairs] = useState<SensorData[]>([]);
  const [pressurePairs, setPressurePairs] = useState<SensorData[]>([]);
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  const calculateAverage = (data: number[]): number => {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, value) => acc + value, 0);
    return sum / data.length;
  };

  const calculateGrowthRate = (data: number[], average: number): number => {
    if (data.length === 0 || average === 0) return 0;
    const latestValue = data[data.length - 1];
    return ((latestValue - average) / average) * 100;
  };

  const splitIntoIntervals = (data: number[]): { ranges: string[], counts: number[] } => {
    // Sort the data in ascending order
    const sortedData = [...data].sort((a, b) => a - b);

    const min = sortedData[0];
    const max = sortedData[sortedData.length - 1];

    console.log("Min:", min);
    console.log("Max:", max);

    const range = max - min;
    const intervalSize = range / 4;

    const intervals = [
      min + intervalSize,
      min + intervalSize * 2,
      min + intervalSize * 3,
      min + intervalSize * 4
    ];

    console.log("Intervals:", intervals);

    const distributions = [0, 0, 0, 0];

    // Count how many data points fall into each interval
    for (const value of sortedData) {
      if (value <= intervals[0]) {
        distributions[0]++;
      } else if (value <= intervals[1]) {
        distributions[1]++;
      } else if (value <= intervals[2]) {
        distributions[2]++;
      } else {
        distributions[3]++;
      }
    }

    if (intervals.length !== 4) {
      console.log("Intervals are not calculated properly:", intervals);
      return { ranges: [], counts: [] };
    }

    const ranges = [
      `${min?.toFixed(2)} - ${intervals[0].toFixed(2)}`,
      `${(intervals[0]).toFixed(2)} - ${intervals[1].toFixed(2)}`,
      `${(intervals[1]).toFixed(2)} - ${intervals[2].toFixed(2)}`,
      `${(intervals[2]).toFixed(2)} - ${intervals[3].toFixed(2)}`
    ];
    console.log("Ranges:", ranges);

    console.log("Distributions:", distributions);

    return { ranges, counts: distributions };
  };

  const fetchLastNotification = async () => {
    const notificationsRef = ref(database, "error/notifications");

    // Fetch the last notification
    const notificationsQuery = query(notificationsRef, limitToLast(1));
    const snapshot = await get(notificationsQuery);

    if (snapshot.exists()) {
      // Cast the data to a Record<string, string> to ensure it's typed properly
      const data = snapshot.val() as Record<string, string>;

      const lastFetchedNotification = Object.values(data)[0]; // Get the last notification from the snapshot
      setLastNotification(lastFetchedNotification); // Set it in the state
    }
  };

  useEffect(() => {
    fetchLastNotification();
  }, []);

  const computeErrorMessage = (latestTemperature: number, latestHumidity: number, latestPressure: number) => {
    errorMessage = "";

    if (latestTemperature < temperatureLowerBound) {
      errorMessage += "Temperature is too low!\n";
    }
    if (latestTemperature > temperatureUpperBound) {
      errorMessage += "Temperature is too high!\n";
    }
    if (latestHumidity < humidityLowerBound) {
      errorMessage += "Humidity is too low!\n";
    }
    if (latestHumidity > humidityUpperBound) {
      errorMessage += "Humidity is too high!\n";
    }
    if (latestPressure < pressureLowerBound) {
      errorMessage += "Pressure is too low!\n";
    }
    if (latestPressure > pressureUpperBound) {
      errorMessage += "Pressure is too high!\n";
    }

    // If there's an error message, update the Firebase database
    if (errorMessage) {
      const errorRef = ref(database, "error/flag");
      set(errorRef, {
        errorOccurred: true,
        message: errorMessage
      })
        .then(() => {
          console.log("Error data has been updated in the database");
        })
        .catch((error) => {
          console.log("Error updating error flag in database:", error);
        });

      const notificationsRef = ref(database, "error/notifications");

      let lastTimestamp = temperaturePairs[temperaturePairs.length - 1]?.timestamp;
      let notification = `Error: ${errorMessage} at ${lastTimestamp}`;

      fetchLastNotification();

      if (lastNotification !== notification) {

        console.log("Notification:", notification);
        console.log("Last Notification:", lastNotification);

        push(notificationsRef, notification)
          .then(() => {
            console.log("Error message has been pushed to the database");
          })
          .catch((error) => {
            console.log("Error pushing error message to database:", error);
          });
      }
      else {
        console.log("Notification already exists in the database");
      }

    } else {
      const errorRef = ref(database, "error/flag");
      set(errorRef, {
        errorOccurred: false,
        message: ""
      })
        .then(() => {
          console.log("Error data has been updated in the database");
        })
        .catch((error) => {
          console.log("Error updating error flag in database:", error);
        });
    }
  };

  const handleButtonClick = () => {

    console.log("Button clicked!");

    const errorRef = ref(database, "error/flag");

    get(errorRef)
      .then((snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();

            if (!data.errorOccurred) {
              set(errorRef, {
                errorOccurred: true,
                message: errorMessage
              })
                .then(() => {
                  console.log("Error data has been updated in the database");
                })
                .catch((error) => {
                  console.log("Error updating error flag in database:", error);
                });
            } else {
              console.log("Error flag is already set to true!");
            }
          }
        }
      )
      .catch((error) => {
        console.log("Error reading data from database:", error);
      });
  };

  useEffect(() => {
    const temperatureRef = query(ref(database, "sensor_data/temperature"), limitToLast(100));
    const humidityRef = query(ref(database, "sensor_data/humidity"), limitToLast(100));
    const pressureRef = query(ref(database, "sensor_data/pressure"), limitToLast(100));

    const processData = (
      snapshot: any,
      setPairs: (data: SensorData[]) => void,
      setValues: (data: number[]) => void,
      type: "temperature" | "humidity" | "pressure"
    ) => {
      if (snapshot.exists()) {
        const rawData = snapshot.val();

        console.log(`[${type}] Raw data:`, JSON.stringify(rawData, null, 2));

        const formattedData: SensorData[] = Object.entries(rawData).map(([entryKey, value]) => {
          console.log(`[${type}] Processing entry:`, entryKey, value);

          if (
            typeof value === "object" &&
            value !== null &&
            "timestamp" in value &&
            typeof value.timestamp === "string"  // Ensure timestamp is a string
          ) {
            const typedValue = value as { temperature?: number; humidity?: number; pressure?: number; timestamp: string };

            if (typeof typedValue[type] === "number") {
              return {
                value: typedValue[type] as number,
                timestamp: typedValue.timestamp,
              };
            }
          }

          console.warn(`[${type}] Invalid entry format for key: ${entryKey}, value:`, value);
          return null; // Filter invalid entries later
        }).filter((item): item is SensorData => item !== null); // Remove null entries

        console.log(`[${type}] Formatted data:`, formattedData);

        setPairs(formattedData); // Set data with timestamps
        setValues(formattedData.map(item => item.value)); // Set numeric values
      } else {
        console.error(`[${type}] Path does not exist or contains no data.`);
      }
    };



// Attach listeners for each sensor type
    const temperatureListener = onValue(temperatureRef, (snapshot) =>
      processData(snapshot, setTemperaturePairs, setTemperatureData, "temperature")
    );

    const humidityListener = onValue(humidityRef, (snapshot) =>
      processData(snapshot, setHumidityPairs, setHumidityData, "humidity")
    );

    const pressureListener = onValue(pressureRef, (snapshot) =>
      processData(snapshot, setPressurePairs, setPressureData, "pressure")
    );

    setLoading(false);

    return () => {
      temperatureListener();
      humidityListener();
      pressureListener();
    };
  }, []);


  // Log the state values to ensure data is being set
  useEffect(() => {
    console.log("Temperature Data:", temperatureData);
    console.log("Humidity Data:", humidityData);
    console.log("Pressure Data:", pressureData);
  }, [temperatureData, humidityData, pressureData]);

  if (loading) return <p>Loading...</p>;

  const latestTemperature = parseFloat(temperatureData[temperatureData.length - 1]?.toFixed(2));
  const latestHumidity = parseFloat(humidityData[humidityData.length - 1]?.toFixed(2));
  const latestPressure = parseFloat(pressureData[pressureData.length - 1]?.toFixed(2));

  const averageTemperature = calculateAverage(temperatureData);
  const averageHumidity = calculateAverage(humidityData);
  const averagePressure = calculateAverage(pressureData);

  const growthRateTemperature = calculateGrowthRate(temperatureData, averageTemperature)?.toFixed(2);
  const growthRateHumidity = calculateGrowthRate(humidityData, averageHumidity)?.toFixed(2);
  const growthRatePressure = calculateGrowthRate(pressureData, averagePressure)?.toFixed(2);

  const temperatureIntervals = splitIntoIntervals(temperatureData);
  const humidityIntervals = splitIntoIntervals(humidityData);
  const pressureIntervals = splitIntoIntervals(pressureData);

  console.log("temperatureIntervals.counts:", temperatureIntervals.counts);
  console.log("temperatureIntervals.ranges:", temperatureIntervals.ranges);

  computeErrorMessage(latestTemperature, latestHumidity, latestPressure);

  return (
    <>
      {errorMessage && (
        <div className="mb-8">
          <AlertError
            title="Out of bounds!"
            message={errorMessage}
          />
        </div>
      )}

      <div className="mb-6 mt-4 grid gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">
        <div className="flex flex-wrap gap-5 items-center w-full">
          <div className="flex-1">
            <DataStatsOne
              currentValues={{
                temperature: latestTemperature,
                humidity: latestHumidity,
                pressure: latestPressure
              }}
              growthRates={{
                temperature: growthRateTemperature,
                humidity: growthRateHumidity,
                pressure: growthRatePressure
              }}
            />
          </div>

          <div className="flex-shrink-0 w-1/4 flex justify-center">
            <ButtonDefault
              label="Trigger Alarm"
              onClick={handleButtonClick}
              customClasses="bg-primary text-white rounded-full px-8 py-3.5 lg:px-8 xl:px-10"
            />
          </div>
        </div>
      </div>


      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-9 2xl:gap-7.5">

        <ChartOne
          title="Temperature"
          description={"Temperature average"}
          data={temperaturePairs}
          average={averageTemperature}
        />
        <ChartThree
          title="Temperature distribution"
          series={temperatureIntervals.counts}
          labels={temperatureIntervals.ranges}
        />


        <ChartOne
          title="Humidity"
          description={"Humidity average"}
          data={humidityPairs}
          average={averageHumidity}
        />
        <ChartThree
          title="Humidity distribution"
          series={humidityIntervals.counts}
          labels={humidityIntervals.ranges}
        />


        <ChartOne
          title="Pressure"
          description={"Pressure average"}
          data={pressurePairs}
          average={averagePressure}
        />
        <ChartThree
          title="Pressure distribution"
          series={pressureIntervals.counts}
          labels={pressureIntervals.ranges}
        />


        <div className="col-span-12">
          <TableOne
            temperaturePairs={temperaturePairs}
            humidityPairs={humidityPairs}
            pressurePairs={pressurePairs}
          />
        </div>
      </div>
    </>
  )
    ;
};

export default ECommerce;
