import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ManualDepositTable from "./components/ManualDepositTable";

export default function AdminUserManualDepositsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="User Manual Deposit Requests" />
      <div className="space-y-6">
        <ManualDepositTable />
      </div>
    </div>
  );
}
