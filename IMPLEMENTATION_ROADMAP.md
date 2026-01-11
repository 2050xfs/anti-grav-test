# AGRD Implementation Roadmap

## ✅ Completed: Foundation

The AGRD backend foundation has been successfully implemented with:

### Tech Stack
- **Backend:** Node.js + Express + TypeScript
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** Session-based with bcrypt
- **Architecture:** Multi-user workspaces

### Database Schema (Prisma)
All 8 core AGRD entities implemented:
- ✅ Contact - Lifecycle tracking (Lead → New Customer → Active → At Risk → Dormant → Churned)
- ✅ Campaign - Marketing initiatives
- ✅ Offer - Lead magnets and products
- ✅ Asset - Generated content
- ✅ Decision - Strategic choices
- ✅ Channel - Core Four (Warm Outreach, Cold Outreach, Content, Paid Ads)
- ✅ Conversation - PMAU qualification
- ✅ Insight - Institutional memory

Plus User & Workspace management with roles.

### Authentication System
- ✅ `/api/auth/register` - Creates user + workspace + 4 channels
- ✅ `/api/auth/login` - Session-based login
- ✅ `/api/auth/me` - Current user info
- ✅ `/api/auth/logout` - Session cleanup
- ✅ Authentication middleware (`requireAuth`, `extractWorkspace`, `requireWorkspaceAccess`)

### Project Structure
```
agrd-backend/
├── prisma/
│   └── schema.prisma          ✅ Complete schema with 8 entities
├── src/
│   ├── middleware/
│   │   └── auth.ts            ✅ Auth middleware
│   ├── routes/
│   │   └── auth.ts            ✅ Auth endpoints
│   ├── services/
│   │   └── auth.service.ts    ✅ Auth business logic
│   ├── utils/
│   │   └── prisma.ts          ✅ Prisma client
│   └── server.ts              ✅ Express server
└── README.md                   ✅ Setup instructions
```

---

## 🚧 Next Steps: Section Implementation

### Option A: Use Ralph for Autonomous Implementation (Recommended)

Ralph can autonomously build the remaining sections with minimal human intervention.

