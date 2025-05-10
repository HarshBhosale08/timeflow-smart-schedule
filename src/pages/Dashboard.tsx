
import React, { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAppointments } from "@/context/AppointmentContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AppointmentStatus } from "@/context/AppointmentContext";

const statusColors: Record<AppointmentStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  completed: "bg-blue-100 text-blue-800"
};

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { getAppointments, getAppointmentsByUser, updateAppointmentStatus } = useAppointments();
  
  const appointments = user ? getAppointmentsByUser(user.id) : [];

  // Format appointments for display
  const upcomingAppointments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return appointments
      .filter(a => 
        // Only include confirmed and pending appointments
        ["confirmed", "pending"].includes(a.status) &&
        // Only include future appointments
        new Date(`${a.date}T00:00:00`) >= today
      )
      .sort((a, b) => {
        // Sort by date and time
        const dateA = new Date(`${a.date}T${a.startTime}`);
        const dateB = new Date(`${b.date}T${b.startTime}`);
        return dateA.getTime() - dateB.getTime();
      })
      .slice(0, 3); // Only get the next 3 appointments
  }, [appointments]);

  // Get statistics based on user role
  const getStatistics = () => {
    if (!user) return [];
    
    switch (user.role) {
      case "customer":
        return [
          {
            title: "Upcoming Appointments",
            value: appointments.filter(a => ["confirmed", "pending"].includes(a.status)).length,
            icon: <Calendar className="h-5 w-5 text-primary" />
          },
          {
            title: "Completed Sessions",
            value: appointments.filter(a => a.status === "completed").length,
            icon: <Clock className="h-5 w-5 text-green-600" />
          }
        ];
      case "provider":
        return [
          {
            title: "Today's Appointments",
            value: appointments.filter(a => 
              a.date === new Date().toISOString().split('T')[0] && 
              ["confirmed", "pending"].includes(a.status)
            ).length,
            icon: <Calendar className="h-5 w-5 text-primary" />
          },
          {
            title: "Pending Approval",
            value: appointments.filter(a => a.status === "pending").length,
            icon: <Clock className="h-5 w-5 text-yellow-600" />
          },
          {
            title: "Total Appointments",
            value: appointments.length,
            icon: <Users className="h-5 w-5 text-blue-600" />
          }
        ];
      case "admin":
        const allAppointments = getAppointments();
        return [
          {
            title: "Total Users",
            value: "10", // This would come from a user service in a real app
            icon: <Users className="h-5 w-5 text-primary" />
          },
          {
            title: "Total Appointments",
            value: allAppointments.length,
            icon: <Calendar className="h-5 w-5 text-blue-600" />
          },
          {
            title: "Active Providers",
            value: "3", // This would come from a user service in a real app
            icon: <Users className="h-5 w-5 text-green-600" />
          }
        ];
      default:
        return [];
    }
  };

  // Render quick actions based on user role
  const renderQuickActions = () => {
    if (!user) return null;
    
    switch (user.role) {
      case "customer":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Book a New Appointment</CardTitle>
                <CardDescription>Schedule your next service</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/book">
                  <Button className="w-full">
                    Book Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">View All Appointments</CardTitle>
                <CardDescription>Check your appointment history</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/appointments">
                  <Button variant="outline" className="w-full">
                    View History
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        );
      case "provider":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">View Today's Schedule</CardTitle>
                <CardDescription>Check your appointments for today</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/schedule">
                  <Button className="w-full">
                    View Schedule
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Update Availability</CardTitle>
                <CardDescription>Manage your available time slots</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/availability">
                  <Button variant="outline" className="w-full">
                    Update
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        );
      case "admin":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Manage Users</CardTitle>
                <CardDescription>Add, edit or remove users</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/users">
                  <Button className="w-full">
                    Manage Users
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">All Appointments</CardTitle>
                <CardDescription>View and manage all appointments</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/all-appointments">
                  <Button variant="outline" className="w-full">
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">System Settings</CardTitle>
                <CardDescription>Configure system parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <Link to="/system-settings">
                  <Button variant="outline" className="w-full">
                    Settings
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  // Render the provider's pending appointment actions
  const renderProviderActions = (appointment: any) => {
    if (user?.role !== "provider" || appointment.status !== "pending") {
      return null;
    }

    return (
      <div className="mt-2 flex space-x-2">
        <Button 
          size="sm" 
          onClick={() => updateAppointmentStatus(appointment.id, "confirmed")}
          className="bg-green-600 hover:bg-green-700"
        >
          Confirm
        </Button>
        <Button 
          size="sm" 
          variant="outline"
          onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
          className="text-red-600 border-red-600 hover:bg-red-50"
        >
          Decline
        </Button>
      </div>
    );
  };

  return (
    <Layout>
      <div className="pt-16 pb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.name || "Guest"}
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your {user?.role || ""} dashboard
        </p>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        {getStatistics().map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              {stat.icon}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        {renderQuickActions()}
      </div>

      {/* Upcoming Appointments */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
        {upcomingAppointments.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingAppointments.map((appointment) => (
              <Card key={appointment.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">
                      {appointment.serviceName}
                    </CardTitle>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[appointment.status]}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                  <CardDescription>
                    {user?.role === "customer" 
                      ? `with ${appointment.providerName}`
                      : `with ${appointment.customerName}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(appointment.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'short', 
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>
                        {appointment.startTime} - {appointment.endTime}
                      </span>
                    </div>
                  </div>
                  
                  {renderProviderActions(appointment)}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-gray-50">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">No upcoming appointments</p>
              {user?.role === "customer" && (
                <Link to="/book">
                  <Button className="mt-4">
                    Book an appointment
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
