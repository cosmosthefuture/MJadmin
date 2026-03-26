import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import GlobalCommissionSettingsTable from "./components/GlobalCommissionSettingsTable";

export const metadata: Metadata = {
  title: "Global Commission Settings",
  description: "Admin global commission settings",
};

export default function GlobalCommissionSettingsPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Global Commission Settings" />
      <div className="space-y-6">
        <GlobalCommissionSettingsTable />
      </div>
    </div>
  );
}
