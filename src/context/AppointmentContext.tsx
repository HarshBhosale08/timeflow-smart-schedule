
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth, User, UserRole } from "./AuthContext";

// Define appointment status
export type AppointmentStatus = "pending" | "confirmed" | "cancelled" | "completed";

// Define appointment interface
export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  serviceName: string;
  date: string; // ISO date string
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format
  status: AppointmentStatus;
  notes?: string;
  aiSuggested?: boolean;
}

// Define service interface
export interface Service {
  id: string;
  providerId: string;
  name: string;
  duration: number; // in minutes
  description: string;
  price: number;
}

// Define availability interface
export interface Availability {
  id: string;
  userId: string;
  dayOfWeek: number; // 0-6, where 0 is Sunday
  startTime: string; // HH:MM format
  endTime: string; // HH:MM format;
}

// Appointment context interface
interface AppointmentContextType {
  appointments: Appointment[];
  services: Service[];
  availability: Availability[];
  loading: boolean;
  getAppointments: () => Appointment[];
  getAppointmentsByUser: (userId: string) => Appointment[];
  getAvailableSlots: (providerId: string, date: Date) => string[];
  bookAppointment: (appointment: Partial<Appointment>) => Promise<Appointment>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>;
  getServices: (providerId?: string) => Service[];
  getServiceProviders: () => User[];
  setAvailability: (userId: string, availability: Omit<Availability, "id">[]) => Promise<void>;
  getAISuggestedSlots: (customerId: string, providerId: string, date: Date) => Promise<string[]>;
}

// Create appointment context
const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

// Mock data
const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "appt1",
    customerId: "1",
    customerName: "John Customer",
    providerId: "2",
    providerName: "Sarah Provider",
    serviceName: "Consultation",
    date: "2025-05-15",
    startTime: "10:00",
    endTime: "11:00",
    status: "confirmed"
  },
  {
    id: "appt2",
    customerId: "1",
    customerName: "John Customer",
    providerId: "2",
    providerName: "Sarah Provider",
    serviceName: "Follow-up",
    date: "2025-05-20",
    startTime: "14:00",
    endTime: "15:00",
    status: "pending"
  }
];

const MOCK_SERVICES: Service[] = [
  {
    id: "srvc1",
    providerId: "2",
    name: "Consultation",
    duration: 60,
    description: "Initial consultation session",
    price: 100
  },
  {
    id: "srvc2",
    providerId: "2",
    name: "Follow-up",
    duration: 30,
    description: "Follow-up session",
    price: 50
  }
];

const MOCK_AVAILABILITY: Availability[] = [
  {
    id: "avail1",
    userId: "2",
    dayOfWeek: 1, // Monday
    startTime: "09:00",
    endTime: "17:00"
  },
  {
    id: "avail2",
    userId: "2",
    dayOfWeek: 2, // Tuesday
    startTime: "09:00",
    endTime: "17:00"
  },
  {
    id: "avail3",
    userId: "2",
    dayOfWeek: 3, // Wednesday
    startTime: "09:00",
    endTime: "17:00"
  },
  {
    id: "avail4",
    userId: "2",
    dayOfWeek: 4, // Thursday
    startTime: "09:00",
    endTime: "17:00"
  },
  {
    id: "avail5",
    userId: "2",
    dayOfWeek: 5, // Friday
    startTime: "09:00",
    endTime: "17:00"
  }
];

const MOCK_SERVICE_PROVIDERS: User[] = [
  {
    id: "2",
    name: "Sarah Provider",
    email: "provider@example.com",
    role: "provider",
    avatar: "https://i.pravatar.cc/150?u=provider"
  },
  {
    id: "4",
    name: "Michael Johnson",
    email: "michael@example.com",
    role: "provider",
    avatar: "https://i.pravatar.cc/150?u=michael"
  },
  {
    id: "5",
    name: "Emily Williams",
    email: "emily@example.com",
    role: "provider",
    avatar: "https://i.pravatar.cc/150?u=emily"
  }
];

