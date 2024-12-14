require('dotenv').config();
const { Client, GatewayIntentBits, Partials, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');
const schedule = require('node-schedule');
const dataFilePath = path.join(__dirname, 'data.json');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

let events = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));

const saveEvents = () => {
  fs.writeFileSync(dataFilePath, JSON.stringify(events, null, 2));
};

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  
  // Schedule reminders for existing events
  Object.values(events).forEach(event => {
    scheduleReminder(event);
  });
});

client.on('messageCreate', message => {
  if (message.content.startsWith('!createevent')) {
    const args = message.content.split(' ').slice(1);
    const eventName = args.join(' ');
    const eventID = Date.now().toString(); // Simple unique ID
    const eventDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // Set event for 24 hours from now
    events[eventID] = { name: eventName, rsvps: [], date: eventDate };
    saveEvents();
    console.log(`Creating event: ${eventName} with ID: ${eventID}`);

    // Add button for RSVP
    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`rsvp_${eventID}`)
          .setLabel('RSVP')
          .setStyle(ButtonStyle.Primary)
      );

    message.reply({ content: `Event "${eventName}" created with ID: ${eventID}!`, components: [row] });

    // Schedule reminder for the new event
    scheduleReminder(events[eventID]);
  }

  if (message.content.startsWith('!events')) {
    if (Object.keys(events).length === 0) {
      message.reply('No events scheduled.');
    } else {
      let eventList = 'Upcoming events:\n';
      for (const [id, event] of Object.entries(events)) {
        eventList += `ID: ${id}, Name: ${event.name}, RSVPs: ${event.rsvps.length}\n`;
      }
      message.reply(eventList);
    }
  }

  if (message.content.startsWith('!rsvp')) {
    const args = message.content.split(' ').slice(1);
    const eventID = args[0];
    if (events[eventID]) {
      const event = events[eventID];
      event.rsvps.push(message.author.username);
      saveEvents();
      console.log(`RSVP to event: ${eventID}`);
      message.reply(`You've successfully RSVP'd to event "${event.name}"!`);
    } else {
      message.reply('Event not found.');
    }
  }

  if (message.content.startsWith('!cancelevent')) {
    const args = message.content.split(' ').slice(1);
    const eventID = args[0];
    if (events[eventID]) {
      delete events[eventID];
      saveEvents();
      console.log(`Cancelled event: ${eventID}`);
      message.reply(`Event with ID: ${eventID} has been cancelled.`);
    } else {
      message.reply('Event not found.');
    }
  }

  if (message.content.startsWith('!editevent')) {
    const args = message.content.split(' ').slice(1);
    const eventID = args[0];
    const newEventName = args.slice(1).join(' ');
    if (events[eventID]) {
      events[eventID].name = newEventName;
      saveEvents();
      message.reply(`Event ID: ${eventID} has been renamed to "${newEventName}".`);
    } else {
      message.reply('Event not found.');
    }
  }

  if (message.content.startsWith('!myrsvps')) {
    let userRsvps = 'Your RSVPs:\n';
    for (const [id, event] of Object.entries(events)) {
      if (event.rsvps.includes(message.author.username)) {
        userRsvps += `ID: ${id}, Name: ${event.name}\n`;
      }
    }
    if (userRsvps === 'Your RSVPs:\n') {
      userRsvps = 'You have not RSVP\'d to any events.';
    }
    message.reply(userRsvps);
  }
});

client.on('interactionCreate', interaction => {
  if (!interaction.isButton()) return;
  const [action, eventID] = interaction.customId.split('_');
  if (action === 'rsvp' && events[eventID]) {
    const event = events[eventID];
    event.rsvps.push(interaction.user.username);
    saveEvents();
    interaction.reply(`You've successfully RSVP'd to event "${event.name}"!`);
  }
});

client.login(process.env.DISCORD_TOKEN);

// Function to schedule reminders
function scheduleReminder(event) {
  const eventDate = new Date(event.date);
  schedule.scheduleJob(eventDate, () => {
    // Fetch the channel by ID where you want to send the reminder
    const channel = client.channels.cache.get('YOUR_CHANNEL_ID');
    if (channel) {
      channel.send(`Reminder: Event "${event.name}" is starting soon!`);
    } else {
      console.error('Channel not found!');
    }
  });
}
