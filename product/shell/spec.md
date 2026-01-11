# Application Shell Specification

## Overview
The AGRD shell provides persistent navigation for all 5 autonomous cells with a professional sidebar layout. The design emphasizes quick access to each cell while maintaining context about which cell is currently active. The user menu is pinned at the bottom of the sidebar for easy access to account controls.

## Navigation Structure
- **Strategy Brain** → Market sensing, offer evolution, budget allocation
- **Offer & Product Cell** → Lead magnet generation, value stacking
- **Distribution Engine** → Core Four execution (Warm, Cold, Content, Paid Ads)
- **Conversation & Sales Engine** → Lead qualification and routing
- **Lifecycle & Compounding Engine** → Long-term nurturing and institutional memory

## User Menu
Located at the bottom of the sidebar, pinned below all navigation items. Contains:
- User avatar (with fallback initials)
- User name
- Logout action

## Layout Pattern
**Desktop Layout:**
- Left sidebar: 240px fixed width
- Content area: Fills remaining space
- Sidebar contains: AGRD logo at top, 5 navigation items in middle, user menu pinned at bottom
- Active section is highlighted with primary color (indigo)
- Hover states use subtle background changes

**Visual Hierarchy:**
- Navigation items use heading font (Inter) with icons from lucide-react
- Active item has indigo background with white text
- Inactive items have neutral text with hover states
- User menu has subtle border separator above it

## Responsive Behavior
- **Desktop (≥1024px):** Full sidebar visible, 240px width
- **Tablet (768px-1023px):** Full sidebar visible, slightly narrower
- **Mobile (<768px):**
  - Sidebar hidden by default
  - Hamburger menu icon appears in top-left
  - Tapping hamburger slides sidebar in from left as overlay
  - Backdrop dims background content
  - Tapping backdrop or navigation item closes sidebar

## Design Notes
- Primary color (indigo) used for active navigation state and key accents
- Secondary color (emerald) reserved for growth metrics and positive indicators within content
- Neutral palette (slate) for backgrounds, borders, and inactive states
- Dark mode support with `dark:` variants for all colors
- Icons should represent each cell's function (Brain for Strategy, Package for Offers, Zap for Distribution, MessageSquare for Conversation, TrendingUp for Lifecycle)
- Smooth transitions for sidebar slide-in/out on mobile
- Logo area should be clean and minimal, showing "AGRD" text
