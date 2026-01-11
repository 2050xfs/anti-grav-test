# AGRD Backend API

Node.js + Express + TypeScript + Prisma + PostgreSQL backend for the AGRD (Autonomous Growth & Revenue Department) application.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Express Session with bcrypt
- **CORS:** Enabled for frontend communication

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Database

Make sure PostgreSQL is running, then create a database:

```bash
# Using psql
createdb agrd_dev

# Or using PostgreSQL CLI
psql -U postgres
CREATE DATABASE agrd_dev;
\q
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Database
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/agrd_dev?schema=public"

# Server
PORT=3001
NODE_ENV=development

# Session
SESSION_SECRET="your-secret-key-change-in-production"

# CORS
FRONTEND_URL="http://localhost:3000"
```

### 4. Run Database Migrations

```bash
npm run prisma:migrate
```

This will create all the tables for the 8 core AGRD entities:
- Users & Workspaces
- Contacts
- Campaigns
- Offers
- Assets
- Decisions
- Channels
- Conversations
- Insights

### 5. Start the Development Server

```bash
npm run dev
```

The server will start on `http://localhost:3001`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe",
  "workspaceName": "My Workspace" // optional
}
```

#### Login
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
GET /api/auth/me
Cookie: connect.sid=<session-cookie>
```

#### Logout
```http
POST /api/auth/logout
Cookie: connect.sid=<session-cookie>
```

### Health Check
```http
GET /health
```

## Database Schema

The database includes:

### Core Entities

1. **Contact** - People tracked through lifecycle stages (Lead → New Customer → Active → At Risk → Dormant → Churned)
2. **Campaign** - Marketing initiatives through Core Four channels
3. **Offer** - Lead magnets and products with value stacks
4. **Asset** - Generated content (emails, ads, posts, sequences)
5. **Decision** - Strategic choices made by Strategy Brain
6. **Channel** - Core Four methods (Warm Outreach, Cold Outreach, Content, Paid Ads)
7. **Conversation** - Interactions with qualification scoring (PMAU)
8. **Insight** - Learned patterns from institutional memory

### User Management

- **User** - User accounts with authentication
- **Workspace** - Multi-tenant workspaces
- **UserWorkspace** - User-workspace relationships with roles

## Architecture

### Multi-User Workspace Model

- Each user can belong to multiple workspaces
- Workspaces isolate data (all entities are scoped to workspace)
- Roles: `owner`, `admin`, `member`
- On registration, a workspace is automatically created with 4 Core Four channels initialized

### Authentication Flow

1. User registers → User + Workspace + 4 Channels created
2. Session established with `connect.sid` cookie
3. Protected routes check `req.session.userId`
4. Workspace access validated via `requireWorkspaceAccess` middleware

### Middleware

- `requireAuth` - Ensures user is authenticated
- `extractWorkspace` - Extracts workspace ID from header/query/body
- `requireWorkspaceAccess` - Validates user has access to workspace

## Next Steps

### Implementing Section APIs

Each AGRD section needs API endpoints. Use Ralph for autonomous implementation:

1. **Strategy Brain** - Decision management, channel performance, insights
2. **Offer & Product Cell** - Offer creation, value stacks, competitive intelligence
3. **Distribution Engine** - Campaign management, asset generation, Core Four execution
4. **Conversation & Sales Engine** - Conversation tracking, qualification, routing
5. **Lifecycle & Compounding Engine** - Contact lifecycle, health scores, retention

See `../product-plan/prompts/section-prompt.md` for implementation guidance.

## Development Tips

### Prisma Studio

View and edit database records visually:

```bash
npm run prisma:studio
```

Opens at `http://localhost:5555`

### Database Reset

To reset the database:

```bash
npx prisma migrate reset
```

⚠️ This will delete all data!

### Adding New Entities

1. Update `prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Prisma Client automatically updates

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Ensure these are set in production:
- `DATABASE_URL` - Production PostgreSQL connection string
- `SESSION_SECRET` - Strong random secret (use `openssl rand -base64 32`)
- `NODE_ENV=production`
- `FRONTEND_URL` - Production frontend URL

### Database Migrations

Run migrations in production:

```bash
npx prisma migrate deploy
```

## Troubleshooting

### PostgreSQL Connection Issues

```bash
# Check if PostgreSQL is running
pg_isready

# Check connection
psql -U postgres -d agrd_dev
```

### Port Already in Use

Change `PORT` in `.env` or kill the process:

```bash
lsof -ti:3001 | xargs kill
```

### Prisma Client Out of Sync

```bash
npm run prisma:generate
```

## License

ISC

---

**Built with:** Node.js, Express, TypeScript, Prisma, PostgreSQL
**Part of:** AGRD (Autonomous Growth & Revenue Department)
**See also:** `../product-plan/` for UI components and implementation guides
