"use client";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect, useMemo } from "react";
// import { useGetProfitDailyListsQuery } from "@/redux/features/admin/AdminHouseCutReportApiSlice";
import Pagination from "@/components/tables/Pagination";
import moment from "moment";
import DatePicker from "@/components/form/date-picker";

type ProfitSampleRow = {
  id: number;
  report_date: string; // YYYY-MM-DD
  money_transfer_profit: string;
  total_profit: string;
};

const SAMPLE_ROWS: ProfitSampleRow[] = [
  { id: 1, report_date: "2026-04-01", money_transfer_profit: "15000", total_profit: "225000" },
  { id: 2, report_date: "2026-04-02", money_transfer_profit: "22000", total_profit: "272000" },
  { id: 3, report_date: "2026-04-03", money_transfer_profit: "12000", total_profit: "162000" },
  { id: 4, report_date: "2026-04-04", money_transfer_profit: "18000", total_profit: "283000" },
  { id: 5, report_date: "2026-04-05", money_transfer_profit: "20000", total_profit: "280000" },
  { id: 6, report_date: "2026-04-06", money_transfer_profit: "16000", total_profit: "269000" },
  { id: 7, report_date: "2026-04-07", money_transfer_profit: "19000", total_profit: "236000" },
  { id: 8, report_date: "2026-04-08", money_transfer_profit: "17000", total_profit: "254000" },
  { id: 9, report_date: "2026-04-09", money_transfer_profit: "25000", total_profit: "305000" },
  { id: 10, report_date: "2026-04-10", money_transfer_profit: "14000", total_profit: "224000" },
  { id: 11, report_date: "2026-04-11", money_transfer_profit: "21000", total_profit: "259000" },
  { id: 12, report_date: "2026-04-12", money_transfer_profit: "16000", total_profit: "239000" },
];

const PER_PAGE = 10;

export default function ProfitTable() {
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // TODO: Re-enable API call when backend is ready again.
  // const { data, isLoading } = useGetProfitDailyListsQuery({
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
          id="profit-start-date"
          label="Start Date"
          onChange={(dates, dateStr) => setStartDate(dateStr || "")}
        />
        <DatePicker
          id="profit-end-date"
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
