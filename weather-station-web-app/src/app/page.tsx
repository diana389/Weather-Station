"use client";

import {useEffect, useState} from "react";
import ReactJson from "react-json-view"; // Import the ReactJson component
import database from "./firebaseConfig";
import Chart from "./ChartComponent";
import {get, ref} from "firebase/database";

export default function Home() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const dbRef = ref(database, "test"); // Adjust path as needed
            try {
                const snapshot = await get(dbRef);
                if (snapshot.exists()) {
                    setData(snapshot.val());
                } else {
                    console.log("No data available");
                }
            } catch (error) {
                console.error("Error reading data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (!data) return <p>No data found</p>;

    return (
        <div
            className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
            <div
                className="grid row-start-3 gap-8 p-8 bg-[#f4f4f4] rounded-lg shadow-lg"
                style={{
                    width: "min(90vw, 800px)",
                    position: "absolute",
                    top: "200%",
                }}
            >
                <h1>Data from Firebase</h1>
                <ReactJson src={data} theme="monokai"/>
            </div>

            <div
                style={
                    {
                        width: "min(90vw, 800px)",
                        position: "absolute",
                        top: "10%",
                    }
                }
            >

                <Chart database={database} dataPath="test/temperature" title="Temperature"/>

                <Chart database={database} dataPath="test/humidity" title="Humidity"/>

                <Chart database={database} dataPath="test/pressure" title="Pressure"/>

            </div>
        </div>
    );
}
