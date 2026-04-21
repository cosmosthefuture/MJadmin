"use client";

import React, { useMemo, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import ProfitSampleTable from "./ProfitSampleTable";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

type ProfitSampleReportProps = {
  title?: string;
  subtitle?: string;
};

type ProfitRange = "daily" | "monthly" | "quarterly";
type ChartType = "area" | "bar";

const sampleDataByRange: Record<ProfitRange, { categories: string[]; series: number[] }> = {
  daily: {
    categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    series: [120000, 90000, 150000, 110000, 170000, 140000, 160000],
  },
  monthly: {
    categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    series: [2100000, 1800000, 2500000, 2300000, 2700000, 2600000],
  },
  quarterly: {
    categories: ["Q1", "Q2", "Q3", "Q4"],
    series: [6500000, 7200000, 8100000, 7800000],
  },
};

export default function ProfitSampleReport({
  title = "Profit Report",
  subtitle = "Profit reports",
}: ProfitSampleReportProps) {
  const [range, setRange] = useState<ProfitRange>("daily");
  const [chartType, setChartType] = useState<ChartType>("bar");

  const { categories, series } = sampleDataByRange[range];

  const chartSeries = useMemo(() => [{ name: "Profit", data: [...series] }], [series]);

  const options: ApexOptions = useMemo(() => {
    return {
      legend: {
        show: false,
      },
      colors: ["#465FFF"],
      chart: {
        fontFamily: "Outfit, sans-serif",
        height: 310,
        type: "line",
        toolbar: { show: false },
      },
      stroke: {
        curve: "straight",
        width: chartType === "bar" ? 0 : [2],
      },
      fill:
        chartType === "bar"
          ? { type: "solid" }
          : {
              type: "gradient",
              gradient: { opacityFrom: 0.55, opacityTo: 0 },
            },
      markers: {
        size: 0,
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: { size: 6 },
      },
      plotOptions:
        chartType === "bar"
          ? {
              bar: {
                borderRadius: 4,
                columnWidth: "60%",
              },
            }
          : {},
      grid: {
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
      },
      dataLabels: { enabled: false },
      tooltip: { enabled: true },
      xaxis: {
        type: "category",
        categories,
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false },
      },
      yaxis: {
        labels: {
          style: { fontSize: "12px", colors: ["#6B7280"] },
        },
        title: { text: "", style: { fontSize: "0px" } },
      },
    };
  }, [categories, chartType]);

  const getButtonClass = (value: ProfitRange) =>
    range === value
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  const getChartTypeButtonClass = (value: ChartType) =>
    chartType === value
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">{title}</h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">{subtitle}</p>
        </div>

        <div className="flex h-10 items-center gap-0.5 rounded-lg bg-gray-100  dark:bg-gray-900">
          <button
            onClick={() => setChartType("area")}
            className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getChartTypeButtonClass(
              "area"
            )}`}
            type="button"
          >
            Area
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getChartTypeButtonClass(
              "bar"
            )}`}
            type="button"
          >
            Bar
          </button>
        </div>

        <div className="flex items-start w-full gap-3 sm:justify-end">
          <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
            <button
              onClick={() => setRange("daily")}
              className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
                "daily"
              )}`}
              type="button"
            >
              Daily
            </button>
            <button
              onClick={() => setRange("monthly")}
              className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
                "monthly"
              )}`}
              type="button"
            >
              Monthly
            </button>
            <button
              onClick={() => setRange("quarterly")}
              className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
                "quarterly"
              )}`}
              type="button"
            >
              Quarterly
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          <ReactApexChart options={options} series={chartSeries} type={chartType} height={310} />
        </div>
      </div>
      <ProfitSampleTable />
    </div>
  );
}
