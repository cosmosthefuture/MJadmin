import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Master Withdraw History",
  description: "master withdraw history",
};

export default function MasterWithdrawHistoryPage() {
  notFound();
}
