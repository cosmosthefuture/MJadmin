"use client";

import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setCurrentPage } from "@/redux/features/PaginationSlice";
import { DEFAULT_PER_PAGE } from "@/lib/constants";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/tables/Pagination";
import Loading from "@/components/common/Loading";
import {
  useGetGlobalCommissionSettingsQuery,
  useUpdateGlobalCommissionSettingMutation,
} from "@/redux/features/commission/GlobalCommissionSettingsApiSlice";
import { useCheckPermission } from "@/hooks/useCheckPermissions";
import NoPermissionUI from "@/components/NoPermissionUI";
import { useState } from "react";
import Button from "@/components/ui/button/Button";
import Input from "@/components/form/input/InputField";
import { Modal } from "@/components/ui/modal";
import { toast } from "sonner";

export default function GlobalCommissionSettingsTable() {
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector((state) => state.pagination.currentPage);

  const canView = useCheckPermission("global_commission_setting_view");
  const canUpdate = useCheckPermission("global_commission_setting_update");

  const { data, isLoading } = useGetGlobalCommissionSettingsQuery({
    page: currentPage,
    perPage: DEFAULT_PER_PAGE,
  });

  const [updateSetting, { isLoading: isUpdating }] = useUpdateGlobalCommissionSettingMutation();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);

  if (!canView) {
    return <NoPermissionUI />;
  }

  const settings = data?.data ?? [];
  const totalPages = data?.meta?.total_pages ?? 1;
  const perPage = data?.meta?.per_page ?? DEFAULT_PER_PAGE;

  const handleOpenEdit = (id: number, value: string) => {
    setEditingId(id);
    setEditingValue(value);
    setIsOpen(true);
  };

  const handleCloseEdit = () => {
    setEditingId(null);
    setEditingValue("");
    setIsOpen(false);
  };

  const handleSave = async () => {
    if (!editingId) return;
    try {
      await updateSetting({ id: editingId, value: editingValue }).unwrap();
      toast.success("Global commission setting updated successfully");
      handleCloseEdit();
    } catch (error) {
      console.error(error);
      toast.error("Failed to update global commission setting");
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/[0.05]">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Global Commission Settings
        </h3>
      </div>
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <Loading />
            </div>
          )}

          {!isLoading && settings.length === 0 && (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No global commission settings found</p>
            </div>
          )}

          {!isLoading && settings.length > 0 && (
            <>
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
                      Name
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                    >
                      Key
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                    >
                      Type
                    </TableCell>
                    <TableCell
                      isHeader
                      className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                    >
                      Value
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
                  {settings.map((setting, index) => (
                    <TableRow key={setting.id}>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {(currentPage - 1) * perPage + index + 1}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {setting.name}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {setting.key}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {setting.type}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        {setting.value}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!canUpdate}
                          onClick={() => handleOpenEdit(setting.id, setting.value)}
                        >
                          Edit
                        </Button>
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
            </>
          )}
        </div>
      </div>

      <Modal
        isOpen={isOpen && editingId !== null}
        onClose={handleCloseEdit}
        className="max-w-[450px] m-4"
      >
        <div className="no-scrollbar relative w-full max-w-[750px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-8">
          <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Edit Setting</h3>
          <div className="space-y-4">
            <Input value={editingValue} onChange={(e) => setEditingValue(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" size="sm" onClick={handleCloseEdit}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleSave} disabled={isUpdating}>
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
