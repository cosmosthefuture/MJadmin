import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import MasterDailyWalletSummaryTable from "./components/MasterDailyWalletSummaryTable";

export const metadata: Metadata = {
  title: "Master Daily Wallet Summary",
  description: "master daily wallet summary",
};

export default function MasterDailyWalletSummaryPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Daily Wallet Summary" />
      <div className="space-y-6">
        <MasterDailyWalletSummaryTable />
      </div>
    </div>
  );
}
