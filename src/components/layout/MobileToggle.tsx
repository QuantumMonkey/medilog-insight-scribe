"use client";
import { Menu } from "lucide-react";

export function MobileToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="md:hidden fixed z-50 top-4 left-4 p-2 bg-white rounded-lg shadow-lg"
    >
      <Menu className="h-6 w-6" />
    </button>
  );
}