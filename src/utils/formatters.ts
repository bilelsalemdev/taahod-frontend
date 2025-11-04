import dayjs from 'dayjs';
import 'dayjs/locale/ar';

/**
 * Format file size in bytes to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Format date to Arabic locale
 */
export function formatDateArabic(date: string | Date): string {
  return dayjs(date).locale('ar').format('DD MMMM YYYY');
}

/**
 * Format date and time to Arabic locale
 */
export function formatDateTimeArabic(date: string | Date): string {
  return dayjs(date).locale('ar').format('DD MMMM YYYY - HH:mm');
}

/**
 * Format relative time (e.g., "منذ ساعتين")
 */
export function formatRelativeTime(date: string | Date, language: string = 'ar'): string {
  const now = dayjs();
  const target = dayjs(date);
  const diffInMinutes = now.diff(target, 'minute');
  const diffInHours = now.diff(target, 'hour');
  const diffInDays = now.diff(target, 'day');

  if (language === 'ar') {
    if (diffInMinutes < 1) return 'الآن';
    if (diffInMinutes < 60) return `منذ ${diffInMinutes} دقيقة`;
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    if (diffInDays < 7) return `منذ ${diffInDays} يوم`;
    return formatDateArabic(date);
  } else {
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return dayjs(date).format('MMM DD, YYYY');
  }
}

/**
 * Format duration in seconds to readable format
 */
export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Format number with Arabic numerals
 */
export function formatNumberArabic(num: number): string {
  return num.toLocaleString('ar-SA');
}
