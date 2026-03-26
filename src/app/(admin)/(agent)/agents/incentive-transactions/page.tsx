import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import AgentIncentiveTransactionTable from "./components/AgentIncentiveTransactionTable";

export const metadata: Metadata = {
  title: "Reports",
  description: "agent incentive transactions",
};

export default function AgentIncentiveTransactionsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Reports" />
      <div className="space-y-6">
        <AgentIncentiveTransactionTable />
      </div>
    </div>
  );
}
