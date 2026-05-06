import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Reports",
  description: "agent incentive transactions",
};

export default function AgentIncentiveTransactionsPage() {
  notFound();
}
