
import { toast } from 'sonner';

export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  SERVER = 'SERVER',
  AUTH = 'AUTH',
  UNKNOWN = 'UNKNOWN'
}

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: any;
}

export const handleAppError = (error: any, customMessage?: string): AppError => {
  console.error('App Error:', error);
  
  let type = ErrorType.UNKNOWN;
  let message = customMessage || 'An unexpected error occurred. Please try again.';
  
  if (error.message?.includes('Failed to fetch') || error.message?.includes('network')) {
    type = ErrorType.NETWORK;
    message = 'Network error. Please check your internet connection.';
  } else if (error.code?.startsWith('auth/')) {
    type = ErrorType.AUTH;
    message = error.message || 'Authentication failed.';
  } else if (error.code === 'PGRST116' || error.message?.includes('relation')) {
    type = ErrorType.SERVER;
    message = 'Database error. Some resources might be missing.';
  } else if (error.name === 'ValidationError') {
    type = ErrorType.VALIDATION;
    message = error.message || 'Invalid input provided.';
  }
  
  toast.error(message);
  
  return {
    type,
    message,
    originalError: error
  };
};

export const wrapAsync = <T>(promise: Promise<T>, customMessage?: string): Promise<T> => {
  return promise.catch(err => {
    handleAppError(err, customMessage);
    throw err;
  });
};
