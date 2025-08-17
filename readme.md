# Chatroom API

A real-time, scalable, and robust backend service for a multi-user chat application, built with Node.js, Express, and Socket.io. This API facilitates instant two-way communication, allowing users to join chat rooms, send and receive messages in real-time.

---

## ✨ Features

-   **Real-time Messaging:** Utilizes **Socket.io** for low-latency, event-based communication.
-   **User Authentication:** Secure user registration and login using **JSON Web Tokens (JWT)**.
-   **Multiple Chat Rooms:** Users can create, join, and chat in different public or private rooms.
-   **Online User Management:** Tracks active users in each room.
-   **Scalable Architecture:** Built with a clean and modular structure for easy maintenance and expansion.

---

## 🛠️ Technologies Used

-   **Backend:** Node.js, Express.js
-   **Real-time Engine:** Socket.io
-   **Database:** MongoDB with Mongoose
-   **Authentication:** JSON Web Tokens (JWT), bcrypt.js
-   **Environment Variables:** `dotenv` for managing configuration.

---

## 🚀 Getting Started

### Prerequisites

-   Node.js (v14 or higher)
-   MongoDB instance (local or cloud)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/chatroom-api.git](https://github.com/your-username/chatroom-api.git)
    cd chatroom-api
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root directory and add the following:
    ```env
    PORT=3000
    MONGODB_URL=mongodb://localhost:27017/chatroom-db
    JWT_SECRET=your_super_secret_key
    ```

4.  **Run the server:**
    ```bash
    npm start
    ```
    The server will be running on `http://localhost:3000`.

---

## 🔌 API Endpoints & Socket Events

### REST API Endpoints (for User & Room Management)

| Method | Endpoint              | Description                      |
| :----- | :-------------------- | :------------------------------- |
| `POST` | `/api/users/register` | Register a new user              |
| `POST` | `/api/users/login`    | Login a user and get a JWT token |
| `GET`  | `/api/rooms`          | Get a list of all chat rooms     |
| `POST` | `/api/rooms`          | Create a new chat room           |

### Socket.io Events

The client should connect to the server with a valid JWT token.

-   **`connection`**: Triggered when a user connects.
    -   **`joinRoom` (emit from client)**: User joins a specific room.
        -   Payload: `{ roomId: 'your_room_id' }`
    -   **`sendMessage` (emit from client)**: User sends a message to their current room.
        -   Payload: `{ message: 'Hello, world!' }`
    -   **`receiveMessage` (listen on client)**: Server broadcasts a new message to all users in a room.
        -   Payload: `{ user: 'username', message: 'Hello, world!', timestamp: '...' }`
    -   **`disconnect`**: Triggered when a user disconnects.