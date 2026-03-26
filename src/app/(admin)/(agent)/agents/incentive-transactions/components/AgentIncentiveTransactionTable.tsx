"use client";

import { useEffect } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Loading from "@/components/common/Loading";
import Pagination from "@/components/tables/Pagination";
import { useGetAgentIncentiveTransactionsQuery } from "@/redux/features/agents/AgentIncentiveTransactionApiSlice";
import { useAppSelector } from "@/redux/hook";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";

const DEFAULT_PER_PAGE = 10;

export default function AgentIncentiveTransactionTable() {
  const authType = useAppSelector((state) => state.auth.authType);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (authType && authType !== "agent") {
      router.replace("/login");
    }
  }, [authType, router]);

  const pageFromQuery = Number(searchParams.get("page") || "1");
  const perPageFromQuery = Number(searchParams.get("per_page") || String(DEFAULT_PER_PAGE));

  const page = Number.isFinite(pageFromQuery) && pageFromQuery > 0 ? pageFromQuery : 1;
  const per_page =
    Number.isFinite(perPageFromQuery) && perPageFromQuery > 0 ? perPageFromQuery : DEFAULT_PER_PAGE;

  const { data, isLoading } = useGetAgentIncentiveTransactionsQuery(
    { page, per_page },
    { skip: authType !== "agent" }
  );

  if (authType !== "agent") {
    return null;
  }

  const transactions = data?.data || [];
  const totalPages = data?.meta?.total_pages || 1;

  const onPageChange = (nextPage: number) => {
    router.push(`/agents/incentive-transactions?page=${nextPage}&per_page=${per_page}`);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <Loading />
            </div>
          )}

          {!isLoading && transactions.length === 0 && (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No transactions found</p>
            </div>
          )}

          {!isLoading && transactions.length > 0 && (
            <>
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                    >
                      No.
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                    >
                      Date Time
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                    >
                      User
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                    >
                      Deposit Amount
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                    >
                      Incentive %
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                    >
                      Incentive Amount
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {transactions.map((row, index) => (
                    <TableRow key={`${row.date_time}-${row.user?.id}-${index}`}>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {(page - 1) * per_page + index + 1}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {moment(row.date_time).format("YYYY-MM-DD HH:mm:ss")}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {row.user?.name}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {row.deposit_amount}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {row.incentive_percentage}%
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {row.incentive_amount}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex justify-center m-5">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={onPageChange}
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
