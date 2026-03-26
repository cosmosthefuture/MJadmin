"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppSelector } from "@/redux/hook";
import { DEFAULT_PER_PAGE } from "@/lib/constants";
import Loading from "@/components/common/Loading";
import Pagination from "@/components/tables/Pagination";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";
import moment from "moment";
import {
  useCreateMasterWithdrawRequestMutation,
  useGetMasterWithdrawHistoryQuery,
  useGetMasterPaymentMethodsQuery,
} from "@/redux/features/masters/MasterWithdrawApiSlice";

const statusColorMap: Record<string, "warning" | "success" | "error" | "dark"> = {
  pending: "warning",
  approved: "success",
  rejected: "error",
};

export default function MasterWithdrawHistoryTable() {
  const authType = useAppSelector((state) => state.auth.authType);
  const router = useRouter();
  const searchParams = useSearchParams();

  const pageFromQuery = Number(searchParams.get("page") || "1");
  const perPageFromQuery = Number(searchParams.get("per_page") || String(DEFAULT_PER_PAGE));

  const page = Number.isFinite(pageFromQuery) && pageFromQuery > 0 ? pageFromQuery : 1;
  const per_page =
    Number.isFinite(perPageFromQuery) && perPageFromQuery > 0 ? perPageFromQuery : DEFAULT_PER_PAGE;

  useEffect(() => {
    if (authType && authType !== "master") {
      router.replace("/login");
    }
  }, [authType, router]);

  const { data, isLoading } = useGetMasterWithdrawHistoryQuery(
    { page, per_page },
    { skip: authType !== "master" }
  );

  const { data: paymentMethodsData } = useGetMasterPaymentMethodsQuery(
    { page: 1, perPage: 10 },
    { skip: authType !== "master" }
  );

  const [isOpen, setIsOpen] = useState(false);
  const [paymentMethodId, setPaymentMethodId] = useState<number | "">("");
  const [amount, setAmount] = useState("");
  const [receiverPhoneNumber, setReceiverPhoneNumber] = useState("");
  const [password, setPassword] = useState("");

  const [createWithdraw, { isLoading: isCreating }] = useCreateMasterWithdrawRequestMutation();

  const withdraws = data?.data ?? [];
  const totalPages = data?.meta?.total_pages ?? 1;

  const paymentMethods = paymentMethodsData?.data || [];

  const isSubmitDisabled = useMemo(() => {
    return (
      isCreating ||
      !paymentMethodId ||
      !amount.trim() ||
      !receiverPhoneNumber.trim() ||
      !password.trim() ||
      !Number.isFinite(Number(amount))
    );
  }, [amount, isCreating, password, paymentMethodId, receiverPhoneNumber]);

  const onPageChange = (nextPage: number) => {
    router.push(`/master/withdraw-history?page=${nextPage}&per_page=${per_page}`);
  };

  const openCreateModal = () => {
    setPaymentMethodId("");
    setAmount("");
    setReceiverPhoneNumber("");
    setPassword("");
    setIsOpen(true);
  };

  const onSubmit = async () => {
    try {
      await createWithdraw({
        payment_method_id: Number(paymentMethodId),
        amount: Number(amount),
        receiver_phone_number: receiverPhoneNumber,
        password,
      }).unwrap();
      toast.success("Withdraw request created successfully");
      setIsOpen(false);
    } catch (error: unknown) {
      const msg =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : "Failed to create withdraw request";
      toast.error(msg ?? "Failed to create withdraw request");
    }
  };

  if (authType !== "master") {
    return null;
  }

  return (
    <div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="max-w-[750px] m-4">
        <div className="no-scrollbar relative w-full max-w-[750px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
          <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
            Create Withdraw Request
          </h5>
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <div className="col-span-2 lg:col-span-1">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                Payment Method
              </label>
              <select
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                value={paymentMethodId}
                onChange={(e) => setPaymentMethodId(Number(e.target.value) || "")}
                disabled={isCreating || paymentMethods.length === 0}
              >
                <option value="">Select payment method</option>
                {paymentMethods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.type}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2 lg:col-span-1">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                Amount
              </label>
              <Input
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={isCreating}
              />
            </div>
            <div className="col-span-1">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                Receiver Phone Number
              </label>
              <Input
                placeholder="Enter receiver phone number"
                value={receiverPhoneNumber}
                onChange={(e) => setReceiverPhoneNumber(e.target.value)}
                disabled={isCreating}
              />
            </div>
            <div className="col-span-1">
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                Password
              </label>
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isCreating}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6 justify-end">
            <Button
              size="sm"
              variant="outline"
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={isCreating}
            >
              Close
            </Button>
            <Button size="sm" type="button" onClick={onSubmit} disabled={isSubmitDisabled}>
              {isCreating ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
      </Modal>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/[0.05]">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">
            Withdraw History
          </h3>
          <Button variant="primary" onClick={openCreateModal}>
            Create Withdraw Request
          </Button>
        </div>
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <Loading />
              </div>
            )}

            {!isLoading && withdraws.length === 0 && (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No withdraw history found</p>
              </div>
            )}

            {!isLoading && withdraws.length > 0 && (
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
                        Payment Method
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
                        Reason
                      </TableCell>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {withdraws.map((w, index) => (
                      <TableRow key={w.id}>
                        <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                          {(page - 1) * per_page + index + 1}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                          {w.amount}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                          {w.receiver_phone_number}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                          {w.payment_method?.type ?? "-"} ({w.payment_method_id})
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                          <Badge color={statusColorMap[w.status] ?? "dark"} variant="light">
                            <span className="capitalize">{w.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                          {w.created_at ? moment(w.created_at).format("DD/MM/YYYY HH:mm:ss") : "-"}
                        </TableCell>
                        <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                          {w.reason_for_rejection ?? "-"}
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
    </div>
  );
}
