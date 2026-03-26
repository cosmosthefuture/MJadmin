import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import MasterTable from "./components/masterTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masters",
  description: "masters",
};

export default function MastersPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Masters" />
      <div className="space-y-6">
        <MasterTable />
      </div>
    </div>
  );
}
