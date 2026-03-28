import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MasterWalletRecordsTable from "./components/MasterWalletRecordsTable";

export const metadata: Metadata = {
  title: "Master Wallet Records",
  description: "master wallet records",
};

export default function MasterWalletRecordsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Wallet Records" />
      <div className="space-y-6">
        <MasterWalletRecordsTable />
      </div>
    </div>
  );
}
