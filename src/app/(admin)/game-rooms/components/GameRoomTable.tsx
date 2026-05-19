"use client";

import { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { setCurrentPage } from "@/redux/features/PaginationSlice";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Pagination from "@/components/tables/Pagination";
import Loading from "@/components/common/Loading";
import { DEFAULT_PER_PAGE } from "@/lib/constants";
import Badge from "@/components/ui/badge/Badge";
import {
  useCreateGameRoomMutation,
  useGetGameRoomsQuery,
  useToggleGameRoomStatusMutation,
  useUpdateGameRoomMutation,
} from "@/redux/features/gameRooms/GameRoomApiSlice";
import { useDebounce } from "@/hooks/useDebounce";
import Input from "@/components/form/input/InputField";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import Select from "@/components/form/Select";
import { useGetGamesQuery } from "@/redux/features/game/GameApiSlice";
import { useGetGameRulesQuery } from "@/redux/features/gameRules/GameRuleApiSlice";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import { toast } from "sonner";
import { getCookie } from "@/utils/cookie";

const statusColorMap: Record<string, "success" | "error" | "warning" | "dark"> = {
  active: "success",
  open: "success",
  inactive: "dark",
  closed: "error",
};

export default function GameRoomTable() {
  const dispatch = useAppDispatch();
  const currentPage = useAppSelector((state) => state.pagination.currentPage);
  const [searchText, setSearchText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<number | null>(null);
  const [roomToClear, setRoomToClear] = useState<number | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    room_name: "",
    room_code: "",
    game_id: "",
    mah_jong_game_rule_id: "",
  });
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [clearingId, setClearingId] = useState<number | null>(null);
  const [isResetting, setIsResetting] = useState(false);
  const debouncedSearchText = useDebounce(searchText);

  const { data, isLoading } = useGetGameRoomsQuery({
    page: currentPage,
    perPage: DEFAULT_PER_PAGE,
    search: debouncedSearchText || undefined,
  });
  const { data: gamesData } = useGetGamesQuery({ page: 1, perPage: 100 });
  const { data: gameRulesData } = useGetGameRulesQuery({ page: 1, perPage: 100 });
  const [createGameRoom, { isLoading: isCreating }] = useCreateGameRoomMutation();
  const [updateGameRoom, { isLoading: isUpdating }] = useUpdateGameRoomMutation();
  const [toggleGameRoomStatus, { isLoading: isToggling }] = useToggleGameRoomStatusMutation();

  const gameOptions = useMemo(
    () =>
      (gamesData?.data ?? [])
        .filter((game) => game.status === "active")
        .map((game) => ({
          value: game.id.toString(),
          label: game.name,
        })),
    [gamesData]
  );

  const gameRuleOptions = useMemo(() => {
    const rules = gameRulesData?.data ?? [];
    return rules
      .filter((rule) => !rule.status || rule.status === "active")
      .filter((rule) => !formValues.game_id || String(rule.game_id) === formValues.game_id)
      .map((rule) => ({
        value: rule.id.toString(),
        label: rule.rule_name,
      }));
  }, [gameRulesData, formValues.game_id]);

  useEffect(() => {
    if (!isModalOpen) {
      setEditingRoom(null);
      setFormValues({
        room_name: "",
        room_code: "",
        game_id: "",
        mah_jong_game_rule_id: "",
      });
    }
  }, [isModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.game_id || !formValues.mah_jong_game_rule_id) return;
    try {
      if (editingRoom) {
        await updateGameRoom({
          id: editingRoom,
          room_name: formValues.room_name,
          room_code: formValues.room_code,
          game_id: Number(formValues.game_id),
          mah_jong_game_rule_id: Number(formValues.mah_jong_game_rule_id),
        }).unwrap();
      } else {
        await createGameRoom({
          room_name: formValues.room_name,
          room_code: formValues.room_code,
          game_id: Number(formValues.game_id),
          mah_jong_game_rule_id: Number(formValues.mah_jong_game_rule_id),
        }).unwrap();
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save game room", error);
    }
  };

  const gameRooms = data?.data ?? [];
  const totalPages = data?.meta?.total_pages ?? 1;
  const perPage = data?.meta?.per_page ?? DEFAULT_PER_PAGE;

  const handleToggleStatus = async (roomId: number, currentStatus: string) => {
    const isActiveLike = currentStatus === "active" || currentStatus === "open";
    const deactivate = isActiveLike;
    setTogglingId(roomId);
    try {
      await toggleGameRoomStatus({ id: roomId, deactivate }).unwrap();
    } catch (error) {
      console.error("Failed to toggle game room status", error);
    } finally {
      setTogglingId(null);
    }
  };

  const handleClearRoomState = async (roomId: number) => {
    setClearingId(roomId);
    try {
      const cookieRes = await getCookie("userInfo");
      const userInfo = cookieRes ? JSON.parse(cookieRes) : null;
      const token = userInfo?.data?.userData?.token;

      const baseUrl = window.location.hostname.includes("localhost")
        ? "http://localhost:3001"
        : "https://ws.playngo.website";

      await axios.post(
        `${baseUrl}/health/state/clear/${roomId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );
      toast.success("Room state cleared successfully");
      setIsConfirmModalOpen(false);
      setRoomToClear(null);
    } catch (error) {
      console.error("Failed to clear room state", error);
      toast.error("Failed to clear room state");
    } finally {
      setClearingId(null);
    }
  };

  const handleDevReset = async () => {
    if (!confirm("Are you sure you want to reset the dev environment?")) return;

    setIsResetting(true);
    try {
      const baseUrl = window.location.hostname.includes("mjbackend")
        ? "http://mjbackend.test/api"
        : "https://admin.playngo.website/";

      await axios.post(`${baseUrl}/dev/reset`);
      toast.success("Dev environment reset successfully");
    } catch (error) {
      console.error("Failed to reset dev environment", error);
      toast.error("Failed to reset dev environment");
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-white/[0.05]">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Game Rooms</h3>

        <div className="flex items-center gap-3 w-full max-w-xl justify-end">
          <div className="w-full max-w-xs">
            <Input
              placeholder="Search game rooms..."
              value={searchText}
              onChange={(e) => {
                dispatch(setCurrentPage(1));
                setSearchText(e.target.value);
              }}
            />
          </div>
          <Button
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50"
            onClick={handleDevReset}
            disabled={isResetting}
          >
            {isResetting ? "Resetting..." : "Reset Dev"}
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>Create Room</Button>
        </div>
      </div>
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1100px]">
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <Loading />
            </div>
          )}

          {!isLoading && gameRooms.length === 0 && (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">No game rooms found</p>
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
                  Room Name
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                >
                  Room Code
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
                  Game
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                >
                  Game Rule
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                >
                  Created By
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                >
                  Created At
                </TableCell>
                <TableCell
                  isHeader
                  className="px-5 py-3 text-start text-gray-500 font-medium text-theme-xs"
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {gameRooms.map((room, idx) => {
                const statusColor = statusColorMap[room.status] ?? "dark";
                const isActiveLike = room.status === "active" || room.status === "open";
                return (
                  <TableRow key={room.id}>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {(currentPage - 1) * perPage + idx + 1}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {room.room_name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {room.room_code}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      <Badge color={statusColor} variant={isActiveLike ? "solid" : "light"}>
                        <span className="capitalize">{room.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {room.game?.name ?? "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {room.mah_jong_game_rule?.rule_name ?? room.game_rule?.rule_name ?? "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {room.created_by?.name ?? "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      {room.created_at ? new Date(room.created_at).toLocaleString() : "-"}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-start text-gray-500 text-theme-sm">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          title="Clear Room State"
                          disabled={clearingId === room.id}
                          onClick={() => {
                            setRoomToClear(room.id);
                            setIsConfirmModalOpen(true);
                          }}
                          className={`p-2 hover:border-orange-400 hover:text-orange-600 transition-colors ${
                            clearingId === room.id ? "opacity-50 cursor-not-allowed" : ""
                          }`}
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
                            className="text-gray-600"
                          >
                            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                            <path d="M3 3v5h5" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          title="Edit Game Room"
                          onClick={() => {
                            setEditingRoom(room.id);
                            setFormValues({
                              room_name: room.room_name,
                              room_code: room.room_code,
                              game_id: room.game_id.toString(),
                              mah_jong_game_rule_id: String(
                                room.mah_jong_game_rule_id ?? room.game_rule_id ?? ""
                              ),
                            });
                            setIsModalOpen(true);
                          }}
                          className="p-2   hover:border-blue-400 hover:text-blue-600 transition-colors"
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
                            className="text-gray-600"
                          >
                            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                          </svg>
                        </button>
                        <Switch
                          checked={isActiveLike}
                          disabled={isToggling || togglingId === room.id}
                          onCheckedChange={() => handleToggleStatus(room.id, room.status)}
                          aria-label="Toggle game room status"
                        />
                        <span className="text-gray-700 dark:text-gray-300 text-sm">
                          {isActiveLike ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} className="max-w-xl">
        <div className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingRoom ? "Edit Game Room" : "Create Game Room"}
          </h4>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-300">Room Name</label>
              <Input
                required
                value={formValues.room_name}
                onChange={(e) => setFormValues((prev) => ({ ...prev, room_name: e.target.value }))}
                placeholder="Room One"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-300">Room Code</label>
              <Input
                required
                value={formValues.room_code}
                onChange={(e) => setFormValues((prev) => ({ ...prev, room_code: e.target.value }))}
                placeholder="0001"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-300">Game</label>
              <Select
                required
                value={formValues.game_id}
                disabled={!!editingRoom}
                onChange={(e) => {
                  const gameId = e.target.value;
                  setFormValues((prev) => ({
                    ...prev,
                    game_id: gameId,
                    mah_jong_game_rule_id: "",
                  }));
                }}
                options={gameOptions}
                placeholder="Select game"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-600 dark:text-gray-300">Game Rule</label>
              <Select
                required
                value={formValues.mah_jong_game_rule_id}
                disabled={!!editingRoom}
                onChange={(e) =>
                  setFormValues((prev) => ({ ...prev, mah_jong_game_rule_id: e.target.value }))
                }
                options={gameRuleOptions}
                placeholder="Select game rule"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setIsModalOpen(false)} type="button">
                Cancel
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isCreating || isUpdating
                  ? editingRoom
                    ? "Saving..."
                    : "Creating..."
                  : editingRoom
                    ? "Save Changes"
                    : "Create"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setRoomToClear(null);
        }}
        className="max-w-md"
      >
        <div className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Confirm Action
          </h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Are you sure you want to clear the state for this room? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setIsConfirmModalOpen(false);
                setRoomToClear(null);
              }}
              disabled={clearingId !== null}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => roomToClear && handleClearRoomState(roomToClear)}
              disabled={clearingId !== null}
            >
              {clearingId !== null ? "Clearing..." : "Clear State"}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
