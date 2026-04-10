"use client";
import React, { useMemo, useState } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { useAppSelector } from "@/redux/hook";
import {
  HouseCutReportType,
  useGetHouseCutReportQuery,
} from "@/redux/features/admin/AdminHouseCutReportApiSlice";
import HouseCutTable from "./HouseCutTable";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function CommissionReport() {
  const [type, setType] = useState<HouseCutReportType>("daily");
  const [chartType, setChartType] = useState<"area" | "bar">("bar");
  const token = useAppSelector((state) => state.auth.token);
  const authType = useAppSelector((state) => state.auth.authType);

  const isAdmin = authType === "admin";

  const { data, isFetching, isError } = useGetHouseCutReportQuery(
    { type },
    { skip: !token || !isAdmin }
  );

  const chartSeries = useMemo(() => {
    if (isFetching) return [];
    const series = data?.data?.series ?? [];
    return series.map((s) => ({ name: s.name, data: [...s.data] }));
  }, [isFetching, data?.data?.series]);

  const chartCategories = useMemo(() => {
    if (isFetching) return [];
    return [...(data?.data?.categories ?? [])];
  }, [isFetching, data?.data?.categories]);

  const options: ApexOptions = useMemo(() => {
    return {
      legend: {
        show: false,
        position: "top",
        horizontalAlign: "left",
      },
      colors: ["#465FFF"],
      chart: {
        fontFamily: "Outfit, sans-serif",
        height: 310,
        type: "line",
        toolbar: {
          show: false,
        },
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
              gradient: {
                opacityFrom: 0.55,
                opacityTo: 0,
              },
            },
      markers: {
        size: chartType === "bar" ? 0 : 0,
        strokeColors: "#fff",
        strokeWidth: 2,
        hover: {
          size: 6,
        },
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
        enabled: true,
      },
      xaxis: {
        type: "category",
        categories: chartCategories,
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: "12px",
            colors: ["#6B7280"],
          },
        },
        title: {
          text: "",
          style: {
            fontSize: "0px",
          },
        },
      },
    };
  }, [chartCategories, chartType]);

  if (!isAdmin) return null;

  const getButtonClass = (value: HouseCutReportType) =>
    type === value
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  const getChartTypeButtonClass = (value: "area" | "bar") =>
    chartType === value
      ? "shadow-theme-xs text-gray-900 dark:text-white bg-white dark:bg-gray-800"
      : "text-gray-500 dark:text-gray-400";

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Commision Report
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">House cut reports</p>
        </div>
        <div className="flex h-10 items-center gap-0.5 rounded-lg bg-gray-100  dark:bg-gray-900">
          <button
            onClick={() => setChartType("area")}
            className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getChartTypeButtonClass(
              "area"
            )}`}
          >
            Area
          </button>
          <button
            onClick={() => setChartType("bar")}
            className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getChartTypeButtonClass(
              "bar"
            )}`}
          >
            Bar
          </button>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          <div className="flex items-center gap-0.5 rounded-lg bg-gray-100 p-0.5 dark:bg-gray-900">
            <button
              onClick={() => setType("daily")}
              className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
                "daily"
              )}`}
            >
              Daily
            </button>
            <button
              onClick={() => setType("monthly")}
              className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
                "monthly"
              )}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setType("quarterly")}
              className={`px-3 py-2 font-medium w-full rounded-md text-theme-sm hover:text-gray-900 dark:hover:text-white ${getButtonClass(
                "quarterly"
              )}`}
            >
              Quarterly
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div className="min-w-[1000px] xl:min-w-full">
          {isFetching && (
            <div className="text-theme-sm text-gray-500 dark:text-gray-400">Loading...</div>
          )}
          {isError && !isFetching && (
            <div className="text-theme-sm text-gray-500 dark:text-gray-400">
              Failed to load report
            </div>
          )}
          {!isError && !isFetching && (
            <ReactApexChart options={options} series={chartSeries} type={chartType} height={310} />
          )}
        </div>
      </div>
      <HouseCutTable />
    </div>
  );
}
