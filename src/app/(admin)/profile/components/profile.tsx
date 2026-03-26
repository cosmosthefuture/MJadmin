"use client";
import AdminProfile from "./AdminProfile";
// import UserInfoCard from "@/components/user-profile/UserInfoCard";
// import UserAddressCard from "@/components/user-profile/UserAddressCard";
import React from "react";
import { useAppSelector } from "@/redux/hook";
import ProfessionalProfile from "./ProfessionalProfile";

export default function Profile() {
  const { authType } = useAppSelector((state) => state.auth);
  return (
    <div className="space-y-6">
      {authType === "admin" ? <AdminProfile /> : <ProfessionalProfile />}
      {/* <UserAddressCard /> */}
    </div>
  );
}
