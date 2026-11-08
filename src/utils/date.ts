export function formatDate(dateString?: string | null): string {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  });
}

export function formatDateTime(dateString?: string | null, timeString?: string | null): string {
  if (!dateString) return '';
  const datePart = formatDate(dateString);
  if (!timeString) return datePart;
  return `${datePart} at ${timeString}`;
}

export function getTodayString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTomorrowString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, '0');
  const day = String(tomorrow.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function isToday(dateString?: string | null): boolean {
  if (!dateString) return false;
  return dateString === getTodayString();
}

export function isTomorrow(dateString?: string | null): boolean {
  if (!dateString) return false;
  return dateString === getTomorrowString();
}

export function isOverdue(dateString?: string | null, completed: boolean = false): boolean {
  if (!dateString || completed) return false;
  const today = getTodayString();
  return dateString < today;
}

export function getRelativeDateLabel(dateString?: string | null): { label: string; isOverdue: boolean } {
  if (!dateString) return { label: 'No date', isOverdue: false };
  if (isToday(dateString)) return { label: 'Today', isOverdue: false };
  if (isTomorrow(dateString)) return { label: 'Tomorrow', isOverdue: false };
  
  const today = getTodayString();
  if (dateString < today) {
    return { label: `Overdue (${formatDate(dateString)})`, isOverdue: true };
  }
  
  return { label: formatDate(dateString), isOverdue: false };
}