#### Prerequisites
1. Install [Amp CLI](https://ampcode.com): `npm install -g @amp/cli`
2. Authenticate: `amp login`
3. Install jq: `brew install jq` ✅ (Already installed)

#### Implementation Strategy

For each of the 5 sections, Ralph will:
1. Read the PRD and acceptance criteria
2. Generate API endpoints for CRUD operations
3. Implement business logic and validations
4. Write tests for each endpoint
5. Create integration with frontend components
6. Commit and track progress

**Sections to Implement (in order):**

1. **Strategy Brain** (~10-15 stories)
   - Decision CRUD endpoints
   - Channel performance tracking
   - Budget allocation logic
   - Insight generation from data

2. **Offer & Product Cell** (~8-12 stories)
   - Offer CRUD endpoints
   - Value stack builder
   - Competitive intelligence tracking
   - Performance dashboard data

3. **Distribution Engine** (~12-16 stories)
   - Campaign CRUD endpoints
   - Asset generation and tracking
   - Channel integration
   - Lead getter management

4. **Conversation & Sales Engine** (~10-14 stories)
   - Conversation CRUD endpoints
   - PMAU qualification scoring
   - Routing logic (human vs automated)
   - Template management

5. **Lifecycle & Compounding Engine** (~10-14 stories)
   - Contact lifecycle transitions
   - Health score calculation
   - Upsell opportunity detection
   - Reactivation campaign management
   - Retention analytics

#### How to Use Ralph

1. **Clone Ralph:**
   ```bash
   cd ..
   git clone https://github.com/snarktank/ralph.git
   cd ralph
   ```

2. **Create PRD for First Section (Strategy Brain):**

   Create `prd.json` based on `product-plan/instructions/incremental/02-strategy-brain.md` (you'll need to create this first):

   ```json
   {
     "stories": [
       {
         "id": "sb-001",
         "title": "Create GET /api/decisions endpoint",
         "description": "Return paginated list of decisions for workspace with filtering by type and status",
         "passes": false,
         "acceptance_criteria": "Endpoint returns 200, supports pagination, filtering works, typecheck passes"
       },
       {
         "id": "sb-002",
         "title": "Create POST /api/decisions endpoint",
         "description": "Create new decision with validation",
         "passes": false,
         "acceptance_criteria": "Creates decision, validates required fields, returns 201, typecheck passes"
       }
       // ... more stories
     ]
   }
   ```

3. **Configure Ralph:**

   Edit `prompt.md` to point to your `agrd-backend` directory and reference the AGRD data model.

4. **Run Ralph:**
   ```bash
   ./ralph.sh
   ```

   Ralph will:
   - Pick the highest-priority incomplete story
   - Implement it
   - Run quality checks (typecheck, tests)
   - Commit if checks pass
   - Continue to next story

5. **Monitor Progress:**
   - Check `prd.json` for story completion status
   - Read `progress.txt` for learnings
   - Review `AGENTS.md` for patterns

6. **Repeat for Each Section**

---

### Option B: Manual Implementation

If you prefer manual control or don't want to use Amp/Ralph:

#### For Each Section:

1. **Read Instructions:**
   - `product-plan/instructions/incremental/[NN]-[section-id].md`
   - `product-plan/sections/[section-id]/README.md`

2. **Create API Routes:**
   ```typescript
   // agrd-backend/src/routes/[section].ts
   import { Router } from 'express';
   import { requireAuth, requireWorkspaceAccess } from '../middleware/auth';

   const router = Router();

   // GET /api/[entity]
   router.get('/', requireAuth, requireWorkspaceAccess, async (req, res) => {
     // Implementation
   });

   // POST /api/[entity]
   router.post('/', requireAuth, requireWorkspaceAccess, async (req, res) => {
     // Implementation
   });

   export default router;
   ```

3. **Add to Server:**
   ```typescript
   // agrd-backend/src/server.ts
   import sectionRoutes from './routes/[section]';
   app.use('/api/[entity]', sectionRoutes);
   ```

4. **Test with Postman/curl**

5. **Commit and Push**

---

## 📦 Frontend Setup (After Backend Sections)

### Create Frontend App

```bash
# In project root
npm create vite@latest agrd-frontend -- --template react-ts
cd agrd-frontend
npm install
```

### Install Dependencies

```bash
npm install react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Configure Tailwind

Use design tokens from `product-plan/design-system/`:
- Primary: indigo
- Secondary: emerald
- Neutral: slate
- Fonts: Inter, JetBrains Mono

### Copy UI Components

Copy from `product-plan/shell/components/` and `product-plan/sections/[section-id]/components/`

### Wire Up Components

Replace sample data with real API calls using `fetch` or `axios`.

---

## 🎯 Estimated Timeline

### With Ralph (Autonomous)
- **Strategy Brain:** 2-4 hours
- **Offer & Product Cell:** 2-3 hours
- **Distribution Engine:** 3-5 hours
- **Conversation & Sales Engine:** 2-4 hours
- **Lifecycle & Compounding Engine:** 2-4 hours
- **Frontend Setup:** 4-6 hours

**Total: ~15-26 hours** (mostly unattended)

### Manual Implementation
- **Each Section Backend:** 1-2 days
- **Frontend Setup:** 2-3 days

**Total: ~2-3 weeks**

---

## 📊 Current Status

### ✅ Completed
- [x] Product design (36 screens, all components)
- [x] Export package creation
- [x] GitHub repository setup
- [x] Ralph analysis and recommendations
- [x] Backend foundation (auth, database schema)

### 🚧 In Progress
- [ ] Section API implementations

### ⏭️ Next
- [ ] Frontend setup
- [ ] Component integration
- [ ] Testing and deployment

---

## 🚀 Quick Start Commands

### Start Backend Development

```bash
cd agrd-backend

# Set up database
createdb agrd_dev
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Run migrations
npm run prisma:migrate

# Start server
npm run dev
```

Server runs on `http://localhost:3001`

### Test Authentication

```bash
# Register
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "name": "Test User"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }' \
  -c cookies.txt

# Get current user
curl -X GET http://localhost:3001/api/auth/me \
  -b cookies.txt
```

---

## 📚 Resources

- **Product Design:** `product-plan/` - All UI components and specs
- **Backend Code:** `agrd-backend/` - API implementation
- **Ralph Guide:** https://github.com/snarktank/ralph
- **Prisma Docs:** https://www.prisma.io/docs
- **Express Docs:** https://expressjs.com/

---

## 🤝 Recommended Next Action

1. **Set up PostgreSQL** and run migrations
2. **Test authentication endpoints** to verify backend works
3. **Choose implementation approach:** Ralph (autonomous) vs Manual
4. **If using Ralph:** Create first section PRD and run `./ralph.sh`
5. **If manual:** Start with Strategy Brain section endpoints

The foundation is solid. You're ready to build! 🎉
