import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2 } from "lucide-react";
import { Task } from "@shared/schema";
import { formatTime } from "@/lib/date-utils";
import { cn } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export default function TaskItem({ task, onEdit }: TaskItemProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const toggleCompleted = async () => {
    try {
      setIsLoading(true);
      await apiRequest("PATCH", `/api/tasks/${task.id}`, {
        completed: !task.completed,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: task.completed ? "Task marked as incomplete" : "Task completed",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Failed to update task",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await apiRequest("DELETE", `/api/tasks/${task.id}`);
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: "Task deleted",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Failed to delete task",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const taskDate = new Date(task.date);
  const taskTime = formatTime(taskDate);

  return (
    <div className={cn(
      "flex items-center justify-between p-3 rounded-md",
      task.completed 
        ? "bg-gray-50" 
        : "bg-white border border-gray-100"
    )}>
      <div className="flex items-center">
        <Checkbox 
          id={`task-${task.id}`}
          checked={task.completed}
          onCheckedChange={toggleCompleted}
          disabled={isLoading}
          className="h-4 w-4 text-primary rounded border-gray-300 mr-3"
        />
        <div>
          <p className={cn(
            "text-sm font-medium",
            task.completed 
              ? "text-gray-500 line-through" 
              : "text-gray-700"
          )}>
            {task.title}
          </p>
          <p className="text-xs text-gray-500">{taskTime}</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button 
          className="text-gray-400 hover:text-gray-600" 
          onClick={() => onEdit(task)}
          disabled={isLoading}
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button 
          className="text-gray-400 hover:text-red-500" 
          onClick={handleDelete}
          disabled={isLoading}
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
