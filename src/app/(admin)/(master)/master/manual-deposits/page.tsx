import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MasterManualDepositTable from "./components/MasterManualDepositTable";

export const metadata: Metadata = {
  title: "Master Manual Deposits",
  description: "master manual deposits",
};

export default function MasterManualDepositsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Manual Deposits" />
      <div className="space-y-6">
        <MasterManualDepositTable />
      </div>
    </div>
  );
}
