import { format, isToday, isYesterday, isTomorrow } from 'date-fns';

export function formatDueDate(dateString: string) {
  const date = new Date(dateString);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  if (isTomorrow(date)) return 'Tomorrow';
  return format(date, 'MMM d, yyyy');
}

export function formatRelativeTime(dateString: string) {
  const date = new Date(dateString);
  return format(date, 'MMM d, h:mm a');
}
