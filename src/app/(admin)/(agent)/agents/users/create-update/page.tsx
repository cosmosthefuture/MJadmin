import { Metadata } from "next";
import AgentUserCreateForm from "./components/AgentUserCreateForm";

export const metadata: Metadata = {
  title: "Agent User Create Update",
  description: "agent user create update",
};

export default function AgentUserCreateUpdatePage() {
  return <AgentUserCreateForm />;
}
