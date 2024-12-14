document.addEventListener('DOMContentLoaded', () => {
    const eventList = document.getElementById('events');
    const eventDetails = document.getElementById('details');

    // Fetch and display all events
    fetch('/events')
        .then(response => response.text())
        .then(data => {
            const events = data.split('\n').filter(event => event);
            events.forEach(event => {
                const li = document.createElement('li');
                li.textContent = event;
                li.addEventListener('click', () => showEventDetails(event));
                eventList.appendChild(li);
            });
        });

    // Fetch and display details of a selected event
    function showEventDetails(event) {
        const eventId = event.match(/ID: (\d+)/)[1];
        fetch(`/events/${eventId}`)
            .then(response => response.text())
            .then(data => {
                eventDetails.innerHTML = `
                    <p>${data.replace(/\n/g, '<br>')}</p>
                    <button id="rsvp-btn">RSVP</button>
                    <button id="edit-btn">Edit Event</button>
                `;

                document.getElementById('rsvp-btn').addEventListener('click', () => rsvpEvent(eventId));
                document.getElementById('edit-btn').addEventListener('click', () => editEvent(eventId));
            });
    }

    // RSVP to an event
    function rsvpEvent(eventId) {
        fetch(`/rsvp/${eventId}`)
            .then(response => response.text())
            .then(data => {
                alert(data);
                showEventDetails(`ID: ${eventId}`);
            });
    }

    // Edit an event
    function editEvent(eventId) {
        const newName = prompt('Enter new event name:');
        if (newName) {
            fetch(`/editevent/${eventId}/${newName}`)
                .then(response => response.text())
                .then(data => {
                    alert(data);
                    showEventDetails(`ID: ${eventId}`);
                });
        }
    }
});
