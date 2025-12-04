"use client";

import { ReactNode } from "react";
import { BottomNavigation } from "./BottomNavigation";

export function MainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="pb-11 sm:pb-16">{children}</main>
      <BottomNavigation />
    </div>
  );
}
