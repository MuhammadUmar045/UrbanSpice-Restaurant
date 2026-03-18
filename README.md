# Urban Spice Restaurant Website

A professional and interactive restaurant landing page built with React + Vite, with MongoDB-backed signup functionality using Express.

## Features

- Modern landing page with intentional visual design
- Responsive layout for desktop and mobile
- Best-food card section
- Filterable restaurant menu section
- Signup modal connected to backend API
- User signup data stored in MongoDB
- Clean project structure for easy debugging

## Tech Stack

- Frontend: React, Vite, CSS
- Backend: Node.js, Express
- Database: MongoDB with Mongoose
- Tooling: ESLint, Nodemon, Concurrently

## Project Structure

```
src/
	components/
		FoodCard.jsx
		SignupModal.jsx
	data/
		menuData.js
	App.jsx
	App.css
	index.css

server/
	config/
		db.js
	models/
		User.js
	server.js
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment file from `.env.example`:

```bash
copy .env.example .env
```

3. Update `.env` values:

- `MONGODB_URI` = your MongoDB connection string
- `PORT` = backend port (default 5000)
- `VITE_API_URL` = leave empty for local proxy

## Run The App

Start frontend and backend together:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## Useful Scripts

- `npm run dev` - run client + server
- `npm run dev:client` - run Vite only
- `npm run dev:server` - run Express server with nodemon
- `npm run server` - run Express server once
- `npm run lint` - lint client + server code
- `npm run build` - production frontend build

## API Endpoints

- `GET /api/health` - health status and MongoDB state
- `POST /api/auth/signup` - create new user

Example request body:

```json
{
	"fullName": "Alex Johnson",
	"email": "alex@example.com",
	"password": "strongPass123"
}
```
