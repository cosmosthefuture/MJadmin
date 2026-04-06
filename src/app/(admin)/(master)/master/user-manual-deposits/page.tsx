import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MasterUserManualDepositTable from "./components/MasterUserManualDepositTable";

export const metadata: Metadata = {
  title: "Manual User Deposits",
  description: "manual user deposits",
};

export default function MasterUserManualDepositsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Manual User Deposits" />
      <div className="space-y-6">
        <MasterUserManualDepositTable />
      </div>
    </div>
  );
}
