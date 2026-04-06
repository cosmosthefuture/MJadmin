import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MasterUserManualWithdrawTable from "./components/MasterUserManualWithdrawTable";

export const metadata: Metadata = {
  title: "Manual User Withdrawals",
  description: "manual user withdrawals",
};

export default function MasterUserManualWithdrawalsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Manual User Withdrawals" />
      <div className="space-y-6">
        <MasterUserManualWithdrawTable />
      </div>
    </div>
  );
}
