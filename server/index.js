
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Mock user data (in a real app, this would be in a database)
const users = [
  { 
    id: "1", 
    name: "John Customer", 
    email: "customer@example.com", 
    password: "password",  // In a real app, this would be hashed
    role: "customer",
    avatar: "https://i.pravatar.cc/150?u=customer"
  },
  { 
    id: "2", 
    name: "Sarah Provider", 
    email: "provider@example.com", 
    password: "password",
    role: "provider",
    avatar: "https://i.pravatar.cc/150?u=provider"
  },
  { 
    id: "3", 
    name: "Admin User", 
    email: "admin@example.com", 
    password: "password",
    role: "admin",
    avatar: "https://i.pravatar.cc/150?u=admin"
  }
];

// Mock appointments data
const appointments = [
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

// Mock services data
const services = [
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

// Auth Routes
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  
  if (user && password === user.password) {
    // Remove password before sending user data
    const { password, ...userData } = user;
    res.json({ success: true, user: userData });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.post('/api/register', (req, res) => {
  const { name, email, password, role } = req.body;
  
  // Check if email already exists
  if (users.some(u => u.email === email)) {
    return res.status(400).json({ success: false, message: 'Email already registered' });
  }
  
  // Create new user
  const newUser = {
    id: `user_${Math.random().toString(36).substring(2, 9)}`,
    name,
    email,
    password,
    role,
    avatar: `https://i.pravatar.cc/150?u=${Math.random()}`
  };
  
  users.push(newUser);
  
  // Remove password before sending user data
  const { password: _, ...userData } = newUser;
  res.status(201).json({ success: true, user: userData });
});

// Appointment Routes
app.get('/api/appointments', (req, res) => {
  const { userId, role } = req.query;
  
  if (!userId) {
    return res.json(appointments);
  }
  
  let userAppointments = [];
  
  if (role === 'admin') {
    userAppointments = appointments;
  } else if (role === 'provider') {
    userAppointments = appointments.filter(a => a.providerId === userId);
  } else if (role === 'customer') {
    userAppointments = appointments.filter(a => a.customerId === userId);
  }
  
  res.json(userAppointments);
});

app.post('/api/appointments', (req, res) => {
  const newAppointment = {
    id: `appt_${Math.random().toString(36).substring(2, 9)}`,
    ...req.body
  };
  
  appointments.push(newAppointment);
  res.status(201).json(newAppointment);
});

app.put('/api/appointments/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const appointment = appointments.find(a => a.id === id);
  
  if (!appointment) {
    return res.status(404).json({ success: false, message: 'Appointment not found' });
  }
  
  appointment.status = status;
  res.json({ success: true, appointment });
});

// Service Routes
app.get('/api/services', (req, res) => {
  const { providerId } = req.query;
  
  if (providerId) {
    return res.json(services.filter(s => s.providerId === providerId));
  }
  
  res.json(services);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
