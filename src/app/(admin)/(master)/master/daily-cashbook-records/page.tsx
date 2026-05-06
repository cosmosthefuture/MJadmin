import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Master Daily Cashbook Records",
  description: "master daily cashbook records",
};

export default function MasterDailyCashbookRecordsPage() {
  notFound();
}
