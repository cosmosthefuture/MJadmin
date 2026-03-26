"use client";

import { useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setCurrentPage } from "@/redux/features/PaginationSlice";
import {
  useGetCoinFlipBetHistoriesQuery,
  useGetSpinWheelBetHistoriesQuery,
} from "@/redux/features/betHistory/BetHistoryApiSlice";
import { DEFAULT_PER_PAGE } from "@/lib/constants";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/tables/Pagination";
import Loading from "@/components/common/Loading";
import Badge from "@/components/ui/badge/Badge";
import moment from "moment";
import Select from "@/components/form/Select";
import Input from "@/components/form/input/InputField";
import { useDebounce } from "@/hooks/useDebounce";
import Link from "next/link";

const statusColorMap: Record<string, "success" | "error" | "warning" | "dark"> = {
  won: "success",
  lost: "error",
};

export default function SpinWheelBetHistoryTable() {
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector((state) => state.pagination.currentPage);

  const [gameFilter, setGameFilter] = useState<"spin-wheel" | "coin-flip">("spin-wheel");
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText);

  const gameOptions = useMemo(
    () => [
      { value: "spin-wheel", label: "Spin Wheel" },
      { value: "coin-flip", label: "Coin Flip" },
    ],
    []
  );

  const { data: spinWheelData, isLoading: isSpinWheelLoading } = useGetSpinWheelBetHistoriesQuery(
    {
      page: currentPage,
      perPage: DEFAULT_PER_PAGE,
      search: debouncedSearchText || undefined,
    },
    { skip: gameFilter !== "spin-wheel" }
  );

  const { data: coinFlipData, isLoading: isCoinFlipLoading } = useGetCoinFlipBetHistoriesQuery(
    {
      page: currentPage,
      perPage: DEFAULT_PER_PAGE,
      search: debouncedSearchText || undefined,
    },
    { skip: gameFilter !== "coin-flip" }
  );

  const data = gameFilter === "spin-wheel" ? spinWheelData : coinFlipData;
  const isLoading = gameFilter === "spin-wheel" ? isSpinWheelLoading : isCoinFlipLoading;

  const histories = data?.data ?? [];
  const totalPages = data?.meta?.total_pages ?? 1;
  const perPage = data?.meta?.per_page ?? DEFAULT_PER_PAGE;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/[0.05]">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          {gameFilter === "spin-wheel" ? "Spin Wheel Bet Histories" : "Coin Flip Bet Histories"}
        </h3>
        <div className="flex items-center gap-3 w-full max-w-xl justify-end">
          <div className="relative w-full max-w-[180px]">
            <Select
              value={gameFilter}
              onChange={(e) => {
                const value = e.target.value as "spin-wheel" | "coin-flip";
                dispatch(setCurrentPage(1));
                setGameFilter(value);
              }}
              options={gameOptions}
            />
            <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </span>
          </div>
          <div className="w-80 max-w-xs">
            <Input
              placeholder="Search user..."
              value={searchText}
              onChange={(e) => {
                dispatch(setCurrentPage(1));
                setSearchText(e.target.value);
              }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1100px]">
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <Loading />
            </div>
          )}

          {!isLoading && histories.length === 0 && (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No bet histories found</p>
            </div>
          )}

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
                  Date
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
                  Room
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                >
                  Round
                </TableCell>
                {gameFilter === "coin-flip" && (
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Bet Side
                  </TableCell>
                )}
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
                  Status
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {histories.map((item, index) => {
                const statusColor = statusColorMap[item.status] ?? "dark";
                return (
                  <TableRow key={item.id}>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {(currentPage - 1) * perPage + index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {item.created_at
                        ? moment(item.created_at).format("DD/MM/YYYY HH:mm:ss")
                        : "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      <Link
                        href={`/user-bet-history/${item.user_id}?user_name=${encodeURIComponent(item.user_name)}`}
                        className="text-blue-500 hover:underline"
                      >
                        {item.user_name}
                      </Link>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {item.room}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {item.round}
                    </TableCell>
                    {gameFilter === "coin-flip" && (
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {"bet_side" in item
                          ? ((item as { bet_side?: string }).bet_side ?? "-")
                          : "-"}
                      </TableCell>
                    )}
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {item.bet_amount}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {item.winning_amount}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      <Badge color={statusColor} variant="light">
                        <span className="capitalize">{item.status}</span>
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          <div className="flex justify-center m-5">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => dispatch(setCurrentPage(page))}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
