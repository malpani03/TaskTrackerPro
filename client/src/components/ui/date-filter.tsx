import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DateFilter } from "@/lib/date-utils";

interface DateFilterProps {
  currentFilter: DateFilter;
  onChange: (filter: DateFilter) => void;
  className?: string;
}

export const DateFilterButtons = ({ currentFilter, onChange, className }: DateFilterProps) => {
  return (
    <div className={cn("flex space-x-2", className)}>
      <Button
        variant={currentFilter === "day" ? "default" : "outline"}
        size="sm"
        onClick={() => onChange("day")}
        className={cn(
          "px-3 py-1 text-sm rounded-md font-medium",
          currentFilter === "day" ? "bg-indigo-50 text-primary hover:bg-indigo-100" : ""
        )}
      >
        Day
      </Button>
      <Button
        variant={currentFilter === "week" ? "default" : "outline"}
        size="sm"
        onClick={() => onChange("week")}
        className={cn(
          "px-3 py-1 text-sm rounded-md font-medium",
          currentFilter === "week" ? "bg-indigo-50 text-primary hover:bg-indigo-100" : ""
        )}
      >
        Week
      </Button>
      <Button
        variant={currentFilter === "month" ? "default" : "outline"}
        size="sm"
        onClick={() => onChange("month")}
        className={cn(
          "px-3 py-1 text-sm rounded-md font-medium",
          currentFilter === "month" ? "bg-indigo-50 text-primary hover:bg-indigo-100" : ""
        )}
      >
        Month
      </Button>
    </div>
  );
};
