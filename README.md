# logistica-back

Backend API for logistica application.

## Tech Stack

- **NestJS** - Framework API
- **TypeScript** - Language
- **Prisma** - ORM
- **PostgreSQL** - Database
- **Zod** - Schema validation
- **class-validator / class-transformer** - Validation and transformation
- **argon2** - Password hashing
- **uuid** - UUID generation
- **@nestjs/swagger** - API documentation
- **bcryptjs** - Password hashing (dev dependency)
- **async-middleware** - Middleware utilities
- **reflect-metadata** - Decorator support

## Project Structure

```
src/
  main.ts - Entry point
  app.module.ts - Root module
  common/ - Shared utilities and pipes
  config/ - Configuration files
  database/ - Prisma module
  security/ - Security modules
  licensing/ - Licensing module
  admin/ - Admin module
  health/ - Health check module
```

## Installation

```bash
# Install dependencies
npm install

# Run migrations
npx prisma migrate deploy

# Start development
npm run start:dev
```

## Available Scripts

- `dev` - Run development mode
- `build` - Build production
- `start` - Run production
- `test` - Run tests
- `postinstall` - Run prisma skills sync

## Environment Variables

Copy `.env.example` to `.env` and configure:

- `PORT` - Server port (default: 3000)
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `ARGON2_MEMORY` - Argon2 memory setting