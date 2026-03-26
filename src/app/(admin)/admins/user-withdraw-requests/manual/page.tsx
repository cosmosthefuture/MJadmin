import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ManualWithdrawTable from "./components/ManualWithdrawTable";

export default function AdminUserManualWithdrawsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="User Manual Withdraw Requests" />
      <div className="space-y-6">
        <ManualWithdrawTable />
      </div>
    </div>
  );
}
