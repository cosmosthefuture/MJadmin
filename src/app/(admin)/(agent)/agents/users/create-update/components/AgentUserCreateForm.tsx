"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import {
  useCreateAgentUserMutation,
  useGetAgentUserByIdQuery,
  useUpdateAgentUserMutation,
} from "@/redux/features/agents/AgentUserApiSlice";
import { useAppSelector } from "@/redux/hook";

type UserFormData = {
  name: string;
  email: string;
  phone_number: string;
  username: string;
};

export default function AgentUserCreateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const authType = useAppSelector((state) => state.auth.authType);
  const [formData, setFormData] = useState<UserFormData>({
    name: "",
    email: "",
    phone_number: "",
    username: "",
  });

  const [createAgentUser, { isLoading: isCreating }] = useCreateAgentUserMutation();
  const [updateAgentUser, { isLoading: isUpdating }] = useUpdateAgentUserMutation();

  const userId = searchParams?.get("id");
  const isEditMode = !!userId;

  const { data: userData, isLoading: isLoadingUser } = useGetAgentUserByIdQuery(Number(userId), {
    skip: !isEditMode,
  });

  useEffect(() => {
    if (authType && authType !== "agent") {
      router.replace("/login");
    }
  }, [authType, router]);

  useEffect(() => {
    if (isEditMode && userData) {
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        phone_number: userData.phone_number || "",
        username: userData.username || "",
      });
    }
  }, [isEditMode, userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        phone_number: formData.phone_number,
        username: formData.username,
        ...(formData.email.trim() ? { email: formData.email.trim() } : {}),
      };

      if (isEditMode && userId) {
        await updateAgentUser({ id: Number(userId), ...payload }).unwrap();
        toast.success("User updated successfully");
      } else {
        await createAgentUser(payload).unwrap();
        toast.success("User created successfully");
      }

      router.push("/agents/users");
    } catch (error: unknown) {
      let errorMessage = `Failed to ${isEditMode ? "update" : "create"} user`;
      if (error && typeof error === "object") {
        const apiData = (
          error as {
            data?: { message?: string; errors?: Record<string, string[]>; response?: { message?: string } };
            message?: string;
          }
        ).data;

        if (apiData?.errors) {
          const fieldMessages: string[] = [];
          Object.values(apiData.errors).forEach((msgs) => {
            if (Array.isArray(msgs) && msgs[0]) fieldMessages.push(msgs[0]);
          });
          if (fieldMessages.length) errorMessage = fieldMessages.join("\n");
        } else if (apiData?.message || apiData?.response?.message) {
          errorMessage = apiData.message || apiData.response?.message || errorMessage;
        } else if ("message" in error && typeof (error as { message?: string }).message === "string") {
          errorMessage = (error as { message?: string }).message || errorMessage;
        }
      }
      toast.error(errorMessage);
    }
  };

  if (authType !== "agent") return null;

  const isLoading = isCreating || isUpdating || isLoadingUser;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {isEditMode ? "Edit User" : "Create User"}
        </h1>
        <div className="mt-2 flex items-center space-x-2 text-sm text-gray-500">
          <span>Users</span>
          <span>/</span>
          <span>{isEditMode ? "Edit User" : "Create User"}</span>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Name *
              </label>
              <Input id="name" name="name" type="text" value={formData.name} onChange={handleInputChange} placeholder="Enter user name" required disabled={isLoading} />
            </div>
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username *
              </label>
              <Input id="username" name="username" type="text" value={formData.username} onChange={handleInputChange} placeholder="Enter username" required disabled={isLoading} />
            </div>
            <div>
              <label htmlFor="phone_number" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Phone Number *
              </label>
              <Input id="phone_number" name="phone_number" type="text" value={formData.phone_number} onChange={handleInputChange} placeholder="Enter phone number" required disabled={isLoading} />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Enter email" disabled={isLoading} />
            </div>
          </div>

          <div className="flex justify-end space-x-4 border-t border-gray-200 pt-6 dark:border-gray-700">
            <Button type="button" variant="outline" onClick={() => router.push("/agents/users")} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading} className="min-w-[120px]">
              {isLoading ? (isEditMode ? "Updating..." : "Creating...") : isEditMode ? "Update User" : "Create User"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
