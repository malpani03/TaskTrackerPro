import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Expense, ExpenseCategory, categoryColorMap } from "@shared/schema";
import { DateFilter, filterExpensesByDate, groupExpensesByCategory, getCategoryPercentages } from "@/lib/date-utils";

interface ExpensePieChartProps {
  expenses: Expense[];
  filter: DateFilter;
}

export default function ExpensePieChart({ expenses, filter }: ExpensePieChartProps) {
  const [chartData, setChartData] = useState<Array<{ name: string; value: number }>>([]);
  const [percentages, setPercentages] = useState<Record<string, number>>({});

  const COLORS = {
    "Food": "#4F46E5",      // indigo/primary
    "Travel": "#0EA5E9",    // blue/secondary
    "Bills": "#22C55E",     // green
    "Entertainment": "#F59E0B", // yellow
    "Other": "#EF4444"      // red
  };

  useEffect(() => {
    const filteredExpenses = filterExpensesByDate(expenses, filter);
    const categoryTotals = groupExpensesByCategory(filteredExpenses);
    const percentagesByCategory = getCategoryPercentages(categoryTotals);
    
    const data = Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
    }));
    
    setChartData(data);
    setPercentages(percentagesByCategory);
  }, [expenses, filter]);

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={false}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.name as keyof typeof COLORS] || "#9CA3AF"} 
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 space-y-2">
          {Object.entries(percentages).map(([category, percentage]) => (
            <div key={category} className="flex items-center">
              <span 
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: COLORS[category as keyof typeof COLORS] || "#9CA3AF" }}
              ></span>
              <span className="text-sm text-gray-700">
                {category} - {percentage}%
              </span>
            </div>
          ))}
          
          {chartData.length === 0 && (
            <div className="text-center text-gray-500 py-2">
              No expense data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
