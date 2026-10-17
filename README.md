# devconnect

A backend for a small social network made for developers. People can sign up, set up a profile, share posts (with code snippets if they want), like and comment on each other's posts, and follow other developers.


## What you can do with it

- Create an account and log in securely
- Edit your profile: headline, bio, avatar, GitHub link, skills
- Write posts with tags and an optional code snippet
- Browse the feed, paginated and filterable by tag
- Like or unlike posts
- Comment on posts and delete your own comments
- Follow or unfollow other developers

## Built with

- **Node.js + Express 5** for the server
- **TypeScript** for type safety
- **PostgreSQL** (via `pg`) for the database
- **Zod** to validate incoming data and environment variables
- **JWT + bcrypt** for authentication and password hashing

## Getting started

You'll need Node.js and a PostgreSQL database (a local one or a hosted one both work).

**1. Clone and install**

```bash
git clone https://github.com/bhanusreeekar7/Bytecraft.git
cd Bytecraft
npm install
```

**2. Create a `.env` file in the project root**

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
DATABASE_URL=postgres://user:password@host:5432/dbname
JWT_ACCESS_SECRET=pick-a-long-random-string
JWT_REFRESH_SECRET=pick-a-different-long-random-string
```

Both JWT secrets must be at least 10 characters. If something is missing or invalid, the app tells you and stops right away.

**3. Create the database tables**

```bash
npm run db:init
```

This runs `db/schema.sql` and creates everything inside a schema called `devconnect`.

**4. Start the server**

```bash
npm run dev
```

Visit `http://localhost:5000/health` to check it's running.

### Other scripts

| Command | What it does |
|---|---|
| `npm run dev` | Runs the server and restarts it when you change a file |
| `npm run build` | Compiles TypeScript into the `dist/` folder |
| `npm start` | Runs the compiled code from `dist/` |
| `npm run db:init` | Creates the tables and indexes |

## API overview

All routes start with `/api`. Routes marked 🔒 need an access token: `Authorization: Bearer <token>`.

**Auth**

| Method | Route | Description |
|---|---|---|
| POST | `/auth/register` | Create an account |
| POST | `/auth/login` | Log in |
| POST | `/auth/logout` | Log out |
| POST | `/auth/refresh` | Get a fresh access token |
| GET | `/auth/me` 🔒 | Who am I? |

**Profiles**

| Method | Route | Description |
|---|---|---|
| GET | `/profiles/:username` | View someone's profile |
| PATCH | `/profiles/me` 🔒 | Update your profile |

**Posts**

| Method | Route | Description |
|---|---|---|
| GET | `/posts?page=1&limit=10&tag=react` | Feed |
| GET | `/posts/:id` | A single post |
| POST | `/posts` 🔒 | Create a post |
| DELETE | `/posts/:id` 🔒 | Delete your post |
| POST | `/posts/:id/like` 🔒 | Like / unlike |
| GET | `/posts/:id/comments` | Read comments |
| POST | `/posts/:id/comments` 🔒 | Add a comment |

**Comments and users**

| Method | Route | Description |
|---|---|---|
| DELETE | `/comments/:id` 🔒 | Delete your comment |
| POST | `/users/:id/follow` 🔒 | Follow / unfollow |

## How login works

When you log in you get two tokens:

- An **access token** (valid 15 minutes) that you send with each request.
- A **refresh token** (valid 7 days) stored in an `httpOnly` cookie, which JavaScript can't read. When the access token expires, call `/auth/refresh` to get a new one.

Passwords are hashed with bcrypt and never stored or returned in plain text.

## Project structure

```
Bytecraft/
├── db/
│   ├── schema.sql        # tables and indexes
│   └── migrate.ts        # runs the schema
└── src/
    ├── index.ts          # starts the server, handles shutdown
    ├── app.ts            # sets up Express and mounts routes
    ├── config/           # env validation and database connection
    ├── routes/           # URL → controller
    ├── middlewares/      # auth check, validation, error handling
    ├── controllers/      # read request, send response
    ├── services/         # business rules
    ├── repositories/     # all the SQL
    ├── schemas/          # Zod validation rules
    └── types/            # TypeScript types
```

A request flows like this: **route → middleware → controller → service → repository → database**. Each layer has one job, which keeps the code easy to read and change.

## Database

Six tables: `users`, `profiles`, `posts`, `comments`, `likes` and `follows`. Deleting a user or a post automatically cleans up everything connected to it. Duplicate likes and follows, and following yourself, are blocked by the database itself.

## Ideas for what's next

- Wrap registration in a database transaction
- Store refresh tokens so logout truly signs you out
- Add rate limiting and `helmet` for extra security
- Paginate comments
- Add tests

## Author

Made by [Gudipalli Bhanu Sreekar](https://github.com/bhanusreeekar7).
