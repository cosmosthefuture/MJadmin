"use client";

import React, { useEffect, useRef, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  // CalenderIcon,
  // BoxCubeIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  UserCircleIcon,
  DollarLineIcon,
  BoxCubeIcon,
  // ListIcon,
  DownloadIcon,
  PaperPlaneIcon,
} from "../icons/index";
import { useCheckPermission } from "../hooks/useCheckPermissions";
import { useAppSelector } from "@/redux/hook";
import {
  Users,
  SquareUser,
  BanknoteArrowDown,
  BanknoteArrowUp,
  Gamepad,
  Gamepad2,
  HandCoins,
  Banknote,
} from "lucide-react";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};
const baseNavItems: NavItem[] = [
  // {
  //   icon: <GridIcon />,
  //   name: "Dashboard",
  //   subItems: [{ name: "Ecommerce", path: "/", pro: false }],
  // },
];

const othersItems: NavItem[] = [];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const authType = useAppSelector((state) => state.auth.authType);
  // Permissions
  const hadAdminsViewPermission = useCheckPermission("admin_view");
  const hadAdminViewAgentsPermission = useCheckPermission("admin_view");
  const hadUsersViewPermission = useCheckPermission("user_view");
  const hadMastersViewPermission = useCheckPermission("master_view");
  const hadPaymentMethodViewPermission = useCheckPermission("payment_method_view");
  const hadUserDepositRequestViewPermission = useCheckPermission("user_deposit_request_view");
  const hadUserWithdrawRequestViewPermission = useCheckPermission("user_withdraw_request_view");
  const hadAgentWithdrawRequestViewPermission = useCheckPermission("agent_withdraw_request_view");
  const hadMoneyTransferRecordViewPermission = useCheckPermission("money_transfer_record_view");
  const hadGameViewPermission = useCheckPermission("game_view");
  const hadGameRuleViewPermission = useCheckPermission("game_rule_view");
  const hadGlobalCommissionSettingViewPermission = useCheckPermission(
    "global_commission_setting_view"
  );
  const hadMasterWithdrawRequestViewPermission = useCheckPermission("master_withdraw_request_view");
  // const hadBlogsViewPermission = useCheckPermission("blogs-view");
  // const hadServicesViewPermission = useCheckPermission("services-view");
  // const hadProfessionalsViewPermission = useCheckPermission("professionals-view");
  // const hadQuestionsViewPermission = useCheckPermission("questions-view");
  // const hadWorkflowsViewPermission = useCheckPermission("workflows-view");

  // Build navItems dynamically based on permissions
  const hadGameRoomViewPermission = useCheckPermission("game_room_view");
  const navItems = useMemo(() => {
    const items = [...baseNavItems];

    if (authType === "admin") {
      items.push({ icon: <GridIcon />, name: "Dashboard", path: "/" });
    }

    if (authType === "master") {
      items.push({ icon: <GridIcon />, name: "Dashboard", path: "/master" });
    }

    if (authType === "agent") {
      items.push({ icon: <GridIcon />, name: "Dashboard", path: "/agents" });
    }

    if (hadAdminsViewPermission) {
      items.push({ icon: <GridIcon />, name: "Admins", path: "/admins" });
    }

    if (authType === "master") {
      items.push({ icon: <Users size={20} />, name: "Users", path: "/master/users" });
      items.push({ icon: <UserCircleIcon />, name: "Agents", path: "/master/agents" });
      items.push({
        icon: <Banknote size={21} />,
        name: "Wallet Records",
        path: "/master/wallet-records",
      });
      items.push({
        icon: <DownloadIcon size={20} />,
        name: "Manual Agent Deposits",
        path: "/master/manual-deposits",
      });
      items.push({
        icon: <PaperPlaneIcon size={20} />,
        name: "Manual Agent Withdrawals",
        path: "/master/manual-withdrawals",
      });
      items.push({
        icon: <DownloadIcon size={20} />,
        name: "Manual User Deposits",
        path: "/master/user-manual-deposits",
      });
      items.push({
        icon: <PaperPlaneIcon size={20} />,
        name: "Manual User Withdrawals",
        path: "/master/user-manual-withdrawals",
      });
    }

    if (authType === "agent") {
      items.push({ icon: <Users size={20} />, name: "Users", path: "/agents/users" });
      items.push({
        icon: <Banknote size={21} />,
        name: "Wallet Records",
        path: "/agents/wallet-records",
      });

      items.push({
        icon: <DownloadIcon size={20} />,
        name: "Manual Deposits",
        path: "/agents/manual-deposits",
      });
      items.push({
        icon: <PaperPlaneIcon size={20} />,
        name: "Manual Withdrawals",
        path: "/agents/manual-withdrawals",
      });
    }
    if (hadUsersViewPermission) {
      items.push({ icon: <Users size={20} />, name: "Users", path: "/users" });
    }
    if (hadMastersViewPermission) {
      items.push({
        icon: <SquareUser size={20} />,
        name: "Masters",
        path: "/masters",
      });
      // if (authType === "admin") {
      //   items.push({
      //     icon: <ChartColumnBig size={21} />,
      //     name: "Monthly Master Commission",
      //     path: "/monthly-master-commission",
      //   });
      // }
    }
    if (hadAdminViewAgentsPermission) {
      items.push({
        icon: <UserCircleIcon />,
        name: "Agent Lists",
        path: "/admins/agents/all",
      });
      // if (authType === "admin") {
      //   items.push({
      //     icon: <ChartColumnBig size={21} />,
      //     name: "Monthly Agent Commission",
      //     path: "/monthly-agent-commission",
      //   });
      // }
    }

    if (authType === "admin" && hadGlobalCommissionSettingViewPermission) {
      items.push({
        icon: <HandCoins size={21} />,
        name: "Global Commission Settings",
        path: "/admins/global-commission-settings/all",
      });
    }

    if (hadPaymentMethodViewPermission) {
      items.push({ icon: <DollarLineIcon />, name: "Payments", path: "/payments" });
    }
    if (hadUserDepositRequestViewPermission) {
      items.push({
        icon: <BanknoteArrowDown size={20} />,
        name: "Deposits",
        path: "/deposits",
      });
    }
    if (hadUserWithdrawRequestViewPermission) {
      items.push({
        icon: <BanknoteArrowUp size={20} />,
        name: "Withdraws",
        path: "/withdraws",
      });
    }
    if (hadMoneyTransferRecordViewPermission) {
      items.push({
        icon: <Banknote size={21} />,
        name: "Money Transfer Records",
        path: "/admins/user-money-transfer-records/all",
      });
    }
    if (hadAdminsViewPermission) {
      items.push({
        icon: <DownloadIcon size={20} />,
        name: "Manual Deposits",
        path: "/admins/master-deposit-requests/manual",
      });
      items.push({
        icon: <PaperPlaneIcon size={20} />,
        name: "Manual Withdraws",
        path: "/admins/master-withdraw-requests/manual",
      });
    }
    if (hadMasterWithdrawRequestViewPermission) {
      items.push({
        icon: <PaperPlaneIcon />,
        name: "Master Withdraw Requests",
        path: "/admins/master-withdraw-requests",
      });
    }
    if (hadAgentWithdrawRequestViewPermission) {
      items.push({
        icon: <PaperPlaneIcon />,
        name: "Agent Withdraw Requests",
        path: "/admins/agent-withdraw-requests/all",
      });
    }

    if (hadGameViewPermission) {
      // items.push({ icon: <ListIcon />, name: "Bet Histories", path: "/bet-histories" });

      items.push({ icon: <Gamepad2 size={21} />, name: "Games", path: "/games" });
    }
    if (hadGameRuleViewPermission) {
      items.push({ icon: <Gamepad size={21} />, name: "Game Rules", path: "/game-rules" });
    }
    if (hadGameRoomViewPermission) {
      items.push({ icon: <BoxCubeIcon />, name: "Game Rooms", path: "/game-rooms" });
    }
    // if (hadServicesViewPermission) {
    //   items.push({ icon: <ListIcon />, name: "Services", path: "/services" });
    // }
    // if (hadProfessionalsViewPermission) {
    //   items.push({ icon: <UserCircleIcon />, name: "Professionals", path: "/professionals" });
    // }
    // if (hadQuestionsViewPermission) {
    //   items.push({ icon: <BoxCubeIcon />, name: "Questions", path: "/questions" });
    // }
    // if (hadWorkflowsViewPermission) {
    //   items.push({ icon: <TableIcon />, name: "Workflows", path: "/workflows" });
    // }

    return items;
  }, [
    authType,
    hadAdminsViewPermission,
    hadAdminViewAgentsPermission,
    hadUsersViewPermission,
    hadMastersViewPermission,
    hadPaymentMethodViewPermission,
    hadUserDepositRequestViewPermission,
    hadUserWithdrawRequestViewPermission,
    hadAgentWithdrawRequestViewPermission,
    hadMoneyTransferRecordViewPermission,
    hadGameViewPermission,
    hadGameRuleViewPermission,
    hadGlobalCommissionSettingViewPermission,
    hadMasterWithdrawRequestViewPermission,
    hadGameRoomViewPermission,

    // hadBlogsViewPermission,
    // hadServicesViewPermission,
    // hadProfessionalsViewPermission,
    // hadQuestionsViewPermission,
    // hadWorkflowsViewPermission,
  ]);

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu && prevOpenSubmenu.type === menuType && prevOpenSubmenu.index === index) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  useEffect(() => {
    let submenuMatched = false;
    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;
      items.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({ type: menuType as "main" | "others", index });
              submenuMatched = true;
            }
          });
        }
      });
    });

    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive, navItems]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const renderMenuItems = (navItems: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`menu-item group  
                ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-active"
                    : "menu-item-inactive"
                } cursor-pointer ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
                }`}
            >
              <span
                className={`${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? "menu-item-icon-active"
                    : "menu-item-icon-inactive"
                }`}
              >
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200  
                    ${
                      openSubmenu?.type === menuType && openSubmenu?.index === index
                        ? "rotate-180 text-brand-500"
                        : ""
                    }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}

          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                      <span className="flex items-center gap-1 ml-auto">
                        {subItem.new && (
                          <span
                            className={`${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`${
                              isActive(subItem.path)
                                ? "menu-dropdown-badge-active"
                                : "menu-dropdown-badge-inactive"
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`py-8 flex ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}
      >
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image
                className="dark:hidden"
                src="/images/logo/logo.svg"
                alt="Logo"
                width={150}
                height={40}
              />
              <Image
                className="hidden dark:block"
                src="/images/logo/logo-dark.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(navItems, "main")}
            </div>

            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Others" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(othersItems, "others")}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
