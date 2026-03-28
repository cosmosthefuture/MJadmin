import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AgentWalletRecordsTable from "./components/AgentWalletRecordsTable";

export const metadata: Metadata = {
  title: "Agent Wallet Records",
  description: "agent wallet records",
};

export default function AgentWalletRecordsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Wallet Records" />
      <div className="space-y-6">
        <AgentWalletRecordsTable />
      </div>
    </div>
  );
}
