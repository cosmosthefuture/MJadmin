import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import AgentWithdrawRequestTable from "./components/AgentWithdrawRequestTable";

export const metadata: Metadata = {
  title: "Agent Withdraw Requests",
  description: "agent withdraw requests",
};

export default function AgentWithdrawRequestsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Agent Withdraw Requests" />
      <div className="space-y-6">
        <AgentWithdrawRequestTable />
      </div>
    </div>
  );
}
