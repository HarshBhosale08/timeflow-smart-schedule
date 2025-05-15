
import React, { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAppointments, Appointment, AppointmentStatus } from "@/context/AppointmentContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Link } from "react-router-dom";
import { Calendar as CalendarIcon, Clock, ArrowRight, User } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

type AppointmentMap = {
  [date: string]: Appointment[];
};

const ProviderSchedule: React.FC = () => {
  const { user } = useAuth();
  const { getAppointmentsByUser, updateAppointmentStatus } = useAppointments();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [statusFilter, setStatusFilter] = useState<string>("all");
  
  // Get provider appointments
  const appointments = user ? getAppointmentsByUser(user.id) : [];
  
  // Group appointments by date
  const appointmentsByDate: AppointmentMap = useMemo(() => {
    return appointments.reduce((acc: AppointmentMap, appointment) => {
      const date = appointment.date;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(appointment);
      return acc;
    }, {});
  }, [appointments]);
  
  // Dates with appointments (for calendar highlighting)
  const datesWithAppointments = useMemo(() => {
    return Object.keys(appointmentsByDate).map(date => new Date(date));
  }, [appointmentsByDate]);

  // Get appointments for selected date
  const selectedDateAppointments = useMemo(() => {
    const formattedDate = format(selectedDate, "yyyy-MM-dd");
    const dateAppointments = appointmentsByDate[formattedDate] || [];
    
    if (statusFilter === "all") {
      return dateAppointments;
    }
    
    return dateAppointments.filter(appointment => appointment.status === statusFilter);
  }, [appointmentsByDate, selectedDate, statusFilter]);
  
  // Filter appointments by status
  const pendingAppointments = useMemo(() => 
    appointments.filter(a => a.status === "pending"),
    [appointments]
  );
  
  const upcomingAppointments = useMemo(() => 
    appointments.filter(a => a.status === "confirmed" && new Date(a.date) >= new Date()),
    [appointments]
  );

  // Handle appointment status update
  const handleStatusUpdate = async (id: string, status: AppointmentStatus) => {
    await updateAppointmentStatus(id, status);
  };

  // Format time range
  const formatTimeRange = (startTime: string, endTime: string) => {
    return `${startTime} - ${endTime}`;
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

  // Render appointment card
  const renderAppointmentCard = (appointment: Appointment) => (
    <Card key={appointment.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{appointment.serviceName}</CardTitle>
          <Badge
            className={cn(getStatusBadgeClass(appointment.status))}
            variant="outline"
          >
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </Badge>
        </div>
        <CardDescription className="flex items-center">
          <User className="h-3 w-3 mr-1" />
          {appointment.customerName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{format(new Date(appointment.date), "EEEE, MMMM d, yyyy")}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{formatTimeRange(appointment.startTime, appointment.endTime)}</span>
          </div>
          {appointment.notes && (
            <div className="text-sm mt-2 pt-2 border-t">
              <p className="text-muted-foreground mb-1">Notes:</p>
              <p>{appointment.notes}</p>
            </div>
          )}
        </div>
        
        {appointment.status === "pending" && (
          <div className="flex space-x-2">
            <Button 
              onClick={() => handleStatusUpdate(appointment.id, "confirmed")}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              Confirm
            </Button>
            <Button 
              onClick={() => handleStatusUpdate(appointment.id, "cancelled")}
              size="sm"
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Decline
            </Button>
          </div>
        )}
        
        {appointment.status === "confirmed" && new Date(appointment.date) <= new Date() && (
          <Button 
            onClick={() => handleStatusUpdate(appointment.id, "completed")}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            Mark Completed
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="pt-16 pb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Provider Schedule</h1>
            <p className="text-muted-foreground">
              Manage your appointments and availability
            </p>
          </div>
          <Link to="/availability">
            <Button>
              Set Availability
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Calendar and Daily Schedule */}
        <div className="md:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>
                Select a date to view appointments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                    modifiers={{
                      hasAppointments: datesWithAppointments,
                    }}
                    modifiersClassNames={{
                      hasAppointments: "bg-primary/10 font-bold text-primary",
                    }}
                    components={{
                      DayContent: ({ date }) => {
                        const hasAppointments = datesWithAppointments.some(d => 
                          isSameDay(d, date)
                        );
                        return (
                          <div className={cn(
                            "relative h-9 w-9 p-0 font-normal aria-selected:opacity-100",
                            hasAppointments && "font-bold text-primary"
                          )}>
                            <div className="flex h-full w-full items-center justify-center">
                              {date.getDate()}
                              {hasAppointments && (
                                <div className="absolute bottom-1 left-1/2 -translate-x-1/2 h-1 w-1 rounded-full bg-primary"></div>
                              )}
                            </div>
                          </div>
                        );
                      },
                    }}
                  />
                </div>
                <div className="md:w-1/2">
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">
                      {format(selectedDate, "EEEE, MMMM d, yyyy")}
                    </h3>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">Filter:</span>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                          <SelectValue placeholder="All statuses" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All statuses</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="confirmed">Confirmed</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {selectedDateAppointments.length > 0 ? (
                      selectedDateAppointments
                        .sort((a, b) => a.startTime.localeCompare(b.startTime))
                        .map(renderAppointmentCard)
                    ) : (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-muted-foreground">No appointments for this date</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Items */}
        <div className="space-y-6">
          {/* Pending Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <span className="relative">
                  Pending Approvals
                  {pendingAppointments.length > 0 && (
                    <span className="absolute -right-6 -top-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {pendingAppointments.length}
                    </span>
                  )}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingAppointments.length > 0 ? (
                <div className="space-y-3 max-h-[250px] overflow-y-auto pr-1">
                  {pendingAppointments.map((appointment) => (
                    <div 
                      key={appointment.id} 
                      className="p-3 border rounded-md bg-yellow-50 border-yellow-100"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <div className="font-medium">{appointment.customerName}</div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(appointment.date), "MMM d")}
                        </div>
                      </div>
                      <div className="text-sm mb-2">{appointment.serviceName}</div>
                      <div className="text-xs text-muted-foreground mb-3">
                        {formatTimeRange(appointment.startTime, appointment.endTime)}
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm"
                          className="h-7 text-xs bg-green-600 hover:bg-green-700 w-full"
                          onClick={() => handleStatusUpdate(appointment.id, "confirmed")}
                        >
                          Confirm
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50 w-full"
                          onClick={() => handleStatusUpdate(appointment.id, "cancelled")}
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No pending approvals</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Links */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to="/availability">
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="mr-2 h-4 w-4" />
                  Update Availability
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Confirmed</CardTitle>
              <CardDescription>Your next {Math.min(3, upcomingAppointments.length)} confirmed appointments</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingAppointments.length > 0 ? (
                <div className="space-y-3">
                  {upcomingAppointments
                    .slice(0, 3)
                    .map((appointment) => (
                      <div 
                        key={appointment.id} 
                        className="p-3 border rounded-md hover:bg-accent transition-colors cursor-pointer"
                        onClick={() => setSelectedDate(new Date(appointment.date))}
                      >
                        <div className="flex justify-between items-start mb-1">
                          <div className="font-medium">{appointment.customerName}</div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(appointment.date), "MMM d")}
                          </div>
                        </div>
                        <div className="text-sm">{appointment.serviceName}</div>
                        <div className="text-xs text-muted-foreground">
                          {formatTimeRange(appointment.startTime, appointment.endTime)}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground">No upcoming appointments</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ProviderSchedule;
