"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MultiSelect from "@/components/form/MultiSelect";
import http from "@/redux/http";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useGetPermissionsQuery,
  useSaveAdminMutation,
  useUpdateAdminMutation,
} from "@/redux/features/admin/AdminApiSlice";
import { createAdminT } from "@/types/types";

export default function AdminCreateForm() {
  const [saveAdmin, saveAdminResult] = useSaveAdminMutation();
  const [updateAdmin, updateAdminResult] = useUpdateAdminMutation();
  const isSaving = saveAdminResult.isLoading;
  const isUpdating = updateAdminResult.isLoading;

  const { data: permissionsResponse, isLoading: isPermissionsLoading } = useGetPermissionsQuery({
    page: 1,
    perPage: 100,
  });

  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);

  const searchParams = useSearchParams();
  const editId = searchParams.get("id");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<createAdminT>({
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      username: "",
      phone_number: "",
      password: "",
      password_confirmation: "",
      permission_type_ids: [],
    },
  });

  const permissionGroups = useMemo(() => permissionsResponse?.data ?? [], [permissionsResponse]);

  useEffect(() => {
    setValue("permission_type_ids", selectedPermissions);
  }, [selectedPermissions, setValue]);

  useEffect(() => {
    if (!selectedGroupIds.length) {
      setSelectedPermissions([]);
      return;
    }

    const permissionIds = selectedGroupIds.flatMap((groupId) => {
      const group = permissionGroups.find((grp) => grp.id.toString() === groupId);
      return group ? group.permission_types.map((perm) => perm.id) : [];
    });

    setSelectedPermissions(Array.from(new Set(permissionIds)));
  }, [selectedGroupIds, permissionGroups]);

  const onSubmit = async (data: createAdminT) => {
    try {
      const payload = {
        ...data,
        permission_type_ids: selectedPermissions,
      };

      if (editId) {
        await updateAdmin({ ...payload, id: editId }).unwrap();
      } else {
        await saveAdmin(payload).unwrap();
      }

      toast.success(`Admin ${editId ? "updated" : "created"} successfully`);
      router.push("/admins");
    } catch (error) {
      const apiError = error as { data?: { errors: Record<string, string[]>; message: string } };
      if (apiError?.data?.errors) {
        const { errors, message } = apiError.data;
        Object.keys(errors).forEach((key) => {
          setError(key as keyof createAdminT, {
            type: "manual",
            message: errors[key][0],
          });
        });
        toast.error(message || "An error occurred");
      } else {
        toast.error("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    if (!editId) {
      setSelectedPermissions([]);
      setSelectedGroupIds([]);
      return;
    }

    const fetchAdminData = async () => {
      try {
        const response = await http.fetchDataWithToken(`/${editId}`);
        const admin = response.data;
        setValue("name", admin.name);
        setValue("email", admin.email);
        setValue("username", admin.username);
        setValue("phone_number", admin.phone_number);
        const permissionIds =
          admin.permissions?.map(
            (permission: { permission_type_id: number }) => permission.permission_type_id
          ) ?? [];
        setSelectedPermissions(permissionIds);

        // Derive selected groups from permissions
        const derivedGroupIds = permissionGroups
          .filter((group) => group.permission_types.some((perm) => permissionIds.includes(perm.id)))
          .map((group) => group.id.toString());
        setSelectedGroupIds(derivedGroupIds);
      } catch {
        toast.error("Failed to fetch admin data");
      }
    };

    fetchAdminData();
  }, [editId, setValue, permissionGroups]);

  const permissionOptions = useMemo(
    () =>
      permissionGroups.map((group) => ({
        value: group.id.toString(),
        text: group.label || group.name,
        selected: selectedGroupIds.includes(group.id.toString()),
      })),
    [permissionGroups, selectedGroupIds]
  );

  const handleGroupSelection = (values: string[]) => {
    setSelectedGroupIds(values);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle={editId ? "Update Admin" : "Create Admin"} />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <form onSubmit={handleSubmit(onSubmit)} className="mb-6 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name</Label>
              <Input
                {...register("name", { required: "Name is required." })}
                type="text"
                error={!!errors.name}
                hint={errors.name?.message}
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                {...register("email", {
                  required: "Email is required.",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Entered value does not match email format.",
                  },
                })}
                type="email"
                error={!!errors.email}
                hint={errors.email?.message}
              />
            </div>
            <div>
              <Label>Username</Label>
              <Input
                {...register("username", { required: "Username is required." })}
                type="text"
                error={!!errors.username}
                hint={errors.username?.message}
              />
            </div>
            <div>
              <Label>Phone Number</Label>
              <Input
                {...register("phone_number", { required: "Phone number is required." })}
                type="tel"
                error={!!errors.phone_number}
                hint={errors.phone_number?.message}
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                {...register("password", { required: editId ? false : "Password is required." })}
                type="password"
                error={!!errors.password}
                hint={errors.password?.message}
              />
            </div>
            <div>
              <Label>Confirm Password</Label>
              <Input
                {...register("password_confirmation", {
                  required: editId ? false : "Password confirmation is required.",
                })}
                type="password"
                error={!!errors.password_confirmation}
                hint={errors.password_confirmation?.message}
              />
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xl font-semibold">Permissions</p>
              {isPermissionsLoading && (
                <span className="text-sm text-gray-500">Loading permissions...</span>
              )}
            </div>
            <div className="mt-4">
              <MultiSelect
                label="Permission Groups"
                options={permissionOptions}
                selectedValues={selectedGroupIds}
                onChange={handleGroupSelection}
                disabled={isPermissionsLoading || permissionOptions.length === 0}
              />
              {!isPermissionsLoading && permissionOptions.length === 0 && (
                <p className="text-sm text-gray-500 mt-2">No permission groups available.</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                Selecting a group automatically includes all of its underlying permissions.
              </p>
            </div>

            {errors.permission_type_ids && (
              <p className="text-sm text-red-500 mt-1">{errors.permission_type_ids.message}</p>
            )}
          </div>

          <Button type="submit" className="mt-8" disabled={isSaving || isUpdating}>
            {isSaving || isUpdating ? "Submitting..." : editId ? "Update Admin" : "Create Admin"}
          </Button>
        </form>
      </div>
    </div>
  );
}
