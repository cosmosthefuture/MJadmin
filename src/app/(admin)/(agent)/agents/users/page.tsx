import { Metadata } from "next";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import AgentUsersTable from "./components/AgentUsersTable";

export const metadata: Metadata = {
  title: "Agent Users",
  description: "agent users",
};

export default function AgentUsersPage() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Users" />
      <div className="space-y-6">
        <AgentUsersTable />
      </div>
    </div>
  );
}
