
import Sidebar from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface LayoutProps {
  isMobileSidebarOpen?: boolean;
  onMobileSidebarToggle?: () => void;
}

const Layout = ({
  isMobileSidebarOpen = false,
  onMobileSidebarToggle = () => {},
}: LayoutProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const handleAddNewRecord = () => {
    navigate("/reports/new");
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Toggle button - always visible */}
      <button
        className="fixed z-50 top-4 left-4 p-2 rounded-lg bg-white shadow-lg hover:bg-gray-100"
        onClick={onMobileSidebarToggle}
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Sidebar with overlay when mobile */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity",
          isMobileSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onMobileSidebarToggle}
      />

      <Sidebar 
        className={cn(
          "fixed z-40 h-full transition-transform duration-300",
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        hideMobileCloseButton={true}
      />

      <main className="flex-1 overflow-y-auto pt-[10px]">
        <div className="container p-4 max-w-7xl mx-auto">
          {/* Header Section - push content down to avoid overlap with menu button */}
          <div className="flex items-center justify-between mb-4 pt-8 md:pt-0">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold">MediLog</h1>
            </div>
            {!isMobile && (
              <Button 
                onClick={handleAddNewRecord}
                className="bg-health-blue text-white hover:bg-health-blue/90"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Record
              </Button>
            )}
          </div>

          <Outlet />

          {/* Mobile Floating Button */}
          {isMobile && (
            <div className="fixed bottom-4 right-4">
              <Button 
                onClick={handleAddNewRecord}
                className="rounded-full w-14 h-14 bg-health-blue text-white hover:bg-health-blue/90 shadow-lg"
              >
                <PlusCircle className="h-6 w-6" />
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Layout;
