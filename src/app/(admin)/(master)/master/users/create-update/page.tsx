import { Metadata } from "next";
import MasterUserCreateForm from "./components/MasterUserCreateForm";

export const metadata: Metadata = {
  title: "Master User Create Update",
  description: "master user create update",
};

export default function MasterUserCreateUpdatePage() {
  return <MasterUserCreateForm />;
}
