import React, { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";

export enum SidebarType {
  "home" = "home",
  "settings" = "settings",
}

const Sidebar = ({
  sideNav,
  closeContent,
}: {
  sideNav: (sidebarType: SidebarType) => void;
  closeContent?: () => void;
}) => {
  const [sidebarType, setSidebarType] = useState<SidebarType>(SidebarType.home);
  return (
    <aside className="absolute inset-y-0 right-0 z-10 flex w-14 flex-col border-r bg-background border-l-[1px]">
      {closeContent && (
        <a
          className="hover:cursor-pointer flex h-9 w-9 items-center justify-center  text-muted-foreground transition-colors hover:text-foreground ml-auto mr-auto"
          href="#"
          onClick={() => {
            closeContent();
          }}
        >
          <span className="sr-only">close sidebar</span>
        </a>
      )}
      <nav className="flex flex-col items-center gap-4 px-2 py-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                className={`hover:cursor-pointer flex h-9 w-9 items-center justify-center  text-muted-foreground transition-colors ${
                  sidebarType == SidebarType.home
                    ? "rounded-full bg-primary text-lg font-semibold text-primary-foreground"
                    : ""
                }`}
                href="#"
                onClick={() => {
                  setSidebarType(SidebarType.home);
                  sideNav(SidebarType.home);
                }}
              >
                <span className="sr-only">home</span>
              </a>
            </TooltipTrigger>
            <TooltipContent side="right">home</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 py-5">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <a
                className={`hover:cursor-pointer flex h-9 w-9 items-center justify-center  text-muted-foreground transition-colors ${
                  sidebarType == SidebarType.settings
                    ? "rounded-full bg-primary text-lg font-semibold text-primary-foreground"
                    : ""
                } `}
                href="#"
                onClick={() => {
                  setSidebarType(SidebarType.settings);
                  sideNav(SidebarType.settings);
                }}
              >
                <span className="sr-only">Settings</span>
              </a>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </nav>
    </aside>
  );
};

export default Sidebar;
