"use client";
import React, { useEffect, useMemo } from "react";
import { useModal } from "../../../../hooks/useModal";
import { Modal } from "../../../../components/ui/modal";
import Button from "../../../../components/ui/button/Button";
import Input from "../../../../components/form/input/InputField";
import Label from "../../../../components/form/Label";
import Image from "next/image";
import {
  useGetProfessionalProfileQuery,
  useUpdateProfessionalProfileMutation,
} from "@/redux/features/profile/ProfileApiSlice";
import { useAppDispatch } from "@/redux/hook";
import { setUserName } from "@/redux/features/AuthSlice";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import ChangePassword from "./ChangePassword";

type formTypes = {
  name: string;
  email: string;
  title: string;
  phone: string;
  office_phone: string;
  organization: string;
  website: string;
  state: string;
  address: string;
  description: string;
  note: string;
};

export default function ProfessionalProfile() {
  const { isOpen, openModal, closeModal } = useModal();
  const { data } = useGetProfessionalProfileQuery();
  const [updateProfessionalProfile, { isLoading }] = useUpdateProfessionalProfileMutation();
  const userObj = useMemo(
    () => ({
      name: data?.data?.name,
      email: data?.data?.email,
      title: data?.data?.title,
      phone: data?.data?.phone,
      office_phone: data?.data?.office_phone,
      organization: data?.data?.organization,
      website: data?.data?.website,
      state: data?.data?.state,
      address: data?.data?.address,
      description: data?.data?.description,
      note: data?.data?.note,
    }),
    [data]
  );
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<formTypes>({
    defaultValues: userObj,
  });
  const onSubmit = async (data: formTypes) => {
    try {
      const response = await updateProfessionalProfile({
        name: data.name,
        email: data.email,
        title: data.title,
        phone: data.phone,
        office_phone: data.office_phone,
        organization: data.organization,
        website: data.website,
        state: data.state,
        address: data.address,
        description: data.description,
        note: data.note,
      }).unwrap();
      if (response.message) {
        dispatch(setUserName(data.name));
        closeModal();
        toast.success("Profile updated successfully");
      }
    } catch (error) {
      const apiError = error as { data?: { errors: Record<string, string[]>; message: string } };
      if (apiError?.data?.errors) {
        const { errors, message } = apiError.data;
        Object.keys(errors).forEach((key) => {
          setError(key as keyof formTypes, {
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
  const handleSave = handleSubmit(onSubmit);

  useEffect(() => {
    dispatch(setUserName(userObj.name || ""));
    setValue("name", userObj.name || "");
    setValue("email", userObj.email || "");
    setValue("title", userObj.title || "");
    setValue("phone", userObj.phone || "");
    setValue("office_phone", userObj.office_phone || "");
    setValue("organization", userObj.organization || "");
    setValue("website", userObj.website || "");
    setValue("state", userObj.state || "");
    setValue("address", userObj.address || "");
    setValue("description", userObj.description || "");
    setValue("note", userObj.note || "");
  }, [userObj, dispatch, setValue]);
  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
          <div className="w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
            <Image width={80} height={80} src="/images/user/owner.jpg" alt="user" />
          </div>
          <div className="order-3 xl:order-2">
            <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
              {userObj.name}
            </h4>
          </div>
        </div>
        <div>
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Edit Profile
          </button>
          <ChangePassword authType="professional" />
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userObj.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Title</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userObj.title}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Phone Number
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userObj.phone}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Office Phone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userObj.office_phone}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Organization
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userObj.organization}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Website
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userObj.website}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">State</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userObj.state}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userObj.address}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Description
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {userObj.description}
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Note</p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">{userObj.note}</p>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[750px] m-4">
        <div className="no-scrollbar relative w-full max-w-[750px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14"></div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Name</Label>
                    <Input
                      type="text"
                      {...register("name", { required: "Name is required." })}
                      error={!!errors.name}
                      hint={errors.name?.message}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      {...register("email", { required: "Email is required." })}
                      error={!!errors.email}
                      hint={errors.email?.message}
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Title</Label>
                    <Input
                      type="text"
                      {...register("title", { required: "Title is required." })}
                      error={!!errors.title}
                      hint={errors.title?.message}
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Office Phone</Label>
                    <Input
                      type="text"
                      {...register("office_phone", { required: "Office Phone is required." })}
                      error={!!errors.office_phone}
                      hint={errors.office_phone?.message}
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Phone</Label>
                    <Input
                      type="text"
                      {...register("phone", { required: "Phone is required." })}
                      error={!!errors.phone}
                      hint={errors.phone?.message}
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Address</Label>
                    <Input
                      type="text"
                      {...register("address", { required: "Address is required." })}
                      error={!!errors.address}
                      hint={errors.address?.message}
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Organization</Label>
                    <Input
                      type="text"
                      {...register("organization", { required: "Organization is required." })}
                      error={!!errors.organization}
                      hint={errors.organization?.message}
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Website</Label>
                    <Input
                      type="text"
                      {...register("website", { required: "Website is required." })}
                      error={!!errors.website}
                      hint={errors.website?.message}
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>State</Label>
                    <Input
                      type="text"
                      {...register("state", { required: "State is required." })}
                      error={!!errors.state}
                      hint={errors.state?.message}
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Description</Label>
                    <Input
                      type="text"
                      {...register("description", { required: "Description is required." })}
                      error={!!errors.description}
                      hint={errors.description?.message}
                    />
                  </div>
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Note</Label>
                    <Input
                      type="text"
                      {...register("note", { required: "Note is required." })}
                      error={!!errors.note}
                      hint={errors.note?.message}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal}>
                Close
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
