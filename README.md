# event-management

1. Register

```bash
curl -X POST http://localhost:3000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"username": "john_doe", "password": "password123", "role": "organizer"}'
```

2. Login

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