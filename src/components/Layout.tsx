import Sidebar from "./Sidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PlusCircle, Menu } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface LayoutProps {
  isMobileSidebarOpen?: boolean;
  onMobileSidebarToggle?: () => void;
  children: React.ReactNode;
}

const Layout = ({
  isMobileSidebarOpen = true,
  onMobileSidebarToggle = () => {},
  children
}: LayoutProps) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  
  const handleAddNewRecord = () => {
    navigate("/reports/new");
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      {isMobile && (
        <button
          className="fixed z-50 top-4 left-4 p-2 rounded-lg bg-white shadow-lg"
          onClick={onMobileSidebarToggle}
        >
          <Menu className="h-5 w-5" />
        </button>
      )}

      <Sidebar className={cn(
        isMobile ? "fixed z-40" : "relative",
        "transition-transform duration-300",
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )} />

      <main className="flex-1 overflow-y-auto">
        <div className="container p-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
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