# Event Management Dashboard

## Overview

This project is an Event Management Dashboard that allows users to create, view, RSVP, and manage events using a Discord bot and a web interface. The bot interacts with users in a Discord server, while the web interface provides a user-friendly way to view and manage events.


/project-root
  ├── bot.js           # Discord bot code
  ├── server.js        # Express server code
  ├── data.json        # Data storage for events
  ├── .env             # Environment variables
  ├── package.json     # Project dependencies and scripts
  └── /public          # Frontend files
      ├── index.html   # HTML structure of the web dashboard
      ├── styles.css   # CSS styles for the web dashboard
      └── script.js    # JavaScript for interactive features

## Features

- **Create Event**: Users can create new events with a unique ID and name.
- **View Events**: Users can view a list of all upcoming events.
- **RSVP to Events**: Users can RSVP to events using buttons in Discord or through the web interface.
- **Edit Event**: Users can edit the name of existing events.
- **Event Reminders**: Automatically schedules reminders for events.
- **View User RSVPs**: Users can view all events they have RSVP'd to.
- **Web Dashboard**: A web interface to view and interact with events.

## Technologies Used

- **Node.js**: JavaScript runtime for server-side programming.
- **Express.js**: Web framework for building the web server.
- **Discord.js**: Library for interacting with the Discord API.
- **Node-Schedule**: Library for scheduling tasks.
- **HTML/CSS/JavaScript**: For building the web interface.

## Setup Instructions

1. **Clone the Repository**:

   git clone 

Install Dependencies:
npm install

Create a .env File: Create a .env file in the root directory and add your Discord bot token
Create data.json File: Create a data.json file in the root directory with an empty object:

Start the Bot and Server:
npm start

