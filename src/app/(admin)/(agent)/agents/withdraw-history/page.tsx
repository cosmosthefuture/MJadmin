import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import AgentWithdrawHistoryTable from "./components/AgentWithdrawHistoryTable";

export const metadata: Metadata = {
  title: "Withdraw Histories",
  description: "agent withdraw histories",
};

export default function AgentWithdrawHistoryPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Withdraw Histories" />
      <div className="space-y-6">
        <AgentWithdrawHistoryTable />
      </div>
    </div>
  );
}
