import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import AgentDailyCashbookRecordsTable from "./components/AgentDailyCashbookRecordsTable";

export const metadata: Metadata = {
  title: "Agent Daily Cashbook Records",
  description: "agent daily cashbook records",
};

export default function AgentDailyCashbookRecordsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Daily Cashbook Records" />
      <div className="space-y-6">
        <AgentDailyCashbookRecordsTable />
      </div>
    </div>
  );
}
