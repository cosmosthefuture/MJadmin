import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AdminAgentsTable from "./components/AdminAgentsTable";

export default function AdminAgentsAllPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Agent Lists" />
      <div className="space-y-6">
        <AdminAgentsTable />
      </div>
    </div>
  );
}
