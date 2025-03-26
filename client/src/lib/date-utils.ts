import {
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
  isWithinInterval,
  isSameDay,
  isSameMonth,
  parseISO,
  addDays,
  isAfter,
  isBefore,
  isValid,
  formatDistanceToNow
} from "date-fns";
import { Expense, Task } from "@shared/schema";

export type DateFilter = "day" | "week" | "month" | "all";

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "MMM dd, yyyy");
};

export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "h:mm a");
};

export const formatDateForInput = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "yyyy-MM-dd");
};

export const formatTimeForInput = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return format(dateObj, "HH:mm");
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return `${format(dateObj, "h:mm a")} - ${format(dateObj, "MMM dd, yyyy")}`;
};

export const formatRelative = (date: Date | string): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
};

export const getFilterDates = (filter: DateFilter): { start: Date; end: Date } => {
  const now = new Date();
  switch (filter) {
    case "day":
      return {
        start: startOfDay(now),
        end: endOfDay(now),
      };
    case "week":
      return {
        start: startOfWeek(now, { weekStartsOn: 1 }),
        end: endOfWeek(now, { weekStartsOn: 1 }),
      };
    case "month":
      return {
        start: startOfMonth(now),
        end: endOfMonth(now),
      };
    case "all":
    default:
      return {
        start: new Date(0),
        end: new Date(8640000000000000), // max date
      };
  }
};

export const filterExpensesByDate = (
  expenses: Expense[],
  filter: DateFilter
): Expense[] => {
  const { start, end } = getFilterDates(filter);
  return expenses.filter((expense) => 
    isWithinInterval(new Date(expense.date), { start, end })
  );
};

export const filterTasksByDate = (
  tasks: Task[],
  filter: DateFilter
): Task[] => {
  const { start, end } = getFilterDates(filter);
  return tasks.filter((task) => 
    isWithinInterval(new Date(task.date), { start, end })
  );
};

export const getTodaysTasks = (tasks: Task[]): Task[] => {
  const today = new Date();
  return tasks.filter(task => isSameDay(new Date(task.date), today));
};

export const getExpenseTotalByFilter = (expenses: Expense[], filter: DateFilter): number => {
  const filteredExpenses = filterExpensesByDate(expenses, filter);
  return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
};

export const getWeekDays = (): string[] => {
  const result = [];
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
  
  for (let i = 0; i < 7; i++) {
    const day = addDays(startOfCurrentWeek, i);
    result.push(format(day, "EEE"));
  }
  
  return result;
};

export const getDailyExpenses = (expenses: Expense[]): number[] => {
  const weekDays = [];
  const today = new Date();
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 });
  
  for (let i = 0; i < 7; i++) {
    const day = addDays(startOfCurrentWeek, i);
    const dailyExpenses = expenses.filter(expense => 
      isSameDay(new Date(expense.date), day)
    );
    const total = dailyExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    weekDays.push(Number(total.toFixed(2)));
  }
  
  return weekDays;
};

export const groupExpensesByCategory = (expenses: Expense[]): Record<string, number> => {
  return expenses.reduce((acc, expense) => {
    const category = expense.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);
};

export const getCategoryPercentages = (
  categoryTotals: Record<string, number>
): Record<string, number> => {
  const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
  
  if (total === 0) return {};
  
  return Object.entries(categoryTotals).reduce((acc, [category, amount]) => {
    acc[category] = Math.round((amount / total) * 100);
    return acc;
  }, {} as Record<string, number>);
};
