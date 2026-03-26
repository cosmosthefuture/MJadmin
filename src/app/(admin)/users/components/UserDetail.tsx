"use client";
import React, { useState } from "react";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Label from "@/components/form/Label";
import { useGetUserByIdQuery, useVerifyUserMutation } from "@/redux/features/user/UserApiSlice";
import Loading from "@/components/common/Loading";
import Link from "next/link";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useModal } from "@/hooks/useModal";
import Input from "@/components/form/input/InputField";
import { toast } from "sonner";
import moment from "moment";

export default function UserDetailPage({ id }: { id: string }) {
  const { data, isLoading } = useGetUserByIdQuery(Number(id));
  const [verifyUser, { isLoading: isVerifying }] = useVerifyUserMutation();
  const verifyModal = useModal();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "—";
    return moment(dateString).format("MMMM D, YYYY hh:mm A");
  };

  const handleVerifyUser = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords match if both are provided
    if (password && password !== passwordConfirmation) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate password length if provided
    if (password && password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    try {
      await verifyUser({
        id: Number(id),
        password: password || undefined,
        password_confirmation: passwordConfirmation || undefined,
      }).unwrap();
      toast.success("User verified successfully");
      verifyModal.closeModal();
      setPassword("");
      setPasswordConfirmation("");
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

  return (
    <div>
      <PageBreadcrumb
        pageTitle={data?.name ? `${data.name} - User Detail` : "User Detail"}
        backPage={{ name: "Users", href: "/users" }}
      />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-16 xl:py-12">
        {isLoading ? (
          <Loading className="flex m-auto" />
        ) : (
          <div className="space-y-6 py-6">
            {/* Basic User Information Section */}
            <div className="rounded-lg mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  User Information
                </h2>
                <div className="flex items-center gap-3">
                  {!data?.is_verified && (
                    <Button variant="primary" className="text-sm" onClick={verifyModal.openModal}>
                      Verify User
                    </Button>
                  )}
                  <Link href={`/users/create-update?id=${id}`}>
                    <Button variant="primary" className="text-sm">
                      Edit User
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Name
                  </Label>
                  <p className="text-base text-gray-900 dark:text-white font-medium">
                    {data?.name || "—"}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Phone
                  </Label>
                  <p className="text-base text-gray-900 dark:text-white">
                    {data?.phone_number || "—"}
                  </p>
                </div>

                {data?.email && (
                  <div>
                    <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                      Email
                    </Label>
                    <p className="text-base text-gray-900 dark:text-white">{data.email}</p>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Verified Status
                  </Label>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                      data?.is_verified
                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                        : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                    }`}
                  >
                    {data?.is_verified ? "Verified" : "Not Verified"}
                  </span>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Created Date
                  </Label>
                  <p className="text-base text-gray-900 dark:text-white">
                    {formatDate((data as { created_at?: string })?.created_at)}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Last Login
                  </Label>
                  <p className="text-base text-gray-900 dark:text-white">
                    {formatDate(
                      (data as { last_logined?: string; last_login?: string })?.last_logined ||
                        (data as { last_logined?: string; last_login?: string })?.last_login
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Verify User Modal */}
      <Modal
        isOpen={verifyModal.isOpen}
        onClose={verifyModal.closeModal}
        className="max-w-[500px] p-6 lg:p-8"
      >
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Verify User</h3>

          <form onSubmit={handleVerifyUser} className="space-y-4">
            <div>
              <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password (Optional)
              </Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password (optional)"
                disabled={isVerifying}
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Leave blank if you don&apos;t want to change the password
              </p>
            </div>

            {password && (
              <div>
                <Label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Confirm Password
                </Label>
                <Input
                  type="password"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  placeholder="Confirm new password"
                  disabled={isVerifying}
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  verifyModal.closeModal();
                  setPassword("");
                  setPasswordConfirmation("");
                }}
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
    </div>
  );
}
