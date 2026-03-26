import type { Metadata } from "next";
import React from "react";
import CommissionReport from "@/components/dashboard/CommissionReport";
import DepositReport from "@/components/dashboard/DepositReport";
import MoneyTransferReport from "@/components/dashboard/MoneyTransferReport";
import ProfitReport from "@/components/dashboard/ProfitReport";

export const metadata: Metadata = {
  title: "Next.js E-commerce Dashboard | TailAdmin - Next.js Dashboard Template",
  description: "This is Next.js Home for TailAdmin Dashboard Template",
};

export default function Ecommerce() {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      <div className="col-span-12">
        <CommissionReport />
      </div>
      <div className="col-span-12">
        <DepositReport />
      </div>
      <div className="col-span-12">
        <MoneyTransferReport />
      </div>
      <div className="col-span-12">
        <ProfitReport />
      </div>
      {/* <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div> */}

      {/* <div className="col-span-12 xl:col-span-5">
        <DemographicCard />
      </div>

      <div className="col-span-12 xl:col-span-7">
        <RecentOrders />
      </div> */}
    </div>
  );
}
