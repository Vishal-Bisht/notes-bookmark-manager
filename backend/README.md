# Backend - Notes and Bookmark Manager API

REST API built with Node.js, Express, and MongoDB.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/notes-bookmark-db
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   ```

3. Run the server:
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user (protected)

### Notes (all protected)
- `GET /api/notes` - Get all notes
- `GET /api/notes/:id` - Get single note
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `PUT /api/notes/:id/favorite` - Toggle favorite

### Bookmarks (all protected)
- `GET /api/bookmarks` - Get all bookmarks
- `GET /api/bookmarks/:id` - Get single bookmark
- `POST /api/bookmarks` - Create bookmark
- `PUT /api/bookmarks/:id` - Update bookmark
- `DELETE /api/bookmarks/:id` - Delete bookmark
- `PUT /api/bookmarks/:id/favorite` - Toggle favorite
- `POST /api/bookmarks/fetch-metadata` - Fetch URL metadata

## Features
- JWT authentication
- Input validation with express-validator
- Auto-fetch URL title and description
- Text search and tag filtering
- Favorites system
