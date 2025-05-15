import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useAppointments } from "@/context/AppointmentContext";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const BookAppointment: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    getServiceProviders, 
    getServices, 
    getAvailableSlots, 
    bookAppointment,
    getAISuggestedSlots,
    loading
  } = useAppointments();

  const [step, setStep] = useState(1);
  const [providerId, setProviderId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [aiSlots, setAiSlots] = useState<string[]>([]);
  const [useAiSuggestions, setUseAiSuggestions] = useState(false);
  const [isLoadingAI, setIsLoadingAI] = useState(false);

  // Get all service providers
  const serviceProviders = getServiceProviders();
  
  // Get services based on selected provider
  const services = getServices(providerId);

  // Get selected provider details
  const selectedProvider = serviceProviders.find(p => p.id === providerId);
  
  // Get selected service details
  const selectedService = services.find(s => s.id === serviceId);

  // Calculate end time based on selected time and service duration
  const calculateEndTime = (startTime: string): string => {
    if (!selectedService || !startTime) return "";
    
    const [hours, minutes] = startTime.split(":").map(Number);
    let endMinutes = minutes + (selectedService.duration % 60);
    let endHours = hours + Math.floor(selectedService.duration / 60);
    
    if (endMinutes >= 60) {
      endMinutes -= 60;
      endHours += 1;
    }
    
    if (endHours >= 24) {
      endHours -= 24;
    }
    
    return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
  };

  // Handle provider selection
  const handleProviderChange = (value: string) => {
    setProviderId(value);
    setServiceId("");
    setSelectedDate(undefined);
    setSelectedTime("");
    setAvailableSlots([]);
    setAiSlots([]);
    setStep(1);
  };

  // Handle service selection
  const handleServiceChange = (value: string) => {
    setServiceId(value);
    setSelectedDate(undefined);
    setSelectedTime("");
    setAvailableSlots([]);
    setAiSlots([]);
    setStep(2);
  };

  // Handle date selection
  const handleDateChange = async (date: Date | undefined) => {
    if (!date || !providerId) return;
    
    setSelectedDate(date);
    setSelectedTime("");
    
    // Get available slots for selected date
    const slots = getAvailableSlots(providerId, date);
    setAvailableSlots(slots);
    
    if (user) {
      // Show AI loading state
      setIsLoadingAI(true);
      
      try {
        // Get AI suggestions
        const suggestions = await getAISuggestedSlots(user.id, providerId, date);
        setAiSlots(suggestions);
        
        if (suggestions.length > 0) {
          toast.success("AI has suggested optimal time slots for you!");
          setUseAiSuggestions(true);
        }
      } catch (error) {
        toast.error("Could not get AI recommendations");
      } finally {
        setIsLoadingAI(false);
      }
    }
    
    setStep(3);
  };

  // Handle time selection
  const handleTimeSelection = (time: string) => {
    setSelectedTime(time);
    
    if (aiSlots.includes(time)) {
      toast.success("You selected an AI-recommended time slot!");
    }
    
    setStep(4);
  };

  // Handle notes change
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !providerId || !serviceId || !selectedDate || !selectedTime) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      const endTime = calculateEndTime(selectedTime);
      
      const appointment = await bookAppointment({
        providerId,
        providerName: selectedProvider?.name || "",
        serviceName: selectedService?.name || "",
        date: format(selectedDate, "yyyy-MM-dd"),
        startTime: selectedTime,
        endTime,
        notes,
        aiSuggested: aiSlots.includes(selectedTime)
      });
      
      navigate("/appointments");
    } catch (error) {
      toast.error("Failed to book appointment");
    }
  };

  // Render current step content
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Select a Service Provider</h3>
              <Select value={providerId} onValueChange={handleProviderChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a provider" />
                </SelectTrigger>
                <SelectContent>
                  {serviceProviders.map(provider => (
                    <SelectItem key={provider.id} value={provider.id}>
                      {provider.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {providerId && (
              <div>
                <h3 className="text-lg font-medium mb-2">Select a Service</h3>
                <Select value={serviceId} onValueChange={handleServiceChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map(service => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name} - ${service.price}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Select a Date</h3>
              <div className="grid gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={handleDateChange}
                      disabled={(date) => {
                        // Disable dates in the past
                        const today = new Date();
                        today.setHours(0, 0, 0, 0);
                        return date < today;
                      }}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        );
      
      case 3:
        return (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">Select a Time</h3>
                {aiSlots.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setUseAiSuggestions(!useAiSuggestions)}
                    className={cn(
                      useAiSuggestions && "bg-primary text-primary-foreground hover:bg-primary/90"
                    )}
                  >
                    {useAiSuggestions ? "All Slots" : "AI Recommendations"}
                  </Button>
                )}
              </div>

              {isLoadingAI && (
                <div className="flex items-center justify-center p-4 bg-gray-50 rounded-md">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
                  <p>Getting AI recommendations...</p>
                </div>
              )}

              {!isLoadingAI && availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {(useAiSuggestions && aiSlots.length > 0 ? aiSlots : availableSlots).map((slot) => (
                    <Button
                      key={slot}
                      variant={selectedTime === slot ? "default" : "outline"}
                      className={cn(
                        "flex items-center justify-center",
                        aiSlots.includes(slot) && useAiSuggestions 
                          ? "border-primary border-2"
                          : "",
                        aiSlots.includes(slot) && !useAiSuggestions && "border-primary"
                      )}
                      onClick={() => handleTimeSelection(slot)}
                    >
                      {aiSlots.includes(slot) && (
                        <span className="bg-primary rounded-full h-2 w-2 absolute top-1 right-1"></span>
                      )}
                      {slot}
                    </Button>
                  ))}
                </div>
              ) : !isLoadingAI && (
                <div className="p-4 text-center bg-gray-50 rounded-md">
                  <p className="text-muted-foreground">No available slots for this date</p>
                </div>
              )}

              {aiSlots.length > 0 && (
                <div className="mt-3 text-sm text-muted-foreground">
                  <p className="flex items-center">
                    <span className="bg-primary rounded-full h-2 w-2 mr-2"></span>
                    AI-recommended time slots are marked with indicators
                  </p>
                </div>
              )}
            </div>
            
            {selectedTime && (
              <div className="pt-4">
                <Button 
                  className="w-full"
                  onClick={() => setStep(4)}
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        );
      
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Additional Notes (Optional)</h3>
              <Textarea
                placeholder="Add any special requests or notes for the service provider"
                value={notes}
                onChange={handleNotesChange}
              />
            </div>
            
            <div className="pt-4">
              <Button 
                className="w-full"
                type="submit"
                disabled={loading}
              >
                {loading ? "Booking..." : "Confirm Booking"}
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="pt-16 pb-8">
        <h1 className="text-3xl font-bold tracking-tight">Book an Appointment</h1>
        <p className="text-muted-foreground">
          Schedule your next appointment with our expert service providers
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Book Your Appointment</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {renderStepContent()}
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {providerId && selectedProvider && (
                <div className="flex items-start space-x-4">
                  <span className="text-muted-foreground w-24">Provider:</span>
                  <span className="font-medium">{selectedProvider.name}</span>
                </div>
              )}
              
              {serviceId && selectedService && (
                <>
                  <div className="flex items-start space-x-4">
                    <span className="text-muted-foreground w-24">Service:</span>
                    <span className="font-medium">{selectedService.name}</span>
                  </div>
                  <div className="flex items-start space-x-4">
                    <span className="text-muted-foreground w-24">Duration:</span>
                    <span className="font-medium">{selectedService.duration} minutes</span>
                  </div>
                  <div className="flex items-start space-x-4">
                    <span className="text-muted-foreground w-24">Price:</span>
                    <span className="font-medium">${selectedService.price}</span>
                  </div>
                </>
              )}
              
              {selectedDate && (
                <div className="flex items-start space-x-4">
                  <span className="text-muted-foreground w-24">Date:</span>
                  <span className="font-medium">{format(selectedDate, "EEEE, MMMM d, yyyy")}</span>
                </div>
              )}
              
              {selectedTime && (
                <div className="flex items-start space-x-4">
                  <span className="text-muted-foreground w-24">Time:</span>
                  <div>
                    <span className="font-medium">{selectedTime} - {calculateEndTime(selectedTime)}</span>
                    {aiSlots.includes(selectedTime) && (
                      <div className="mt-1 text-xs flex items-center text-primary">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>AI recommended time slot</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {!providerId && (
                <div className="text-center py-6 text-muted-foreground">
                  <Clock className="mx-auto h-12 w-12 mb-2 opacity-30" />
                  <p>Select a service provider and service to continue</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* AI Assistant Card */}
          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center">
                <span className="bg-primary h-2 w-2 rounded-full mr-2"></span>
                Smart Scheduling Assistant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Our AI analyzes provider schedules, customer preferences, and service details to recommend the best time slots for your appointment.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default BookAppointment;
