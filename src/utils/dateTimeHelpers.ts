export interface DateTimeResult {
  success: boolean;
  formatted?: string;
  isoDate?: string;
  time?: string;
}

export function formatDateInput(value: string): DateTimeResult {
  if (!value.trim()) return { success: false };

  const currentYear = new Date().getFullYear();
  let parsedDate: Date | null = null;

  // Try various date formats
  const datePatterns = [
    // M/D, M/DD, MM/D, MM/DD
    /^(\d{1,2})\/(\d{1,2})$/,
    // M/D/YY, M/D/YYYY, MM/DD/YY, MM/DD/YYYY
    /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/,
    // Month DD, Month D
    /^([a-zA-Z]+)\s+(\d{1,2})$/,
    // Month DD, YYYY
    /^([a-zA-Z]+)\s+(\d{1,2}),?\s+(\d{4})$/,
  ];

  // Pattern 1: M/D or MM/DD (assume current year)
  if (datePatterns[0].test(value)) {
    const match = value.match(datePatterns[0]);
    if (match) {
      const [, month, day] = match;
      parsedDate = new Date(currentYear, parseInt(month) - 1, parseInt(day));
    }
  }
  // Pattern 2: M/D/YY or M/D/YYYY
  else if (datePatterns[1].test(value)) {
    const match = value.match(datePatterns[1]);
    if (match) {
      const [, month, day, year] = match;
      let fullYear = parseInt(year);
      if (fullYear < 100) {
        fullYear += fullYear < 50 ? 2000 : 1900;
      }
      parsedDate = new Date(fullYear, parseInt(month) - 1, parseInt(day));
    }
  }
  // Pattern 3: Month DD (assume current year)
  else if (datePatterns[2].test(value)) {
    const match = value.match(datePatterns[2]);
    if (match) {
      const [, monthName, day] = match;
      const monthIndex = getMonthIndex(monthName);
      if (monthIndex !== -1) {
        parsedDate = new Date(currentYear, monthIndex, parseInt(day));
      }
    }
  }
  // Pattern 4: Month DD, YYYY
  else if (datePatterns[3].test(value)) {
    const match = value.match(datePatterns[3]);
    if (match) {
      const [, monthName, day, year] = match;
      const monthIndex = getMonthIndex(monthName);
      if (monthIndex !== -1) {
        parsedDate = new Date(parseInt(year), monthIndex, parseInt(day));
      }
    }
  }

  if (parsedDate && !isNaN(parsedDate.getTime())) {
    // Format as "Month DDth, YYYY"
    const options: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
    const formatted = parsedDate.toLocaleDateString('en-US', options);
    const isoDate = parsedDate.toISOString().split('T')[0];
    
    return {
      success: true,
      formatted,
      isoDate
    };
  }

  return { success: false };
}

export function formatTimeInput(value: string): DateTimeResult {
  if (!value.trim()) return { success: false };

  let parsedTime: { hours: number; minutes: number } | null = null;
  const timePatterns = [
    // H:MM, HH:MM
    /^(\d{1,2}):(\d{2})$/,
    // H:MMam/pm, HH:MMam/pm, H:MM am/pm, HH:MM am/pm
    /^(\d{1,2}):(\d{2})\s*(am|pm)$/i,
    // Ham/pm, HHam/pm, H am/pm, HH am/pm
    /^(\d{1,2})\s*(am|pm)$/i,
    // Just numbers like 330, 1430 (military time)
    /^(\d{3,4})$/,
  ];

  // Pattern 1: H:MM or HH:MM (24-hour format)
  if (timePatterns[0].test(value)) {
    const match = value.match(timePatterns[0]);
    if (match) {
      const [, hours, minutes] = match;
      const h = parseInt(hours);
      const m = parseInt(minutes);
      if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
        parsedTime = { hours: h, minutes: m };
      }
    }
  }
  // Pattern 2: H:MMam/pm
  else if (timePatterns[1].test(value)) {
    const match = value.match(timePatterns[1]);
    if (match) {
      const [, hours, minutes, period] = match;
      let h = parseInt(hours);
      const m = parseInt(minutes);
      if (period.toLowerCase() === 'pm' && h !== 12) h += 12;
      if (period.toLowerCase() === 'am' && h === 12) h = 0;
      if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
        parsedTime = { hours: h, minutes: m };
      }
    }
  }
  // Pattern 3: Ham/pm
  else if (timePatterns[2].test(value)) {
    const match = value.match(timePatterns[2]);
    if (match) {
      const [, hours, period] = match;
      let h = parseInt(hours);
      if (period.toLowerCase() === 'pm' && h !== 12) h += 12;
      if (period.toLowerCase() === 'am' && h === 12) h = 0;
      if (h >= 0 && h <= 23) {
        parsedTime = { hours: h, minutes: 0 };
      }
    }
  }
  // Pattern 4: Military time (330 = 3:30, 1430 = 14:30)
  else if (timePatterns[3].test(value)) {
    const match = value.match(timePatterns[3]);
    if (match) {
      const [, timeStr] = match;
      if (timeStr.length === 3) {
        const h = parseInt(timeStr.charAt(0));
        const m = parseInt(timeStr.substring(1));
        if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
          parsedTime = { hours: h, minutes: m };
        }
      } else if (timeStr.length === 4) {
        const h = parseInt(timeStr.substring(0, 2));
        const m = parseInt(timeStr.substring(2));
        if (h >= 0 && h <= 23 && m >= 0 && m <= 59) {
          parsedTime = { hours: h, minutes: m };
        }
      }
    }
  }

  if (parsedTime) {
    const formatted = formatTime12Hour(parsedTime.hours, parsedTime.minutes);
    const time = `${parsedTime.hours.toString().padStart(2, '0')}:${parsedTime.minutes.toString().padStart(2, '0')}`;
    
    return {
      success: true,
      formatted,
      time
    };
  }

  return { success: false };
}

function getMonthIndex(monthName: string): number {
  const months = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
  ];
  const shortMonths = [
    'jan', 'feb', 'mar', 'apr', 'may', 'jun',
    'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
  ];
  
  const lowerMonth = monthName.toLowerCase();
  let index = months.findIndex(month => month.startsWith(lowerMonth));
  if (index === -1) {
    index = shortMonths.findIndex(month => month.startsWith(lowerMonth));
  }
  return index;
}

function formatTime12Hour(hours: number, minutes: number): string {
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : (hours > 12 ? hours - 12 : hours);
  const displayMinutes = minutes.toString().padStart(2, '0');
  return `${displayHours}:${displayMinutes} ${period}`;
}

export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('en-US', options);
}

export function getDueDateStatus(dueDate: string): { class: string; text: string } {
  const due = new Date(dueDate);
  const now = new Date();
  const diffTime = due.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { class: 'overdue', text: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}` };
  } else if (diffDays === 0) {
    return { class: 'due-today', text: 'Due today' };
  } else if (diffDays <= 3) {
    return { class: 'due-soon', text: `Due in ${diffDays} day${diffDays !== 1 ? 's' : ''}` };
  } else {
    return { class: '', text: formatDate(due) };
  }
}
