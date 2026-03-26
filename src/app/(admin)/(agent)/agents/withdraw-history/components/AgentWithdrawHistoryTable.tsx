"use client";

import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Loading from "@/components/common/Loading";
import Pagination from "@/components/tables/Pagination";
import { useGetAgentWithdrawHistoryQuery } from "@/redux/features/agents/AgentWithdrawHistoryApiSlice";
import { useAppSelector } from "@/redux/hook";
import moment from "moment";
import { useRouter, useSearchParams } from "next/navigation";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { useModal } from "@/hooks/useModal";
import { toast } from "sonner";
import {
  useGetAgentPaymentMethodsQuery,
  useCreateAgentWithdrawRequestMutation,
} from "@/redux/features/agents/AgentWithdrawRequestForAgentApiSlice";

import { DEFAULT_PER_PAGE } from "@/lib/constants";

export default function AgentWithdrawHistoryTable() {
  const authType = useAppSelector((state) => state.auth.authType);
  const router = useRouter();
  const searchParams = useSearchParams();
  const createWithdrawModal = useModal();
  const [paymentMethodId, setPaymentMethodId] = useState<number | "">("");
  const [amount, setAmount] = useState<number | "">("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [password, setPassword] = useState("");

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

  const { data, isLoading, refetch } = useGetAgentWithdrawHistoryQuery(
    { page, per_page },
    { skip: authType !== "agent" }
  );

  const { data: paymentMethodsData } = useGetAgentPaymentMethodsQuery(
    { page: 1, perPage: 10 },
    { skip: authType !== "agent" }
  );

  const [createWithdrawRequest, { isLoading: isCreating }] =
    useCreateAgentWithdrawRequestMutation();

  if (authType !== "agent") {
    return null;
  }

  const histories = data?.data || [];
  const totalPages = data?.meta?.total_pages || 1;

  const onPageChange = (nextPage: number) => {
    router.push(`/agents/withdraw-history?page=${nextPage}&per_page=${per_page}`);
  };

  const handleOpenCreateWithdrawModal = () => {
    setPaymentMethodId("");
    setAmount("");
    setReceiverPhone("");
    setPassword("");
    createWithdrawModal.openModal();
  };

  const handleCloseCreateWithdrawModal = () => {
    createWithdrawModal.closeModal();
    setPaymentMethodId("");
    setAmount("");
    setReceiverPhone("");
    setPassword("");
  };

  const handleSubmitCreateWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!paymentMethodId || !amount || !receiverPhone || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await createWithdrawRequest({
        payment_method_id: Number(paymentMethodId),
        amount: Number(amount),
        receiver_phone_number: receiverPhone,
        password,
      }).unwrap();

      toast.success("Withdraw request created successfully");
      handleCloseCreateWithdrawModal();
      refetch();
    } catch (error: unknown) {
      console.error("Error creating withdraw request:", error);
      let errorMessage = "Failed to create withdraw request";

      if (error && typeof error === "object") {
        const err = error as {
          data?: {
            message?: string;
            errors?: Record<string, string[]>;
          };
          message?: string;
        };

        if (err.data?.errors && typeof err.data.errors === "object") {
          const fieldMessages: string[] = [];
          Object.values(err.data.errors).forEach((msgs) => {
            if (Array.isArray(msgs)) {
              msgs.forEach((m) => {
                if (typeof m === "string") fieldMessages.push(m);
              });
            }
          });

          if (fieldMessages.length > 0) {
            errorMessage = fieldMessages.join("\n");
          }
        }

        if (errorMessage === "Failed to create withdraw request") {
          if (err.data?.message) {
            errorMessage = err.data.message || errorMessage;
          } else if (err.message) {
            errorMessage = err.message || errorMessage;
          }
        }
      }

      toast.error(errorMessage);
    }
  };

  const paymentMethods = paymentMethodsData?.data || [];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/[0.05]">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Agent Withdrawal Histories
        </h3>
        <Button variant="primary" size="sm" onClick={handleOpenCreateWithdrawModal}>
          Add Withdrawal Request
        </Button>
      </div>
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <Loading />
            </div>
          )}

          {!isLoading && histories.length === 0 && (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No withdrawal histories found</p>
            </div>
          )}

          {!isLoading && histories.length > 0 && (
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
                      Receiver Phone
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
                      Reason
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {histories.map((row, index) => (
                    <TableRow key={row.id}>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {(page - 1) * per_page + index + 1}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {moment(row.created_at).format("YYYY-MM-DD HH:mm:ss")}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {row.payment_method?.type}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {row.amount}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {row.receiver_phone_number}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm capitalize">
                        {row.status}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {row.reason_for_rejection || "-"}
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

      <Modal
        isOpen={createWithdrawModal.isOpen}
        onClose={handleCloseCreateWithdrawModal}
        className="max-w-[500px] p-6 lg:p-8"
      >
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Create Withdraw Request
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Submit a new withdraw request using your payment method.
          </p>

          <form onSubmit={handleSubmitCreateWithdraw} className="space-y-4">
            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Payment Method
              </Label>
              <select
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                value={paymentMethodId}
                onChange={(e) => setPaymentMethodId(Number(e.target.value) || "")}
                disabled={isCreating || paymentMethods.length === 0}
              >
                <option value="">Select payment method</option>
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.type} - {method.account_username} ({method.phone_number})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Amount
              </Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                placeholder="Enter amount"
                disabled={isCreating}
              />
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Receiver Phone Number
              </Label>
              <Input
                type="text"
                value={receiverPhone}
                onChange={(e) => setReceiverPhone(e.target.value)}
                placeholder="Enter receiver phone number"
                disabled={isCreating}
              />
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={isCreating}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseCreateWithdrawModal}
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isCreating}>
                {isCreating ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
