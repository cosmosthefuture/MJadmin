import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MasterManualWithdrawTable from "./components/MasterManualWithdrawTable";

export const metadata: Metadata = {
  title: "Master Manual Withdrawals",
  description: "master manual withdrawals",
};

export default function MasterManualWithdrawalsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Manual Withdrawals" />
      <div className="space-y-6">
        <MasterManualWithdrawTable />
      </div>
    </div>
  );
}
