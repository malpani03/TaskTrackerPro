import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import TaskItem from "@/components/tasks/task-item";
import TaskDialog from "@/components/tasks/task-dialog";
import { Task } from "@shared/schema";
import { DateFilter, filterTasksByDate } from "@/lib/date-utils";

export default function Tasks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("day");
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | undefined>(undefined);

  // Fetch tasks
  const {
    data: tasks = [],
    isLoading,
    error,
  } = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });

  const handleAddTask = () => {
    setTaskToEdit(undefined);
    setTaskDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setTaskDialogOpen(true);
  };

  // Filter tasks by date and search query
  const filteredTasks = filterTasksByDate(tasks, dateFilter).filter(task => {
    if (!searchQuery) return true;
    return task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (task.description?.toLowerCase() || "").includes(searchQuery.toLowerCase());
  });

  // Split into completed and pending tasks
  const completedTasks = filteredTasks.filter(task => task.completed);
  const pendingTasks = filteredTasks.filter(task => !task.completed);

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tasks</h1>
          <p className="mt-1 text-gray-600">Manage and organize your daily tasks</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button onClick={handleAddTask} className="flex items-center">
            <Plus className="h-4 w-4 mr-1" />
            Add Task
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search tasks..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <TabsList>
              <TabsTrigger 
                value="day" 
                onClick={() => setDateFilter("day")}
                className={dateFilter === "day" ? "bg-indigo-50 text-primary" : ""}
              >
                Today
              </TabsTrigger>
              <TabsTrigger 
                value="week" 
                onClick={() => setDateFilter("week")}
                className={dateFilter === "week" ? "bg-indigo-50 text-primary" : ""}
              >
                This Week
              </TabsTrigger>
              <TabsTrigger 
                value="month" 
                onClick={() => setDateFilter("month")}
                className={dateFilter === "month" ? "bg-indigo-50 text-primary" : ""}
              >
                This Month
              </TabsTrigger>
              <TabsTrigger 
                value="all" 
                onClick={() => setDateFilter("all")}
                className={dateFilter === "all" ? "bg-indigo-50 text-primary" : ""}
              >
                All Tasks
              </TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="pending" className="mb-6">
        <TabsList>
          <TabsTrigger value="pending" className="flex items-center">
            Pending ({pendingTasks.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="flex items-center">
            Completed ({completedTasks.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pending" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3">
                    <Skeleton className="h-4 w-4 rounded-sm" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[80%]" />
                      <Skeleton className="h-3 w-[40%]" />
                    </div>
                  </div>
                ))
              ) : error ? (
                <div className="p-3 text-center text-sm text-gray-500">
                  Failed to load tasks
                </div>
              ) : pendingTasks.length === 0 ? (
                <div className="p-3 text-center text-sm text-gray-500">
                  No pending tasks
                </div>
              ) : (
                pendingTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Completed Tasks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {isLoading ? (
                Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="flex items-center space-x-2 p-3">
                    <Skeleton className="h-4 w-4 rounded-sm" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[80%]" />
                      <Skeleton className="h-3 w-[40%]" />
                    </div>
                  </div>
                ))
              ) : error ? (
                <div className="p-3 text-center text-sm text-gray-500">
                  Failed to load tasks
                </div>
              ) : completedTasks.length === 0 ? (
                <div className="p-3 text-center text-sm text-gray-500">
                  No completed tasks
                </div>
              ) : (
                completedTasks.map(task => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    onEdit={handleEditTask}
                  />
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Task Dialog */}
      <TaskDialog
        open={taskDialogOpen}
        onOpenChange={setTaskDialogOpen}
        taskToEdit={taskToEdit}
      />
    </div>
  );
}
