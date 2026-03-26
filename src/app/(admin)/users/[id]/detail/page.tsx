import { Metadata } from "next";
import React from "react";
import UserDetailPage from "./../../components/UserDetail";
const UserDetail = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  console.log(id);
  return <UserDetailPage id={id} />;
};

export const metadata: Metadata = {
  title: "User Detail",
  description: "",
};

export default UserDetail;
