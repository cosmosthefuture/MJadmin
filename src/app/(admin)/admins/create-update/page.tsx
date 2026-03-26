import { Metadata } from "next";
import React from "react";
import AdminCreateForm from "./components/AdminCreateForm";

export const metadata: Metadata = {
  title: " Admin",
  description: "",
};

export default function AdminCreatePage() {
  return (
    <>
      <AdminCreateForm />
    </>
  );
}
