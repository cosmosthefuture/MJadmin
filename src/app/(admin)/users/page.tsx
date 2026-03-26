import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import UserTable from "./components/userTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Users",
  description: "users",
  // other metadata
};

export default function AdminPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Users" />
      <div className="space-y-6">
        <UserTable />
      </div>
    </div>
  );
}
