const io = require('socket.io')(8001, {
  cors: {
    origin: "*", // allow requests from all origins
    methods: ["GET", "POST"] // allow GET and POST requests
  }
});

const users = {};

// Helper function to get the current time and date as a string
function getCurrentTime() {
  const now = new Date();
  const time = now.toLocaleTimeString(); // e.g., "10:20:30 AM"
  const date = now.toLocaleDateString(); // e.g., "8/12/2024"
  return `${date} ${time}`;
}

io.on('connection', socket => {
  // When a new user joins the chat
  socket.on('new-user-joined', fullname => {
    console.log("New user:", fullname);
    users[socket.id] = fullname;
    const timestamp = getCurrentTime();
    console.log(`User joined at: ${timestamp}`);
    socket.broadcast.emit('user-joined', fullname, timestamp);
  });

  // When a user sends a message
  socket.on('send', message => {
    const timestamp = getCurrentTime();
    console.log(`Message sent at: ${timestamp}`);
    socket.broadcast.emit('receive', { message: message, fullname: users[socket.id], timestamp });
  });

  // When a user disconnects from the chat
  socket.on('disconnect', () => {
    const fullname = users[socket.id];
    console.log("User disconnected:", fullname);
    const timestamp = getCurrentTime();
    console.log(`User disconnected at: ${timestamp}`);
    socket.broadcast.emit('left', fullname, timestamp);
    delete users[socket.id];
  });
});