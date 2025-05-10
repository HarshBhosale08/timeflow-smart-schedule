
import React, { useMemo } from "react";
import Layout from "@/components/Layout";
import { useAppointments } from "@/context/AppointmentContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { format, parseISO, subDays, startOfMonth, endOfMonth } from "date-fns";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const COLORS = ["#8B5CF6", "#EC4899", "#10B981", "#F59E0B"];

const AdminDashboard: React.FC = () => {
  const { getAppointments } = useAppointments();
  const allAppointments = getAppointments();

  // Get appointments by status
  const appointmentsByStatus = useMemo(() => {
    const statuses = ["confirmed", "pending", "completed", "cancelled"];
    const counts = statuses.map(status => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: allAppointments.filter(a => a.status === status).length
    }));
    return counts;
  }, [allAppointments]);

  // Get appointments for the last 7 days
  const last7DaysAppointments = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      const dateStr = format(date, "yyyy-MM-dd");
      return {
        date: dateStr,
        displayDate: format(date, "EEE"),
        count: allAppointments.filter(a => a.date === dateStr).length
      };
    });
    return days;
  }, [allAppointments]);

  // Get appointments for current month
  const currentMonthAppointments = useMemo(() => {
    const today = new Date();
    const firstDay = startOfMonth(today);
    const lastDay = endOfMonth(today);
    
    // Create an array for each day in the month
    const daysInMonth = [];
    let currentDay = firstDay;
    
    while (currentDay <= lastDay) {
      const dateStr = format(currentDay, "yyyy-MM-dd");
      daysInMonth.push({
        date: dateStr,
        displayDate: format(currentDay, "d"),
        count: allAppointments.filter(a => a.date === dateStr).length
      });
      currentDay = new Date(currentDay.setDate(currentDay.getDate() + 1));
    }
    
    return daysInMonth;
  }, [allAppointments]);

  // Get appointments by provider
  const appointmentsByProvider = useMemo(() => {
    const providers: Record<string, number> = {};
    
    allAppointments.forEach(appointment => {
      const providerName = appointment.providerName;
      if (!providers[providerName]) {
        providers[providerName] = 0;
      }
      providers[providerName]++;
    });
    
    return Object.entries(providers).map(([name, count]) => ({
      name,
      value: count
    }));
  }, [allAppointments]);

  return (
    <Layout>
      <div className="pt-16 pb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Overview of all system appointments and activity
            </p>
          </div>
          <Link to="/users">
            <Button>
              Manage Users
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allAppointments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Pending Approval
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {allAppointments.filter(a => a.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Confirmed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {allAppointments.filter(a => a.status === "confirmed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Cancelled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {allAppointments.filter(a => a.status === "cancelled").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Appointment Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="week">
              <TabsList className="mb-4">
                <TabsTrigger value="week">Last 7 Days</TabsTrigger>
                <TabsTrigger value="month">This Month</TabsTrigger>
              </TabsList>
              <TabsContent value="week" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={last7DaysAppointments}
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="displayDate" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} appointments`]}
                      labelFormatter={(label) => {
                        const dataItem = last7DaysAppointments.find(item => item.displayDate === label);
                        return dataItem ? format(parseISO(dataItem.date), "MMMM d, yyyy") : label;
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#8B5CF6" 
                      name="Appointments"
                      strokeWidth={2} 
                      dot={{ r: 4 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
              <TabsContent value="month" className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={currentMonthAppointments}
                    margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="displayDate" 
                      tickFormatter={(value, index) => {
                        // Only show every 5th day to avoid overcrowding
                        return index % 5 === 0 ? value : '';
                      }}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [`${value} appointments`]}
                      labelFormatter={(label) => {
                        const dataItem = currentMonthAppointments.find(item => item.displayDate === label);
                        return dataItem ? format(parseISO(dataItem.date), "MMMM d, yyyy") : label;
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="count" 
                      stroke="#8B5CF6" 
                      name="Appointments"
                      strokeWidth={2}
                      dot={{ r: 3 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Appointments by Status</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={appointmentsByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {appointmentsByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} appointments`]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Providers */}
      <Card>
        <CardHeader>
          <CardTitle>Appointments by Provider</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointmentsByProvider
              .sort((a, b) => b.value - a.value)
              .map((provider, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-full max-w-md mr-8">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{provider.name}</span>
                      <span className="text-sm text-muted-foreground">{provider.value} appointments</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2" 
                        style={{ 
                          width: `${(provider.value / Math.max(...appointmentsByProvider.map(p => p.value))) * 100}%` 
                        }} 
                      />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default AdminDashboard;
