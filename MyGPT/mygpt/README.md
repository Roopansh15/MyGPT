# MyGPT

MyGPT is a MERN stack AI assistant web app. Users can create an account, log in securely, ask questions, receive OpenAI-generated answers, and return to previous conversations from a polished dark-theme chat dashboard.

## Features

- JWT authentication with signup, login, logout, protected routes, and bcrypt password hashing
- ChatGPT-style interface with a responsive sidebar, main chat window, bottom input, and loading states
- Configurable assistant responses through demo mode, OpenAI, or local Ollama
- MongoDB chat history with create, open, delete, and automatic title generation from the first prompt
- Markdown rendering for assistant answers, including formatted code blocks
- Copy button for assistant responses
- Centralized error handling, API rate limiting, Helmet security headers, and environment-based config
- Deployment-ready `client/` and `server/` structure

## Tech Stack

Frontend:

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- React Markdown
- Lucide React icons

Backend:

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- OpenAI JavaScript SDK
- Optional local Ollama provider
- express-rate-limit

## Folder Structure

```txt
mygpt/
  client/
    src/
      api/
      components/
      context/
      pages/
      routes/
    .env.example
    package.json
  server/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
      utils/
    .env.example
    package.json
  README.md
```

## Local Setup

### 1. Install dependencies

From the project root:

```bash
cd mygpt
npm install
npm run install:all
```

Or install each app separately:

```bash
cd server
npm install

cd ../client
npm install
```

### 2. Configure environment variables

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/mygpt
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
AI_PROVIDER=demo
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1-mini
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2
```

Create `client/.env` from `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB

Use a local MongoDB service or MongoDB Atlas. If using Atlas, replace `MONGO_URI` with your Atlas connection string.

### 4. Run the app

From the project root:

```bash
npm run dev
```

Or run each side separately:

```bash
cd server
npm run dev
```

```bash
cd client
npm run dev
```

Open the frontend at `http://localhost:5173`.

## AI Provider Modes

You do not need paid OpenAI credits to test the project.

Use this for free local testing:

```env
AI_PROVIDER=demo
```

Demo mode returns a realistic Markdown response so you can test signup, login, chat saving, sidebar history, copy buttons, and the full UI without spending money.

Use this only when you have OpenAI credits:

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-4.1-mini
```

Use this for a real free local model if you install Ollama separately:

```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2
```

## How It Works

The React app stores the JWT in `localStorage` after login or signup. The Axios client adds that token to each request as `Authorization: Bearer <token>`.

Protected Express routes use the auth middleware to verify the JWT, load the user from MongoDB, and attach it to `req.user`.

When a user sends a message, the frontend calls `POST /api/chats/:id/messages`. The backend loads the chat, sends the recent conversation context to the configured AI provider, saves the user message and assistant reply in MongoDB, then returns the updated chat.

Chat history is stored in the `chats` collection. Each chat belongs to one user and contains a title plus an ordered `messages` array with `user` and `assistant` roles.

## API Routes

Auth:

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

Chats:

- `GET /api/chats`
- `POST /api/chats`
- `GET /api/chats/:id`
- `PATCH /api/chats/:id`
- `DELETE /api/chats/:id`
- `POST /api/chats/:id/messages`

