function initializeSocketHandler(io, tokenService, sendMessageUseCase, getMessageHistoryUseCase, editMessageUseCase,deleteMessageUseCase ,messageRepository  ) {

    // --- Authentication Middleware ---
    // This runs once per connection to verify the user's token.
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error('Authentication error: Token not provided.'));
        }
        try {
            const decoded = await tokenService.verifyAccessToken(token);
            socket.user = decoded; // Attach user payload to the socket
            next();
        } catch (err) {
            console.error("Socket Auth Error:", err.name, err.message);
            return next(new Error('Authentication error: Invalid token.'));
        }
    });

    // --- Main Connection Handler ---
    // This function runs for each successfully authenticated client.
    io.on('connection', (socket) => {
        console.log(`✅ User connected: ${socket.user.username} (ID: ${socket.id})`);

           // --- THIS IS THE NEW PART ---
    // Immediately send the user their own session details.
    socket.emit('session', {
        userId: socket.user.id,
        username: socket.user.username
    });
    // ---------------------------
    

        // --- Room Management ---
        socket.on('joinRoom', async ({ roomId }) => {
            socket.join(roomId);

              // --- DEBUG LOG 1 ---
            const clientsInRoom = io.sockets.adapter.rooms.get(roomId);
            console.log(`--- User '${socket.user.username}' joined room '${roomId}'.`);
            console.log(`--- Clients now in room '${roomId}':`, clientsInRoom ? Array.from(clientsInRoom) : 'None');
            // --------------------

            // console.log(`User '${socket.user.username}' joined room: ${roomId}`);

            // Announce presence to the room
            const userPayload = { id: socket.user.id, username: socket.user.username };
            io.to(roomId).emit('userJoined', userPayload);

            // Fetch and send message history to the joining user
            try {
                const messageHistory = await getMessageHistoryUseCase.execute({ roomId });
                socket.emit('messageHistory', messageHistory.reverse());
            } catch (error) {
                console.error("Error fetching message history:", error);
                socket.emit('error', { message: 'Could not fetch message history.' });
            }
        });

        // --- Messaging ---
        // socket.on('chatMessage', async ({ roomId, content }) => {
        //     try {
        //         const message = await sendMessageUseCase.execute({
        //             content,
        //             roomId,
        //             senderId: socket.user.id
        //         });
        //         io.to(roomId).emit('newMessage', message);
        //     } catch (error) {
        //         console.error("Error sending chat message:", error);
        //         socket.emit('error', { message: 'Could not send message.' });
        //     }
        // });
        socket.on('chatMessage', async ({ roomId, content, type = 'text' }) => {
            try {
                // We now pass the 'type' along to the use case.
                const message = await sendMessageUseCase.execute({
                    content,
                    roomId,
                    senderId: socket.user.id,
                    type // Pass the type ('text' or 'image')
                });
                  const plainMessage = message.toObject();
                io.to(roomId).emit('newMessage', plainMessage);
            } catch (error) {
                console.error("Error sending chat message:", error);
                socket.emit('error', { message: 'Could not send message.' });
            }
        });
        // --- Typing Indicators ---
        socket.on('startTyping', ({ roomId }) => {

             // --- DEBUG LOG 2 ---
            const clientsInRoom = io.sockets.adapter.rooms.get(roomId);
            console.log(`--- 'startTyping' received from '${socket.user.username}' for room '${roomId}'.`);
            console.log(`--- Broadcasting to clients:`, clientsInRoom ? Array.from(clientsInRoom) : 'None');
            // --------------------


            const userPayload = { id: socket.user.id, username: socket.user.username };
            io.to(roomId).emit('userTyping', userPayload);
        });

        socket.on('stopTyping', ({ roomId }) => {
            const userPayload = { id: socket.user.id, username: socket.user.username };
            socket.to(roomId).emit('userStoppedTyping', userPayload);
        });

        // --- ADD 'editMessage' LISTENER ---
        socket.on('editMessage' , async ({messageId , newContent}) => {
            try{
                const updatedMessage = await editMessageUseCase.execute({
                    messageId,
                    newContent,
                    requestingUserId : socket.user.id
                });

                // Broadcast the updated message to the room it belongs to
                io.to(updatedMessage.room.toString()).emit('messageUpdated' , updatedMessage.toObject());
            } catch(err)
            {
                console.log('Error editing messsage:',err);
                socket.emit('error',{message:err.message || 'Could not edit message'});
            }
        })

      // --- ADD 'deleteMessage' LISTENER ---
      socket.on('deleteMessage', async({messageId}) => {
        try{
          // Step 1: Find the message first to get its room ID.
            const message = await messageRepository.findById(messageId);
            if (!message) {
                // If message is already gone, no action is needed.
                return;
            }
            const roomId = message.room.toString();

            // Step 2: Execute the delete use case, which includes the authorization check.
            await deleteMessageUseCase.execute({
                messageId,
                requestingUserId: socket.user.id
            });

            // Step 3: If successful, broadcast the deletion to the correct room.
            io.to(roomId).emit('messageDeleted', { messageId });
        } catch(err)
        {
            console.log('Error deleting messsage', err);
            socket.emit('error', {message:err.message || 'could not delete message'});

        }
      })

        // --- Disconnection Handler ---
        socket.on('disconnect', () => {
            console.log(`🔥 User disconnected: ${socket.user.username}`);
            const userPayload = { id: socket.user.id, username: socket.user.username };
            
            // Announce user leaving to all rooms they were in
            socket.rooms.forEach(room => {
                if (room !== socket.id) { // Don't broadcast to the socket's private room
                    io.to(room).emit('userLeft', userPayload);
                }
            });
        });
    });
}

module.exports = initializeSocketHandler;