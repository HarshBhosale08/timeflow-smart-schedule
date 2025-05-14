
# Smart Appointment Scheduler

A full-stack web application for scheduling and managing appointments between customers and service providers.

## Tech Stack

- **Frontend**: React, Bootstrap
- **Backend**: Node.js, Express.js

## Features

- User authentication (login, registration, role-based access)
- Customers can book, view, reschedule, and cancel appointments
- Service Providers can view their schedule, approve or reject appointments, and set availability
- Admins can manage users, view all appointments, and update system settings
- AI-based scheduler that suggests optimal time slots
- Responsive design for mobile, tablet, and desktop devices

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd smart-appointment-scheduler
   ```

2. Install frontend dependencies:
   ```
   npm install
   ```

3. Install backend dependencies:
   ```
   cd server
   npm install
   cd ..
   ```

### Running the Application

1. Start the backend server:
   ```
   cd server
   npm run dev
   ```

2. In a separate terminal, start the frontend:
   ```
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Demo Accounts

- **Customer**: customer@example.com / password
- **Provider**: provider@example.com / password
- **Admin**: admin@example.com / password
