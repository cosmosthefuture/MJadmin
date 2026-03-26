"use client";

import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { useState } from "react";
import { useGetAllAdminsQuery, useToggleAdminMutation } from "@/redux/features/admin/AdminApiSlice";
import Pagination from "@/components/tables/Pagination";
import { Switch } from "@/components/ui/switch";
import Loading from "@/components/common/Loading";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setCurrentPage } from "@/redux/features/PaginationSlice";
import { useDebounce } from "@/hooks/useDebounce";
import Input from "@/components/form/input/InputField";
import { AdminApiResponse } from "@/types/types";
import { DEFAULT_PER_PAGE } from "@/lib/constants";
import { useCheckPermission } from "@/hooks/useCheckPermissions";
// import NoPermissionUI from "@/components/NoPermissionUI";
export default function AdminTable() {
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector((state) => state.pagination.currentPage);
  const hadAdminCreatePermission = useCheckPermission("admin_create");
  const hadAdminUpdatePermission = useCheckPermission("admin_update");
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText);

  const { data, isLoading } = useGetAllAdminsQuery({
    page: currentPage,
    perPage: DEFAULT_PER_PAGE,
    search: debouncedSearchText || undefined,
  });

  const totalPages = data?.meta?.total_pages ?? 1;
  const perPage = data?.meta?.per_page ?? DEFAULT_PER_PAGE;
  const admins: AdminApiResponse["data"] = data?.data ?? [];

  const [toggleAdmin] = useToggleAdminMutation();

  const handleToggleActive = async (id: number, status: boolean) => {
    try {
      await toggleAdmin({ adminId: id, deactivate: status }).unwrap();
      toast.success("Admin status updated successfully");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update admin status");
    }
  };
  // if (!hadAdminViewPermission) {
  //   return <NoPermissionUI />;
  // }
  return (
    <div className="">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Search..."
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        {hadAdminCreatePermission && (
          <Link href="/admins/create-update" className="flex items-center">
            <Button variant="primary" className="flex">
              Add Admin
            </Button>
          </Link>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <Loading />
              </div>
            )}

            {!isLoading && admins.length === 0 && (
              <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">No admins found</p>
              </div>
            )}
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    No.
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Admin Name
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                  >
                    Email
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
                    Status
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
                {admins.map((admin, index) => (
                  <TableRow key={admin.id}>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {(currentPage - 1) * perPage + index + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {admin.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {admin.email}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {admin.username}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {admin.phone_number || "—"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          admin.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {admin.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-theme-sm text-gray-500">
                      {hadAdminUpdatePermission && (
                        <span className="flex gap-2">
                          <Link href={`/admins/create-update?id=${admin.id}`} title="Edit Admin">
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
                            checked={admin.status === "active"}
                            onClick={() => handleToggleActive(admin.id, admin.status === "active")}
                          />
                        </span>
                      )}
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
