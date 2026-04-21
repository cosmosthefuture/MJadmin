"use client";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useMemo, useState } from "react";
import Pagination from "@/components/tables/Pagination";
import moment from "moment";
import DatePicker from "@/components/form/date-picker";

type ProfitSampleRow = {
  id: number;
  report_date: string; // YYYY-MM-DD
  spin_wheel_profit: string;
  coin_flip_profit: string;
  money_transfer_profit: string;
  total_profit: string;
};

const SAMPLE_ROWS: ProfitSampleRow[] = [
  {
    id: 1,
    report_date: "2026-04-01",
    spin_wheel_profit: "120000",
    coin_flip_profit: "90000",
    money_transfer_profit: "15000",
    total_profit: "225000",
  },
  {
    id: 2,
    report_date: "2026-04-02",
    spin_wheel_profit: "140000",
    coin_flip_profit: "110000",
    money_transfer_profit: "22000",
    total_profit: "272000",
  },
  {
    id: 3,
    report_date: "2026-04-03",
    spin_wheel_profit: "90000",
    coin_flip_profit: "60000",
    money_transfer_profit: "12000",
    total_profit: "162000",
  },
  {
    id: 4,
    report_date: "2026-04-04",
    spin_wheel_profit: "170000",
    coin_flip_profit: "95000",
    money_transfer_profit: "18000",
    total_profit: "283000",
  },
  {
    id: 5,
    report_date: "2026-04-05",
    spin_wheel_profit: "160000",
    coin_flip_profit: "100000",
    money_transfer_profit: "20000",
    total_profit: "280000",
  },
  {
    id: 6,
    report_date: "2026-04-06",
    spin_wheel_profit: "155000",
    coin_flip_profit: "98000",
    money_transfer_profit: "16000",
    total_profit: "269000",
  },
  {
    id: 7,
    report_date: "2026-04-07",
    spin_wheel_profit: "130000",
    coin_flip_profit: "87000",
    money_transfer_profit: "19000",
    total_profit: "236000",
  },
  {
    id: 8,
    report_date: "2026-04-08",
    spin_wheel_profit: "145000",
    coin_flip_profit: "92000",
    money_transfer_profit: "17000",
    total_profit: "254000",
  },
  {
    id: 9,
    report_date: "2026-04-09",
    spin_wheel_profit: "175000",
    coin_flip_profit: "105000",
    money_transfer_profit: "25000",
    total_profit: "305000",
  },
  {
    id: 10,
    report_date: "2026-04-10",
    spin_wheel_profit: "125000",
    coin_flip_profit: "85000",
    money_transfer_profit: "14000",
    total_profit: "224000",
  },
  {
    id: 11,
    report_date: "2026-04-11",
    spin_wheel_profit: "150000",
    coin_flip_profit: "88000",
    money_transfer_profit: "21000",
    total_profit: "259000",
  },
  {
    id: 12,
    report_date: "2026-04-12",
    spin_wheel_profit: "132000",
    coin_flip_profit: "91000",
    money_transfer_profit: "16000",
    total_profit: "239000",
  },
];

const PER_PAGE = 10;

export default function ProfitSampleTable() {
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

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

  const formatDate = (dateString: string) => moment(dateString).format("MMM D, YYYY");

  return (
    <div className="mt-8">
      <div className="flex items-center gap-4 mb-4 ml-10">
        <DatePicker
          id="profit-start-date-sample"
          label="Start Date"
          onChange={(_dates, dateStr) => setStartDate(dateStr || "")}
        />
        <DatePicker
          id="profit-end-date-sample"
          label="End Date"
          onChange={(_dates, dateStr) => setEndDate(dateStr || "")}
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
                    Money Transfer Profit
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Total Profit
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {items.map((item, index) => {
                  const no = (page - 1) * PER_PAGE + index + 1;
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {no}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {formatDate(item.report_date)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {item.money_transfer_profit}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {item.total_profit}
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
