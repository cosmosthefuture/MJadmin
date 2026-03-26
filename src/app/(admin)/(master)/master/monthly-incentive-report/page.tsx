import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import MasterMonthlyIncentiveReportTable from "./components/MasterMonthlyIncentiveReportTable";

export const metadata: Metadata = {
  title: "Master Monthly Incentive Report",
  description: "master monthly incentive report",
};

export default function MasterMonthlyIncentiveReportPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Master Monthly Incentive Report" />
      <div className="space-y-6">
        <MasterMonthlyIncentiveReportTable />
      </div>
    </div>
  );
}
