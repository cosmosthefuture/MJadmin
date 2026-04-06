import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MasterManualDepositTable from "./components/MasterManualDepositTable";

export const metadata: Metadata = {
  title: "Manual Agent Deposits",
  description: "manual agent deposits",
};

export default function MasterManualDepositsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Manual Agent Deposits" />
      <div className="space-y-6">
        <MasterManualDepositTable />
      </div>
    </div>
  );
}
