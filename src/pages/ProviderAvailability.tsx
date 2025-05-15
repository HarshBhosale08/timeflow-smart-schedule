
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useAppointments } from "@/context/AppointmentContext";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Clock, Save } from "lucide-react";

const DAYS_OF_WEEK = [
  { value: "0", label: "Sunday" },
  { value: "1", label: "Monday" },
  { value: "2", label: "Tuesday" },
  { value: "3", label: "Wednesday" },
  { value: "4", label: "Thursday" },
  { value: "5", label: "Friday" },
  { value: "6", label: "Saturday" },
];

const TIME_SLOTS = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return { value: `${hour}:00`, label: `${hour}:00` };
});

type DayAvailability = {
  dayOfWeek: number;
  isAvailable: boolean;
  startTime: string;
  endTime: string;
};

const ProviderAvailability: React.FC = () => {
  const { user } = useAuth();
  const { availability, setAvailability, loading } = useAppointments();
  
  const [availabilitySettings, setAvailabilitySettings] = useState<DayAvailability[]>(
    DAYS_OF_WEEK.map(day => ({
      dayOfWeek: parseInt(day.value),
      isAvailable: false,
      startTime: "09:00",
      endTime: "17:00",
    }))
  );

  // Initialize availability settings from existing data
  useEffect(() => {
    if (user && availability.length > 0) {
      // Create a new array with 7 days
      const newSettings = DAYS_OF_WEEK.map(day => {
        const dayNumber = parseInt(day.value);
        // Find if there's existing availability for this day
        const existingAvail = availability.find(a => a.userId === user.id && a.dayOfWeek === dayNumber);
        
        return {
          dayOfWeek: dayNumber,
          isAvailable: existingAvail !== undefined,
          startTime: existingAvail?.startTime || "09:00",
          endTime: existingAvail?.endTime || "17:00",
        };
      });
      
      setAvailabilitySettings(newSettings);
    }
  }, [user, availability]);

  // Handle day availability toggle
  const handleDayToggle = (dayIndex: number) => {
    setAvailabilitySettings(prev => 
      prev.map((day, i) => 
        i === dayIndex 
          ? { ...day, isAvailable: !day.isAvailable } 
          : day
      )
    );
  };

  // Handle time selection
  const handleTimeChange = (dayIndex: number, type: "startTime" | "endTime", value: string) => {
    setAvailabilitySettings(prev => 
      prev.map((day, i) => 
        i === dayIndex 
          ? { ...day, [type]: value } 
          : day
      )
    );
  };

  // Save availability settings
  const handleSaveAvailability = async () => {
    if (!user) return;
    
    try {
      // Format availability data for the API
      const availabilityData = availabilitySettings
        .filter(day => day.isAvailable)
        .map(({ dayOfWeek, startTime, endTime }) => ({
          dayOfWeek,
          startTime,
          endTime,
          userId: user.id,
        }));
      
      await setAvailability(user.id, availabilityData);
      toast.success("Availability updated successfully!");
    } catch (error) {
      toast.error("Failed to update availability");
      console.error(error);
    }
  };

  return (
    <Layout>
      <div className="pt-16 pb-8">
        <h1 className="text-3xl font-bold tracking-tight">Manage Availability</h1>
        <p className="text-muted-foreground">
          Set your weekly schedule and availability for appointments
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-xl flex items-center">
            <Clock className="mr-2 h-5 w-5 text-primary" />
            Weekly Schedule
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {availabilitySettings.map((day, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${day.isAvailable ? 'bg-primary/5 border-primary/20' : 'bg-gray-50'}`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id={`day-${index}`}
                      checked={day.isAvailable}
                      onCheckedChange={() => handleDayToggle(index)}
                    />
                    <Label htmlFor={`day-${index}`} className="text-lg font-medium">
                      {DAYS_OF_WEEK[index].label}
                    </Label>
                  </div>
                  {day.isAvailable && (
                    <div className="text-sm text-muted-foreground">
                      Available {day.startTime} to {day.endTime}
                    </div>
                  )}
                </div>
                
                {day.isAvailable && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`start-${index}`}>Start Time</Label>
                      <Select
                        value={day.startTime}
                        onValueChange={(value) => handleTimeChange(index, "startTime", value)}
                      >
                        <SelectTrigger id={`start-${index}`}>
                          <SelectValue placeholder="Start time" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_SLOTS.map((slot) => (
                            <SelectItem 
                              key={slot.value} 
                              value={slot.value}
                              disabled={slot.value >= day.endTime}
                            >
                              {slot.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`end-${index}`}>End Time</Label>
                      <Select
                        value={day.endTime}
                        onValueChange={(value) => handleTimeChange(index, "endTime", value)}
                      >
                        <SelectTrigger id={`end-${index}`}>
                          <SelectValue placeholder="End time" />
                        </SelectTrigger>
                        <SelectContent>
                          {TIME_SLOTS.map((slot) => (
                            <SelectItem 
                              key={slot.value} 
                              value={slot.value}
                              disabled={slot.value <= day.startTime}
                            >
                              {slot.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <Button 
              onClick={handleSaveAvailability} 
              disabled={loading}
              className="w-full sm:w-auto"
            >
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Saving..." : "Save Availability"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Layout>
  );
};

export default ProviderAvailability;
