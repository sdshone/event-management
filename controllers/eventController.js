const events = require('../models/eventModel');
const users = require('../models/userModel');
const emailService = require('../services/emailService');

// Create Event
exports.createEvent = (req, res) => {
    const { title, date, time, description } = req.body;
    const event = {
        id: events.length + 1,
        title,
        date,
        time,
        description,
        organizer: req.user.userId, // Store the organizer's user ID
        participants: []
    };
    events.push(event);
    res.status(201).json({ message: 'Event created successfully', event });
};

// Update Event
exports.updateEvent = (req, res) => {
    const { id } = req.params;
    const { title, date, time, description } = req.body;

    const event = events.find(e => e.id == id && e.organizer == req.user.userId);
    if (!event) {
        return res.status(404).json({ message: 'Event not found or unauthorized' });
    }

    event.title = title || event.title;
    event.date = date || event.date;
    event.time = time || event.time;
    event.description = description || event.description;

    res.json({ message: 'Event updated successfully', event });
};

// Delete Event
exports.deleteEvent = (req, res) => {
    const { id } = req.params;
    const eventIndex = events.findIndex(e => e.id == id && e.organizer == req.user.userId);

    if (eventIndex === -1) {
        return res.status(404).json({ message: 'Event not found or unauthorized' });
    }

    events.splice(eventIndex, 1);
    res.json({ message: 'Event deleted successfully' });
};

// Get Events (List or Detail)
exports.getEvents = (req, res) => {
    if (req.params.id) {
        const event = events.find(e => e.id == req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        return res.json(event);
    }
    res.json(events);
};


// Register Participant for Event
exports.registerForEvent = async (req, res) => {
    const { id } = req.params;
    const event = events.find(e => e.id == id);

    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is already registered
    if (event.participants.includes(req.user.userId)) {
        return res.status(400).json({ message: 'User already registered for this event' });
    }

    // Register the user
    event.participants.push(req.user.userId);

    // Get the user's email from the in-memory user data
    const user = users.find(u => u.id == req.user.userId);

    if (user) {
        // Send email notification
        await emailService.sendRegistrationEmail(user.email, event.title);
    }

    res.status(200).json({ message: 'Successfully registered for the event', event });
};

// View Event Participants
exports.getEventParticipants = (req, res) => {
    const { id } = req.params;
    const event = events.find(e => e.id == id);

    if (!event) {
        return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json({ participants: event.participants });
};
