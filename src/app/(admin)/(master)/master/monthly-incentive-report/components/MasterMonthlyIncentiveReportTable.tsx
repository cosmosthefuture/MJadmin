"use client";

import React, { useEffect } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Loading from "@/components/common/Loading";
import Pagination from "@/components/tables/Pagination";
import { useGetMasterMonthlyIncentiveReportQuery } from "@/redux/features/masters/MasterMonthlyIncentiveReportApiSlice";
import { useAppSelector } from "@/redux/hook";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

export default function MasterMonthlyIncentiveReportTable() {
  const authType = useAppSelector((state) => state.auth.authType);
  const router = useRouter();
  const searchParams = useSearchParams();

  const formatAmount = (value: unknown) => {
    const n = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(n)) return "0";
    return new Intl.NumberFormat("en-US").format(n);
  };

  useEffect(() => {
    if (authType && authType !== "master") {
      router.replace("/login");
    }
  }, [authType, router]);

  const pageFromQuery = Number(searchParams.get("page") || "1");
  const perPageFromQuery = Number(searchParams.get("per_page") || String(DEFAULT_PER_PAGE));

  const page = Number.isFinite(pageFromQuery) && pageFromQuery > 0 ? pageFromQuery : 1;
  const per_page =
    Number.isFinite(perPageFromQuery) && perPageFromQuery > 0 ? perPageFromQuery : DEFAULT_PER_PAGE;

  const { data, isLoading } = useGetMasterMonthlyIncentiveReportQuery(
    { page, per_page },
    { skip: authType !== "master" }
  );

  if (authType !== "master") {
    return null;
  }

  const items = data?.data || [];
  const totalPages = data?.meta?.total_pages || 1;

  const onPageChange = (nextPage: number) => {
    router.push(`/masters/monthly-incentive-report?page=${nextPage}&per_page=${per_page}`);
  };

  return (
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
              <p className="text-gray-500">No monthly incentive report found</p>
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
                      ID
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                    >
                      Month
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                    >
                      Agent
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-end text-gray-500 font-medium text-theme-xs"
                    >
                      Total Deposit
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-end text-gray-500 font-medium text-theme-xs"
                    >
                      Total Agent Incentive
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-end text-gray-500 font-medium text-theme-xs"
                    >
                      Total Your Incentive
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {items.map((item, itemIndex) => {
                    const rowSpan = (item.agents?.length || 0) + 1; // agents + total row

                    return (
                      <React.Fragment key={`month-${item.month}-${itemIndex}`}>
                        {item.agents.map((agent, agentIndex) => (
                          <TableRow key={`${item.month}-${agent.agent_id}-${agentIndex}`}>
                            {agentIndex === 0 && (
                              <TableCell
                                rowSpan={rowSpan}
                                className="px-4 py-3 text-start text-gray-500 text-theme-sm align-top"
                              >
                                {itemIndex + 1}
                              </TableCell>
                            )}
                            {agentIndex === 0 && (
                              <TableCell
                                rowSpan={rowSpan}
                                className="px-4 py-3 text-start font-semibold text-gray-700 text-theme-sm align-top"
                              >
                                {item.month}
                              </TableCell>
                            )}
                            <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                              {agent.agent_name}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-end tabular-nums text-gray-500 text-theme-sm">
                              {formatAmount(agent.total_deposit_amount)}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-end tabular-nums text-gray-500 text-theme-sm">
                              {formatAmount(agent.total_agent_incentive_amount)}
                            </TableCell>
                            <TableCell className="px-4 py-3 text-end tabular-nums text-gray-500 text-theme-sm">
                              {formatAmount(agent.total_master_incentive_amount)}
                            </TableCell>
                          </TableRow>
                        ))}

                        <TableRow key={`${item.month}-total`} className="bg-gray-50">
                          <TableCell className="px-4 py-3 text-end font-semibold text-gray-700 text-theme-sm">
                            TOTAL
                          </TableCell>
                          <TableCell className="px-4 py-3 text-end tabular-nums font-semibold text-gray-700 text-theme-sm">
                            {formatAmount(item.month_total.total_deposit_amount)}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-end tabular-nums font-semibold text-gray-700 text-theme-sm">
                            {formatAmount(item.month_total.total_agent_incentive_amount)}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-end tabular-nums font-semibold text-gray-700 text-theme-sm">
                            {formatAmount(item.month_total.total_master_incentive_amount)}
                          </TableCell>
                        </TableRow>
                      </React.Fragment>
                    );
                  })}
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
