import { Server } from 'socket.io';

const rooms = {};

const setupSocket = (server) => {
  // Create a new socket server
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    // Track which room this socket is currently in
    let currentRoom = null;

    socket.on('joinRoom', (roomId) => {
      console.log("User " + socket.id + " joined room: " + roomId);
      currentRoom = roomId;

      if (!rooms[roomId]) {
        rooms[roomId] = {
          mentor: null,
          students: []
        };
      }
      
      // If there is no mentor the user is the mentor
      if (!rooms[roomId].mentor) {
        rooms[roomId].mentor = socket.id;
        socket.emit('assignRole', 'mentor');
      } else {
        // If there is a mentor, the user is a student - prevent duplicates
        if (!rooms[roomId].students.includes(socket.id)) {
          rooms[roomId].students.push(socket.id);
        }
        socket.emit('assignRole', 'student');
      }

      socket.join(roomId);
      
      socket.emit('joinedRoom', roomId);
    });

    socket.on('leaveRoom', (roomId) => {
      console.log("User " + socket.id + " left room: " + roomId);
      currentRoom = null;
  
      if (!rooms[roomId]) {
        console.log("Room " + roomId + " does not exist");
        return;
      }

      // Remove the user from students array
      rooms[roomId].students = rooms[roomId].students.filter(id => id !== socket.id);

      // Change the mentor if the mentor left
      if (rooms[roomId].mentor === socket.id) {
        rooms[roomId].mentor = null;
        // If there are students in the room notify them that the mentor left
        if (rooms[roomId].students.length > 0) {
          io.to(roomId).emit('mentorLeft');
        }
      } 
  
      socket.leave(roomId);
    });

    socket.on('codeChange', ({ room, code }) => {
      socket.to(room).emit('codeUpdate', code);
    });

    socket.on('disconnect', () => {
      console.log("User " + socket.id + " disconnected");
      
      // Clean up rooms this user was in
      if (currentRoom && rooms[currentRoom]) {
        // Remove from students list
        rooms[currentRoom].students = rooms[currentRoom].students.filter(id => id !== socket.id);
        
        // If this was the mentor remove them and notify students
        if (rooms[currentRoom].mentor === socket.id) {
          rooms[currentRoom].mentor = null;
          
          if (rooms[currentRoom].students.length > 0) {
            io.to(currentRoom).emit('mentorLeft');
          }
        }
        
        // Clean up empty rooms
        if (rooms[currentRoom].mentor === null && rooms[currentRoom].students.length === 0) {
          delete rooms[currentRoom];
          console.log("Room " + currentRoom + " deleted because it's empty");
        }
      }
    });
  });
};

export default setupSocket;
