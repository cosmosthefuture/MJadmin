import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MasterUsersTable from "./components/MasterUsersTable";

export const metadata: Metadata = {
  title: "Master Users",
  description: "master users",
};

export default function MasterUsersPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Users" />
      <div className="space-y-6">
        <MasterUsersTable />
      </div>
    </div>
  );
}
