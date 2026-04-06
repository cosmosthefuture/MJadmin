import { Metadata } from "next";
import MasterUserDetailPage from "../../components/MasterUserDetail";

const MasterUserDetail = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  return <MasterUserDetailPage id={id} />;
};

export const metadata: Metadata = {
  title: "Master User Detail",
  description: "master user detail",
};

export default MasterUserDetail;
