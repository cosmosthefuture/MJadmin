"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setCurrentPage } from "@/redux/features/PaginationSlice";
import {
  useApproveAgentWithdrawRequestMutation,
  useGetAgentWithdrawRequestsQuery,
  useRejectAgentWithdrawRequestMutation,
} from "@/redux/features/agents/AgentWithdrawRequestApiSlice";
import { DEFAULT_PER_PAGE } from "@/lib/constants";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/tables/Pagination";
import Loading from "@/components/common/Loading";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import { useDebounce } from "@/hooks/useDebounce";
import { useCheckPermission } from "@/hooks/useCheckPermissions";
import moment from "moment";

const statusColorMap: Record<string, "warning" | "success" | "error" | "dark"> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
};

export default function AgentWithdrawRequestTable() {
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector((state) => state.pagination.currentPage);

  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText);

  const hadAgentWithdrawRequestViewPermission = useCheckPermission("agent_withdraw_request_view");
  const hadAgentWithdrawRequestActionPermission = useCheckPermission(
    "agent_withdraw_request_action"
  );

  const { data, isLoading } = useGetAgentWithdrawRequestsQuery({
    page: currentPage,
    perPage: DEFAULT_PER_PAGE,
    search: debouncedSearchText || undefined,
  });

  const [approveAgentWithdrawRequest, { isLoading: isApproving }] =
    useApproveAgentWithdrawRequestMutation();
  const [rejectAgentWithdrawRequest, { isLoading: isRejecting }] =
    useRejectAgentWithdrawRequestMutation();

  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const isUpdating = isApproving || isRejecting;

  const totalPages = data?.meta?.total_pages ?? 1;
  const perPage = data?.meta?.per_page ?? DEFAULT_PER_PAGE;
  const requests = data?.data ?? [];

  const handleApprove = async (id: number) => {
    try {
      await approveAgentWithdrawRequest({ id }).unwrap();
      toast.success("Withdraw request approved");
    } catch (error: unknown) {
      const msg =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : "Failed to approve";
      toast.error(msg ?? "Failed to approve");
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectingId) return;
    try {
      await rejectAgentWithdrawRequest({
        id: rejectingId,
        reason_for_rejection: rejectReason,
      }).unwrap();
      toast.success("Withdraw request rejected");
      setIsRejectModalOpen(false);
      setRejectReason("");
      setRejectingId(null);
    } catch (error: unknown) {
      const msg =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : "Failed to reject";
      toast.error(msg ?? "Failed to reject");
    }
  };

  if (!hadAgentWithdrawRequestViewPermission) {
    return null;
  }

  return (
    <div>
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        className="max-w-[500px] m-4"
      >
        <div className="no-scrollbar w-full rounded-2xl bg-white p-5 dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Reject Agent Withdraw Request
          </h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Please provide a reason for rejection.
          </p>
          <div className="mt-4">
            <Input
              placeholder="Reason for rejection"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              disabled={isRejecting}
            />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsRejectModalOpen(false)}
              disabled={isRejecting}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleRejectSubmit}
              disabled={isRejecting || !rejectReason.trim()}
            >
              {isRejecting ? "Rejecting..." : "Reject"}
            </Button>
          </div>
        </div>
      </Modal>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/[0.05]">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Agent Withdraw Requests
          </h3>
          <div className="w-full max-w-xs">
            <Input
              placeholder="Search agent..."
              value={searchText}
              onChange={(e) => {
                dispatch(setCurrentPage(1));
                setSearchText(e.target.value);
              }}
            />
          </div>
        </div>

        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1100px]">
            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <Loading />
              </div>
            )}

            {!isLoading && requests.length === 0 && (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No withdraw requests found</p>
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
                    Agent
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Agent Phone
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Receiver Phone
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Payment Method
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Amount
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
                    Created At
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {requests.map((req, index) => {
                  const statusColor = statusColorMap[req.status] ?? "dark";
                  return (
                    <TableRow key={req.id}>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {(currentPage - 1) * perPage + index + 1}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {req.agent?.name ?? "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {req.agent?.phone_number ?? "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {req.receiver_phone_number ?? "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {req.payment_method?.type ?? "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {req.amount}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        <Badge color={statusColor} variant="light">
                          <span className="capitalize">{req.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {req.created_at
                          ? moment(req.created_at).format("DD/MM/YYYY HH:mm:ss")
                          : "-"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {req.status === "pending" && hadAgentWithdrawRequestActionPermission ? (
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="primary"
                              disabled={isUpdating}
                              onClick={() => handleApprove(req.id)}
                            >
                              {isApproving ? "Approving..." : "Approve"}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              disabled={isUpdating}
                              onClick={() => {
                                setRejectingId(req.id);
                                setIsRejectModalOpen(true);
                              }}
                            >
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
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
    </div>
  );
}
