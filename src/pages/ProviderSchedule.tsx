
import React, { useState, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAppointments } from "@/context/AppointmentContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format, isSameDay, parseISO } from "date-fns";
import { Calendar as CalendarIcon, Users, Clock, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const ProviderSchedule: React.FC = () => {
  const { user } = useAuth();
  const { getAppointmentsByUser, updateAppointmentStatus } = useAppointments();
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  
  // Get provider appointments
  const allAppointments = user ? getAppointmentsByUser(user.id) : [];
  
  // Filter appointments for selected date
  const dateAppointments = useMemo(() => {
    return allAppointments.filter(a => 
      isSameDay(parseISO(a.date), selectedDate) && 
      ["confirmed", "pending"].includes(a.status)
    ).sort((a, b) => {
      // Sort by time
      return a.startTime.localeCompare(b.startTime);
    });
  }, [allAppointments, selectedDate]);

  // Get dates with appointments for calendar highlighting
  const appointmentDates = useMemo(() => {
    const dates = allAppointments
      .filter(a => ["confirmed", "pending"].includes(a.status))
      .map(a => parseISO(a.date));
    return dates;
  }, [allAppointments]);

  // Count appointments by date for calendar
  const appointmentCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    allAppointments
      .filter(a => ["confirmed", "pending"].includes(a.status))
      .forEach(a => {
        const dateStr = a.date;
        counts[dateStr] = (counts[dateStr] || 0) + 1;
      });
    return counts;
  }, [allAppointments]);
  
  // Handle date change
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };

  // Handle approve appointment
  const handleApprove = async (id: string) => {
    await updateAppointmentStatus(id, "confirmed");
  };
  
  // Handle decline appointment
  const handleDecline = async (id: string) => {
    await updateAppointmentStatus(id, "cancelled");
  };

  // Handle complete appointment
  const handleComplete = async (id: string) => {
    await updateAppointmentStatus(id, "completed");
  };

  return (
    <Layout>
      <div className="pt-16 pb-8">
        <h1 className="text-3xl font-bold tracking-tight">My Schedule</h1>
        <p className="text-muted-foreground">
          Manage your appointments and availability
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Calendar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Select a Date</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateChange}
                className="border rounded-md p-3"
                classNames={{
                  day_today: "bg-muted text-muted-foreground font-normal",
                }}
                modifiers={{
                  booked: appointmentDates,
                }}
                modifiersClassNames={{
                  booked: "border-primary border font-medium text-primary",
                }}
                components={{
                  DayContent: (props) => {
                    const dateStr = format(props.date, "yyyy-MM-dd");
                    const count = appointmentCounts[dateStr] || 0;
                    return (
                      <div className="relative">
                        <div>{props.date.getDate()}</div>
                        {count > 0 && (
                          <div className="absolute bottom-0 right-0 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                          </div>
                        )}
                      </div>
                    );
                  },
                }}
              />

              <div className="mt-4 text-sm text-center text-muted-foreground">
                Selected date: {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Schedule for selected date */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>
                Schedule for {format(selectedDate, "MMMM d, yyyy")}
              </CardTitle>
              <Badge className="bg-primary">
                {dateAppointments.length} Appointments
              </Badge>
            </CardHeader>
            <CardContent>
              {dateAppointments.length > 0 ? (
                <div className="space-y-4">
                  {dateAppointments.map((appointment) => (
                    <div
                      key={appointment.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="mb-2 sm:mb-0">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="font-medium">
                            {appointment.startTime} - {appointment.endTime}
                          </span>
                          {appointment.status === "pending" && (
                            <Badge variant="outline" className="ml-2 text-yellow-600 border-yellow-200 bg-yellow-50">
                              Pending
                            </Badge>
                          )}
                        </div>
                        <div className="mt-1 flex items-center">
                          <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{appointment.customerName}</span>
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          {appointment.serviceName}
                        </div>
                      </div>

                      <div className="flex mt-2 sm:mt-0 space-x-2">
                        {appointment.status === "pending" ? (
                          <>
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => handleApprove(appointment.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => handleDecline(appointment.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Decline
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleComplete(appointment.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-30" />
                  <p className="mt-4 text-muted-foreground">
                    No appointments scheduled for this date
                  </p>
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
