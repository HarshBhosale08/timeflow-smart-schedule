
import React, { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAppointments, Appointment, AppointmentStatus } from "@/context/AppointmentContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar, Clock, Search, Users, BarChart, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart as RechartsPieChart, Pie, Cell } from "recharts";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { getAppointments, updateAppointmentStatus, getServiceProviders } = useAppointments();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [providerFilter, setProviderFilter] = useState<string>("all");
  
  // Get all appointments and providers
  const allAppointments = getAppointments();
  const serviceProviders = getServiceProviders();
  
  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return allAppointments.filter(appointment => {
      // Search filter
      const searchMatch = 
        searchTerm === "" || 
        appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const statusMatch = 
        statusFilter === "all" || 
        appointment.status === statusFilter;
      
      // Provider filter
      const providerMatch = 
        providerFilter === "all" || 
        appointment.providerId === providerFilter;
      
      return searchMatch && statusMatch && providerMatch;
    });
  }, [allAppointments, searchTerm, statusFilter, providerFilter]);
  
  // Get upcoming appointments (today and future)
  const upcomingAppointments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return filteredAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate >= today && ["confirmed", "pending"].includes(appointment.status);
    });
  }, [filteredAppointments]);
  
  // Get past appointments
  const pastAppointments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return filteredAppointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      return appointmentDate < today || ["completed", "cancelled"].includes(appointment.status);
    });
  }, [filteredAppointments]);

  // Calculate statistics
  const statistics = useMemo(() => {
    // Count appointments by status
    const statusCounts = allAppointments.reduce((acc: Record<string, number>, appointment) => {
      acc[appointment.status] = (acc[appointment.status] || 0) + 1;
      return acc;
    }, {});
    
    // Count appointments by provider
    const providerCounts = allAppointments.reduce((acc: Record<string, number>, appointment) => {
      acc[appointment.providerId] = (acc[appointment.providerId] || 0) + 1;
      return acc;
    }, {});
    
    // Prepare data for charts
    const statusChartData = Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count,
    }));
    
    const providerChartData = Object.entries(providerCounts).map(([providerId, count]) => {
      const provider = serviceProviders.find(p => p.id === providerId);
      return {
        name: provider ? provider.name : 'Unknown',
        value: count,
      };
    });
    
    return {
      totalAppointments: allAppointments.length,
      confirmedCount: statusCounts.confirmed || 0,
      pendingCount: statusCounts.pending || 0,
      completedCount: statusCounts.completed || 0,
      cancelledCount: statusCounts.cancelled || 0,
      statusChartData,
      providerChartData,
    };
  }, [allAppointments, serviceProviders]);
  
  // Handle appointment status update
  const handleStatusUpdate = async (id: string, status: AppointmentStatus) => {
    await updateAppointmentStatus(id, status);
  };
  
  // Format date
  const formatAppointmentDate = (date: string) => {
    return format(new Date(date), "MMM d, yyyy");
  };
  
  // Get status badge class
  const getStatusBadgeClass = (status: AppointmentStatus) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Chart colors
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];

  return (
    <Layout>
      <div className="pt-16 pb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Monitor and manage all appointments and system activity
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalAppointments}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <div className="h-2 w-2 rounded-full bg-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.confirmedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <div className="h-2 w-2 rounded-full bg-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.pendingCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <div className="h-2 w-2 rounded-full bg-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.completedCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Appointments by Status
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={statistics.statusChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statistics.statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-primary" />
              Appointments by Provider
            </CardTitle>
          </CardHeader>
          <CardContent className="px-2">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={statistics.providerChartData}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 30,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} tickFormatter={(value) => value.split(' ')[0]} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" name="Appointments" fill="#8884d8" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            All Appointments
          </CardTitle>
          <CardDescription>
            View and manage all appointments across the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative w-full md:w-1/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search appointments..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-1/4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-1/4">
              <Select value={providerFilter} onValueChange={setProviderFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All providers</SelectItem>
                  {serviceProviders.map(provider => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList>
              <TabsTrigger value="upcoming">Upcoming ({upcomingAppointments.length})</TabsTrigger>
              <TabsTrigger value="past">Past ({pastAppointments.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="py-3 px-4 text-left font-medium">Customer</th>
                        <th className="py-3 px-4 text-left font-medium">Service</th>
                        <th className="py-3 px-4 text-left font-medium">Provider</th>
                        <th className="py-3 px-4 text-left font-medium">Date</th>
                        <th className="py-3 px-4 text-left font-medium">Time</th>
                        <th className="py-3 px-4 text-left font-medium">Status</th>
                        <th className="py-3 px-4 text-left font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {upcomingAppointments.length > 0 ? (
                        upcomingAppointments.map((appointment) => (
                          <tr key={appointment.id} className="hover:bg-muted/30">
                            <td className="py-3 px-4">{appointment.customerName}</td>
                            <td className="py-3 px-4">{appointment.serviceName}</td>
                            <td className="py-3 px-4">{appointment.providerName}</td>
                            <td className="py-3 px-4">{formatAppointmentDate(appointment.date)}</td>
                            <td className="py-3 px-4">{appointment.startTime}</td>
                            <td className="py-3 px-4">
                              <Badge
                                className={cn(getStatusBadgeClass(appointment.status))}
                                variant="outline"
                              >
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex space-x-2">
                                {appointment.status === "pending" && (
                                  <>
                                    <Button 
                                      size="sm"
                                      className="h-7 text-xs bg-green-600 hover:bg-green-700"
                                      onClick={() => handleStatusUpdate(appointment.id, "confirmed")}
                                    >
                                      Confirm
                                    </Button>
                                    <Button 
                                      size="sm"
                                      variant="outline"
                                      className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50"
                                      onClick={() => handleStatusUpdate(appointment.id, "cancelled")}
                                    >
                                      Cancel
                                    </Button>
                                  </>
                                )}
                                {appointment.status === "confirmed" && (
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50"
                                    onClick={() => handleStatusUpdate(appointment.id, "cancelled")}
                                  >
                                    Cancel
                                  </Button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="py-6 text-center text-muted-foreground">
                            No upcoming appointments found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="past">
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-muted/50">
                        <th className="py-3 px-4 text-left font-medium">Customer</th>
                        <th className="py-3 px-4 text-left font-medium">Service</th>
                        <th className="py-3 px-4 text-left font-medium">Provider</th>
                        <th className="py-3 px-4 text-left font-medium">Date</th>
                        <th className="py-3 px-4 text-left font-medium">Time</th>
                        <th className="py-3 px-4 text-left font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {pastAppointments.length > 0 ? (
                        pastAppointments.map((appointment) => (
                          <tr key={appointment.id} className="hover:bg-muted/30">
                            <td className="py-3 px-4">{appointment.customerName}</td>
                            <td className="py-3 px-4">{appointment.serviceName}</td>
                            <td className="py-3 px-4">{appointment.providerName}</td>
                            <td className="py-3 px-4">{formatAppointmentDate(appointment.date)}</td>
                            <td className="py-3 px-4">{appointment.startTime}</td>
                            <td className="py-3 px-4">
                              <Badge
                                className={cn(getStatusBadgeClass(appointment.status))}
                                variant="outline"
                              >
                                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                              </Badge>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="py-6 text-center text-muted-foreground">
                            No past appointments found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default AdminDashboard;
