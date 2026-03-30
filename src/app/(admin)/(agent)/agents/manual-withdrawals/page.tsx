import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AgentManualWithdrawTable from "./components/AgentManualWithdrawTable";

export const metadata: Metadata = {
  title: "Agent Manual Withdrawals",
  description: "agent manual withdrawals",
};

export default function AgentManualWithdrawalsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Manual Withdrawals" />
      <div className="space-y-6">
        <AgentManualWithdrawTable />
      </div>
    </div>
  );
}
