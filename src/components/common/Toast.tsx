"use client";

import { toast } from "sonner";

interface ToastProps {
  title: string;
  message: string;
  type?: "success" | "error" | "info" | "warning";
}

export function showToast({ title, message, type = "info" }: ToastProps) {
  const fullMessage = `${title}: ${message}`;

  switch (type) {
    case "success":
      toast.success(fullMessage);
      break;
    case "error":
      toast.error(fullMessage);
      break;
    case "warning":
      toast.warning(fullMessage);
      break;
    case "info":
    default:
      toast.info(fullMessage);
      break;
  }
}
