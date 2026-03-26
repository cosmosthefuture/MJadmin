import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import AdminMasterWithdrawTable from "./components/AdminMasterWithdrawTable";

export const metadata: Metadata = {
  title: "Admin Master Withdraw Requests",
  description: "admin master withdraw requests",
};

export default function AdminMasterWithdrawRequestsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Master Withdraw Requests" />
      <div className="space-y-6">
        <AdminMasterWithdrawTable />
      </div>
    </div>
  );
}
