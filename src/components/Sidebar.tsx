
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
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
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={cn(
      "h-screen bg-white border-r",
      className
    )}>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <span className="text-xl font-bold">MediLog</span>
          <button 
            className="md:hidden p-1 rounded-full hover:bg-gray-100"
            aria-label="Close sidebar"
            onClick={() => document.querySelector('.fixed.z-50')?.dispatchEvent(new MouseEvent('click'))}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-2">
          <div className="mb-4">
            <p className="px-4 text-sm font-medium text-gray-500 uppercase">Main Menu</p>
            <nav className="mt-2">
              <NavLink to="/dashboard" icon={<LayoutDashboard className="h-5 w-5" />} label="Dashboard" active={isActive('/dashboard')} />
              <NavLink to="/reports" icon={<FileText className="h-5 w-5" />} label="Health Reports" active={isActive('/reports')} />
              <NavLink to="/consultations" icon={<ClipboardList className="h-5 w-5" />} label="Consultations" active={isActive('/consultations')} />
              <NavLink to="/vitals" icon={<ActivitySquare className="h-5 w-5" />} label="Vital Metrics" active={isActive('/vitals')} />
              <NavLink to="/medications" icon={<Pill className="h-5 w-5" />} label="Medications" active={isActive('/medications')} />
              <NavLink to="/analytics" icon={<BarChartBig className="h-5 w-5" />} label="Analytics" active={isActive('/analytics')} />
              <NavLink to="/assistant" icon={<MessageCircle className="h-5 w-5" />} label="Health Assistant" active={isActive('/assistant')} />
            </nav>
          </div>
          
          <div>
            <p className="px-4 text-sm font-medium text-gray-500 uppercase">Account</p>
            <nav className="mt-2">
              <NavLink to="/settings" icon={<Settings className="h-5 w-5" />} label="Settings" active={isActive('/settings')} />
              <NavLink to="/help" icon={<HelpCircle className="h-5 w-5" />} label="Help & Support" active={isActive('/help')} />
            </nav>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t text-xs text-gray-500">
          MediLog v1.0.0 • Your health data stays on your device
        </div>
      </div>
    </div>
  );
};

// Helper component for navigation links
const NavLink = ({ to, icon, label, active }: { to: string; icon: React.ReactNode; label: string; active: boolean }) => (
  <Link 
    to={to} 
    className={cn(
      "flex items-center gap-2 px-4 py-2 rounded-md",
      active ? "bg-blue-50 text-blue-600" : "hover:bg-gray-100"
    )}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

export default Sidebar;
