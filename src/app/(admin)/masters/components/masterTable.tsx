"use client";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import {
  useAddMoneyToMasterMutation,
  useGetAllMastersQuery,
  useToggleMasterStatusMutation,
  useWithdrawMoneyFromMasterMutation,
} from "@/redux/features/masters/MasterApiSlice";
import Pagination from "@/components/tables/Pagination";
import { Switch } from "@/components/ui/switch";
import Loading from "@/components/common/Loading";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setCurrentPage } from "@/redux/features/PaginationSlice";
import { useDebounce } from "@/hooks/useDebounce";
import Input from "@/components/form/input/InputField";
import { DEFAULT_PER_PAGE } from "@/lib/constants";
import { useCheckPermission } from "@/hooks/useCheckPermissions";
import NoPermissionUI from "@/components/NoPermissionUI";
import moment from "moment";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";

export default function MasterTable() {
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector((state) => state.pagination.currentPage);
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText);

  const hadMasterViewPermission = useCheckPermission("master_view");
  const hadMasterCreatePermission = useCheckPermission("master_create");
  const hadMasterUpdatePermission = useCheckPermission("master_update");

  const { data, isLoading } = useGetAllMastersQuery({
    page: currentPage,
    perPage: DEFAULT_PER_PAGE,
    search: debouncedSearchText || undefined,
  });

  const totalPages = data?.meta?.total_pages ?? 1;
  const perPage = data?.meta?.per_page ?? DEFAULT_PER_PAGE;
  const masters = data?.data ?? [];

  const [toggleMasterStatus] = useToggleMasterStatusMutation();
  const [addMoneyToMaster, { isLoading: isAddingMoney }] = useAddMoneyToMasterMutation();
  const [withdrawMoneyFromMaster, { isLoading: isWithdrawing }] =
    useWithdrawMoneyFromMasterMutation();
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedMasterId, setSelectedMasterId] = useState<number | null>(null);
  const [amount, setAmount] = useState("");

  const handleToggleActive = async (id: number, status: boolean) => {
    try {
      await toggleMasterStatus({ id, deactivate: status }).unwrap();
      toast.success("Master status updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update master status");
    }
  };

  const handleOpenAddMoneyModal = (masterId: number) => {
    setSelectedMasterId(masterId);
    setAmount("");
    setIsAddMoneyModalOpen(true);
  };

  const handleCloseAddMoneyModal = () => {
    setIsAddMoneyModalOpen(false);
    setSelectedMasterId(null);
    setAmount("");
  };

  const handleOpenWithdrawModal = (masterId: number) => {
    setSelectedMasterId(masterId);
    setAmount("");
    setIsWithdrawModalOpen(true);
  };

  const handleCloseWithdrawModal = () => {
    setIsWithdrawModalOpen(false);
    setSelectedMasterId(null);
    setAmount("");
  };

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMasterId || !amount.trim()) return;

    try {
      await addMoneyToMaster({
        master_id: selectedMasterId,
        amount: amount.trim(),
      }).unwrap();
      toast.success("Money added successfully");
      handleCloseAddMoneyModal();
    } catch (error: unknown) {
      let errorMessage = "Failed to add money";
      if (error && typeof error === "object") {
        if (
          "data" in error &&
          typeof (
            error as {
              data?: { message?: string; response?: { message?: string } };
            }
          ).data?.message === "string"
        ) {
          errorMessage =
            (
              error as {
                data?: { message?: string; response?: { message?: string } };
              }
            ).data?.message || errorMessage;
        } else if (
          "data" in error &&
          typeof (
            error as {
              data?: { message?: string; response?: { message?: string } };
            }
          ).data?.response?.message === "string"
        ) {
          errorMessage =
            (
              error as {
                data?: { message?: string; response?: { message?: string } };
              }
            ).data?.response?.message || errorMessage;
        } else if (
          "message" in error &&
          typeof (error as { message?: string }).message === "string"
        ) {
          errorMessage = (error as { message?: string }).message || errorMessage;
        }
      }
      toast.error(errorMessage);
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMasterId || !amount.trim()) return;

    try {
      await withdrawMoneyFromMaster({
        master_id: selectedMasterId,
        amount: amount.trim(),
      }).unwrap();
      toast.success("Money withdrawn successfully");
      handleCloseWithdrawModal();
    } catch (error: unknown) {
      let errorMessage = "Failed to withdraw money";
      if (error && typeof error === "object") {
        if (
          "data" in error &&
          typeof (
            error as {
              data?: { message?: string; response?: { message?: string } };
            }
          ).data?.message === "string"
        ) {
          errorMessage =
            (
              error as {
                data?: { message?: string; response?: { message?: string } };
              }
            ).data?.message || errorMessage;
        } else if (
          "data" in error &&
          typeof (
            error as {
              data?: { message?: string; response?: { message?: string } };
            }
          ).data?.response?.message === "string"
        ) {
          errorMessage =
            (
              error as {
                data?: { message?: string; response?: { message?: string } };
              }
            ).data?.response?.message || errorMessage;
        } else if (
          "message" in error &&
          typeof (error as { message?: string }).message === "string"
        ) {
          errorMessage = (error as { message?: string }).message || errorMessage;
        }
      }
      toast.error(errorMessage);
    }
  };

  if (!hadMasterViewPermission) {
    return <NoPermissionUI />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search..."
            onChange={(e) => {
              dispatch(setCurrentPage(1));
              setSearchText(e.target.value);
            }}
          />
        </div>

        {hadMasterCreatePermission && (
          <Link href="/masters/create-update" className="flex items-center">
            <Button variant="primary" className="flex">
              Add Master
            </Button>
          </Link>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <Loading />
              </div>
            )}

            {!isLoading && masters.length === 0 && (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No masters found</p>
              </div>
            )}

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
                    Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Username
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Phone
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Incentive %
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Balance
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
                    Created Date
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
                {masters.map((master, index) => {
                  const formatDate = (dateString?: string) => {
                    if (!dateString) return "—";
                    return moment(dateString).format("MMM D, YYYY");
                  };

                  return (
                    <TableRow key={master.id}>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {(currentPage - 1) * perPage + index + 1}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {master.name}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {master.username}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {master.phone_number || "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {master.incentive_percentage ?? master.winning_commission_percentage ?? "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {master.balance ? Number(master.balance).toLocaleString() : "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            master.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {master.status}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {formatDate((master as { created_at?: string })?.created_at)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-500">
                        {hadMasterUpdatePermission && (
                          <span className="flex gap-2">
                            <Link
                              href={`/masters/create-update?id=${master.id}`}
                              title="Edit Master"
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
                            </Link>

                            <button
                              type="button"
                              title="Add Money"
                              onClick={() => handleOpenAddMoneyModal(master.id)}
                              className="-mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:border-brand-300 hover:text-brand-500 dark:border-gray-700 dark:text-gray-300"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={16}
                                height={16}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 5v14"></path>
                                <path d="M5 12h14"></path>
                              </svg>
                            </button>

                            <button
                              type="button"
                              title="Withdraw"
                              onClick={() => handleOpenWithdrawModal(master.id)}
                              className="-mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:border-red-300 hover:text-red-500 dark:border-gray-700 dark:text-gray-300"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={16}
                                height={16}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M5 12h14"></path>
                              </svg>
                            </button>

                            <Switch
                              checked={master.status === "active"}
                              onClick={() =>
                                handleToggleActive(master.id, master.status === "active")
                              }
                            />
                          </span>
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

      <Modal
        isOpen={isAddMoneyModalOpen}
        onClose={handleCloseAddMoneyModal}
        className="max-w-[500px] p-6 lg:p-8"
      >
        <div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Add Money</h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Add balance to the selected master.
          </p>

          <form onSubmit={handleAddMoney} className="space-y-4">
            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Amount
              </Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                disabled={isAddingMoney}
              />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseAddMoneyModal}
                disabled={isAddingMoney}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isAddingMoney}>
                {isAddingMoney ? "Adding..." : "Add Money"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={isWithdrawModalOpen}
        onClose={handleCloseWithdrawModal}
        className="max-w-[500px] p-6 lg:p-8"
      >
        <div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Withdraw Money
          </h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Withdraw balance from the selected master.
          </p>

          <form onSubmit={handleWithdraw} className="space-y-4">
            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Amount
              </Label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount"
                disabled={isWithdrawing}
              />
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseWithdrawModal}
                disabled={isWithdrawing}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isWithdrawing}>
                {isWithdrawing ? "Withdrawing..." : "Withdraw"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
