"use client";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect, useMemo } from "react";
// import { useGetHouseCutDailyListsQuery } from "@/redux/features/admin/AdminHouseCutReportApiSlice";
import Pagination from "@/components/tables/Pagination";
import moment from "moment";
import DatePicker from "@/components/form/date-picker";

type HouseCutSampleRow = {
  id: number;
  report_date: string; // YYYY-MM-DD
  spin_wheel_house_cut: string;
  coin_flip_house_cut: string;
  total_house_cut: string;
};

const SAMPLE_ROWS: HouseCutSampleRow[] = [
  {
    id: 1,
    report_date: "2026-04-01",
    spin_wheel_house_cut: "120000",
    coin_flip_house_cut: "90000",
    total_house_cut: "210000",
  },
  {
    id: 2,
    report_date: "2026-04-02",
    spin_wheel_house_cut: "140000",
    coin_flip_house_cut: "110000",
    total_house_cut: "250000",
  },
  {
    id: 3,
    report_date: "2026-04-03",
    spin_wheel_house_cut: "90000",
    coin_flip_house_cut: "60000",
    total_house_cut: "150000",
  },
  {
    id: 4,
    report_date: "2026-04-04",
    spin_wheel_house_cut: "170000",
    coin_flip_house_cut: "95000",
    total_house_cut: "265000",
  },
  {
    id: 5,
    report_date: "2026-04-05",
    spin_wheel_house_cut: "160000",
    coin_flip_house_cut: "100000",
    total_house_cut: "260000",
  },
  {
    id: 6,
    report_date: "2026-04-06",
    spin_wheel_house_cut: "155000",
    coin_flip_house_cut: "98000",
    total_house_cut: "253000",
  },
  {
    id: 7,
    report_date: "2026-04-07",
    spin_wheel_house_cut: "130000",
    coin_flip_house_cut: "87000",
    total_house_cut: "217000",
  },
  {
    id: 8,
    report_date: "2026-04-08",
    spin_wheel_house_cut: "145000",
    coin_flip_house_cut: "92000",
    total_house_cut: "237000",
  },
  {
    id: 9,
    report_date: "2026-04-09",
    spin_wheel_house_cut: "175000",
    coin_flip_house_cut: "105000",
    total_house_cut: "280000",
  },
  {
    id: 10,
    report_date: "2026-04-10",
    spin_wheel_house_cut: "125000",
    coin_flip_house_cut: "85000",
    total_house_cut: "210000",
  },
  {
    id: 11,
    report_date: "2026-04-11",
    spin_wheel_house_cut: "150000",
    coin_flip_house_cut: "88000",
    total_house_cut: "238000",
  },
  {
    id: 12,
    report_date: "2026-04-12",
    spin_wheel_house_cut: "132000",
    coin_flip_house_cut: "91000",
    total_house_cut: "223000",
  },
];

const PER_PAGE = 10;

export default function HouseCutTable() {
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // TODO: Re-enable API call when backend is ready again.
  // const { data, isLoading } = useGetHouseCutDailyListsQuery({
  //   page,
  //   perPage: 10,
  //   startDate: startDate || undefined,
  //   endDate: endDate || undefined,
  // });

  useEffect(() => {
    setPage(1);
  }, [startDate, endDate]);

  const filteredRows = useMemo(() => {
    const start = startDate ? moment(startDate, "YYYY-MM-DD") : null;
    const end = endDate ? moment(endDate, "YYYY-MM-DD") : null;
    return SAMPLE_ROWS.filter((row) => {
      const d = moment(row.report_date, "YYYY-MM-DD");
      if (start && d.isBefore(start, "day")) return false;
      if (end && d.isAfter(end, "day")) return false;
      return true;
    });
  }, [startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PER_PAGE));
  const items = filteredRows.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="mt-8">
      <div className="flex items-center gap-4 mb-4 ml-10">
        <DatePicker
          id="start-date"
          label="Start Date"
          onChange={(dates, dateStr) => setStartDate(dateStr || "")}
        />
        <DatePicker
          id="end-date"
          label="End Date"
          onChange={(dates, dateStr) => setEndDate(dateStr || "")}
        />
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            {items.length === 0 && (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No data found</p>
              </div>
            )}
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    No
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Report Date
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Spin Wheel House Cut
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Coin Flip House Cut
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Total House Cut
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {items.map((item, index) => {
                  const formatDate = (dateString: string) => {
                    return moment(dateString).format("MMM D, YYYY");
                  };

                  const no = (page - 1) * 10 + index + 1;

                  return (
                    <TableRow key={item.id}>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {no}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {formatDate(item.report_date)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {item.spin_wheel_house_cut}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {item.coin_flip_house_cut}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {item.total_house_cut}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            <div className="flex justify-center m-5">
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage) => setPage(newPage)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
