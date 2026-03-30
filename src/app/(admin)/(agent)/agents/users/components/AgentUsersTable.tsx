"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import moment from "moment";
import { Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/tables/Pagination";
import { Switch } from "@/components/ui/switch";
import Loading from "@/components/common/Loading";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { Modal } from "@/components/ui/modal";
import { DEFAULT_PER_PAGE } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setCurrentPage } from "@/redux/features/PaginationSlice";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useAddMoneyToAgentUserMutation,
  useGetAgentUsersQuery,
  useResetAgentUserPasswordMutation,
  useToggleAgentUserStatusMutation,
  useVerifyAgentUserMutation,
  useWithdrawMoneyFromAgentUserMutation,
} from "@/redux/features/agents/AgentUserApiSlice";

export default function AgentUsersTable() {
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector((state) => state.pagination.currentPage);
  const authType = useAppSelector((state) => state.auth.authType);
  const router = useRouter();
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText);

  const { data, isLoading } = useGetAgentUsersQuery(
    { page: currentPage, perPage: DEFAULT_PER_PAGE, search: debouncedSearchText || undefined },
    { skip: authType !== "agent" }
  );

  const [toggleUser] = useToggleAgentUserStatusMutation();
  const [verifyUser, { isLoading: isVerifying }] = useVerifyAgentUserMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetAgentUserPasswordMutation();
  const [addMoneyToUser, { isLoading: isAddingMoney }] = useAddMoneyToAgentUserMutation();
  const [withdrawMoneyFromUser, { isLoading: isWithdrawing }] =
    useWithdrawMoneyFromAgentUserMutation();

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [isAddMoneyModalOpen, setIsAddMoneyModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [resetPasswordInput, setResetPasswordInput] = useState("");
  const [resetPasswordConfirmationInput, setResetPasswordConfirmationInput] = useState("");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (authType && authType !== "agent") {
      router.replace("/login");
    }
  }, [authType, router]);

  if (authType !== "agent") return null;

  const users = data?.data ?? [];
  const totalPages = data?.meta?.total_pages ?? 1;

  const formatDate = (dateString?: string) =>
    dateString ? moment(dateString).format("MMM D, YYYY") : "—";

  const handleToggleActive = async (id: number, status: boolean) => {
    try {
      await toggleUser({ id, deactivate: status }).unwrap();
      toast.success("User status updated successfully");
    } catch {
      toast.error("Failed to update user status");
    }
  };

  const closeVerifyModal = () => {
    setIsVerifyModalOpen(false);
    setSelectedUserId(null);
    setPassword("");
    setPasswordConfirmation("");
  };

  const closeResetPasswordModal = () => {
    setIsResetPasswordModalOpen(false);
    setSelectedUserId(null);
    setResetPasswordInput("");
    setResetPasswordConfirmationInput("");
  };

  const closeAddMoneyModal = () => {
    setIsAddMoneyModalOpen(false);
    setSelectedUserId(null);
    setAmount("");
  };

  const closeWithdrawModal = () => {
    setIsWithdrawModalOpen(false);
    setSelectedUserId(null);
    setAmount("");
  };

  const handleVerifyUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    if (password && password.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (password !== passwordConfirmation) return toast.error("Passwords do not match");
    try {
      await verifyUser({
        id: selectedUserId,
        password: password || undefined,
        password_confirmation: passwordConfirmation || undefined,
      }).unwrap();
      toast.success("User verified successfully");
      closeVerifyModal();
    } catch (error: unknown) {
      const data = (error as { data?: { message?: string; response?: { message?: string } } }).data;
      toast.error(data?.message || data?.response?.message || "Failed to verify user");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    if (resetPasswordInput.length < 6) return toast.error("Password must be at least 6 characters");
    if (resetPasswordInput !== resetPasswordConfirmationInput)
      return toast.error("Passwords do not match");
    try {
      await resetPassword({
        id: selectedUserId,
        password: resetPasswordInput,
        password_confirmation: resetPasswordConfirmationInput,
      }).unwrap();
      toast.success("Password reset successfully");
      closeResetPasswordModal();
    } catch (error: unknown) {
      const data = (error as { data?: { message?: string; response?: { message?: string } } }).data;
      toast.error(data?.message || data?.response?.message || "Failed to reset password");
    }
  };

  const handleAddMoney = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !amount.trim()) return;
    try {
      await addMoneyToUser({ user_id: selectedUserId, amount: amount.trim() }).unwrap();
      toast.success("Money added successfully");
      closeAddMoneyModal();
    } catch (error: unknown) {
      const data = (error as { data?: { message?: string; response?: { message?: string } } }).data;
      toast.error(data?.message || data?.response?.message || "Failed to add money");
    }
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId || !amount.trim()) return;
    try {
      await withdrawMoneyFromUser({ user_id: selectedUserId, amount: amount.trim() }).unwrap();
      toast.success("Money withdrawn successfully");
      closeWithdrawModal();
    } catch (error: unknown) {
      const data = (error as { data?: { message?: string; response?: { message?: string } } }).data;
      toast.error(data?.message || data?.response?.message || "Failed to withdraw money");
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
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
        <Link href="/agents/users/create-update" className="flex items-center">
          <Button variant="primary" className="flex">
            Add User
          </Button>
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[900px]">
            {isLoading && (
              <div className="flex h-64 items-center justify-center">
                <Loading />
              </div>
            )}
            {!isLoading && users.length === 0 && (
              <div className="flex h-64 items-center justify-center">
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
                {users.map((user) => (
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
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${user.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}`}
                      >
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {user.is_verified ? (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                          Verified
                        </span>
                      ) : (
                        <Button
                          variant="primary"
                          className="px-3 py-1.5 text-xs"
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setIsVerifyModalOpen(true);
                          }}
                        >
                          Verify User
                        </Button>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {formatDate(user.created_at)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500">
                      <span className="flex items-center gap-2">
                        <Link href={`/agents/users/${user.id}/detail`} title="View User Detail">
                          <Eye className="h-5 w-5 text-gray-600 transition-colors hover:text-blue-600" />
                        </Link>
                        <Link href={`/agents/users/create-update?id=${user.id}`} title="Edit User">
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
                            className="text-gray-600 transition-colors hover:text-blue-600"
                          >
                            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                          </svg>
                        </Link>
                        <button
                          type="button"
                          title="Reset Password"
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setIsResetPasswordModalOpen(true);
                          }}
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
                            className="text-gray-600 transition-colors hover:text-red-600"
                          >
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                        </button>
                        <button
                          type="button"
                          title="Add Money"
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setAmount("");
                            setIsAddMoneyModalOpen(true);
                          }}
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
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setAmount("");
                            setIsWithdrawModalOpen(true);
                          }}
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
                          checked={user.status === "active"}
                          onClick={() => handleToggleActive(user.id, user.status === "active")}
                        />
                      </span>
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

      <Modal
        isOpen={isVerifyModalOpen}
        onClose={closeVerifyModal}
        className="max-w-[500px] p-6 lg:p-8"
      >
        <div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Verify User</h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
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
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={closeVerifyModal}
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

      <Modal
        isOpen={isResetPasswordModalOpen}
        onClose={closeResetPasswordModal}
        className="max-w-[500px] p-6 lg:p-8"
      >
        <div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Reset Password
          </h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
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
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={closeResetPasswordModal}
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

      <Modal
        isOpen={isAddMoneyModalOpen}
        onClose={closeAddMoneyModal}
        className="max-w-[500px] p-6 lg:p-8"
      >
        <div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">Add Money</h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Add balance to the selected user.
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
                onClick={closeAddMoneyModal}
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
        onClose={closeWithdrawModal}
        className="max-w-[500px] p-6 lg:p-8"
      >
        <div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Withdraw Money
          </h3>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400">
            Withdraw balance from the selected user.
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
                onClick={closeWithdrawModal}
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
