"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setCurrentPage } from "@/redux/features/PaginationSlice";
import { useGetGamesQuery, useToggleGameStatusMutation } from "@/redux/features/game/GameApiSlice";
import { DEFAULT_PER_PAGE } from "@/lib/constants";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/tables/Pagination";
import Loading from "@/components/common/Loading";
import Badge from "@/components/ui/badge/Badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const statusColorMap: Record<string, "success" | "error" | "warning" | "dark"> = {
  active: "success",
  inactive: "dark",
};

export default function GameTable() {
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector((state) => state.pagination.currentPage);

  const { data, isLoading } = useGetGamesQuery({
    page: currentPage,
    perPage: DEFAULT_PER_PAGE,
  });
  const [toggleGameStatus, { isLoading: isToggling }] = useToggleGameStatusMutation();

  const games = data?.data ?? [];
  const totalPages = data?.meta?.total_pages ?? 1;
  const perPage = data?.meta?.per_page ?? DEFAULT_PER_PAGE;

  const handleToggle = async (id: number, status: string) => {
    try {
      const deactivate = status === "active";
      await toggleGameStatus({ id, deactivate }).unwrap();
      toast.success("Game status updated");
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
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Games</h3>
      </div>
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[900px]">
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <Loading />
            </div>
          )}

          {!isLoading && games.length === 0 && (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No games found</p>
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
                  Name
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
              {games.map((game, index) => {
                const statusColor = statusColorMap[game.status] ?? "dark";
                return (
                  <TableRow key={game.id}>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {(currentPage - 1) * perPage + index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {game.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      <Badge color={statusColor} variant="light">
                        <span className="capitalize">{game.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      <Switch
                        checked={game.status === "active"}
                        onCheckedChange={() => handleToggle(game.id, game.status)}
                        disabled={isToggling}
                      />
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
