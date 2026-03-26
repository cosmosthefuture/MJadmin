"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setCurrentPage } from "@/redux/features/PaginationSlice";
import { DEFAULT_PER_PAGE } from "@/lib/constants";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/tables/Pagination";
import Loading from "@/components/common/Loading";
import { useCheckPermission } from "@/hooks/useCheckPermissions";
import NoPermissionUI from "@/components/NoPermissionUI";
import moment from "moment";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetUserMoneyTransferRecordsQuery } from "@/redux/features/moneyTransferRecords/UserMoneyTransferRecordsApiSlice";

export default function UserMoneyTransferRecordsTable() {
  const dispatch = useAppDispatch();
  const authType = useAppSelector((state) => state.auth.authType);

  const router = useRouter();
  const searchParams = useSearchParams();

  const hadMoneyTransferRecordViewPermission = useCheckPermission("money_transfer_record_view");

  useEffect(() => {
    if (authType && authType !== "admin") {
      router.replace("/login");
    }
  }, [authType, router]);

  const pageFromQuery = Number(searchParams.get("page") || "1");
  const perPageFromQuery = Number(searchParams.get("per_page") || String(DEFAULT_PER_PAGE));

  const currentPage = Number.isFinite(pageFromQuery) && pageFromQuery > 0 ? pageFromQuery : 1;
  const perPage =
    Number.isFinite(perPageFromQuery) && perPageFromQuery > 0 ? perPageFromQuery : DEFAULT_PER_PAGE;

  useEffect(() => {
    dispatch(setCurrentPage(currentPage));
  }, [currentPage, dispatch]);

  const { data, isLoading } = useGetUserMoneyTransferRecordsQuery(
    { page: currentPage, perPage },
    { skip: authType !== "admin" || !hadMoneyTransferRecordViewPermission }
  );

  if (authType !== "admin") {
    return null;
  }

  if (!hadMoneyTransferRecordViewPermission) {
    return <NoPermissionUI />;
  }

  const totalPages = data?.meta?.total_pages ?? 1;
  const rows = data?.data ?? [];

  const onPageChange = (nextPage: number) => {
    router.push(`/admins/user-money-transfer-records/all?page=${nextPage}&per_page=${perPage}`);
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/[0.05]">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          User Money Transfer Records
        </h3>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1100px]">
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <Loading />
            </div>
          )}

          {!isLoading && rows.length === 0 && (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No money transfer records found</p>
            </div>
          )}

          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                <TableCell isHeader className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs">
                  ID
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs">
                  Sender
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs">
                  Recipient
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-end text-gray-500 font-medium text-theme-xs">
                  Amount
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-end text-gray-500 font-medium text-theme-xs">
                  House Cut %
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-end text-gray-500 font-medium text-theme-xs">
                  House Cut Amount
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs">
                  Status
                </TableCell>
                <TableCell isHeader className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs">
                  Created At
                </TableCell>
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {!isLoading &&
                rows.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {record.id}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {record.sender?.name ?? "-"} ({record.sender?.phone_number ?? "-"})
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {record.recipient?.name ?? "-"} ({record.recipient?.phone_number ?? "-"})
                    </TableCell>
                    <TableCell className="px-4 py-3 text-end tabular-nums text-gray-500 text-theme-sm">
                      {record.amount}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-end tabular-nums text-gray-500 text-theme-sm">
                      {record.house_cut_percentage}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-end tabular-nums text-gray-500 text-theme-sm">
                      {record.house_cut_amount}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      <span className="capitalize">{record.status}</span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {record.created_at ? moment(record.created_at).format("DD/MM/YYYY HH:mm:ss") : "-"}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>

          <div className="flex justify-center m-5">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
