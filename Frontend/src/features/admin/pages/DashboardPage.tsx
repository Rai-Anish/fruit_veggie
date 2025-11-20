import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BookOpen,
  CircleUserRound,
  ShoppingCart,
  DollarSign,
  TrendingUp,
} from 'lucide-react'
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts'

// Stats
const stats = [
  { label: 'Total Customers', value: '200000' },
  { label: 'Total Orders', value: '3000' },
  { label: 'Daily Sales', value: '$245,000' },
  { label: 'Total Sales', value: '$3,430,000' },
  { label: 'Total Profit', value: '$1,200,000' },
]

const iconMap = {
  'Total Customers': CircleUserRound,
  'Total Orders': ShoppingCart,
  'Daily Sales': TrendingUp,
  'Total Sales': DollarSign,
  'Total Profit': DollarSign,
}

const colorMap = {
  'Total Customers': 'bg-blue-100',
  'Total Orders': 'bg-purple-100',
  'Daily Sales': 'bg-orange-100',
  'Total Sales': 'bg-green-100',
  'Total Profit': 'bg-yellow-100',
}

const bubbleColorMap = {
  'Total Customers': 'bg-blue-200',
  'Total Orders': 'bg-purple-200',
  'Daily Sales': 'bg-orange-200',
  'Total Sales': 'bg-green-200',
  'Total Profit': 'bg-yellow-200',
}

// Donut Chart Data - Total Sales Breakdown
const salesStatusData = [
  { name: 'Active', value: 500000 },
  { name: 'On Hold', value: 200000 },
  { name: 'Completed', value: 2730000 },
]
const donutColors = ['#3b82f6', '#facc15', '#22c55e']

// Monthly Sales Area Chart
const monthlySales = [
  { month: 'Jan', sales: 200000 },
  { month: 'Feb', sales: 250000 },
  { month: 'Mar', sales: 300000 },
  { month: 'Apr', sales: 320000 },
  { month: 'May', sales: 400000 },
  { month: 'Jun', sales: 280000 },
  { month: 'Jul', sales: 420000 },
  { month: 'Aug', sales: 460000 },
  { month: 'Sep', sales: 400000 },
  { month: 'Oct', sales: 530000 },
  { month: 'Nov', sales: 570000 },
  { month: 'Dec', sales: 600000 },
]

// Top Customers List
const topCustomers = [
  { name: 'John Carter', orders: 120, spent: '$32,000' },
  { name: 'Emily Stone', orders: 98, spent: '$27,400' },
  { name: 'Michael Lee', orders: 86, spent: '$22,900' },
  { name: 'Sophia Green', orders: 75, spent: '$20,100' },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 w-full ">
      {/* Stats Scroll Section */}
      <div className="flex overflow-x-auto justify-between gap-4 no-scrollbar py-2">
        {stats.map((s, i) => {
          const Icon = iconMap[s.label] || BookOpen
          const bgColor = colorMap[s.label] || 'bg-gray-100'
          const bubbleColor = bubbleColorMap[s.label] || 'bg-gray-200'

          return (
            <Card
              key={i}
              className={`${bgColor} md:w-[280px] w-[220px] flex-shrink-0 rounded-xl shadow-sm`}
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className={`p-3 rounded-full ${bubbleColor}`}>
                  <Icon className="h-8 w-8 text-muted-foreground" />
                </div>

                <div className="flex flex-col text-right">
                  <span className="text-sm text-muted-foreground">
                    {s.label}
                  </span>
                  <span className="xl:text-3xl text-muted-foreground text-xl font-semibold">
                    {s.value}
                  </span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Reordered Charts: Line (Area) left, Donut right */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Area Chart */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Monthly Sales Overview</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={monthlySales}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorSales)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Donut Chart */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Sales by Status</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesStatusData}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {salesStatusData.map((entry, index) => (
                    <Cell key={index} fill={donutColors[index]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Customers */}
      <Card className="rounded-xl shadow-sm">
        <CardHeader>
          <CardTitle>Top Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {topCustomers.map((c, i) => (
              <div
                key={i}
                className="flex justify-between items-center p-3 border-b last:border-none"
              >
                <span className="font-medium">{c.name}</span>
                <div className="text-right">
                  <span className="block text-sm text-muted-foreground">
                    Orders: {c.orders}
                  </span>
                  <span className="font-semibold">{c.spent}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
