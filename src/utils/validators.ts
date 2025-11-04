/**
 * Validation utilities for forms
 */

export const validators = {
  email: {
    required: true,
    type: 'email' as const,
    message: 'Please enter a valid email address',
  },
  
  password: {
    required: true,
    min: 6,
    message: 'Password must be at least 6 characters',
  },
  
  required: {
    required: true,
    message: 'This field is required',
  },
  
  arabicText: {
    pattern: /[\u0600-\u06FF]/,
    message: 'Please enter Arabic text',
  },
};

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isStrongPassword(password: string): boolean {
  return password.length >= 6;
}

/**
 * Validate file type
 */
export function isValidFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some(type => file.type.includes(type));
}

/**
 * Validate file size
 */
export function isValidFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Validate Arabic text
 */
export function containsArabic(text: string): boolean {
  const arabicRegex = /[\u0600-\u06FF]/;
  return arabicRegex.test(text);
}
