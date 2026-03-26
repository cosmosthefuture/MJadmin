import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import AgentDailyWalletSummaryTable from "./components/AgentDailyWalletSummaryTable";

export const metadata: Metadata = {
  title: "Daily Wallet Summary",
  description: "agent daily wallet summary",
};

export default function AgentDailyWalletSummaryPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Daily Wallet Summary" />
      <div className="space-y-6">
        <AgentDailyWalletSummaryTable />
      </div>
    </div>
  );
}
