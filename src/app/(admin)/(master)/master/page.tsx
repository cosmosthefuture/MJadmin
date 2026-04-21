import React from "react";
import ProfitSampleReport from "@/components/dashboard/ProfitSampleReport";

export default function MasterDashboardPage() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <ProfitSampleReport title="Profit Report" subtitle="Profit reports" />
      </div>
    </div>
  );
}
