"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useGetUserGameHistoryListsQuery } from "@/redux/features/admin/UserApiSlice";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Loading from "@/components/common/Loading";
import moment from "moment";
import Badge from "@/components/ui/badge/Badge";
import Pagination from "@/components/tables/Pagination";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

const statusColorMap: Record<string, "success" | "error" | "warning" | "dark"> = {
  won: "success",
  lost: "error",
};

export default function UserBetHistoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const userId = parseInt(params.user_id as string);
  const userName = searchParams.get("user_name") || "Unknown User";
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading } = useGetUserGameHistoryListsQuery({
    userId,
    page: currentPage,
    perPage: DEFAULT_PER_PAGE,
  });

  const totals = data?.data;
  const histories = totals?.histories || [];
  const totalPages = data?.meta?.total_pages ?? 1;

  return (
    <div className="rounded-2xl bg-white px-5 pb-5 pt-5 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
        Bet History for {userName}
      </h3>
      <div className="mb-4">
        <p>Total Bet Amount: {totals?.total_bet_amount}</p>
        <p>Total Winning Amount: {totals?.total_winning_amount}</p>
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Game Type
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Bet Amount
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Winning Amount
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Room
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Created At
                  </TableCell>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {histories.map((item) => {
                  const statusColor = statusColorMap[item.status] ?? "dark";
                  return (
                    <TableRow key={item.id}>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {item.game_type}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        <Badge color={statusColor} variant="light">
                          <span className="capitalize">{item.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {item.bet_amount}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {item.winning_amount}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {item.room}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {moment(item.created_at).format("MMM D, YYYY hh:mm A")}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      <div className="flex justify-center m-5">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}
