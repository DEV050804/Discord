const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 4000;

const dataFilePath = path.join(__dirname, 'data.json');

const loadEvents = () => JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/events', (req, res) => {
  const events = loadEvents();
  if (Object.keys(events).length === 0) {
    res.send('No events scheduled.');
  } else {
    let eventList = '';
    for (const [id, event] of Object.entries(events)) {
      eventList += `ID: ${id}, Name: ${event.name}, RSVPs: ${event.rsvps.length}\n`;
    }
    res.send(eventList);
  }
});

app.get('/events/:id', (req, res) => {
  const events = loadEvents();
  const event = events[req.params.id];
  if (event) {
    res.send(`Event: ${event.name}\nRSVPs: ${event.rsvps.join(', ')}`);
  } else {
    res.send('Event not found.');
  }
});

// Endpoint to RSVP to an event
app.get('/rsvp/:id', (req, res) => {
  const events = loadEvents();
  const event = events[req.params.id];
  if (event) {
    event.rsvps.push("User"); // Replace "User" with the actual username if available
    fs.writeFileSync(dataFilePath, JSON.stringify(events, null, 2));
    res.send(`You've successfully RSVP'd to event "${event.name}"!`);
  } else {
    res.send('Event not found.');
  }
});

// Endpoint to edit event details
app.get('/editevent/:id/:newname', (req, res) => {
  const events = loadEvents();
  const event = events[req.params.id];
  if (event) {
    event.name = req.params.newname;
    fs.writeFileSync(dataFilePath, JSON.stringify(events, null, 2));
    res.send(`Event ID: ${req.params.id} has been renamed to "${req.params.newname}".`);
  } else {
    res.send('Event not found.');
  }
});

// Endpoint to view user's RSVPs
app.get('/myrsvps/:username', (req, res) => {
  const events = loadEvents();
  let userRsvps = `RSVPs for user ${req.params.username}:\n`;
  for (const [id, event] of Object.entries(events)) {
    if (event.rsvps.includes(req.params.username)) {
      userRsvps += `ID: ${id}, Name: ${event.name}\n`;
    }
  }
  if (userRsvps === `RSVPs for user ${req.params.username}:\n`) {
    userRsvps = `User ${req.params.username} has not RSVP'd to any events.`;
  }
  res.send(userRsvps);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
