import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import MasterWithdrawHistoryTable from "./components/MasterWithdrawHistoryTable";

export const metadata: Metadata = {
  title: "Master Withdraw History",
  description: "master withdraw history",
};

export default function MasterWithdrawHistoryPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Withdraw History" />
      <div className="space-y-6">
        <MasterWithdrawHistoryTable />
      </div>
    </div>
  );
}
