
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
        "flex h-14 items-center border-b",
        isCollapsed ? "justify-center px-2" : "justify-center px-6", // Center alignment with more left padding
        className
      )}
    >
      {children}
    </div>
  );
};

export default SidebarHeader;
