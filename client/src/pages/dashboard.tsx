import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, ListChecks, Wallet, BarChart3, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TaskItem from "@/components/tasks/task-item";
import TaskDialog from "@/components/tasks/task-dialog";
import ExpenseDialog from "@/components/expenses/expense-dialog";
import StatsCard from "@/components/dashboard/stats-card";
import ExpenseChart from "@/components/dashboard/expense-chart";
import ExpensePieChart from "@/components/dashboard/expense-pie-chart";
import { Task, Expense } from "@shared/schema";
import { DateFilter, filterExpensesByDate, filterTasksByDate, formatDate, getExpenseTotalByFilter, getTodaysTasks } from "@/lib/date-utils";
import { Link } from "wouter";

export default function Dashboard() {
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);
  const [selectedDateFilter, setSelectedDateFilter] = useState<DateFilter>("day");

  // Fetch tasks
  const {
    data: tasks = [],
    isLoading: isLoadingTasks,
    error: tasksError,
  } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });

  // Fetch expenses
  const {
    data: expenses = [],
    isLoading: isLoadingExpenses,
    error: expensesError,
  } = useQuery<Expense[]>({
    queryKey: ['/api/expenses'],
  });

  const handleAddTask = () => {
    setTaskToEdit(undefined);
    setTaskDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setTaskDialogOpen(true);
  };

  const handleAddExpense = () => {
    setExpenseDialogOpen(true);
  };

  // Get today's tasks
  const todaysTasks = getTodaysTasks(tasks);
  const completedTodaysTasks = todaysTasks.filter(task => task.completed).length;

  // Get expenses for different time periods
  const todayExpenseTotal = getExpenseTotalByFilter(expenses, "day");
  const weeklyExpenseTotal = getExpenseTotalByFilter(expenses, "week");
  const monthlyExpenseTotal = getExpenseTotalByFilter(expenses, "month");

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="mt-1 text-gray-600">Welcome back! Here's an overview of your tasks and expenses.</p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-2">
          <Button onClick={handleAddTask} size="sm" className="flex items-center">
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
          <Button onClick={handleAddExpense} size="sm" variant="secondary" className="flex items-center">
            <Plus className="h-4 w-4 mr-1" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Tasks Today Card */}
        <StatsCard
          title="Tasks Today"
          value={todaysTasks.length}
          icon={<ListChecks className="h-5 w-5" />}
          iconColor="indigo"
          trend={{
            value: `${completedTodaysTasks} completed`,
            direction: "up"
          }}
        />

        {/* Expenses Today Card */}
        <StatsCard
          title="Expenses Today"
          value={`$${todayExpenseTotal.toFixed(2)}`}
          icon={<Wallet className="h-5 w-5" />}
          iconColor="blue"
          trend={todayExpenseTotal > 0 ? {
            value: "Today's spending",
            direction: "down"
          } : {
            value: "No spending today",
            direction: "neutral" 
          }}
        />

        {/* Weekly Expenses Card */}
        <StatsCard
          title="Weekly Expenses"
          value={`$${weeklyExpenseTotal.toFixed(2)}`}
          icon={<BarChart3 className="h-5 w-5" />}
          iconColor="green"
          trend={{
            value: "Weekly total",
            direction: "up"
          }}
        />

        {/* Monthly Expenses Card */}
        <StatsCard
          title="Monthly Expenses"
          value={`$${monthlyExpenseTotal.toFixed(2)}`}
          icon={<Calendar className="h-5 w-5" />}
          iconColor="purple"
          trend={{
            value: "On track with budget",
            direction: "neutral"
          }}
        />
      </div>

      {/* Tasks and Expenses Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Section */}
        <div className="col-span-1 bg-white rounded-lg shadow">
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-medium text-gray-700">Today's Tasks</h2>
            <Button variant="ghost" size="icon" className="text-primary hover:text-indigo-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </Button>
          </div>
          {/* Task list */}
          <div className="p-4 space-y-3">
            {isLoadingTasks ? (
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-center space-x-2 p-3">
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[80%]" />
                    <Skeleton className="h-3 w-[40%]" />
                  </div>
                </div>
              ))
            ) : tasksError ? (
              <div className="p-3 text-center text-sm text-gray-500">
                Failed to load tasks
              </div>
            ) : todaysTasks.length === 0 ? (
              <div className="p-3 text-center text-sm text-gray-500">
                No tasks for today
              </div>
            ) : (
              todaysTasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                />
              ))
            )}

            <Link href="/tasks">
              <a className="w-full mt-4 py-2 text-primary text-sm font-medium bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors flex justify-center">
                View All Tasks
              </a>
            </Link>
          </div>
        </div>

        {/* Expense Chart Section */}
        <div className="col-span-1 lg:col-span-2">
          <div className="flex flex-col gap-6">
            <ExpenseChart expenses={expenses} />
            
            <div className="flex">
              <div className="bg-white rounded-lg shadow w-full">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-medium text-gray-700">Category Breakdown</h2>
                </div>
                <div className="p-4">
                  <ExpensePieChart expenses={expenses} filter={selectedDateFilter} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Task Dialog */}
      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        taskToEdit={taskToEdit}
      />

      {/* Expense Dialog */}
      <ExpenseDialog
        open={expenseDialogOpen}
        onOpenChange={setExpenseDialogOpen}
      />
    </div>
  );
}
