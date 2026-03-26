import React, { useState } from "react";
import { useModal } from "../../../../hooks/useModal";
import { Modal } from "@/components/ui/modal";
import Button from "../../../../components/ui/button/Button";
import Input from "../../../../components/form/input/InputField";
import Label from "../../../../components/form/Label";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  useChangeAdminPasswordMutation,
  useChangeProfessionalPasswordMutation,
} from "../../../../redux/features/profile/ProfileApiSlice";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { KeyRound } from "lucide-react";
type formTypes = {
  new_password: string;
  new_password_confirmation: string;
};

export default function ChangePassword({ authType }: { authType: "admin" | "professional" }) {
  const { isOpen, openModal, closeModal } = useModal();
  const [changeAdminPassword, { isLoading: adminLoading }] = useChangeAdminPasswordMutation();
  const [changeProfessionalPassword, { isLoading: professionalLoading }] =
    useChangeProfessionalPasswordMutation();
  //   loading
  const isLoading = adminLoading || professionalLoading;
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<formTypes>({
    defaultValues: {
      new_password: "",
      new_password_confirmation: "",
    },
  });
  const onSubmit = async (data: formTypes) => {
    try {
      const response = await (
        authType === "admin" ? changeAdminPassword : changeProfessionalPassword
      )({
        new_password: data.new_password,
        new_password_confirmation: data.new_password_confirmation,
      }).unwrap();
      if (response.message) {
        closeModal();
        toast.success("Password changed successfully");
        reset();
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

  return (
    <>
      <button
        onClick={openModal}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
      >
        <KeyRound size={15} />
        Change Password
      </button>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[500px] m-4">
        <div className="no-scrollbar relative w-full max-w-[500px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14"></div>
          <form className="flex flex-col">
            <div className="custom-scrollbar h-[300px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Change Password
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-2">
                    <div>
                      <Label>
                        Password <span className="text-error-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          {...register("new_password", {
                            required: "New Password is required.",
                            minLength: {
                              value: 8,
                              message: "New Password must be at least 8 characters long.",
                            },
                          })}
                          error={!!errors.new_password}
                          hint={errors.new_password?.message}
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                          {showPassword ? (
                            <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                          ) : (
                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 lg:col-span-2">
                    <div>
                      <Label>
                        Confirm Password <span className="text-error-500">*</span>
                      </Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter confirm password"
                          {...register("new_password_confirmation", {
                            required: "Confirm Password is required.",
                            minLength: {
                              value: 8,
                              message: "Confirm Password must be at least 8 characters long.",
                            },
                          })}
                          error={!!errors.new_password_confirmation}
                          hint={errors.new_password_confirmation?.message}
                        />
                        <span
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                        >
                          {showPassword ? (
                            <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                          ) : (
                            <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                          )}
                        </span>
                      </div>
                    </div>
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
    </>
  );
}
