import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DateFilterButtons } from "@/components/ui/date-filter";
import { DateFilter, filterExpensesByDate, getDailyExpenses, getWeekDays } from "@/lib/date-utils";
import { Expense } from "@shared/schema";

interface ExpenseChartProps {
  expenses: Expense[];
}

export default function ExpenseChart({ expenses }: ExpenseChartProps) {
  const [filter, setFilter] = useState<DateFilter>("day");
  const [chartData, setChartData] = useState<Array<{ name: string; amount: number }>>([]);

  useEffect(() => {
    const filteredExpenses = filterExpensesByDate(expenses, filter);
    const weekdays = getWeekDays();
    const dailyAmounts = getDailyExpenses(filteredExpenses);
    
    const data = weekdays.map((day, index) => ({
      name: day,
      amount: dailyAmounts[index],
    }));
    
    setChartData(data);
  }, [expenses, filter]);

  const formatYAxis = (value: number) => {
    return `$${value}`;
  };

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-md rounded-md border">
          <p className="font-medium text-gray-700">{`${label}`}</p>
          <p className="text-primary font-medium">{`$${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <CardTitle className="text-lg font-medium text-gray-700 mb-2 md:mb-0">
            Expense Breakdown
          </CardTitle>
          <DateFilterButtons currentFilter={filter} onChange={setFilter} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis 
                tickFormatter={formatYAxis} 
                tick={{ fontSize: 12 }} 
                width={45}
              />
              <Tooltip content={customTooltip} />
              <Bar 
                dataKey="amount" 
                fill="hsl(236 72% 58%)" 
                radius={[4, 4, 0, 0]} 
                barSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
