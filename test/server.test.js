const tap = require('tap');
const supertest = require('supertest');
const app = require('../index');
const events = require('../models/eventModel'); // Adjust path as per your structure
const users = require('../models/userModel');
const jwt = require('jsonwebtoken');
const server = supertest(app)
require('dotenv').config();
// Helper function to authenticate and get a JWT
async function getAuthToken() {
    return token = jwt.sign({ userId: '1', role: 'organizer' }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Reset the events and users arrays before each test
tap.beforeEach(() => {
    events.length = 0; // Clear the events array
    users.length = 0;  // Clear the users array
});


tap.test('POST /api/auth/register - Successful Registration', async t => {
    const response = await server
        .post('/api/auth/register')
        .send({
            username: 'john_doe',
            password: 'password123',
            email: 'john_doe@example.com',
            role: 'organizer'
        });

    t.equal(response.status, 201, 'Should return status 201');
    t.match(response.body, {
        message: 'User registered successfully',
        user: {
            username: 'john_doe',
            email: 'john_doe@example.com',
            role: 'organizer'
        }
    }, 'Should return a success message and user data');

    t.end();
});

tap.test('POST /api/auth/register - Username Already Taken', async t => {
    // Pre-populate the users array with a user
    users.push({
        id: 1,
        username: 'john_doe',
        email: 'john_doe@example.com',
        password: 'hashed_password',
        role: 'organizer'
    });

    const response = await server
        .post('/api/auth/register')
        .send({
            username: 'john_doe',
            password: 'password123',
            email: 'different_email@example.com',
            role: 'organizer'
        });

    t.equal(response.status, 400, 'Should return status 400');
    t.match(response.body, { message: 'Username or email already taken' }, 'Should return a message indicating the username is taken');

    t.end();
});

tap.test('POST /api/auth/register - Email Already Taken', async t => {
    // Pre-populate the users array with a user
    users.push({
        id: 1,
        username: 'different_user',
        email: 'john_doe@example.com',
        password: 'hashed_password',
        role: 'organizer'
    });

    const response = await server
        .post('/api/auth/register')
        .send({
            username: 'new_user',
            password: 'password123',
            email: 'john_doe@example.com',
            role: 'organizer'
        });

    t.equal(response.status, 400, 'Should return status 400');
    t.match(response.body, { message: 'Username or email already taken' }, 'Should return a message indicating the email is taken');

    t.end();
});

tap.test('POST /api/auth/register - Missing Required Fields', async t => {
    const response = await server
        .post('/api/auth/register')
        .send({
            username: 'john_doe',
            role: 'organizer'
            // Missing password and email
        });

    t.equal(response.status, 400, 'Should return status 400');
    t.match(response.body, { message: 'Username, password, and email are required' }, 'Should return a message indicating missing fields');

    t.end();
});

tap.test('POST /api/events - Create Event', async t => {
    try {
        // First, create and authenticate a user
        users.push({
            id: 1,
            username: 'organizer_user',
            email: 'organizer@example.com',
            password: 'hashed_password', // assume password hashing is done
            role: 'organizer'
        });

        const token = await getAuthToken();

        const response = await server
            .post('/api/events')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Tech Conference',
                description: 'A conference about technology',
                date: '2024-09-15',
                time: '10:00',
                participants: []
            });

        t.equal(response.status, 201, 'Should return status 201');
        t.match(response.body, {
            message: 'Event created successfully',
            event: {
                title: 'Tech Conference',
                description: 'A conference about technology',
                date: '2024-09-15',
                time: '10:00'
            }
        }, 'Should return the created event details');

        t.end();
    } catch (error) {
        t.fail(error);
        t.end();
    }
});

tap.test('PUT /api/events/:id - Update Event', async t => {
    try {
        // Create a user and authenticate
        users.push({
            id: 1,
            username: 'organizer_user',
            email: 'organizer@example.com',
            password: 'hashed_password',
            role: 'organizer'
        });

        const token = await getAuthToken();

        // Pre-populate an event
        events.push({
            id: 1,
            organizer: 1,
            title: 'Tech Conference',
            description: 'A conference about technology',
            date: '2024-09-15',
            time: '10:00',
            participants: []
        });

        const response = await server
            .put('/api/events/1')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Updated Tech Conference',
                description: 'An updated description',
                date: '2024-09-16',
                time: '11:00'
            });

        t.equal(response.status, 200, 'Should return status 200');
        t.match(response.body, {
            message: 'Event updated successfully',
            event: {
                title: 'Updated Tech Conference',
                description: 'An updated description',
                date: '2024-09-16',
                time: '11:00'
            }
        }, 'Should return the updated event details');

        t.end();
    } catch (error) {
        t.fail(error);
        t.end();
    }
});

tap.test('DELETE /api/events/:id - Delete Event', async t => {
    try {
        // Create a user and authenticate
        users.push({
            id: 1,
            username: 'organizer_user',
            email: 'organizer@example.com',
            password: 'hashed_password',
            role: 'organizer'
        });

        const token = await getAuthToken();

        // Pre-populate an event
        events.push({
            id: 1,
            organizer: 1,
            title: 'Tech Conference',
            description: 'A conference about technology',
            date: '2024-09-15',
            time: '10:00',
            participants: []
        });

        const response = await server
            .delete('/api/events/1')
            .set('Authorization', `Bearer ${token}`);

        t.equal(response.status, 200, 'Should return status 200');
        t.match(response.body, { message: 'Event deleted successfully' }, 'Should confirm event deletion');

        t.end();
    } catch (error) {
        t.fail(error);
        t.end();
    }
});

tap.test('POST /api/events/:id/register - Register for Event', async t => {
    try {
        // Create an organizer and an attendee
        users.push({
            id: 1,
            username: 'organizer_user',
            email: 'organizer@example.com',
            password: 'hashed_password',
            role: 'organizer'
        });
        users.push({
            id: 2,
            username: 'attendee_user',
            email: 'attendee@example.com',
            password: 'hashed_password',
            role: 'attendee'
        });

        const token = await getAuthToken();

        // Pre-populate an event
        events.push({
            id: 1,
            title: 'Tech Conference',
            description: 'A conference about technology',
            date: '2024-09-15',
            time: '10:00',
            participants: []
        });

        const response = await server
            .post('/api/events/1/register')
            .set('Authorization', `Bearer ${token}`)
            .send({ email: 'attendee@example.com' });

        t.equal(response.status, 200, 'Should return status 200');
        t.match(response.body, { message: 'Successfully registered for the event' }, 'Should confirm user registration');

        t.end();
    } catch (error) {
        t.fail(error);
        t.end();
    }
});


tap.teardown(() => {
    process.exit(0);
});