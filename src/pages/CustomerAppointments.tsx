
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAppointments } from "@/context/AppointmentContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const CustomerAppointments: React.FC = () => {
  const { user } = useAuth();
  const { getAppointmentsByUser, updateAppointmentStatus } = useAppointments();
  
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
  
  // Get customer appointments
  const appointments = user ? getAppointmentsByUser(user.id) : [];
  
  // Filter appointments by status
  const upcomingAppointments = appointments.filter(
    a => ["pending", "confirmed"].includes(a.status)
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const pastAppointments = appointments.filter(
    a => ["completed", "cancelled"].includes(a.status)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Open cancel dialog
  const openCancelDialog = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setCancelDialogOpen(true);
  };

  // Cancel appointment
  const cancelAppointment = async () => {
    if (selectedAppointmentId) {
      await updateAppointmentStatus(selectedAppointmentId, "cancelled");
      setCancelDialogOpen(false);
    }
  };

  // Format date for display
  const formatAppointmentDate = (date: string) => {
    return format(new Date(date), "EEEE, MMMM d, yyyy");
  };

  // Get status badge classes
  const getStatusBadgeClass = (status: string) => {
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
  const renderAppointmentCard = (appointment: any) => (
    <Card key={appointment.id} className="mb-4">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{appointment.serviceName}</CardTitle>
          <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-medium", getStatusBadgeClass(appointment.status))}>
            {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">with {appointment.providerName}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{formatAppointmentDate(appointment.date)}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
            <span>{appointment.startTime} - {appointment.endTime}</span>
          </div>
          {appointment.notes && (
            <div className="text-sm mt-2 pt-2 border-t">
              <p className="text-muted-foreground mb-1">Additional Notes:</p>
              <p>{appointment.notes}</p>
            </div>
          )}
        </div>
        
        {["confirmed", "pending"].includes(appointment.status) && (
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
              onClick={() => openCancelDialog(appointment.id)}
            >
              Cancel Appointment
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Layout>
      <div className="pt-16 pb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Appointments</h1>
            <p className="text-muted-foreground">
              View and manage your appointment schedule
            </p>
          </div>
          <Link to="/book">
            <Button>
              New Appointment
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList className="mb-6">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming">
          {upcomingAppointments.length > 0 ? (
            <div>
              {upcomingAppointments.map(renderAppointmentCard)}
            </div>
          ) : (
            <Card className="bg-gray-50">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground mb-4">You don't have any upcoming appointments</p>
                <Link to="/book">
                  <Button>
                    Book an Appointment
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="past">
          {pastAppointments.length > 0 ? (
            <div>
              {pastAppointments.map(renderAppointmentCard)}
            </div>
          ) : (
            <Card className="bg-gray-50">
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">You don't have any past appointments</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Cancel Appointment Dialog */}
      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Appointment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Appointment</AlertDialogCancel>
            <AlertDialogAction onClick={cancelAppointment} className="bg-red-600 hover:bg-red-700">
              Yes, Cancel
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default CustomerAppointments;
