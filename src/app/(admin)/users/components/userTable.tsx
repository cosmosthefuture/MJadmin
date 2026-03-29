"use client";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import {
  useGetAllUsersQuery,
  useToggleUserMutation,
  useVerifyUserMutation,
  useResetPasswordMutation,
} from "@/redux/features/user/UserApiSlice";
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
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Label from "@/components/form/Label";
import moment from "moment";
import { Eye } from "lucide-react";

export default function UserTable() {
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector((state) => state.pagination.currentPage);
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText);

  const hadUserViewPermission = useCheckPermission("user_view");
  const hadUserCreatePermission = useCheckPermission("user_create");
  const hadUserUpdatePermission = useCheckPermission("user_update");

  const { data, isLoading } = useGetAllUsersQuery({
    page: currentPage,
    perPage: DEFAULT_PER_PAGE,
    search: debouncedSearchText || undefined,
  });

  const totalPages = data?.meta?.total_pages ?? 1;
  const users = data?.data ?? [];

  const [toggleUser] = useToggleUserMutation();
  const [verifyUser, { isLoading: isVerifying }] = useVerifyUserMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();
  const verifyModal = useModal();
  const resetPasswordModal = useModal();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [resetPasswordInput, setResetPasswordInput] = useState("");
  const [resetPasswordConfirmationInput, setResetPasswordConfirmationInput] = useState("");

  const handleOpenResetPasswordModal = (userId: number) => {
    setSelectedUserId(userId);
    setResetPasswordInput("");
    setResetPasswordConfirmationInput("");
    resetPasswordModal.openModal();
  };

  const handleCloseResetPasswordModal = () => {
    resetPasswordModal.closeModal();
    setSelectedUserId(null);
    setResetPasswordInput("");
    setResetPasswordConfirmationInput("");
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId) return;

    if (resetPasswordInput.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (resetPasswordInput !== resetPasswordConfirmationInput) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await resetPassword({
        id: selectedUserId,
        password: resetPasswordInput,
        password_confirmation: resetPasswordConfirmationInput,
      }).unwrap();
      toast.success("Password reset successfully");
      handleCloseResetPasswordModal();
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to reset password");
    }
  };

  const handleToggleActive = async (id: number, status: boolean) => {
    try {
      await toggleUser({ adminId: id, deactivate: status }).unwrap();
      toast.success("User status updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update user status");
    }
  };

  const handleOpenVerifyModal = (userId: number) => {
    setSelectedUserId(userId);
    setPassword("");
    setPasswordConfirmation("");
    verifyModal.openModal();
  };

  const handleCloseVerifyModal = () => {
    verifyModal.closeModal();
    setSelectedUserId(null);
    setPassword("");
    setPasswordConfirmation("");
  };

  const handleVerifyUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId) return;

    // If password is provided, validate it
    if (password) {
      // Validate password length
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }

      // Validate passwords match
      if (password !== passwordConfirmation) {
        toast.error("Passwords do not match");
        return;
      }
    }

    try {
      await verifyUser({
        id: selectedUserId,
        password: password || undefined,
        password_confirmation: passwordConfirmation || undefined,
      }).unwrap();
      toast.success("User verified successfully");
      handleCloseVerifyModal();
    } catch (error: unknown) {
      console.error("Error:", error);
      let errorMessage = "Failed to verify user";

      if (error && typeof error === "object") {
        if (
          "data" in error &&
          typeof (error as { data?: { message?: string } }).data?.message === "string"
        ) {
          errorMessage = (error as { data?: { message?: string } }).data?.message || errorMessage;
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

  if (!hadUserViewPermission) {
    return <NoPermissionUI />;
  }

  return (
    <div className="">
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

        {hadUserCreatePermission && (
          <Link href="/users/create-update" className="flex items-center">
            <Button variant="primary" className="flex">
              Add User
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

            {!isLoading && users.length === 0 && (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No users found</p>
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
                    Phone
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
                    Verified
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
                {users.map((user) => {
                  const formatDate = (dateString?: string) => {
                    if (!dateString) return "—";
                    return moment(dateString).format("MMM D, YYYY");
                  };

                  return (
                    <TableRow key={user.id}>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {user.id}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        <Link
                          href={`/user-bet-history/${user.id}?user_name=${encodeURIComponent(user.name)}`}
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {user.name}
                        </Link>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {user.phone_number || "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {user.balance || "0"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            user.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-200 text-gray-600"
                          }`}
                        >
                          {user.status}
                        </span>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {user.is_verified ? (
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-700">
                            Verified
                          </span>
                        ) : (
                          <Button
                            variant="primary"
                            className="text-xs px-3 py-1.5"
                            onClick={() => handleOpenVerifyModal(user.id)}
                          >
                            Verify User
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {formatDate((user as { created_at?: string })?.created_at)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-theme-sm text-gray-500">
                        <span className="flex gap-2 items-center">
                          <Link href={`/users/${user.id}/detail`} title="View User Detail">
                            <Eye className="w-5 h-5 text-gray-600 hover:text-blue-600 transition-colors" />
                          </Link>
                          {hadUserUpdatePermission && (
                            <>
                              <Link href={`/users/create-update?id=${user.id}`} title="Edit User">
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
                                  className="text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                  <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                  <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                                </svg>
                              </Link>

                              <button
                                type="button"
                                title="Reset Password"
                                onClick={() => handleOpenResetPasswordModal(user.id)}
                                className="disabled:opacity-50"
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
                                  className="text-gray-600 hover:text-red-600 transition-colors"
                                >
                                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                                </svg>
                              </button>

                              {/*
                              <button
                                type="button"
                                onClick={() => handleOpenManualTransactionModal(user.id, "deposit")}
                                className="text-xs bg-green-50 text-green-600 hover:bg-green-100 px-2 py-1 rounded font-medium transition-colors"
                              >
                                Deposit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleOpenManualTransactionModal(user.id, "withdraw")
                                }
                                className="text-xs bg-red-50 text-red-600 hover:bg-red-100 px-2 py-1 rounded font-medium transition-colors"
                              >
                                Withdraw
                              </button>
                              */}

                              <Switch
                                checked={user.status === "active"}
                                onClick={() =>
                                  handleToggleActive(user.id, user.status === "active")
                                }
                              />
                            </>
                          )}
                        </span>
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

      {/* Verify User Modal */}
      <Modal
        isOpen={verifyModal.isOpen}
        onClose={handleCloseVerifyModal}
        className="max-w-[500px] p-6 lg:p-8"
      >
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Verify User</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Verify this user account. You can optionally set or update their password.
          </p>

          <form onSubmit={handleVerifyUser} className="space-y-4">
            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                disabled={isVerifying}
              />
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </Label>
              <Input
                type="password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                placeholder="Confirm password"
                disabled={isVerifying}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseVerifyModal}
                disabled={isVerifying}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isVerifying}>
                {isVerifying ? "Verifying..." : "Verify User"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Reset Password Modal */}
      <Modal
        isOpen={resetPasswordModal.isOpen}
        onClose={handleCloseResetPasswordModal}
        className="max-w-[500px] p-6 lg:p-8"
      >
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Reset Password
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Reset the user&apos;s password.
          </p>

          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password
              </Label>
              <Input
                type="password"
                value={resetPasswordInput}
                onChange={(e) => setResetPasswordInput(e.target.value)}
                placeholder="Enter new password"
                disabled={isResetting}
              />
            </div>

            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm New Password
              </Label>
              <Input
                type="password"
                value={resetPasswordConfirmationInput}
                onChange={(e) => setResetPasswordConfirmationInput(e.target.value)}
                placeholder="Confirm new password"
                disabled={isResetting}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseResetPasswordModal}
                disabled={isResetting}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={isResetting}>
                {isResetting ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
