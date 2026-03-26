"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setCurrentPage } from "@/redux/features/PaginationSlice";
import {
  useCreatePaymentMethodMutation,
  useGetPaymentMethodsQuery,
  useUpdatePaymentMethodMutation,
  useTogglePaymentMethodMutation,
} from "@/redux/features/payment/PaymentApiSlice";
import { DEFAULT_PER_PAGE } from "@/lib/constants";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/tables/Pagination";
import Loading from "@/components/common/Loading";
import Badge from "@/components/ui/badge/Badge";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import { Switch } from "@/components/ui/switch";
import Select from "@/components/form/Select";
import { ChevronDownIcon } from "@/icons";
import { useState } from "react";
import { toast } from "sonner";
import { Modal } from "@/components/ui/modal";
import { useForm } from "react-hook-form";
import { useCheckPermission } from "@/hooks/useCheckPermissions";
import NoPermissionUI from "@/components/NoPermissionUI";

export default function PaymentTable() {
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector((state) => state.pagination.currentPage);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  type PaymentForm = {
    type: string;
    account_username: string;
    phone_number: string;
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm<PaymentForm>({
    defaultValues: {
      type: "",
      account_username: "",
      phone_number: "",
    },
  });

  const hadPaymentMethodViewPermission = useCheckPermission("payment_method_view");
  const hadPaymentMethodCreatePermission = useCheckPermission("payment_method_create");
  const hadPaymentMethodUpdatePermission = useCheckPermission("payment_method_update");

  const { data, isLoading } = useGetPaymentMethodsQuery({
    page: currentPage,
    perPage: DEFAULT_PER_PAGE,
  });
  const [createPaymentMethod, { isLoading: isCreating }] = useCreatePaymentMethodMutation();
  const [updatePaymentMethod, { isLoading: isUpdating }] = useUpdatePaymentMethodMutation();
  const [togglePaymentMethod] = useTogglePaymentMethodMutation();
  const isSaving = isCreating || isUpdating;

  const totalPages = data?.meta?.total_pages ?? 1;
  const perPage = data?.meta?.per_page ?? DEFAULT_PER_PAGE;
  const payments = data?.data ?? [];

  const onSubmit = async (values: PaymentForm) => {
    try {
      if (editingId) {
        await updatePaymentMethod({ id: editingId, ...values }).unwrap();
        toast.success("Payment method updated successfully");
      } else {
        await createPaymentMethod(values).unwrap();
        toast.success("Payment method created successfully");
      }
      reset();
      setEditingId(null);
      setIsOpen(false);
      dispatch(setCurrentPage(1));
    } catch (error: unknown) {
      const serverErrors =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { errors?: Record<string, string[]>; message?: string } }).data
              ?.errors
          : undefined;

      if (serverErrors) {
        Object.entries(serverErrors).forEach(([field, messages]) => {
          if (Array.isArray(messages) && messages[0]) {
            setError(field as keyof PaymentForm, { type: "server", message: messages[0] });
          }
        });
      }

      const msg =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : "Failed to create payment method";
      toast.error(msg ?? "Failed to create payment method");
    }
  };

  const handleToggle = async (id: number, isActive: boolean) => {
    try {
      await togglePaymentMethod({ id, deactivate: isActive }).unwrap();
      toast.success("Payment status updated");
    } catch (error: unknown) {
      const msg =
        error && typeof error === "object" && "data" in error
          ? (error as { data?: { message?: string } }).data?.message
          : "Failed to update status";
      toast.error(msg ?? "Failed to update status");
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    reset();
    setIsOpen(true);
  };

  const openEditModal = (payment: {
    id: number;
    type: string;
    account_username: string;
    phone_number: string;
  }) => {
    setEditingId(payment.id);
    reset({
      type: payment.type,
      account_username: payment.account_username,
      phone_number: payment.phone_number,
    });
    setIsOpen(true);
  };

  if (!hadPaymentMethodViewPermission) {
    return <NoPermissionUI />;
  }

  return (
    <div className="">
      {/* Add Payment Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} className="max-w-[750px] m-4">
        <div className="no-scrollbar relative w-full max-w-[750px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14"></div>
          <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <div className="custom-scrollbar max-h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-2">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  {editingId ? "Edit Payment Method" : "Add Payment Method"}
                </h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                      Type
                    </label>
                    <div className="relative">
                      <Select
                        className="text-gray-600"
                        options={[
                          { value: "", label: "Select method" },
                          { value: "kpay", label: "KBZ Pay" },
                          { value: "wave", label: "Wave Pay" },
                        ]}
                        disabled={isSaving}
                        {...register("type", { required: "Type is required" })}
                      />
                      <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                        <ChevronDownIcon />
                      </span>
                    </div>
                    {errors.type?.message && (
                      <p className="mt-1 text-xs text-error-500">{errors.type.message}</p>
                    )}
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                      Account Username
                    </label>
                    <Input
                      {...register("account_username", {
                        required: "Account username is required",
                      })}
                      placeholder="Enter account username"
                      disabled={isSaving}
                      error={!!errors.account_username}
                      hint={errors.account_username?.message}
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200">
                      Phone Number
                    </label>
                    <Input
                      {...register("phone_number", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^09\d{8,9}$/,
                          message:
                            "Phone number must start with 09 and contain 8 or 9 digits after it.",
                        },
                      })}
                      placeholder="Enter phone number (e.g., 09XXXXXXXXX)"
                      disabled={isSaving}
                      error={!!errors.phone_number}
                      hint={errors.phone_number?.message}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isSaving}
              >
                Close
              </Button>
              <Button size="sm" type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : editingId ? "Update Payment" : "Add Payment"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/[0.05]">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Payment Methods</h3>
          {hadPaymentMethodCreatePermission && (
            <Button variant="primary" onClick={openCreateModal}>
              Add Payment
            </Button>
          )}
        </div>
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <Loading />
              </div>
            )}

            {!isLoading && payments.length === 0 && (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No payment methods found</p>
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
                    Type
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Account Username
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Phone Number
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
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {payments.map((payment, index) => (
                  <TableRow key={payment.id}>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {(currentPage - 1) * perPage + index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {payment.type}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {payment.account_username}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {payment.phone_number}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      <Badge
                        color={payment.status === "active" ? "success" : "dark"}
                        variant="light"
                      >
                        <span className="capitalize">{payment.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {payment.created_at}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {hadPaymentMethodUpdatePermission && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEditModal({
                                id: payment.id,
                                type: payment.type,
                                account_username: payment.account_username,
                                phone_number: payment.phone_number,
                              })
                            }
                            className="text-gray-500 hover:text-gray-700"
                            title="Edit Payment"
                          >
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
                            >
                              <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                              <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                            </svg>
                          </button>
                          <Switch
                            checked={payment.status === "active"}
                            onCheckedChange={() =>
                              handleToggle(payment.id, payment.status === "active")
                            }
                          />
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
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
