import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AgentManualDepositTable from "./components/AgentManualDepositTable";

export const metadata: Metadata = {
  title: "Agent Manual Deposits",
  description: "agent manual deposits",
};

export default function AgentManualDepositsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Manual Deposits" />
      <div className="space-y-6">
        <AgentManualDepositTable />
      </div>
    </div>
  );
}
