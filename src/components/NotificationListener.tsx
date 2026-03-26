"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import { onMessageListener } from "@/lib/firebase";
import { playNotificationSound } from "@/lib/notificationSound";
import {
  useGetAdminDepositNotificationsQuery,
  useGetAdminWithdrawNotificationsQuery,
} from "@/redux/features/notifications/AdminNotificationApiSlice";
import { useGetAgentNotificationsQuery } from "@/redux/features/notifications/AgentNotificationApiSlice";
import { useGetDepositRequestsQuery } from "@/redux/features/deposit/DepositApiSlice";
import { useGetWithdrawRequestsQuery } from "@/redux/features/withdraw/WithdrawApiSlice";
import { useGetAgentWithdrawHistoryQuery } from "@/redux/features/agents/AgentWithdrawHistoryApiSlice";
import { DEFAULT_PER_PAGE } from "@/lib/constants";

// This listener is responsible for reacting to foreground FCM messages
// and keeping the notification dropdowns in sync by refetching
// the appropriate queries based on the current auth type and
// notification content.

export function NotificationListener() {
  const authType = useSelector((state: RootState) => state.auth.authType);
  const token = useSelector((state: RootState) => state.auth.token);
  const isLoggedIn = Boolean(token);

  // We only need refetch functions here; actual data is unused.
  // Use the same pagination args as NotificationDropdown so refetch
  // updates the exact same cache entry and unread dot reacts correctly.
  const { refetch: refetchAdminDeposit } = useGetAdminDepositNotificationsQuery(
    { page: 1, perPage: 100 },
    { skip: !isLoggedIn || authType !== "admin" }
  );

  const { refetch: refetchAdminWithdraw } = useGetAdminWithdrawNotificationsQuery(
    { page: 1, perPage: 100 },
    { skip: !isLoggedIn || authType !== "admin" }
  );

  const { refetch: refetchAgentNotifications } = useGetAgentNotificationsQuery(
    { page: 1, perPage: 100 },
    { skip: !isLoggedIn || authType !== "agent" }
  );

  // Admin tables: user deposit & withdraw requests
  const { refetch: refetchUserDepositRequests } = useGetDepositRequestsQuery(
    { page: 1, perPage: DEFAULT_PER_PAGE },
    { skip: !isLoggedIn || authType !== "admin" }
  );

  const { refetch: refetchUserWithdrawRequests } = useGetWithdrawRequestsQuery(
    { page: 1, perPage: DEFAULT_PER_PAGE },
    { skip: !isLoggedIn || authType !== "admin" }
  );

  // Agent table: withdraw history
  const { refetch: refetchAgentWithdrawHistory } = useGetAgentWithdrawHistoryQuery(
    { page: 1, per_page: DEFAULT_PER_PAGE },
    { skip: !isLoggedIn || authType !== "agent" }
  );

  useEffect(() => {
    let isMounted = true;

    const listen = async () => {
      while (isMounted) {
        const payload = (await onMessageListener()) as {
          from?: string;
          notification?: { title?: string; body?: string };
        } | null;
        console.log("payload", payload);

        if (!payload) continue;

        const title = payload.notification?.title || "New notification";
        const body = payload.notification?.body || "You have a new message";

        toast(title, { description: body });

        // Admin/master: refresh both notification lists + admin tables, and play sound(s)
        if (authType === "admin") {
          refetchAdminDeposit();
          refetchAdminWithdraw();
          refetchUserDepositRequests();
          refetchUserWithdrawRequests();

          const lowerTitle = title.toLowerCase();
          if (lowerTitle.includes("deposit")) {
            playNotificationSound("admin_deposit");
          } else if (lowerTitle.includes("withdraw")) {
            playNotificationSound("admin_withdraw");
          } else {
            // If ambiguous, play for both bells
            playNotificationSound("admin_deposit");
            playNotificationSound("admin_withdraw");
          }
        }

        // Agent: always refresh agent notifications + agent withdraw history and play sound
        if (authType === "agent") {
          refetchAgentNotifications();
          refetchAgentWithdrawHistory();
          playNotificationSound("agent");
        }
      }
    };

    void listen();

    return () => {
      isMounted = false;
    };
  }, [
    authType,
    refetchAdminDeposit,
    refetchAdminWithdraw,
    refetchAgentNotifications,
    refetchUserDepositRequests,
    refetchUserWithdrawRequests,
    refetchAgentWithdrawHistory,
  ]);

  return null;
}
