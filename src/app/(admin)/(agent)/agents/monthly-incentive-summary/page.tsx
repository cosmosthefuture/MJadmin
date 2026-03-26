import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import AgentMonthlyIncentiveSummaryTable from "./components/AgentMonthlyIncentiveSummaryTable";

export const metadata: Metadata = {
  title: "Monthly Incentive Summary",
  description: "agent monthly incentive summary",
};

export default function AgentMonthlyIncentiveSummaryPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Monthly Incentive Summary" />
      <div className="space-y-6">
        <AgentMonthlyIncentiveSummaryTable />
      </div>
    </div>
  );
}
