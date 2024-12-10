import { useEffect, useState } from "react";
import { get, ref } from "firebase/database";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ChartProps {
  database: any; // Replace 'any' with the appropriate type if known
  dataPath: string;
  title: string;
}

interface ChartData {
  labels: string[]; // Correctly typed as an array of strings
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor: string;
    tension: number;
  }[];
}

export default function Chart({ database, dataPath, title }: ChartProps) {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      const dbRef = ref(database, dataPath); // Reference to provided data path
      try {
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const data = snapshot.val();

          // Transform data for Chart.js
          const labels: string[] = Object.keys(data); // Explicitly type labels as string[]
          const values: number[] = Object.values(data); // Ensure values are numbers

          setChartData({
            labels,
            datasets: [
              {
                label: title + " Readings",
                data: values,
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.4,
              },
            ],
          });
        } else {
          console.log("No data available");
        }
      } catch (error) {
        console.error("Error fetching ", title, " data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();

    // Set up a periodic fetch (e.g., every 5 seconds)
    const interval = setInterval(fetchChartData, 5000);

    return () => clearInterval(interval); // Cleanup on component unmount
  }, [database, dataPath]);

  if (loading) return <p>Loading chart...</p>;
  if (!chartData) return <p>No chart data available</p>;

  const getTitleText = (title: string) => {
    if (title === "Temperature") {
      return "Temperature (°C)";
    } else if (title === "Humidity") {
      return "Humidity (%)";
    } else if (title === "Pressure") {
      return "Pressure (hPa)";
    } else {
      return "Data";
    }
  };

  return (
    <div 
    style={{ 
        maxWidth: "1200px", 
        margin: "0 auto", 
        padding: "20px",
        // position: "absolute",
        // top: "3%",
        }}> {/* Set a max width */}
      <Line
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Timestamps",
              },
            },
            y: {
              title: {
                display: true,
                text: getTitleText(title),
              },
            },
          },
        }}
        height={400} // Height of the chart
        width={1200} // Width of the chart
      />
    </div>
  );
}
