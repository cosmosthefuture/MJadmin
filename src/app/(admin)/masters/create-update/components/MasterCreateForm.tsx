"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hook";
import { setCurrentPage } from "@/redux/features/PaginationSlice";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import {
  useCreateMasterMutation,
  useGetMasterByIdQuery,
  useUpdateMasterMutation,
} from "@/redux/features/masters/MasterApiSlice";

type MasterCreateFormT = {
  name: string;
  phone_number: string;
  username: string;
  master_code: string;
  winning_commission_percentage: number;
  password: string;
  password_confirmation: string;
};

export default function MasterCreateForm() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const searchParams = useSearchParams();
  const masterIdParam = searchParams?.get("id");
  const isEditMode = !!masterIdParam;
  const masterId = masterIdParam ? Number(masterIdParam) : null;

  const [createMaster, { isLoading: isCreating }] = useCreateMasterMutation();
  const [updateMaster, { isLoading: isUpdating }] = useUpdateMasterMutation();

  const { data: masterData, isLoading: isLoadingMaster } = useGetMasterByIdQuery(
    masterId as number,
    {
      skip: !isEditMode || !masterId,
    }
  );

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<MasterCreateFormT>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      phone_number: "",
      username: "",
      master_code: "",
      winning_commission_percentage: 1,
      password: "",
      password_confirmation: "",
    },
  });

  const isLoading = isCreating || isUpdating || isLoadingMaster;
  const passwordValue = watch("password");

  useEffect(() => {
    if (!isEditMode || !masterData) return;
    setValue("name", masterData.name || "");
    setValue("phone_number", masterData.phone_number || "");
    setValue("username", masterData.username || "");
    setValue("master_code", masterData.master_code || "");
    setValue(
      "winning_commission_percentage",
      Number(masterData.winning_commission_percentage ?? masterData.incentive_percentage ?? 0)
    );
  }, [isEditMode, masterData, setValue]);

  const onSubmit = async (data: MasterCreateFormT) => {
    try {
      if (isEditMode && masterId) {
        await updateMaster({
          id: masterId,
          name: data.name,
          phone_number: data.phone_number,
          username: data.username,
          ...(data.master_code.trim() ? { master_code: data.master_code.trim() } : {}),
          winning_commission_percentage: Number(data.winning_commission_percentage),
          ...(data.password.trim()
            ? { password: data.password, password_confirmation: data.password_confirmation }
            : {}),
        }).unwrap();
        toast.success("Master updated successfully");
      } else {
        await createMaster({
          name: data.name,
          phone_number: data.phone_number,
          username: data.username,
          ...(data.master_code.trim() ? { master_code: data.master_code.trim() } : {}),
          winning_commission_percentage: Number(data.winning_commission_percentage),
          password: data.password,
          password_confirmation: data.password_confirmation,
        }).unwrap();
        toast.success("Master created successfully");
      }

      dispatch(setCurrentPage(1));
      router.push("/masters");
    } catch (error: unknown) {
      console.error("Error:", error);
      let errorMessage = `Failed to ${isEditMode ? "update" : "create"} master`;

      if (error && typeof error === "object") {
        if ("data" in error) {
          const apiData = (
            error as { data?: { errors?: Record<string, string[]>; message?: string } }
          ).data;
          if (apiData) {
            if (apiData.errors) {
              const fieldMessages: string[] = [];

              Object.keys(apiData.errors).forEach((key) => {
                const msg = apiData.errors?.[key]?.[0];
                if (msg) {
                  setError(key as keyof MasterCreateFormT, {
                    type: "manual",
                    message: msg,
                  });
                  fieldMessages.push(msg);
                }
              });

              if (fieldMessages.length) {
                errorMessage = fieldMessages.join("\n");
              }
            }

            if (
              (!errorMessage || errorMessage.startsWith("Failed to")) &&
              typeof apiData.message === "string" &&
              apiData.message
            ) {
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

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          {isEditMode ? "Edit Master" : "Create Master"}
        </h1>
        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
          <span>Masters</span>
          <span>/</span>
          <span>{isEditMode ? "Edit Master" : "Create Master"}</span>
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
                placeholder="Enter master name"
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
                type="text"
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
                  validate: (v) => {
                    if (Number.isNaN(v)) {
                      return "Winning commission percentage is required.";
                    }
                    if (v < 1) {
                      return "Winning commission percentage must be at least 1.";
                    }
                    return true;
                  },
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
                htmlFor="master_code"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Master Code
              </label>
              <Input
                id="master_code"
                type="text"
                {...register("master_code")}
                placeholder="Enter master code"
                disabled={isLoading}
                error={!!errors.master_code}
                hint={errors.master_code?.message}
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
              onClick={() => router.push("/masters")}
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
                <span>{isEditMode ? "Update Master" : "Create Master"}</span>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
