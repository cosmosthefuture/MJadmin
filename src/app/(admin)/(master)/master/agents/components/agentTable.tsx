"use client";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import {
  useGetMasterAgentsQuery,
  useToggleAgentStatusMutation,
} from "@/redux/features/agents/MasterAgentApiSlice";
import Pagination from "@/components/tables/Pagination";
import Loading from "@/components/common/Loading";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setCurrentPage } from "@/redux/features/PaginationSlice";
import { useDebounce } from "@/hooks/useDebounce";
import Input from "@/components/form/input/InputField";
import { DEFAULT_PER_PAGE } from "@/lib/constants";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import moment from "moment";
import { useRouter } from "next/navigation";

export default function AgentTable() {
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector((state) => state.pagination.currentPage);
  const authType = useAppSelector((state) => state.auth.authType);
  const router = useRouter();

  const [toggleAgentStatus] = useToggleAgentStatusMutation();

  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText);

  const { data, isLoading } = useGetMasterAgentsQuery(
    {
      page: currentPage,
      perPage: DEFAULT_PER_PAGE,
      search: debouncedSearchText || undefined,
    },
    {
      skip: authType !== "master",
    }
  );

  useEffect(() => {
    if (authType && authType !== "master") {
      router.replace("/login");
    }
  }, [authType, router]);

  if (authType !== "master") {
    return null;
  }

  const handleToggleActive = async (id: number, status: boolean) => {
    try {
      await toggleAgentStatus({ id, deactivate: status }).unwrap();
      toast.success("Agent status updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update agent status");
    }
  };

  const agents = data?.data ?? [];
  const totalPages = data?.meta?.total_pages ?? 1;
  const perPage = data?.meta?.per_page ?? DEFAULT_PER_PAGE;

  const formatDate = (dateString?: string) => {
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

        <Link href="/master/agents/create-update" className="flex items-center">
          <Button variant="primary" className="flex">
            Add Agent
          </Button>
        </Link>
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
                    Winning Commission %
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
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Action
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {agents.map((agent, index) => (
                  <TableRow key={agent.id}>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {(currentPage - 1) * perPage + index + 1}
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
                      {formatDate((agent as { created_at?: string })?.created_at)}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500">
                      <span className="flex gap-2">
                        <Link
                          href={`/master/agents/create-update?id=${agent.id}`}
                          title="Edit Agent"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={20}
                            height={20}
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                          </svg>
                        </Link>

                        <Switch
                          checked={agent.status === "active"}
                          onClick={() => handleToggleActive(agent.id, agent.status === "active")}
                        />
                      </span>
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
