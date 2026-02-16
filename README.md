# 📝 NotesMark - Personal Notes and Bookmark Manager

A full-stack web application for managing personal notes and bookmarks with powerful search, tagging, and organization features.

## 🚀 Features

### Notes
- Create, read, update, and delete notes
- Add tags for organization
- Mark notes as favorites
- Full-text search across title and content
- Filter by tags

### Bookmarks
- Save URLs with titles and descriptions
- **Auto-fetch metadata** (title and description) from URLs
- Add tags for organization
- Mark bookmarks as favorites
- Full-text search across URL, title, and description
- Filter by tags

### Authentication
- User registration and login
- JWT-based authentication
- Protected routes - data is user-specific

### UI/UX
- Responsive design (mobile, tablet, desktop)
- Clean and modern interface with Tailwind CSS
- Toast notifications for feedback
- Modal forms for creating/editing items

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **node-fetch** - Fetching URL metadata

### Frontend
- **Next.js 16** - React framework (App Router)
- **React 19** - UI library
- **Tailwind CSS 4** - Styling
- **Axios** - HTTP client
- **react-hot-toast** - Notifications
- **react-icons** - Icons

## 📁 Project Structure

```
notes-bookmark-manager/
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   ├── notesController.js # Notes CRUD
│   │   └── bookmarksController.js # Bookmarks CRUD
│   ├── middleware/
│   │   └── auth.js            # JWT authentication
│   ├── models/
│   │   ├── User.js
│   │   ├── Note.js
│   │   └── Bookmark.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── notes.js
│   │   └── bookmarks.js
│   ├── utils/
│   │   └── urlFetcher.js      # URL metadata fetching
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── bookmarks/
│   │   │   ├── login/
│   │   │   ├── notes/
│   │   │   ├── register/
│   │   │   ├── globals.css
│   │   │   ├── layout.js
│   │   │   └── page.js
│   │   ├── components/
│   │   │   ├── BookmarkCard.js
│   │   │   ├── BookmarkForm.js
│   │   │   ├── Modal.js
│   │   │   ├── Navbar.js
│   │   │   ├── NoteCard.js
│   │   │   ├── NoteForm.js
│   │   │   ├── SearchBar.js
│   │   │   └── TagInput.js
│   │   └── context/
│   │       └── AuthContext.js
│   │   
│   ├── .env
│   ├── jsconfig.json
│   ├── next.config.js
│   ├── package.json
│   ├── postcss.config.js
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file from the example:
   ```bash
   cp .env.example
   ```

4. Update the `.env` file with your configuration:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/notes-bookmark-db
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=http://localhost:3000
   ```

5. Start the server:
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:3000`

## 📚 API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "User",
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/user
Authorization: Bearer <token>
```

### Notes API

#### Get All Notes
```http
GET /api/notes
Authorization: Bearer <token>
Query Parameters:
  - q: Search term (optional)
  - tags: Comma-separated tags (optional)
  - favorite: true/false (optional)
```

#### Get Single Note
```http
GET /api/notes/:id
Authorization: Bearer <token>
```

#### Create Note
```http
POST /api/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "My Note",
  "content": "Note content here...",
  "tags": ["work", "important"],
  "isFavorite": false
}
```

#### Update Note
```http
PUT /api/notes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content...",
  "tags": ["personal"],
  "isFavorite": true
}
```

#### Delete Note
```http
DELETE /api/notes/:id
Authorization: Bearer <token>
```

#### Toggle Favorite
```http
PUT /api/notes/:id/favorite
Authorization: Bearer <token>
```

### Bookmarks API

#### Get All Bookmarks
```http
GET /api/bookmarks
Authorization: Bearer <token>
Query Parameters:
  - q: Search term (optional)
  - tags: Comma-separated tags (optional)
  - favorite: true/false (optional)
```

#### Get Single Bookmark
```http
GET /api/bookmarks/:id
Authorization: Bearer <token>
```

#### Create Bookmark
```http
POST /api/bookmarks
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://example.com",
  "title": "Example Website",  // Optional - auto-fetched if empty
  "description": "A great website",
  "tags": ["reference"],
  "isFavorite": false
}
```

#### Update Bookmark
```http
PUT /api/bookmarks/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://example.com",
  "title": "Updated Title",
  "description": "Updated description",
  "tags": ["tools"],
  "isFavorite": true
}
```

#### Delete Bookmark
```http
DELETE /api/bookmarks/:id
Authorization: Bearer <token>
```

#### Toggle Favorite
```http
PUT /api/bookmarks/:id/favorite
Authorization: Bearer <token>
```

#### Fetch URL Metadata
```http
POST /api/bookmarks/fetch-metadata
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://example.com"
}
```

## 🧪 Sample cURL Requests

### Register a new user
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Create a note (replace <token> with actual JWT)
```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"My First Note","content":"This is the content","tags":["personal"]}'
```

### Create a bookmark with auto-fetch
```bash
curl -X POST http://localhost:5000/api/bookmarks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"url":"https://github.com","tags":["development"]}'
```

### Search notes
```bash
curl -X GET "http://localhost:5000/api/notes?q=first&tags=personal" \
  -H "Authorization: Bearer <token>"
```

## 🔒 Error Handling

All API endpoints return consistent error responses:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error


## 🎯 Skills This Project Tests

| Skill | Implementation |
|-------|----------------|
| **REST API Design** | Proper endpoint structure, HTTP methods, status codes |
| **Data Validation** | Express-validator for input sanitization and validation |
| **Error Handling** | Consistent error responses, try-catch patterns |
| **Authentication** | JWT-based auth with protected routes and middleware |
| **React/Next.js** | App router, client components, hooks, context API |
| **State Management** | React Context for global auth state |
| **Tailwind CSS** | Responsive design, custom theming with CSS variables |
| **Clean Code** | Modular structure, separation of concerns, ES Modules |
| **Real-world Data Modeling** | MongoDB schemas with user relationships |

## 🚀 Deployment

**Backend (Render):**
- Set environment variables: `MONGO_URL`, `JWT_SECRET`, `NODE_ENV=production`, `FRONTEND_URL`

**Frontend (Vercel):**
- Set environment variable: `NEXT_PUBLIC_API_URL` pointing to your Render backend URL

## 📝 License

This project is for educational purposes.

## 👨‍💻 Author

Vishal Bisht
