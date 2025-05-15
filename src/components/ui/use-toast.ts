
import { useToast as useToastHook, toast as toastFunction } from "@/hooks/use-toast";

// Re-export the hooks with the same names for compatibility
export const useToast = useToastHook;
export const toast = toastFunction;
