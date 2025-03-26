# Appointments Module

This module handles the creation, management, and scheduling of appointments between users and experts.

## Features

- Create appointments between users and experts
- View appointment details
- List appointments for users and experts
- Update appointment status (confirm, complete, reschedule)
- Cancel appointments
- Check expert availability for scheduling

## API Endpoints

### Create Appointment
- **POST** `/appointments`
- Creates a new appointment with an expert
- Requires authentication
- Request body:
  ```typescript
  {
    expert_id: number;
    service_id: number;
    scheduled_time: string; // ISO string format
    end_time: string; // ISO string format
    notes?: string;
  }
  ```

### Get Appointment by ID
- **GET** `/appointments/:id`
- Retrieves details of a specific appointment
- Requires authentication
- Path parameters:
  - `id`: Appointment ID

### Get User's Appointments
- **GET** `/appointments/user`
- Lists all appointments for the authenticated user
- Requires authentication

### Get Expert's Appointments
- **GET** `/appointments/expert`
- Lists all appointments for the authenticated expert
- Requires authentication

### Update Appointment Status
- **PATCH** `/appointments/:id/status`
- Updates the status of an appointment (for experts only)
- Requires authentication
- Path parameters:
  - `id`: Appointment ID
- Request body:
  ```typescript
  {
    status: "pending" | "confirmed" | "canceled" | "completed" | "rescheduled";
  }
  ```

### Cancel Appointment
- **POST** `/appointments/:id/cancel`
- Cancels an appointment (for users only)
- Requires authentication
- Path parameters:
  - `id`: Appointment ID

### Get Expert Availability
- **GET** `/appointments/availability`
- Retrieves available time slots for an expert on a specific date
- Requires authentication
- Query parameters:
  - `expert_id`: Expert ID
  - `date`: Date in ISO format (YYYY-MM-DD)

## Appointment Status Flow

1. **PENDING**: Initial status when appointment is created
2. **CONFIRMED**: Expert has confirmed the appointment
3. **COMPLETED**: Appointment has been completed
4. **CANCELED**: Appointment has been canceled by user or expert
5. **RESCHEDULED**: Appointment has been rescheduled

## Implementation Details

The module checks for:
- Expert availability based on their weekly schedule
- Existing appointments to prevent double-booking
- Service validity and association with the expert
- User and expert authorization for various operations 