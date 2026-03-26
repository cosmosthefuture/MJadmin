"use client";

import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setCurrentPage } from "@/redux/features/PaginationSlice";
import {
  useGetGameRulesQuery,
  useToggleGameRuleStatusMutation,
} from "@/redux/features/gameRules/GameRuleApiSlice";
import { DEFAULT_PER_PAGE } from "@/lib/constants";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/tables/Pagination";
import Loading from "@/components/common/Loading";
import Badge from "@/components/ui/badge/Badge";
import { Switch } from "@/components/ui/switch";
import Button from "@/components/ui/button/Button";
import { toast } from "sonner";

const statusColorMap: Record<string, "success" | "error" | "warning" | "dark"> = {
  active: "success",
  inactive: "dark",
};

export default function GameRuleTable() {
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector((state) => state.pagination.currentPage);

  const { data, isLoading } = useGetGameRulesQuery({
    page: currentPage,
    perPage: DEFAULT_PER_PAGE,
  });
  const [toggleGameRuleStatus, { isLoading: isToggling }] = useToggleGameRuleStatusMutation();

  const rules = data?.data ?? [];
  const totalPages = data?.meta?.total_pages ?? 1;
  const perPage = data?.meta?.per_page ?? DEFAULT_PER_PAGE;

  const handleToggle = async (id: number, status: string) => {
    try {
      const deactivate = status === "active";
      await toggleGameRuleStatus({ id, deactivate }).unwrap();
      toast.success("Rule status updated");
    } catch (error: unknown) {
      const message =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : "Failed to update status";
      toast.error(message ?? "Failed to update status");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/[0.05]">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Game Rules</h3>
        <Link href="/game-rules/create-update">
          <Button variant="primary" size="sm">
            Add Rule
          </Button>
        </Link>
      </div>
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1100px]">
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <Loading />
            </div>
          )}

          {!isLoading && rules.length === 0 && (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No game rules found</p>
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
                  Rule Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                >
                  Game
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                >
                  Min Bet
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                >
                  Max Bet
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                >
                  Time / Round (s)
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                >
                  User Limit
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
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {rules.map((rule, index) => {
                const statusColor = statusColorMap[rule.status] ?? "dark";
                return (
                  <TableRow key={rule.id}>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {(currentPage - 1) * perPage + index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {rule.rule_name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {rule.game?.name ?? "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {rule.min_bet_amount}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {rule.max_bet_amount}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {rule.time_per_round}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {rule.user_limit}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      <Badge color={statusColor} variant="light">
                        <span className="capitalize">{rule.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      <div className="flex items-center gap-3">
                        <Link href={`/game-rules/create-update?id=${rule.id}`}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-gray-500 hover:text-brand-500"
                          >
                            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                          </svg>
                        </Link>
                        <Switch
                          checked={rule.status === "active"}
                          onCheckedChange={() => handleToggle(rule.id, rule.status)}
                          disabled={isToggling}
                        />
                      </div>
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
