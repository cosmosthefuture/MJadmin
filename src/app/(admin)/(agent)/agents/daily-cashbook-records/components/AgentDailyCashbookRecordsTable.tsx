"use client";

import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import Input from "@/components/form/input/InputField";
import Loading from "@/components/common/Loading";
import Pagination from "@/components/tables/Pagination";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useAppSelector } from "@/redux/hook";
import { useGetAgentDailyCashbookRecordsQuery } from "@/redux/features/agents/AgentDailyCashbookRecordApiSlice";

const DEFAULT_AGENT_PER_PAGE = 10;

export default function AgentDailyCashbookRecordsTable() {
  const authType = useAppSelector((state) => state.auth.authType);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (authType && authType !== "agent") {
      router.replace("/login");
    }
  }, [authType, router]);

  const pageFromQuery = Number(searchParams.get("page") || "1");
  const perPageFromQuery = Number(searchParams.get("per_page") || String(DEFAULT_AGENT_PER_PAGE));

  const page = Number.isFinite(pageFromQuery) && pageFromQuery > 0 ? pageFromQuery : 1;
  const per_page =
    Number.isFinite(perPageFromQuery) && perPageFromQuery > 0
      ? perPageFromQuery
      : DEFAULT_AGENT_PER_PAGE;

  const [fromDate, setFromDate] = useState(() => moment().subtract(1, "day").format("YYYY-MM-DD"));
  const [toDate, setToDate] = useState(() => moment().format("YYYY-MM-DD"));

  const { data, isLoading } = useGetAgentDailyCashbookRecordsQuery(
    { page, per_page, from: fromDate, to: toDate },
    { skip: authType !== "agent" || !fromDate || !toDate || fromDate > toDate }
  );

  const items = data?.data || [];
  const totalPages = data?.meta?.total_pages || 1;

  const buildQueryString = (nextPage: number) => {
    const params = new URLSearchParams();
    params.set("page", String(nextPage));
    params.set("per_page", String(per_page));
    return params.toString();
  };

  const formatAmount = (value: number | null) => {
    if (value === null || value === undefined) {
      return "-";
    }

    return new Intl.NumberFormat("en-US").format(value);
  };

  const formatWithdrawAmount = (value: number | null) => {
    if (value === null || value === undefined) {
      return "-";
    }

    return new Intl.NumberFormat("en-US").format(-Math.abs(value));
  };

  const isFilterDisabled = useMemo(() => {
    return !fromDate || !toDate || fromDate > toDate;
  }, [fromDate, toDate]);

  const onPageChange = (nextPage: number) => {
    router.push(`/agents/daily-cashbook-records?${buildQueryString(nextPage)}`);
  };

  if (authType !== "agent") {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="border-b border-gray-100 px-4 py-4 dark:border-white/[0.05]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Daily Cashbook Records
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                From
              </label>
              <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-200">
                To
              </label>
              <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
          </div>
        </div>

        {fromDate > toDate && (
          <p className="mt-3 text-sm text-error-600 dark:text-error-400">
            The from date must be earlier than or equal to the to date.
          </p>
        )}
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          {(isLoading || !fromDate || !toDate) && (
            <div className="flex h-64 items-center justify-center">
              <Loading />
            </div>
          )}

          {!isLoading && !isFilterDisabled && items.length === 0 && (
            <div className="flex h-64 items-center justify-center">
              <p className="text-gray-500">No daily cashbook records found</p>
            </div>
          )}

          {!isLoading && !isFilterDisabled && items.length > 0 && (
            <>
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs"
                    >
                      Date
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-start font-medium text-gray-500 text-theme-xs"
                    >
                      Member ID
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-end font-medium text-gray-500 text-theme-xs"
                    >
                      Deposit
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-end font-medium text-gray-500 text-theme-xs"
                    >
                      %
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-end font-medium text-gray-500 text-theme-xs"
                    >
                      Amount
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-end font-medium text-gray-500 text-theme-xs"
                    >
                      Withdraw
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-end font-medium text-gray-500 text-theme-xs"
                    >
                      Balance
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {item.date ? moment(item.date).format("M/D/YY") : "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {item.member_id}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-end tabular-nums text-gray-500 text-theme-sm">
                        {formatAmount(item.deposit)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-end tabular-nums text-gray-500 text-theme-sm">
                        {item.incentive_percentage !== null &&
                        item.incentive_percentage !== undefined
                          ? `${item.incentive_percentage}%`
                          : "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-end tabular-nums text-gray-500 text-theme-sm">
                        {formatAmount(item.amount)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-end tabular-nums text-gray-500 text-theme-sm">
                        {formatWithdrawAmount(item.withdraw)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-end tabular-nums text-gray-500 text-theme-sm">
                        {formatAmount(item.balance)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="m-5 flex justify-center">
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
