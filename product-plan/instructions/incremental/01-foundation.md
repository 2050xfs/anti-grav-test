# Milestone 1: Foundation

> **Provide alongside:** `product-overview.md`
> **Prerequisites:** None

---

## About These Instructions

**What you're receiving:**
- Finished UI designs (React components with full styling)
- Data model definitions (TypeScript types and sample data)
- UI/UX specifications (user flows, requirements, screenshots)
- Design system tokens (colors, typography, spacing)
- Test-writing instructions for each section (for TDD approach)

**What you need to build:**
- Backend API endpoints and database schema
- Authentication and authorization
- Data fetching and state management
- Business logic and validation
- Integration of the provided UI components with real data

**Important guidelines:**
- **DO NOT** redesign or restyle the provided components — use them as-is
- **DO** wire up the callback props to your routing and API calls
- **DO** replace sample data with real data from your backend
- **DO** implement proper error handling and loading states
- **DO** implement empty states when no records exist (first-time users, after deletions)
- **DO** use test-driven development — write tests first using `tests.md` instructions
- The components are props-based and ready to integrate — focus on the backend and data layer

---

## Goal

Set up the foundational elements: design tokens, data model types, routing structure, and application shell.

## What to Implement

### 1. Design Tokens

Configure your styling system with these tokens:

- See `product-plan/design-system/tokens.css` for CSS custom properties
- See `product-plan/design-system/tailwind-colors.md` for Tailwind configuration
- See `product-plan/design-system/fonts.md` for Google Fonts setup

**Colors:**
- Primary: `indigo` (buttons, links, active states)
- Secondary: `emerald` (growth metrics, success states)
- Neutral: `slate` (backgrounds, text, borders)

**Typography:**
- Heading: Inter
- Body: Inter
- Mono: JetBrains Mono

**Dark Mode:**
All components support dark mode via `dark:` class on the root element.

### 2. Data Model Types

Create TypeScript interfaces for your core entities:

- See `product-plan/data-model/README.md` for entity definitions and relationships

**Core Entities:**
- Contact — People tracked through lifecycle stages
- Campaign — Marketing initiatives with performance tracking
- Offer — Lead magnets and products with value stacks
- Asset — Generated content (emails, ads, posts, sequences)
- Decision — Strategic choices made by the Strategy Brain
- Channel — One of the Core Four methods (Warm, Cold, Content, Paid Ads)
- Conversation — Interactions with qualification and routing
- Insight — Learned patterns from institutional memory

### 3. Routing Structure

Create placeholder routes for each section:

- `/strategy-brain` — Market sensing and budget allocation
- `/offer-and-product-cell` — Lead magnet generation
- `/distribution-engine` — Core Four execution
- `/conversation-and-sales-engine` — Lead qualification
- `/lifecycle-and-compounding-engine` — Long-term nurturing

### 4. Application Shell

Copy the shell components from `product-plan/shell/components/` to your project:

- `AppShell.tsx` — Main layout wrapper with sidebar navigation
- `MainNav.tsx` — Navigation component with 5 sections
- `UserMenu.tsx` — User menu with avatar and logout

**Wire Up Navigation:**

Connect navigation to your routing. The nav items are:

1. **Strategy Brain** — Icon: Brain
2. **Offer & Product Cell** — Icon: Package
3. **Distribution Engine** — Icon: Zap
4. **Conversation & Sales Engine** — Icon: MessageSquare
5. **Lifecycle & Compounding Engine** — Icon: TrendingUp

**User Menu:**

The user menu expects:
- User name
- Avatar URL (optional - shows initials fallback)
- Logout callback

**Responsive Behavior:**
- Desktop (≥1024px): Full sidebar visible (240px width)
- Tablet (768-1023px): Full sidebar visible (narrower)
- Mobile (<768px): Hamburger menu with slide-out sidebar

## Files to Reference

- `product-plan/design-system/` — Design tokens
- `product-plan/data-model/` — Type definitions
- `product-plan/shell/README.md` — Shell design intent
- `product-plan/shell/components/` — Shell React components
- `product-plan/shell/screenshot.png` — Visual reference (if available)

## Done When

- [ ] Design tokens are configured (colors, fonts)
- [ ] Data model types are defined as TypeScript interfaces
- [ ] Routes exist for all 5 sections (can be placeholder pages)
- [ ] Shell renders with navigation and user menu
- [ ] Navigation links work and show active state
- [ ] User menu shows user info and logout works
- [ ] Shell is responsive on mobile with hamburger menu
- [ ] Dark mode support is functional
