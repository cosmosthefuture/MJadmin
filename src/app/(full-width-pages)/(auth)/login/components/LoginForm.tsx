"use client";

import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/redux/hook";
import { setToken, setUserData } from "@/redux/features/AuthSlice";
import http from "@/redux/http";
import { fcmService } from "@/services/fcmService";

type AuthMode = "admin" | "master" | "agent";

type LoginFormValues = {
  phone_number: string;
  password: string;
};
type Errors = {
  phone_number?: string[];
  password?: string[];
};

const getRedirectPathByMode = (mode: AuthMode) => {
  if (mode === "master") {
    return "/master";
  }

  if (mode === "agent") {
    return "/agents";
  }

  return "/";
};

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AuthMode>("admin");
  const dispatch = useAppDispatch();
  const router = useRouter();
  const {
    register,
    setError,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ mode: "onTouched" });

  React.useEffect(() => {
    const getToken = async () => {
      console.log("Login: Attempting to get FCM token...");
      const fcmToken = await fcmService.initializeToken();
      console.log("Login: FCM token result:", fcmToken);
    };

    getToken();
  }, []);

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setLoading(true);

    try {
      console.log("Login: Attempting to get FCM token...");
      const fcmToken = await fcmService.initializeToken();
      console.log("Login: FCM token result:", fcmToken);

      const loginFn =
        mode === "admin" ? http.adminLogin : mode === "master" ? http.masterLogin : http.agentLogin;

      const response = await loginFn({
        phone_number: data.phone_number,
        password: data.password,
        ...(fcmToken ? { fcm_token: fcmToken } : {}),
      });

      if (response.status === 422 && response.data.errors) {
        const apiErrors: Errors = response.data.errors;
        (Object.keys(apiErrors) as Array<keyof Errors>).forEach((key) => {
          const message = apiErrors[key]?.[0];
          if (message) {
            setError(key, { type: "manual", message });
          }
        });
      } else if (response.status === 200) {
        const accessToken = response.data.data.accessToken;
        const permissionList = response.data.data.permission_list;
        const permissions = Array.isArray(permissionList)
          ? permissionList.map(
              (p: { permission_type_id: number; permission_type_name: string }) =>
                p.permission_type_name
            )
          : [];

        dispatch(setToken(accessToken));
        dispatch(
          setUserData({
            id: response.data.data.user.id.toString(),
            name: response.data.data.user.name,
            email: response.data.data.user.email,
            role: response.data.data.user.username,
            permissions,
            authType: mode,
          })
        );

        toast.success(`${mode.charAt(0).toUpperCase() + mode.slice(1)} login successful!`, {
          description: "Welcome back!",
        });
        router.push(getRedirectPathByMode(mode));
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed.", {
        description: "Please check your credentials and try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center  flex-1 w-full max-w-md mx-auto ">
        <div className="rounded-sm px-12 py-10 w-full border border-stroke bg-white/80 dark:bg-black/60 backdrop-blur-sm shadow-2xl dark:border-strokedark">
          <div className=" mb-2 text-center sm:mb-0">
            <Link href="/login" className="mb-5 inline-block">
              <Image src="/images/logo/logo-icon.svg" alt="Logo" width={48} height={48} />
            </Link>
            <div className="flex items-center justify-center gap-3">
              <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                {mode === "admin" ? "Admin" : mode === "master" ? "Master" : "Agent"} Login
              </h1>
            </div>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-6">
                <div>
                  <Label>Phone Number *</Label>
                  <Input
                    placeholder="e.g. 09123456789"
                    type="text"
                    {...register("phone_number", {
                      required: "Phone number is required.",
                    })}
                    error={!!errors.phone_number}
                    hint={errors.phone_number?.message}
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...register("password", {
                        required: "Password is required.",
                        minLength: {
                          value: 8,
                          message: "Password must be at least 8 characters long.",
                        },
                      })}
                      error={!!errors.password}
                      hint={errors.password?.message}
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
                <div>
                  <Button className="w-full" size="sm" disabled={loading} type="submit">
                    {loading ? "Logging In..." : "Log In"}
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  {/* <div className="flex items-center gap-3"></div> */}
                  <button
                    type="button"
                    onClick={() => setMode("admin")}
                    className={`text-sm ${
                      mode === "admin"
                        ? "text-brand-500 font-medium border-b-2 border-brand-500 pb-1"
                        : "text-gray-500 hover:text-brand-500 dark:text-gray-400"
                    } transition-colors`}
                  >
                    Admin Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("master")}
                    className={`text-sm ${
                      mode === "master"
                        ? "text-brand-500 font-medium border-b-2 border-brand-500 pb-1"
                        : "text-gray-500 hover:text-brand-500 dark:text-gray-400"
                    } transition-colors`}
                  >
                    Master Login
                  </button>
                  <button
                    type="button"
                    onClick={() => setMode("agent")}
                    className={`text-sm ${
                      mode === "agent"
                        ? "text-brand-500 font-medium border-b-2 border-brand-500 pb-1"
                        : "text-gray-500 hover:text-brand-500 dark:text-gray-400"
                    } transition-colors`}
                  >
                    Agent Login
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
