import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Task, insertTaskSchema } from "@shared/schema";
import { formatDateForInput, formatTimeForInput } from "@/lib/date-utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskToEdit?: Task;
}

const taskFormSchema = insertTaskSchema.extend({
  time: z.string(),
}).transform((data) => {
  // Combine date and time
  if (typeof data.date === 'string' && data.time) {
    const [year, month, day] = data.date.split('-').map(Number);
    const [hours, minutes] = data.time.split(':').map(Number);
    
    const combinedDate = new Date(year, month - 1, day, hours, minutes);
    return {
      ...data,
      date: combinedDate.toISOString(),
    };
  }
  return data;
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

export default function TaskDialog({ 
  open, 
  onOpenChange, 
  taskToEdit 
}: TaskDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const isEditing = !!taskToEdit;

  // Default values for the form
  const defaultValues: Partial<TaskFormValues> = {
    title: taskToEdit?.title || "",
    description: taskToEdit?.description || "",
    date: taskToEdit ? formatDateForInput(taskToEdit.date) : formatDateForInput(new Date()),
    time: taskToEdit ? formatTimeForInput(taskToEdit.date) : formatTimeForInput(new Date()),
    completed: taskToEdit?.completed || false,
  };

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: TaskFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditing && taskToEdit) {
        await apiRequest("PATCH", `/api/tasks/${taskToEdit.id}`, data);
        toast({
          title: "Task updated",
          description: "Your task has been updated successfully",
        });
      } else {
        await apiRequest("POST", "/api/tasks", data);
        toast({
          title: "Task created",
          description: "Your task has been created successfully",
        });
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      onOpenChange(false);
      form.reset(defaultValues);
    } catch (error) {
      toast({
        title: "Failed to save task",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Task" : "Add New Task"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Task Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter task title" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter task description"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
              >
                {isEditing ? "Update Task" : "Add Task"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
