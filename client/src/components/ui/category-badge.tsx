import { cn } from "@/lib/utils";
import { ExpenseCategory, categoryColorMap } from "@shared/schema";

interface CategoryBadgeProps {
  category: ExpenseCategory | string;
  className?: string;
}

export const CategoryBadge = ({ category, className }: CategoryBadgeProps) => {
  const getColorClasses = (category: string) => {
    const colorKey = category as keyof typeof categoryColorMap;
    const color = categoryColorMap[colorKey] || "gray";
    
    switch (color) {
      case "indigo":
        return "bg-indigo-100 text-primary";
      case "blue":
        return "bg-blue-100 text-secondary";
      case "green":
        return "bg-green-100 text-green-800";
      case "yellow":
        return "bg-yellow-100 text-yellow-800";
      case "red":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <span className={cn(
      "px-2 inline-flex text-xs leading-5 font-semibold rounded-full",
      getColorClasses(category),
      className
    )}>
      {category}
    </span>
  );
};
