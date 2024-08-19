# Virtual Event Management Platform Backend

## Overview

This project is a backend system for a virtual event management platform. It allows users to register, log in, create and manage events, and register for events. The backend is built with Node.js, Express.js, and uses in-memory data structures to store information about users and events.

## Features

- User Authentication: Secure user registration and login using bcrypt for password hashing and JWT for session management.
- Event Management: Create, update, and delete events with details such as date, time, description, and participant list.
- Participant Management: Allow users to register for events and manage their registrations.
- Asynchronous Operations: Sending email notifications on successful event registration.



## Installation

1. Clone the repository:

```bash
git clone https://github.com/sdshone//event-management
cd event-management
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file in the root directory with the following environment variables:

```
PORT=xxx
JWT_SECRET=xxx
EMAIL_USER=xxx
EMAIL_CLIENT_ID=xxx
EMAIL_CLIENT_SECRET=xxx
EMAIL_REFRESH_TOKEN=xxx
EMAIL_ACCESS_TOKEN=xxx
```

4. Start the server:

```
node run start
```
The server will run on http://localhost:3000.

5. Run tests:

```
npm run test
```

# API Endpoints

1. Register User

```bash
curl -X POST http://localhost:3000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"username": "john_doe", "password": "password123", "role": "organizer", "email": "john_doe@example.com"}'
```

2. Login User

```bash
curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"username": "john_doe", "password": "password123"}'
```

3. Create an Event

```bash
curl -X POST http://localhost:3000/api/events \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your_jwt_token>" \
-d '{"title": "Virtual Conference", "date": "2024-08-20", "time": "10:00 AM", "description": "Tech conference"}'
```

4. Update an Event

```bash
curl -X PUT http://localhost:3000/api/events/1 \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <your_jwt_token>" \
-d '{"title": "Updated Conference"}'
```

5. Delete an Event

```bash
curl -X DELETE http://localhost:3000/api/events/1 \
-H "Authorization: Bearer <your_jwt_token>"
```

6. Get All Events

```bash
curl -X GET http://localhost:3000/api/events
```

7. Get a Specific Event

```bash
curl -X GET http://localhost:3000/api/events/1
```

8. Register for an Event

```bash
curl -X POST http://localhost:3000/api/events/1/register \
-H "Authorization: Bearer <your_jwt_token>"
```

9. View Event Participants

```bash
curl -X GET http://localhost:3000/api/events/1/participants \
-H "Authorization: Bearer <your_jwt_token>"
```