import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import MasterDailyCashbookRecordsTable from "./components/MasterDailyCashbookRecordsTable";

export const metadata: Metadata = {
  title: "Master Daily Cashbook Records",
  description: "master daily cashbook records",
};

export default function MasterDailyCashbookRecordsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Daily Cashbook Records" />
      <div className="space-y-6">
        <MasterDailyCashbookRecordsTable />
      </div>
    </div>
  );
}
