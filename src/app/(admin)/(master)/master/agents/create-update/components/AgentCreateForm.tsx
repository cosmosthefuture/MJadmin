"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import { useAppSelector } from "@/redux/hook";
import {
  useCreateAgentMutation,
  useGetAgentByIdQuery,
  useUpdateAgentMutation,
} from "@/redux/features/agents/MasterAgentApiSlice";

type AgentCreateFormT = {
  name: string;
  phone_number: string;
  username: string;
  winning_commission_percentage: number;
  agent_code: string;
  password: string;
  password_confirmation: string;
};

export default function AgentCreateForm() {
  const router = useRouter();
  const authType = useAppSelector((state) => state.auth.authType);

  useEffect(() => {
    if (authType && authType !== "master") {
      router.replace("/login");
    }
  }, [authType, router]);

  const searchParams = useSearchParams();
  const agentIdParam = searchParams?.get("id");
  const isEditMode = !!agentIdParam;
  const agentId = agentIdParam ? Number(agentIdParam) : null;

  const [createAgent, { isLoading: isCreating }] = useCreateAgentMutation();
  const [updateAgent, { isLoading: isUpdating }] = useUpdateAgentMutation();

  const { data: agentData, isLoading: isLoadingAgent } = useGetAgentByIdQuery(agentId as number, {
    skip: !isEditMode || !agentId,
  });

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AgentCreateFormT>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      phone_number: "",
      username: "",
      winning_commission_percentage: 1,
      agent_code: "",
      password: "",
      password_confirmation: "",
    },
  });

  const isLoading = isCreating || isUpdating || isLoadingAgent;
  const passwordValue = watch("password");

  useEffect(() => {
    if (!isEditMode || !agentData) return;
    setValue("name", agentData.name || "");
    setValue("phone_number", agentData.phone_number || "");
    setValue("username", agentData.username || "");
    setValue("agent_code", agentData.agent_code || "");
    setValue(
      "winning_commission_percentage",
      Number(agentData.winning_commission_percentage ?? agentData.incentive_percentage ?? 0)
    );
  }, [isEditMode, agentData, setValue]);

  const onSubmit = async (data: AgentCreateFormT) => {
    try {
      if (isEditMode && agentId) {
        await updateAgent({
          id: agentId,
          name: data.name,
          phone_number: data.phone_number,
          username: data.username,
          agent_code: data.agent_code,
          winning_commission_percentage: Number(data.winning_commission_percentage),
        }).unwrap();
        toast.success("Agent updated successfully");
      } else {
        await createAgent({
          name: data.name,
          phone_number: data.phone_number,
          username: data.username,
          agent_code: data.agent_code,
          winning_commission_percentage: Number(data.winning_commission_percentage),
          password: data.password,
          password_confirmation: data.password_confirmation,
        }).unwrap();
        toast.success("Agent created successfully");
      }
      router.push("/master/agents");
    } catch (error: unknown) {
      console.error("Error:", error);
      let errorMessage = `Failed to ${isEditMode ? "update" : "create"} agent`;

      if (error && typeof error === "object") {
        if ("data" in error) {
          const apiData = (
            error as { data?: { errors?: Record<string, string[]>; message?: string } }
          ).data;
          if (apiData?.errors) {
            Object.keys(apiData.errors).forEach((key) => {
              const msg = apiData.errors?.[key]?.[0];
              if (msg) {
                setError(key as keyof AgentCreateFormT, {
                  type: "manual",
                  message: msg,
                });
              }
            });
          }
          if (typeof apiData?.message === "string") {
            errorMessage = apiData.message || errorMessage;
          }
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

  if (authType !== "master") {
    return null;
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {isEditMode ? "Edit Agent" : "Create Agent"}
        </h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
          <span>Agents</span>
          <span>/</span>
          <span>{isEditMode ? "Edit Agent" : "Create Agent"}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                type="text"
                {...register("name", { required: "Name is required." })}
                placeholder="Enter agent name"
                required
                disabled={isLoading}
                error={!!errors.name}
                hint={errors.name?.message}
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
                type="text"
                {...register("username", { required: "Username is required." })}
                placeholder="Enter username"
                required
                disabled={isLoading}
                error={!!errors.username}
                hint={errors.username?.message}
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
                type="tel"
                {...register("phone_number", { required: "Phone number is required." })}
                placeholder="Enter phone number"
                required
                disabled={isLoading}
                error={!!errors.phone_number}
                hint={errors.phone_number?.message}
              />
            </div>

            <div>
              <label
                htmlFor="agent_code"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Agent Code *
              </label>
              <Input
                id="agent_code"
                type="text"
                {...register("agent_code", { required: "Agent code is required." })}
                placeholder="Enter agent code"
                required
                disabled={isLoading}
                error={!!errors.agent_code}
                hint={errors.agent_code?.message}
              />
            </div>

            <div>
              <label
                htmlFor="winning_commission_percentage"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Winning Commission Percentage *
              </label>
              <Input
                id="winning_commission_percentage"
                type="number"
                {...register("winning_commission_percentage", {
                  required: "Winning commission percentage is required.",
                  valueAsNumber: true,
                })}
                placeholder="Enter winning commission percentage"
                required
                disabled={isLoading}
                error={!!errors.winning_commission_percentage}
                hint={errors.winning_commission_percentage?.message}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password{isEditMode ? "" : " *"}
              </label>
              <Input
                id="password"
                type="password"
                {...register("password", {
                  required: isEditMode ? false : "Password is required.",
                  validate: (v) =>
                    isEditMode && !v
                      ? true
                      : v.length >= 6 || "Password must be at least 6 characters",
                })}
                placeholder="Enter password"
                required={!isEditMode}
                disabled={isLoading}
                error={!!errors.password}
                hint={errors.password?.message}
              />
            </div>

            <div>
              <label
                htmlFor="password_confirmation"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Password Confirmation{isEditMode ? "" : " *"}
              </label>
              <Input
                id="password_confirmation"
                type="password"
                {...register("password_confirmation", {
                  required: isEditMode ? false : "Password confirmation is required.",
                  validate: (v) =>
                    isEditMode && !passwordValue
                      ? true
                      : v === passwordValue || "Passwords do not match",
                })}
                placeholder="Confirm password"
                required={!isEditMode}
                disabled={isLoading}
                error={!!errors.password_confirmation}
                hint={errors.password_confirmation?.message}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/agents")}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={isLoading} className="min-w-[120px]">
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                <span>{isEditMode ? "Update Agent" : "Create Agent"}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
