import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MasterManualWithdrawTable from "./components/MasterManualWithdrawTable";

export const metadata: Metadata = {
  title: "Manual Agent Withdrawals",
  description: "manual agent withdrawals",
};

export default function MasterManualWithdrawalsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Manual Agent Withdrawals" />
      <div className="space-y-6">
        <MasterManualWithdrawTable />
      </div>
    </div>
  );
}
