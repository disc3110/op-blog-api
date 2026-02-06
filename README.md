# 📝 Blog API

A RESTful backend API for a full-stack blog platform, built with **Express**, **PostgreSQL**, and **Prisma**.  
This API supports authentication with JWT, role-based access, draft/published posts, comments, and per-user likes.

The project is designed to be consumed by **two separate front-end applications**:
- An **author dashboard** (for writing, editing, and publishing posts)
- A **public blog app** (for reading, commenting, and liking posts)

---

## 🚀 Tech Stack

- **Node.js**
- **Express**
- **PostgreSQL**
- **Prisma ORM**
- **JWT Authentication**
- **bcryptjs**
- **MVC architecture**
- **Feature-branch Git workflow**

---

## ✨ Features

### Authentication & Users
- User registration and login
- JWT-based authentication
- Role-based access control:
  - `USER` – can comment and like
  - `AUTHOR` – can create, edit, and publish posts
  - `ADMIN` – full access

### Posts
- Create, update, delete posts (author/admin only)
- Draft & published posts
- Public access to published posts
- Author dashboard endpoint to view own posts
- Publish / unpublish toggle

### Comments
- Public comment listing per post
- Authenticated users can comment
- Comment moderation by:
  - Comment author
  - Post author
  - Admin

### Likes
- Per-user likes tracking
- Like / unlike posts
- Like / unlike comments
- Duplicate likes prevented at the database level
- Likes count kept in sync using transactions

---


## 🔐 Authentication

- JWTs are issued on login/register
- Tokens must be sent using the header:

```
Authorization: Bearer <JWT_TOKEN>
```

- Tokens are expected to be stored client-side (e.g. `localStorage`) by front-end apps

---

## 🧪 API Endpoints (Overview)

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET  /api/auth/me`

### Posts
- `GET    /api/posts` – published posts (public)
- `GET    /api/posts/:id`
- `GET    /api/posts/mine` (author/admin)
- `POST   /api/posts` (author/admin)
- `PUT    /api/posts/:id` (author/admin)
- `PATCH  /api/posts/:id/publish` (author/admin)
- `DELETE /api/posts/:id` (author/admin)

### Comments
- `GET    /api/posts/:postId/comments`
- `POST   /api/posts/:postId/comments`
- `PUT    /api/comments/:id`
- `DELETE /api/comments/:id`

### Likes
- `POST   /api/posts/:postId/like`
- `DELETE /api/posts/:postId/like`
- `POST   /api/comments/:id/like`
- `DELETE /api/comments/:id/like`

---

## 🛠️ Getting Started (Local)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/blog-api.git
cd blog-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/blog_api_dev"
JWT_SECRET="your-secret-key"
JWT_EXPIRES_IN="7d"
```

### 4. Run database migrations

```bash
npx prisma migrate dev
```

### 5. Start the server

```bash
npm run dev
```

Server will run at:

```
http://localhost:3000
```

Health check:

```
GET /api/health
```

---

## 🔀 Git Workflow

This project follows a **feature-branch workflow**:

- `main` → stable branch
- New features are developed in branches like:
  - `feature/auth-jwt`
  - `feature/post-routes`
  - `feature/comment-routes`
  - `feature/like-routes`
- Each feature is merged via Pull Request

---

## 📦 Related Repositories

- **Author Dashboard** 
- **Public Blog App** 

Each front-end lives in its **own repository** and consumes this API.

---

## 📌 Future Improvements

- Pagination for posts & comments
- Rich-text editor support
- Image uploads
- Refresh tokens
- Rate limiting
- API documentation (Swagger / OpenAPI)

---

## 👤 Author

Built by **Diego**  
disc3110@gmail.com

---

## 📄 License

MIT
