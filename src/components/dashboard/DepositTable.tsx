"use client";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { useGetDepositDailyListsQuery } from "@/redux/features/admin/AdminHouseCutReportApiSlice";
import Pagination from "@/components/tables/Pagination";
import Loading from "@/components/common/Loading";
import moment from "moment";
import DatePicker from "@/components/form/date-picker";

export default function DepositTable() {
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const { data, isLoading } = useGetDepositDailyListsQuery({
    page,
    perPage: 10,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });

  useEffect(() => {
    setPage(1);
  }, [startDate, endDate]);

  const totalPages = data?.meta?.total_pages ?? 1;
  const items = data?.data ?? [];

  return (
    <div className="mt-8">
      <div className="flex items-center gap-4 mb-4 ml-10">
        <DatePicker
          id="deposit-start-date"
          label="Start Date"
          onChange={(dates, dateStr) => setStartDate(dateStr || "")}
        />
        <DatePicker
          id="deposit-end-date"
          label="End Date"
          onChange={(dates, dateStr) => setEndDate(dateStr || "")}
        />
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <Loading />
              </div>
            )}

            {!isLoading && items.length === 0 && (
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
                    Request Deposit
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Manual Deposit
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Total Deposit
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
                        {item.request_deposit}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {item.manual_deposit}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {item.total_deposit}
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
