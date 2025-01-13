import Dashboard from "@/components/Dashboard/Dashboard";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React from "react";

export const metadata: Metadata = {
  title: "Weather Station Web App",
  description: "This is a weather station web app",
};

export default function Home() {
  return (
    <>
      <DefaultLayout>
        <Dashboard />
      </DefaultLayout>
    </>
  );
}
