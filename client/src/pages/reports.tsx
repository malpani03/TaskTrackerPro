import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DateFilterButtons } from "@/components/ui/date-filter";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";
import { Expense, expenseCategories, categoryColorMap } from "@shared/schema";
import { DateFilter, filterExpensesByDate, getExpenseTotalByFilter, groupExpensesByCategory, getCategoryPercentages } from "@/lib/date-utils";

export default function Reports() {
  const [dateFilter, setDateFilter] = useState<DateFilter>("month");
  const [selectedTab, setSelectedTab] = useState<string>("expenses");
  const [barChartData, setBarChartData] = useState<any[]>([]);
  const [pieChartData, setPieChartData] = useState<any[]>([]);
  const [categoryPercentages, setCategoryPercentages] = useState<Record<string, number>>({});

  // Fetch expenses
  const {
    data: expenses = [],
    isLoading,
    error,
  } = useQuery<Expense[]>({
    queryKey: ['/api/expenses'],
  });

  // Colors for charts
  const COLORS = {
    "Food": "#4F46E5",      // indigo/primary
    "Travel": "#0EA5E9",    // blue/secondary
    "Bills": "#22C55E",     // green
    "Entertainment": "#F59E0B", // yellow
    "Other": "#EF4444"      // red
  };

  useEffect(() => {
    if (!isLoading && !error) {
      const filteredExpenses = filterExpensesByDate(expenses, dateFilter);
      
      // Prepare bar chart data
      const categoryTotals = groupExpensesByCategory(filteredExpenses);
      const barData = Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        amount: value,
      }));
      setBarChartData(barData);
      
      // Prepare pie chart data
      const pieData = Object.entries(categoryTotals).map(([name, value]) => ({
        name,
        value,
      }));
      setPieChartData(pieData);
      
      // Calculate percentages
      const percentages = getCategoryPercentages(categoryTotals);
      setCategoryPercentages(percentages);
    }
  }, [expenses, dateFilter, isLoading, error]);

  const formatCurrency = (value: number) => {
    return `$${value.toFixed(2)}`;
  };

  const totalAmount = filterExpensesByDate(expenses, dateFilter)
    .reduce((sum, expense) => sum + expense.amount, 0);

  const renderBarChart = () => {
    if (isLoading) {
      return <Skeleton className="w-full h-[400px]" />;
    }
    
    if (error) {
      return <div className="text-center py-4 text-gray-500">Failed to load expense data</div>;
    }

    if (barChartData.length === 0) {
      return <div className="text-center py-4 text-gray-500">No expense data available</div>;
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis 
            tickFormatter={formatCurrency}
            width={60}
          />
          <Tooltip 
            formatter={(value: number) => formatCurrency(value)}
            cursor={{fill: 'rgba(200, 200, 200, 0.2)'}}
          />
          <Bar 
            dataKey="amount" 
            fill="hsl(236 72% 58%)" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderPieChart = () => {
    if (isLoading) {
      return <Skeleton className="w-full h-[400px]" />;
    }
    
    if (error) {
      return <div className="text-center py-4 text-gray-500">Failed to load expense data</div>;
    }

    if (pieChartData.length === 0) {
      return <div className="text-center py-4 text-gray-500">No expense data available</div>;
    }

    return (
      <div className="flex flex-col items-center md:flex-row md:items-start gap-6">
        <div className="w-full md:w-1/2">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieChartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={COLORS[entry.name as keyof typeof COLORS] || "#9CA3AF"} 
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="w-full md:w-1/2">
          <h3 className="text-lg font-medium mb-4">Expense Distribution</h3>
          <div className="space-y-4">
            {Object.entries(categoryPercentages).map(([category, percentage]) => (
              <div key={category} className="flex items-center justify-between">
                <div className="flex items-center">
                  <span 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[category as keyof typeof COLORS] || "#9CA3AF" }}
                  ></span>
                  <span className="text-gray-700">{category}</span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-900 font-medium">
                    {formatCurrency(
                      (pieChartData.find(item => item.name === category)?.value as number) || 0
                    )}
                  </span>
                  <span className="text-gray-500 w-12 text-right">{percentage}%</span>
                </div>
              </div>
            ))}
            
            <div className="pt-4 border-t mt-4">
              <div className="flex items-center justify-between font-medium">
                <span className="text-gray-800">Total</span>
                <span className="text-gray-900">{formatCurrency(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
          <p className="mt-1 text-gray-600">Analyze your expenses and track your spending patterns</p>
        </div>
        <div className="mt-4 md:mt-0">
          <DateFilterButtons currentFilter={dateFilter} onChange={setDateFilter} />
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Expense Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-sm text-gray-500 mb-1">Total Expenses</div>
              {isLoading ? (
                <Skeleton className="h-7 w-24" />
              ) : (
                <div className="text-2xl font-bold text-primary">
                  {formatCurrency(totalAmount)}
                </div>
              )}
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-sm text-gray-500 mb-1">Average per Day</div>
              {isLoading ? (
                <Skeleton className="h-7 w-24" />
              ) : (
                <div className="text-2xl font-bold text-secondary">
                  {formatCurrency(totalAmount / 30)} {/* Simplified calculation */}
                </div>
              )}
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-sm text-gray-500 mb-1">Highest Category</div>
              {isLoading ? (
                <Skeleton className="h-7 w-24" />
              ) : (
                <div className="text-2xl font-bold text-green-600">
                  {barChartData.length > 0 
                    ? barChartData.sort((a, b) => b.amount - a.amount)[0]?.name || "None"
                    : "None"
                  }
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <CardTitle>Expense Analytics</CardTitle>
              <TabsList className="mt-3 md:mt-0">
                <TabsTrigger value="expenses">
                  By Category
                </TabsTrigger>
                <TabsTrigger value="distribution">
                  Distribution
                </TabsTrigger>
              </TabsList>
            </div>
          </CardHeader>
          <CardContent>
            <TabsContent value="expenses" className="mt-0">
              {renderBarChart()}
            </TabsContent>
            
            <TabsContent value="distribution" className="mt-0">
              {renderPieChart()}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
}
