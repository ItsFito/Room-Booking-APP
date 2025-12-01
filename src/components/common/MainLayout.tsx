"use client";

import { ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-24">{children}</main>
      <BottomNavigation />
    </div>
  );
}
