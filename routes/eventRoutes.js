const express = require('express');
const eventController = require('../controllers/eventController');
const verifyToken = require('../middlewares/authMiddleware');
const router = express.Router();

// Event management routes
router.post('/events', verifyToken, eventController.createEvent);
router.put('/events/:id', verifyToken, eventController.updateEvent);
router.delete('/events/:id', verifyToken, eventController.deleteEvent);
router.get('/events', eventController.getEvents);
router.get('/events/:id', eventController.getEvents);

// Participant management routes
router.post('/events/:id/register', verifyToken, eventController.registerForEvent);
router.get('/events/:id/participants', verifyToken, eventController.getEventParticipants);


module.exports = router;
