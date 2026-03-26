import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AgentTable from "./components/agentTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Agents",
  description: "agents",
};

export default function AgentsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Agents" />
      <div className="space-y-6">
        <AgentTable />
      </div>
    </div>
  );
}
