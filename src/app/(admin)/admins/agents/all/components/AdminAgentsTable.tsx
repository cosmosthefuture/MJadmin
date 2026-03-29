"use client";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useGetAdminAgentsQuery } from "@/redux/features/admin/AdminAgentsApiSlice";
import Pagination from "@/components/tables/Pagination";
import Loading from "@/components/common/Loading";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setCurrentPage } from "@/redux/features/PaginationSlice";
import { useDebounce } from "@/hooks/useDebounce";
import Input from "@/components/form/input/InputField";
import { DEFAULT_PER_PAGE } from "@/lib/constants";
import moment from "moment";
import { useRouter } from "next/navigation";

export default function AdminAgentsTable() {
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector((state) => state.pagination.currentPage);
  const authType = useAppSelector((state) => state.auth.authType);
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText);

  const { data, isLoading } = useGetAdminAgentsQuery({
    page: currentPage,
    perPage: DEFAULT_PER_PAGE,
    search: debouncedSearchText || undefined,
  });

  useEffect(() => {
    if (authType && authType !== "admin") {
      router.replace("/login");
    }
  }, [authType, router]);

  if (authType !== "admin") {
    return null;
  }

  const agents = data?.data ?? [];
  const totalPages = data?.meta?.total_pages ?? 1;
  const perPage = data?.meta?.per_page ?? DEFAULT_PER_PAGE;

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "—";
    return moment(dateString).format("MMM D, YYYY");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search..."
            onChange={(e) => {
              dispatch(setCurrentPage(1));
              setSearchText(e.target.value);
            }}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1000px]">
            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <Loading />
              </div>
            )}

            {!isLoading && agents.length === 0 && (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No agents found</p>
              </div>
            )}

            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    ID
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Username
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Phone
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Agent Code
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Incentive %
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Created Date
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {agents.map((agent, index) => (
                  <TableRow key={agent.id}>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {(currentPage - 1) * perPage + index + 1
                      }
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {agent.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {agent.username}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {agent.phone_number || "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {agent.agent_code || "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {agent.winning_commission_percentage ?? agent.incentive_percentage ?? "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          agent.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {agent.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {formatDate(agent.created_at)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-center m-5">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => dispatch(setCurrentPage(page))}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
