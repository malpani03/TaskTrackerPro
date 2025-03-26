import { cn } from "@/lib/utils";
import { ArrowDownIcon, ArrowUpIcon, MinusIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconColor?: string; // e.g. "indigo", "blue", "green", "yellow", "red", etc.
  trend?: {
    value: string;
    direction: "up" | "down" | "neutral";
  };
  className?: string;
}

export default function StatsCard({
  title,
  value,
  icon,
  iconColor = "indigo",
  trend,
  className,
}: StatsCardProps) {
  const getIconBgColor = (color: string) => {
    switch (color) {
      case "indigo":
        return "bg-indigo-100";
      case "blue":
        return "bg-blue-100";
      case "green":
        return "bg-green-100";
      case "yellow":
        return "bg-yellow-100";
      case "purple":
        return "bg-purple-100";
      case "red":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  const getIconTextColor = (color: string) => {
    switch (color) {
      case "indigo":
        return "text-primary";
      case "blue":
        return "text-secondary";
      case "green":
        return "text-green-500";
      case "yellow":
        return "text-yellow-500";
      case "purple":
        return "text-purple-500";
      case "red":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case "up":
        return "text-green-500";
      case "down":
        return "text-red-500";
      case "neutral":
      default:
        return "text-yellow-500";
    }
  };

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case "up":
        return <ArrowUpIcon className="h-4 w-4" />;
      case "down":
        return <ArrowDownIcon className="h-4 w-4" />;
      case "neutral":
      default:
        return <MinusIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className={cn("bg-white rounded-lg shadow p-5", className)}>
      <div className="flex items-center justify-between">
        <h2 className="text-gray-500 text-sm font-medium">{title}</h2>
        <span className={cn("rounded-full p-2", getIconBgColor(iconColor))}>
          <div className={getIconTextColor(iconColor)}>{icon}</div>
        </span>
      </div>
      <div className="flex flex-col mt-3">
        <div className="text-3xl font-bold text-gray-800">{value}</div>
        {trend && (
          <div className="flex items-center mt-1 text-sm">
            <span className={cn("flex items-center", getTrendColor(trend.direction))}>
              {getTrendIcon(trend.direction)}
              {trend.value}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
