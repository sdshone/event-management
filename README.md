# event-management

1. Sample Register Curl

```bash
curl -X POST http://localhost:3000/api/auth/register \
-H "Content-Type: application/json" \
-d '{"username": "john_doe", "password": "password123", "role": "organizer"}'
```

2. Sample Login Curl

```bash
curl -X POST http://localhost:3000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"username": "john_doe", "password": "password123"}'
```