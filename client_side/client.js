const socket = io('http://localhost:8001');

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");
const audio = new Audio('ting-sound-197759.mp3');

// Function to format date and time
const formatTimestamp = (date) => {
    const options = {
        hour: '2-digit',
        minute: '2-digit',
        // Uncomment the next line if you want to include seconds
        // second: '2-digit',
    };
    return date.toLocaleDateString(undefined, options);
}

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', position);
    
    // Create a div for the message text
    const textElement = document.createElement('span');
    textElement.innerText = message;
    
    // Create a div for the timestamp
    const timeElement = document.createElement('span');
    const now = new Date();
    timeElement.innerText = formatTimestamp(now);
    timeElement.classList.add('timestamp');
    
    // Append text and timestamp to the message element
    messageElement.appendChild(textElement);
    messageElement.appendChild(timeElement);
    
    messageContainer.append(messageElement);
    
    if (position === 'left') {
        audio.play();
    }
}

// Event listener for form submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    if (message === "") return; // Prevent sending empty messages
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});

// Prompt user for their name
const fullname = prompt("Enter your name to join");
socket.emit('new-user-joined', fullname);

// Listen for user joined event
socket.on('user-joined', fullname => {
    append(`${fullname} joined the chat`, 'right');
});

// Listen for receive message event
socket.on('receive', data => {
    append(`${data.fullname}: ${data.message}`, 'left');
});

// Listen for user left event
socket.on('left', fullname => {                                                                             
    append(`${fullname} left the chat`, 'left');
});
