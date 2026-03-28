"use client";

import Link from "next/link";
import { toast } from "sonner";
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
import Button from "@/components/ui/button/Button";
import Badge from "@/components/ui/badge/Badge";
import { Switch } from "@/components/ui/switch";

const feeLabelMap: Record<string, string> = {
  room: "Room",
  registration: "Registration",
  winning_commission: "Winning Commission",
};

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
          ? (error as { data?: { message?: string; response?: { message?: string } } }).data
              ?.message ||
            (error as { data?: { message?: string; response?: { message?: string } } }).data
              ?.response?.message
          : "Failed to update status";
      toast.error(message ?? "Failed to update status");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-white/[0.05]">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Mah Jong Rules</h3>
        <Link href="/game-rules/create-update">
          <Button variant="primary" size="sm">
            Add Rule
          </Button>
        </Link>
      </div>
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1100px]">
          {isLoading && (
            <div className="flex h-64 items-center justify-center">
              <Loading />
            </div>
          )}

          {!isLoading && rules.length === 0 && (
            <div className="flex h-64 items-center justify-center">
              <p className="text-gray-500">No game rules found</p>
            </div>
          )}

          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500"
                >
                  No.
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500"
                >
                  Rule Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500"
                >
                  Match Qty / Round
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500"
                >
                  Max Player
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500"
                >
                  Bet Amount
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500"
                >
                  Game
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500"
                >
                  Status
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500"
                >
                  Created By
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500"
                >
                  Fees
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-theme-xs font-medium text-gray-500"
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {rules.map((rule, index) => (
                <TableRow key={rule.id}>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500">
                    {(currentPage - 1) * perPage + index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500">
                    {rule.rule_name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500">
                    {rule.match_qty_per_round}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500">
                    {rule.max_player}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500">
                    {rule.bet_amount}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500">
                    {rule.game?.name ?? "-"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500">
                    <Badge color={statusColorMap[rule.status ?? "inactive"] ?? "dark"} variant="light">
                      <span className="capitalize">{rule.status ?? "inactive"}</span>
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500">
                    {rule.created_by?.name ?? "-"}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500">
                    <div className="space-y-1">
                      {rule.fees && rule.fees.length > 0 ? (
                        rule.fees.map((fee) => (
                          <p key={`${rule.id}-${fee.fee_type}`}>
                            {feeLabelMap[fee.fee_type] ?? fee.fee_type}: {fee.amount} ({fee.payer_type})
                          </p>
                        ))
                      ) : (
                        <p>-</p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm text-gray-500">
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
                        onCheckedChange={() => handleToggle(rule.id, rule.status ?? "inactive")}
                        disabled={isToggling}
                        aria-label="Toggle game rule status"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="m-5 flex justify-center">
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
