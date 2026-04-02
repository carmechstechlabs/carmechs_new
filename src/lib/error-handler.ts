
import { toast } from "sonner";

export class AppError extends Error {
  constructor(
    public message: string,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = "AppError";
  }
}

export const handleError = (error: any, context?: string) => {
  console.error(`Error in ${context || 'App'}:`, error);

  let userMessage = "An unexpected error occurred. Please try again.";

  if (error instanceof AppError) {
    userMessage = error.message;
  } else if (error.message?.includes("network") || error.message?.includes("fetch") || error.name === "TypeError") {
    userMessage = "Network error. Please check your internet connection or try again later.";
  } else if (error.message?.includes("permission") || error.message?.includes("insufficient") || error.code === "permission-denied") {
    userMessage = "You don't have permission to perform this action. Please sign in or contact support.";
  } else if (error.message?.includes("not found") || error.code === "not-found") {
    userMessage = "The requested resource was not found. It may have been moved or deleted.";
  } else if (error.message?.includes("invalid") || error.code === "invalid-argument") {
    userMessage = "Invalid input provided. Please check your data and try again.";
  } else if (error.message?.includes("quota") || error.code === "resource-exhausted") {
    userMessage = "Service quota exceeded. Please try again later.";
  } else if (error.message?.includes("timeout") || error.code === "deadline-exceeded") {
    userMessage = "The request timed out. Please try again.";
  }

  toast.error(userMessage);
  return userMessage;
};