// Appointment provider component
export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [services, setServices] = useState<Service[]>(MOCK_SERVICES);
  const [availability, setAvailabilityState] = useState<Availability[]>(MOCK_AVAILABILITY);
  const [loading, setLoading] = useState<boolean>(false);

  // Get all appointments
  const getAppointments = () => {
    return appointments;
  };

  // Get appointments by user
  const getAppointmentsByUser = (userId: string) => {
    if (!user) return [];

    switch (user.role) {
      case "admin":
        return appointments;
      case "provider":
        return appointments.filter(a => a.providerId === userId);
      case "customer":
        return appointments.filter(a => a.customerId === userId);
      default:
        return [];
    }
  };

  // Get available time slots
  const getAvailableSlots = (providerId: string, date: Date): string[] => {
    const dayOfWeek = date.getDay();
    
    // Get provider's availability for that day
    const providerAvailability = availability.find(
      a => a.userId === providerId && a.dayOfWeek === dayOfWeek
    );
    
    if (!providerAvailability) return [];
    
    // Generate time slots based on availability
    const slots: string[] = [];
    let currentTime = providerAvailability.startTime;
    
    while (currentTime < providerAvailability.endTime) {
      // Check if slot is already booked
      const isBooked = appointments.some(
        a => 
          a.providerId === providerId && 
          a.date === date.toISOString().split('T')[0] && 
          a.startTime === currentTime &&
          ["confirmed", "pending"].includes(a.status)
      );
      
      if (!isBooked) {
        slots.push(currentTime);
      }
      
      // Move to next slot (30 min increments)
      const [hours, minutes] = currentTime.split(':').map(Number);
      let newMinutes = minutes + 30;
      let newHours = hours;
      
      if (newMinutes >= 60) {
        newMinutes -= 60;
        newHours += 1;
      }
      
      currentTime = `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
    }
    
    return slots;
  };

  // Book appointment
  const bookAppointment = async (appointmentData: Partial<Appointment>): Promise<Appointment> => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create new appointment
      const newAppointment: Appointment = {
        id: `appt_${Math.random().toString(36).substring(2, 9)}`,
        customerId: user?.id || "",
        customerName: user?.name || "",
        providerId: appointmentData.providerId || "",
        providerName: appointmentData.providerName || "",
        serviceName: appointmentData.serviceName || "",
        date: appointmentData.date || new Date().toISOString().split('T')[0],
        startTime: appointmentData.startTime || "09:00",
        endTime: appointmentData.endTime || "10:00",
        status: "pending",
        notes: appointmentData.notes,
        aiSuggested: appointmentData.aiSuggested
      };
      
      // Add to appointments
      setAppointments(prev => [...prev, newAppointment]);
      toast.success("Appointment booked successfully!");
      return newAppointment;
    } catch (error) {
      toast.error("Failed to book appointment");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update appointment status
  const updateAppointmentStatus = async (id: string, status: AppointmentStatus): Promise<void> => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update appointment
      setAppointments(prev => 
        prev.map(a => 
          a.id === id ? { ...a, status } : a
        )
      );
      
      const statusMessages = {
        confirmed: "Appointment confirmed!",
        cancelled: "Appointment cancelled",
        completed: "Appointment marked as completed",
        pending: "Appointment status updated to pending"
      };
      
      toast.success(statusMessages[status]);
    } catch (error) {
      toast.error("Failed to update appointment status");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get services
  const getServices = (providerId?: string): Service[] => {
    if (providerId) {
      return services.filter(s => s.providerId === providerId);
    }
    return services;
  };

  // Get service providers
  const getServiceProviders = (): User[] => {
    return MOCK_SERVICE_PROVIDERS;
  };

  // Set availability
  const setAvailability = async (userId: string, newAvailability: Omit<Availability, "id">[]): Promise<void> => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Map new availability entries to include IDs
      const availabilityWithIds = newAvailability.map(a => ({
        ...a,
        id: `avail_${Math.random().toString(36).substring(2, 9)}`,
        userId
      }));
      
      // Remove old availability for this user
      const filteredAvailability = availability.filter(a => a.userId !== userId);
      
      // Add new availability
      setAvailabilityState([...filteredAvailability, ...availabilityWithIds]);
      toast.success("Availability updated successfully!");
    } catch (error) {
      toast.error("Failed to update availability");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get AI suggested slots
  const getAISuggestedSlots = async (customerId: string, providerId: string, date: Date): Promise<string[]> => {
    setLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Get regular available slots
      const availableSlots = getAvailableSlots(providerId, date);
      
      if (availableSlots.length === 0) return [];
      
      // For this demo, we'll just return 1-3 "AI-suggested" slots from the available ones
      // In a real app, this would use actual AI logic based on previous appointments,
      // user preferences, etc.
      const shuffled = [...availableSlots].sort(() => 0.5 - Math.random());
      const suggestedCount = Math.min(Math.floor(Math.random() * 3) + 1, shuffled.length);
      
      return shuffled.slice(0, suggestedCount);
    } catch (error) {
      toast.error("Failed to get AI suggestions");
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppointmentContext.Provider value={{
      appointments,
      services,
      availability,
      loading,
      getAppointments,
      getAppointmentsByUser,
      getAvailableSlots,
      bookAppointment,
      updateAppointmentStatus,
      getServices,
      getServiceProviders,
      setAvailability,
      getAISuggestedSlots
    }}>
      {children}
    </AppointmentContext.Provider>
  );
};

// Custom hook to use appointment context
export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error("useAppointments must be used within an AppointmentProvider");
  }
  return context;
};
