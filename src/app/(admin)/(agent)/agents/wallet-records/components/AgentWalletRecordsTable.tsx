"use client";

import React from "react";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import Loading from "@/components/common/Loading";
import Pagination from "@/components/tables/Pagination";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { DEFAULT_PER_PAGE } from "@/lib/constants";
import { useAppSelector } from "@/redux/hook";
import { useGetAgentWalletRecordsQuery } from "@/redux/features/agents/AgentWalletRecordApiSlice";

export default function AgentWalletRecordsTable() {
  const authType = useAppSelector((state) => state.auth.authType);
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    if (authType && authType !== "agent") {
      router.replace("/login");
    }
  }, [authType, router]);

  const formatAmount = (value: number) => new Intl.NumberFormat("en-US").format(value);

  const pageFromQuery = Number(searchParams.get("page") || "1");
  const perPageFromQuery = Number(searchParams.get("per_page") || String(DEFAULT_PER_PAGE));

  const page = Number.isFinite(pageFromQuery) && pageFromQuery > 0 ? pageFromQuery : 1;
  const per_page =
    Number.isFinite(perPageFromQuery) && perPageFromQuery > 0 ? perPageFromQuery : DEFAULT_PER_PAGE;

  const { data, isLoading } = useGetAgentWalletRecordsQuery(
    { page, per_page },
    { skip: authType !== "agent" }
  );

  if (authType !== "agent") {
    return null;
  }

  const items = data?.data || [];
  const totalPages = data?.meta?.total_pages || 1;

  const onPageChange = (nextPage: number) => {
    router.push(`/agents/wallet-records?page=${nextPage}&per_page=${per_page}`);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          {isLoading && (
            <div className="flex h-64 items-center justify-center">
              <Loading />
            </div>
          )}

          {!isLoading && items.length === 0 && (
            <div className="flex h-64 items-center justify-center">
              <p className="text-gray-500">No wallet records found</p>
            </div>
          )}

          {!isLoading && items.length > 0 && (
            <>
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
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
                      Type
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-end text-gray-500 font-medium text-theme-xs"
                    >
                      Amount
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-end text-gray-500 font-medium text-theme-xs"
                    >
                      Balance
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                    >
                      Description
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {moment(item.date_time).format("DD/MM/YYYY HH:mm:ss")}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-theme-sm">
                        <span
                          className={
                            item.type === "in"
                              ? "font-medium text-green-600"
                              : "font-medium text-red-600"
                          }
                        >
                          {item.type.toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-end tabular-nums text-gray-500 text-theme-sm">
                        {formatAmount(item.amount)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-end tabular-nums text-gray-500 text-theme-sm">
                        {formatAmount(item.balance)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {item.description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="m-5 flex justify-center">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={onPageChange} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
