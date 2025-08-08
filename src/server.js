// --- ADD THIS BLOCK AT THE VERY TOP OF THE FILE ---
// Global error handlers to catch unhandled promise rejections and uncaught exceptions
process.on('unhandledRejection', (reason, promise) => {
  console.error('!!! UNHANDLED REJECTION !!!');
  console.error('Reason:', reason.stack || reason);
  console.error('At Promise:', promise);
});

process.on('uncaughtException', (error) => {
  console.error('!!! UNCAUGHT EXCEPTION !!!');
  console.error('Error:', error.stack || error);
  // process.exit(1); // <-- TEMPORARILY COMMENT THIS LINE OUT
});

// ----------------------------------------------------

const express = require('express');
const http = require('http');
const dotenv = require('dotenv');
const cors = require('cors');
const { Server } = require('socket.io');
const path = require('path');

// --- 1. SETUP PHASE ---
// Load environment variables first
dotenv.config({path:'../.env'})

// All require statements for your architecture layers
// Infrastructure
const connectDB = require('./infrastructure/database/mongodb/mongoose.setup');
const UserRepositoryImpl = require('./infrastructure/database/mongodb/repositories/user.repository.impl');
const TokenRepositoryImpl = require('./infrastructure/database/mongodb/repositories/token.repository.impl');
const RoomRepositoryImpl = require('./infrastructure/database/mongodb/repositories/room.repository.impl');
const MessageRepositoryImpl = require('./infrastructure/database/mongodb/repositories/message.repository.impl');
const BcryptService = require('./infrastructure/services/bcrypt.service');
const JwtService = require('./infrastructure/services/jwt.service');
// Application
const RegisterUseCase = require('./application/use-cases/auth/register.usecase');
const LoginUseCase = require('./application/use-cases/auth/login.usecase');
const LogoutUseCase = require('./application/use-cases/auth/logout.usecase');
const RefreshTokenUseCase = require('./application/use-cases/auth/refresh.usecase');
const CreateRoomUseCase = require('./application/use-cases/rooms/create-room.usecase');
const ListRoomsUseCase = require('./application/use-cases/rooms/list-rooms.usecase');
const JoinRoomUseCase = require('./application/use-cases/rooms/join-room.usecase');
const SendMessageUseCase = require('./application/use-cases/messages/send-message.usecase');
const GetMessageHistoryUseCase = require('./application/use-cases/messages/get-message-history.usecase');


// --- Add new Phase 6 use case imports ---
const EditMessageUseCase = require('./application/use-cases/messages/edit-message.usecase');
const DeleteMessageUseCase = require('./application/use-cases/messages/delete-message.usecase');


// Interfaces
const AuthController = require('./interfaces/http/controllers/auth.controller');
const RoomController = require('./interfaces/http/controllers/room.controller');
const UploadController = require('./interfaces/http/controllers/upload.controller');
const createAuthRouter = require('./interfaces/http/routes/auth.route');
const createRoomRouter = require('./interfaces/http/routes/room.routes');
const createUploadRouter = require('./interfaces/http/routes/upload.route');
const initializeSocketHandler = require('./interfaces/sockets/socket.handler');
const createAuthMiddleware = require('./interfaces/http/middleware/auth.middleware');


// --- 2. INITIALIZATION PHASE ---
// Create the core server instances
const app = express();

// --- Add new Phase 5 instantiations ---
const uploadController = new UploadController(); // This controller has no dependencies


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Connect to the database
connectDB(process.env.MONGO_URI);

// --- 3. DEPENDENCY INJECTION (WIRING) PHASE ---
// Instantiate all services, repositories, use cases, and controllers
// Services and Repositories
const userRepository = new UserRepositoryImpl();
const tokenRepository = new TokenRepositoryImpl();
const roomRepository = new RoomRepositoryImpl();
const messageRepository = new MessageRepositoryImpl();
const passwordService = new BcryptService();
const tokenService = new JwtService(
    process.env.JWT_ACCESS_SECRET,
    process.env.JWT_REFRESH_SECRET,
    process.env.ACCESS_TOKEN_EXPIRATION,
    process.env.REFRESH_TOKEN_EXPIRATION
);
// Use Cases
const registerUseCase = new RegisterUseCase(userRepository, passwordService);
const loginUseCase = new LoginUseCase(userRepository, passwordService, tokenService, tokenRepository);
const logoutUseCase = new LogoutUseCase(tokenRepository);
const refreshTokenUseCase = new RefreshTokenUseCase(tokenRepository, tokenService);
const createRoomUseCase = new CreateRoomUseCase(roomRepository);
const listRoomsUseCase = new ListRoomsUseCase(roomRepository);
const joinRoomUseCase = new JoinRoomUseCase(roomRepository);
const sendMessageUseCase = new SendMessageUseCase(messageRepository);
const getMessageHistoryUseCase = new GetMessageHistoryUseCase(messageRepository);


// --- Add new Phase 6 use case instantiations ---
const editMessageUseCase = new EditMessageUseCase(messageRepository);
const deleteMessageUseCase = new DeleteMessageUseCase(messageRepository);


// Controllers
const authController = new AuthController(registerUseCase, loginUseCase, logoutUseCase, refreshTokenUseCase);
const roomController = new RoomController(createRoomUseCase, listRoomsUseCase, joinRoomUseCase);
// Middleware
const authMiddleware = createAuthMiddleware(tokenService, userRepository);


// --- DM 
const StartDmUseCase = require('./application/use-cases/dm/start-dm.usecase');
const DmController = require('./interfaces/http/controllers/dm.controller');
const createDmRouter = require('./interfaces/http/routes/dm.route');

// new  instantiations 
const startDmUseCase = new StartDmUseCase(roomRepository, userRepository);
const dmController = new DmController(startDmUseCase);
// ---


// --- 4. CONFIGURATION PHASE ---
// Configure Express middleware
app.use(cors());
app.use(express.json());

// Configure Express routes

// Serve static files from the 'public' directory
app.use('/static', express.static(path.join(__dirname, 'public')));

app.use('/api/v1/auth', createAuthRouter(authController));
app.use('/api/v1/rooms', createRoomRouter(roomController, authMiddleware));
app.use('/api/v1/dm' ,  createDmRouter(dmController, authMiddleware));

// Any request to '/static/...' will look for files in the 'public' folder.
app.use('/api/uploads', createUploadRouter(uploadController, authMiddleware)); 

// Configure Socket.IO handler
initializeSocketHandler(io, tokenService, sendMessageUseCase, getMessageHistoryUseCase,editMessageUseCase, 
    deleteMessageUseCase,messageRepository  );

// --- 5. EXECUTION PHASE ---
// Start the server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => console.log(`✅ Server and Sockets are running on port ${PORT}`));