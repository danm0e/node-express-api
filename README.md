# node-express-api

A habit tracker API built with Node.js, Express, and Drizzle ORM.

## Database Setup

This project uses [Neon](https://neon.tech) as the PostgreSQL database provider. Neon offers a free trial that provides a temporary database for 72 hours, which is perfect for testing and development. After 72 hours, you'll need to create a new database or sign up for a permanent account.

### Initial Setup

1. Create a new Neon database at https://neon.new/
2. Copy the connection string from your Neon dashboard
3. Create a `.env` file (copy from `.env.example`)
4. Add your database URL to the `DATABASE_URL` variable in `.env`
5. Run `npm install` to install dependencies
6. Run `npm run db:push` to create database tables
7. Run `npm run db:seed` to populate with sample data (optional)
8. Run `npm run dev` to start the development server

### When Your Database Expires (72 Hours)

If you're using the free trial, your database will expire after 72 hours. Here's how to set up a new one:

1. **Get new database URL:**

   - Go to https://neon.new/
   - Create a new temporary database (or sign up for permanent account)
   - Copy the connection string from the dashboard

2. **Update your environment:**

   - Open your `.env` file
   - Replace the `DATABASE_URL` value with the new connection string

3. **Create database tables:**

   - Run: `npm run db:push`
   - Select "Yes, I want to execute all statements"

4. **Seed the database (optional):**

   - Run: `npm run db:seed`

5. **Restart your server:**
   - Stop the current server (Ctrl+C)
   - Run: `npm run dev`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:seed` - Seed database with sample data
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## Environment Variables

Create a `.env` file based on `.env.example` and configure the following variables:

- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/test/production)
- `JWT_SECRET` - Secret key for JWT tokens (min 32 characters)
- `JWT_EXPIRES_IN` - JWT expiration time (default: 7d)
- `BCRYPT_SALT_ROUNDS` - Bcrypt salt rounds (default: 12)
