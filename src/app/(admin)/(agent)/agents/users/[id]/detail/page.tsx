import { Metadata } from "next";
import AgentUserDetailPage from "../../components/AgentUserDetail";

const AgentUserDetail = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <AgentUserDetailPage id={id} />;
};

export const metadata: Metadata = {
  title: "Agent User Detail",
  description: "agent user detail",
};

export default AgentUserDetail;
