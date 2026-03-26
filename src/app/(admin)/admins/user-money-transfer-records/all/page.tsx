import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import UserMoneyTransferRecordsTable from "./components/UserMoneyTransferRecordsTable";

export const metadata: Metadata = {
  title: "User Money Transfer Records",
  description: "user money transfer records",
};

export default function UserMoneyTransferRecordsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="User Money Transfer Records" />
      <div className="space-y-6">
        <UserMoneyTransferRecordsTable />
      </div>
    </div>
  );
}
