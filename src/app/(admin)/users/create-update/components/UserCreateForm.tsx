"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hook";
import { setCurrentPage } from "@/redux/features/PaginationSlice";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
  useGetUserByIdQuery,
} from "@/redux/features/user/UserApiSlice";
import { useGetAdminAgentsQuery } from "@/redux/features/admin/AdminAgentsApiSlice";

type UserFormData = {
  name: string;
  phone_number: string;
  username: string;
  agent_code?: string | "";
};

export default function UserCreateForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    phone_number: "",
    username: "",
    agent_code: "",
  });

  // API mutations
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  // Check if we're in edit mode
  const userId = searchParams?.get("id");
  const isEditMode = !!userId;

  // Load user data for edit mode
  const { data: userData, isLoading: isLoadingUser } = useGetUserByIdQuery(Number(userId), {
    skip: !isEditMode,
  });

  // Load active agents for select options
  const { data: agentsData } = useGetAdminAgentsQuery({
    page: 1,
    perPage: 100,
    search: "active",
  });

  // Pre-fill form data when in edit mode
  useEffect(() => {
    if (isEditMode && userData) {
      setFormData({
        name: userData.name || "",
        phone_number: userData.phone_number || "",
        username: userData.username || "",
        // agent_code comes from agents list; keep empty here
        agent_code: "",
      });
    }
  }, [isEditMode, userData]);

  // Auto-select first agent for new user when agents are loaded
  useEffect(() => {
    if (!isEditMode && agentsData?.data?.length && !formData.agent_code) {
      setFormData((prev) => ({
        ...prev,
        agent_code: agentsData.data[0].agent_code || "",
      }));
    }
  }, [isEditMode, agentsData, formData.agent_code]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { agent_code, ...rest } = formData;
      const payload = {
        ...rest,
        ...(agent_code ? { agent_code } : {}),
      };

      if (isEditMode && userId) {
        await updateUser({ id: Number(userId), ...payload }).unwrap();
        toast.success("User updated successfully");
      } else {
        await createUser(payload).unwrap();
        toast.success("User created successfully");
      }

      // Reset pagination and navigate back to users list
      dispatch(setCurrentPage(1));
      router.push("/users");
    } catch (error: unknown) {
      console.error("Error:", error);
      let errorMessage = `Failed to ${isEditMode ? "update" : "create"} user`;

      if (error && typeof error === "object") {
        const apiData = (
          error as {
            data?: { message?: string; errors?: Record<string, string[]> };
            message?: string;
          }
        ).data;

        if (apiData) {
          // Prefer field-level validation messages if present
          if (apiData.errors && typeof apiData.errors === "object") {
            const fieldMessages: string[] = [];

            Object.values(apiData.errors).forEach((msgs) => {
              if (Array.isArray(msgs) && msgs[0]) {
                fieldMessages.push(msgs[0]);
              }
            });

            if (fieldMessages.length) {
              errorMessage = fieldMessages.join("\n");
            }
          }

          if (!errorMessage || errorMessage.startsWith("Failed to")) {
            if (typeof apiData.message === "string" && apiData.message) {
              errorMessage = apiData.message;
            }
          }
        } else if (
          "message" in (error as { message?: string }) &&
          typeof (error as { message?: string }).message === "string"
        ) {
          errorMessage = (error as { message?: string }).message || errorMessage;
        }
      }

      toast.error(errorMessage);
    }
  };

  const isLoading = isCreating || isUpdating || isLoadingUser;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {isEditMode ? "Edit User" : "Create User"}
        </h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
          <span>Users</span>
          <span>/</span>
          <span>{isEditMode ? "Edit User" : "Create User"}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Name *
              </label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter user name"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Username *
              </label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="phone_number"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Phone Number *
              </label>
              <Input
                id="phone_number"
                name="phone_number"
                type="text"
                value={formData.phone_number}
                onChange={handleInputChange}
                placeholder="Enter phone number"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="agent_code"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Agent (optional)
              </label>
              <select
                id="agent_code"
                name="agent_code"
                className="block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                value={formData.agent_code ?? ""}
                onChange={handleInputChange}
                disabled={isLoading}
              >
                <option value="">Select agent (optional)</option>
                {agentsData?.data?.map((agent) => (
                  <option key={agent.id} value={agent.agent_code}>
                    {agent.name} ({agent.agent_code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/users")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading} className="min-w-[120px]">
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {isEditMode ? "Updating..." : "Creating..."}
                </span>
              ) : (
                <span>{isEditMode ? "Update User" : "Create User"}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
