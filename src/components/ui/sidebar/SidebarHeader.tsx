
import React from 'react';
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  className?: string;
  children?: React.ReactNode;
  isCollapsed?: boolean;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  className,
  children,
  isCollapsed = false,
}) => {
  return (
    <div
      className={cn(
        "flex h-14 items-center px-4 border-b",
        isCollapsed ? "justify-center" : "justify-between",
        className
      )}
    >
      {children}
    </div>
  );
};

export default SidebarHeader;
