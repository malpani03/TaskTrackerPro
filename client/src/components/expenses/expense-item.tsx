import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Expense } from "@shared/schema";
import { formatDate } from "@/lib/date-utils";
import { CategoryBadge } from "@/components/ui/category-badge";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface ExpenseItemProps {
  expense: Expense;
  onEdit: (expense: Expense) => void;
}

export default function ExpenseItem({ expense, onEdit }: ExpenseItemProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await apiRequest("DELETE", `/api/expenses/${expense.id}`);
      queryClient.invalidateQueries({ queryKey: ['/api/expenses'] });
      toast({
        title: "Expense deleted",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Failed to delete expense",
        description: error instanceof Error ? error.message : "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <tr>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {formatDate(expense.date)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{expense.description}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <CategoryBadge category={expense.category} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
        ${expense.amount.toFixed(2)}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex space-x-2">
          <button 
            className="text-gray-500 hover:text-gray-700" 
            onClick={() => onEdit(expense)}
            disabled={isLoading}
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button 
            className="text-gray-500 hover:text-red-500" 
            onClick={handleDelete}
            disabled={isLoading}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
