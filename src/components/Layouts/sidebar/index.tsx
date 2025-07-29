"use client";

import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_DATA } from "./data";
import { ArrowLeftIcon, ChevronUp } from "./icons";
import { MenuItem } from "./menu-item";
import { useSidebarContext } from "./sidebar-context";
import type { NavItem, NavSection } from "../../../../types/data";

interface SidebarProps {
  userRole: string;
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();
  const { setIsOpen, isOpen, isMobile, toggleSidebar } = useSidebarContext();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  // Role-based filtering
  const filterNavByRole = (
    navData: NavSection[],
    role: string,
  ): NavSection[] => {
    if (role === "superAdmin") {
      return navData;
    }

    return navData
      .map((section) => ({
        ...section,
        items: section.items
          .filter((item) => item.roles?.includes(role))
          .map((item) => ({
            ...item,
            items: item.items
              ? item.items.filter((subItem) =>
                  subItem.roles
                    ? subItem.roles.includes(role)
                    : item.roles?.includes(role),
                )
              : [],
          })),
      }))
      .filter((section) => section.items.length > 0);
  };

  const filteredNav = filterNavByRole(NAV_DATA, userRole);

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );
  };

  // Auto-expand if current path is in subitem
  useEffect(() => {
    const newExpandedItems: string[] = [];

    filteredNav.forEach((section) => {
      section.items.forEach((item) => {
        if (item.items?.some((subItem) => subItem.url === pathname)) {
          newExpandedItems.push(item.title);
        }
      });
    });

    setExpandedItems((prev) => [...new Set([...prev, ...newExpandedItems])]);
  }, [pathname, filteredNav]);

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 transition-opacity duration-300"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "max-w-[290px] overflow-hidden border-r border-gray-200 bg-white transition-[width] duration-200 ease-linear dark:border-gray-800 dark:bg-gray-dark",
          isMobile ? "fixed bottom-0 top-0 z-50" : "sticky top-0 h-screen",
          isOpen ? "w-full" : "w-0",
        )}
        aria-label="Main navigation"
        aria-hidden={!isOpen}
      >
        <div className="flex h-full flex-col py-10 pl-[25px] pr-[7px]">
          {/* Logo + Close button (mobile only) */}
          <div className="relative pr-4.5">
            <Link
              href="/"
              onClick={() => isMobile && toggleSidebar()}
              className="px-0 py-2.5 min-[900px]:py-0"
            >
              <Logo />
            </Link>

            {isMobile && (
              <button
                onClick={toggleSidebar}
                className="absolute left-2/4 right-4.5 top-1/2 -translate-y-1/2 text-right"
              >
                <span className="sr-only">Close Menu</span>
                <ArrowLeftIcon className="ml-auto size-7" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="custom-scrollbar mt-6 flex-1 overflow-y-auto pr-3 min-[850px]:mt-10">
            {filteredNav?.map((section) => (
              <div key={section.label} className="mb-6">
                <h2 className="mb-5 text-sm font-medium text-dark-4 dark:text-dark-6">
                  {section.label}
                </h2>
                <nav role="navigation" aria-label={section.label}>
                  <ul className="space-y-2">
                    {section?.items.map((item) => (
                      <li key={item.title}>
                        {/* Dropdown item */}
                        {item.items && item.items.length > 0 ? (
                          <div>
                            <MenuItem
                              isActive={
                                item.items?.some(
                                  ({ url }) => url === pathname,
                                ) ?? false
                              }
                              onClick={() => toggleExpanded(item.title)}
                              aria-expanded={expandedItems.includes(item.title)}
                              aria-controls={`${item.title}-submenu`}
                            >
                              {item.icon && (
                                <item.icon
                                  className="size-4 shrink-0"
                                  aria-hidden="true"
                                />
                              )}
                              <span>{item.title}</span>
                              <ChevronUp
                                className={cn(
                                  "ml-auto rotate-180 transition-transform duration-200",
                                  expandedItems.includes(item.title) &&
                                    "rotate-0",
                                )}
                                aria-hidden="true"
                              />
                            </MenuItem>

                            {expandedItems.includes(item.title) && (
                              <ul
                                id={`${item.title}-submenu`}
                                className="ml-9 mr-0 space-y-1.5 pb-[15px] pr-0 pt-2"
                                role="menu"
                              >
                                {item.items?.map((subItem) => (
                                  <li key={subItem.title} role="none">
                                    <MenuItem
                                      as="link"
                                      href={subItem.url}
                                      isActive={pathname === subItem.url}
                                    >
                                      <span>{subItem.title}</span>
                                    </MenuItem>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ) : (
                          // Single item (no dropdown)
                          <MenuItem
                            as="link"
                            href={
                              item.url ||
                              "/" +
                                item.title.toLowerCase().replace(/\s+/g, "-")
                            }
                            isActive={
                              pathname ===
                              (item.url ||
                                "/" +
                                  item.title.toLowerCase().replace(/\s+/g, "-"))
                            }
                          >
                            <div className="flex items-center gap-2">
                              {item.icon && (
                                <item.icon
                                  className="size-4 shrink-0"
                                  aria-hidden="true"
                                />
                              )}
                              <span>{item.title}</span>
                            </div>
                          </MenuItem>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
