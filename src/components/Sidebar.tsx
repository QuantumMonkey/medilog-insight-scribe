import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarFooter
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  FileText, 
  ActivitySquare, 
  Pill, 
  BarChartBig, 
  MessageCircle, 
  Settings, 
  HelpCircle,
  Menu,
  ClipboardList,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";

const Sidebar = ({ className }: { className?: string }) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <SidebarContainer className={cn(
      "fixed md:relative h-screen transition-transform duration-300 z-40",
      "md:translate-x-0", // Always visible on tablet/desktop
      className // Allows Layout to control mobile state
    )}>
      <SidebarHeader className="flex items-center px-4 py-2">
        <SidebarTrigger className="mr-2" data-sidebar="trigger">
          <Menu className="h-5 w-5" />
        </SidebarTrigger>
        <span className="text-xl font-bold">MediLog</span>
        {/* Mobile close button (NEW) */}
        <button 
          className="md:hidden absolute top-4 right-4 p-1 rounded-full hover:bg-accent"
          onClick={() => document.querySelector('[data-sidebar="trigger"]')?.click()}
        >
          <X className="h-5 w-5" />
        </button>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/') ? 'bg-accent' : ''}>
                  <Link to="/">
                    <LayoutDashboard className="mr-2 h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/reports') ? 'bg-accent' : ''}>
                  <Link to="/reports">
                    <FileText className="mr-2 h-5 w-5" />
                    <span>Health Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/consultations') ? 'bg-accent' : ''}>
                  <Link to="/consultations">
                    <ClipboardList className="mr-2 h-5 w-5" />
                    <span>Consultations</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/vitals') ? 'bg-accent' : ''}>
                  <Link to="/vitals">
                    <ActivitySquare className="mr-2 h-5 w-5" />
                    <span>Vital Metrics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/medications') ? 'bg-accent' : ''}>
                  <Link to="/medications">
                    <Pill className="mr-2 h-5 w-5" />
                    <span>Medications</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/analytics') ? 'bg-accent' : ''}>
                  <Link to="/analytics">
                    <BarChartBig className="mr-2 h-5 w-5" />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/assistant') ? 'bg-accent' : ''}>
                  <Link to="/assistant">
                    <MessageCircle className="mr-2 h-5 w-5" />
                    <span>Health Assistant</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/settings') ? 'bg-accent' : ''}>
                  <Link to="/settings">
                    <Settings className="mr-2 h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild className={isActive('/help') ? 'bg-accent' : ''}>
                  <Link to="/help">
                    <HelpCircle className="mr-2 h-5 w-5" />
                    <span>Help & Support</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-4 py-2 text-xs text-muted-foreground">
        MediLog v1.0.0 • Your health data stays on your device
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;