import { AxiosError } from 'axios';

export interface ApiError {
  message: string;
  messageAr?: string;
  status?: number;
  data?: any;
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    const apiError = error as any;
    return {
      message: apiError.message || 'An error occurred',
      messageAr: apiError.messageAr,
      status: apiError.status,
      data: apiError.data,
    };
  }

  return {
    message: 'An unexpected error occurred',
  };
}

export function getErrorMessage(error: unknown, language: string = 'ar'): string {
  const apiError = handleApiError(error);
  
  if (language === 'ar' && apiError.messageAr) {
    return apiError.messageAr;
  }
  
  return apiError.message;
}
