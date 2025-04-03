
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { useIsMobile } from '@/hooks/use-mobile';

const Layout = () => {
  const isMobile = useIsMobile();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="container p-4 max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">MediLog</h1>
              {!isMobile && (
                <Button className="bg-health-blue text-white hover:bg-health-blue/90">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add New Record
                </Button>
              )}
            </div>
            <Outlet />
            {isMobile && (
              <div className="fixed bottom-4 right-4">
                <Button className="rounded-full w-14 h-14 bg-health-blue text-white hover:bg-health-blue/90 shadow-lg">
                  <PlusCircle className="h-6 w-6" />
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
