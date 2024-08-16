const events = require('../models/eventModel');

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
