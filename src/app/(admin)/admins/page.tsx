import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AdminTable from "./components/adminTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin",
  description: "admin",
  // other metadata
};

export default function AdminPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Admins" />
      <div className="space-y-6">
        <AdminTable />
      </div>
    </div>
  );
}
