# AGRD Product Roadmap

This roadmap breaks AGRD into 5 development sections aligned with Hormozi's scaling methodology and the Core Four × Lead Getters framework. Each section operates as an autonomous cell that can be designed, built, and deployed independently while integrating with the broader system.

---

## Section 1: Strategy Brain (Foundation Phase)
**Hormozi Level**: Level 1-2 (Friends know → Consistent personal output)
**Core Four Focus**: Market Research + Offer Engineering
**Development Priority**: 1 (Build First)

### Description
The Strategy Brain is AGRD's decision-making core that continuously monitors markets, extracts pain points, evolves offers, and allocates budget across channels. This cell operates like a VP of Growth + CFO hybrid, making autonomous strategic decisions within governed boundaries.

### Key Capabilities
- **Pain Point Extraction**: Analyze customer feedback and market signals to identify 10+ pain points ranked by (Pain × Frequency) / Perceived Difficulty
- **Offer Evolution**: Apply Hormozi's Value Equation framework to engineer high-converting offers: (Dream Outcome × Perceived Likelihood) / (Time Delay × Effort)
- **Budget Allocation**: Monitor LTGP:CAC ratios across all channels (target: 5:1+), auto-reallocate to highest-performing methods
- **Constraint Detection**: Identify bottlenecks using More-Better-New methodology, trigger appropriate scaling response
- **Market Sensing**: Continuous monitoring of competitor moves, industry trends, customer sentiment

### Autonomous Decisions
- Which channel to scale (MORE)
- When to optimize conversion (BETTER)
- When to expand to new audiences/platforms (NEW)
- Budget reallocation thresholds
- Which offers to test next
- When to pause underperforming campaigns

### Technical Implementation
- **Model**: Gemini 3 Pro with thinking budgets (2,048 for tactical decisions, 8,192 for offer engineering, 32,768 for strategic analysis)
- **Pattern**: Schema-driven JSON generation for structured decision outputs
- **Storage**: PostgreSQL for decision history, performance metrics, constraint logs
- **Integration**: Feeds decisions to Distribution Engine, receives performance data from all cells

### Success Metrics
- Decision latency < 5 seconds for tactical, < 60 seconds for strategic
- Offer conversion improvement > 20% quarter-over-quarter
- LTGP:CAC maintained above 3:1 across all channels
- Constraint detection accuracy > 85%

### Code Patterns from Repository Analysis
- Thinking budget management (Ebook-creator pattern)
- Multi-step pipeline with schema-driven outputs (Ebook-creator `performMarketResearch`)
- Parallel decision processing for multiple channels simultaneously

---

## Section 2: Offer & Product Cell (Positioning Phase)
**Hormozi Level**: Level 2-3 (Consistent output → First advertising help)
**Core Four Focus**: Lead Magnet Creation + Value Stacking
**Development Priority**: 2 (Build Second)

### Description
The Offer & Product Cell generates high-converting lead magnets and core offers using proven frameworks. This cell operates like a Chief Product Officer that continuously tests and evolves the product positioning, pricing, and packaging based on market response.

### Key Capabilities
- **Lead Magnet Generation**: Create 3 lead magnet types (Reveal Problem, Free Sample, One Step) tailored to customer awareness level
- **Delivery Mechanism Selection**: Choose optimal format (Physical, Digital, Event, Human) based on scalability vs. perceived value tradeoff
- **Value Stack Composition**: Generate complete offer stack (5 bonuses + workbook + OTO) with calculated total value vs. investment
- **Guarantee Engineering**: Select guarantee type (Unconditional, Conditional, Anti-Guarantee) based on price point and positioning
- **Client Financed Acquisition**: Structure offers so first purchase covers CAC (target: 3:1 minimum LTGP on initial transaction)

### Autonomous Decisions
- Which lead magnet type to create for each audience segment
- Optimal delivery format balancing cost and conversion
- Guarantee strategy for different price points
- Pricing tiers and payment plans
- When to introduce new bonuses or upgrade OTO
- Which offers to sunset based on performance

### Technical Implementation
- **Model**: Gemini 3 Pro for complex offer engineering with thinking budget (8,192 tokens)
- **Pattern**: Hormozi Value Equation implementation (Ebook-creator `generateValueStack`)
- **Storage**: Asset versioning system tracking offer variants and performance
- **Integration**: Receives market intelligence from Strategy Brain, provides offers to Distribution Engine

### Success Metrics
- Lead magnet conversion rate > 30%
- Core offer conversion > 5% from lead magnet
- Average order value increase > 15% quarter-over-quarter
- Client financed acquisition achieved on 80%+ of campaigns

### Code Patterns from Repository Analysis
- Schema-driven offer generation (Campaign-gen pattern)
- Value stack composition with bonus generation (Ebook-creator pattern)
- Batch generation with uniqueness tracking for multiple offer variants

---

## Section 3: Distribution Engine (Execution Phase)
**Hormozi Level**: Level 3-5 (Scale → Referral engine → Multi-channel)
**Core Four Focus**: All Four Methods + Four Lead Getters
**Development Priority**: 3 (Build Third)

### Description
The Distribution Engine executes the Core Four (Warm Outreach, Cold Outreach, Content, Paid Ads) and Four Lead Getters (Customers, Employees, Agencies, Affiliates) as parallel autonomous systems. This cell operates like a full marketing department running multiple campaigns simultaneously with institutional learning across all channels.

### Key Capabilities

#### Warm Outreach Executor
- Mine CRM for relationship scores and 3-way introduction opportunities
- 7 referral methods: One-sided, Two-sided, At-purchase, Negotiation chip, Events, Ongoing, Unlockable bonuses
- Target: 25%+ monthly referral rate (Referral Growth Equation: % Referred - % Churned = % Compounding Growth)

#### Cold Outreach Executor
- 4-step proven sequence: Compliment+Value → Curiosity → Proof+CTA → Breakup
- Volume: 1,000+/day with AI-generated personalization per prospect
- Completion detection token marks sequences done
- "Open to Goal" methodology: Work until target met, not just X attempts

#### Content Executor
- 6 hook formulas: Big Promise, Secret Reveal, Mistake, Question, Story, Controversy
- Give-Give-Give-Ask sequencing (3 value posts : 1 promotional)
- Multi-platform simultaneous posting (LinkedIn, Twitter, YouTube)
- Multi-format generation: Video scripts, carousel posts, short-form clips

#### Paid Ads Executor
- What-Who-When ad framework for all creatives
- Client-financed acquisition (first purchase covers CAC)
- Auto-optimization to 5:1+ LTGP:CAC, pause if falls below 3:1
- Multi-format generation: HTML emails, SMS, landing pages, social ads
- Batch processing with uniqueness tracking (no duplicate creative)

#### Lead Getters Automation
- **Customer Referrals**: 7 automated triggers at purchase, milestone, positive feedback
- **Employees**: Document-Demonstrate-Duplicate training system with performance tracking
- **Agencies**: 6-month learning extraction → team training → consulting transition
- **Affiliates**: 6-step army building (Find → Offer → Qualify → Pay → Launch → Integrate) with Whisper-Tease-Shout launches

### Autonomous Decisions
- Channel budget allocation across Core Four
- Creative testing and variant selection
- Audience expansion timing and targeting
- Format optimization (text vs. video vs. image)
- When to activate Lead Getters
- Referral incentive calibration
- Affiliate commission structure

### Technical Implementation
- **Models**: Gemini 2.5 Flash for prose generation, Imagen 4 for visuals, Gemini 3 Pro for strategic copy
- **Pattern**: Parallel batch processing (Promise.all for simultaneous campaign generation)
- **Storage**: Campaign history, asset versions, performance metrics per channel
- **Integration**: Receives offers from Offer Cell, budget allocations from Strategy Brain, sends leads to Conversation Engine

### Success Metrics
- Aggregate lead volume > 1,000/week across all channels by Month 3
- Referral rate > 25% monthly by Month 6
- Multi-channel presence (3+ channels active simultaneously) by Month 4
- LTGP:CAC > 5:1 on paid channels

### Code Patterns from Repository Analysis
- Multi-format campaign generation (campaign-OS `generateCampaignStrategy`)
- Image generation + template injection (campaign-OS, Ebook-creator)
- Parallel asset generation (Campaign-gen batch processing)
- State machine for campaign lifecycle tracking

---

## Section 4: Conversation & Sales Engine (Qualification Phase)
**Hormozi Level**: Level 3-4 (Advertising help → Referral engine)
**Core Four Focus**: Lead Qualification + Routing
**Development Priority**: 4 (Build Fourth)

### Description
The Conversation & Sales Engine handles all inbound interactions, qualifies leads, and routes them appropriately. This cell operates like a sales development team that pre-qualifies prospects and escalates high-value opportunities to humans with full context.

### Key Capabilities
- **Multi-Input Handler**: Accept text briefs, file uploads (screenshots, documents), URL inputs (website audits)
- **Conversational Extraction**: 5-question onboarding with completion detection token [COMPLETE]
- **Lead Qualification**: Score prospects on PMAU framework (Problem × Money × Authority × Urgency)
- **Auto-Routing**: Score 8+ → human sales immediately with full context, 5-8 → automated nurture, <5 → long-term sequence
- **Objection Handling**: Learn from every objection, track successful/failed responses with conversion rates
- **Context Handoff**: When escalating to humans, provide complete conversation history, qualification data, and recommended next steps

### Autonomous Decisions
- Lead qualification scores based on conversation analysis
- Routing logic (human vs. automated nurture)
- Which nurture sequence to assign
- When to escalate with full conversation context
- Objection response selection from learned patterns
- When to offer booking/demo vs. additional nurture

### Technical Implementation
- **Model**: Gemini 3 Pro for multi-modal analysis (supports text, images, documents)
- **Pattern**: Multi-input type handler (Campaign-gen InputForm pattern)
- **Storage**: Conversation history, qualification scores, objection database with response effectiveness
- **Integration**: Receives leads from Distribution Engine, sends qualified opportunities to CRM/human sales

### Success Metrics
- Qualification accuracy > 90% (validated by human sales feedback)
- Response latency < 10 seconds for conversational turns
- Escalation precision > 85% (humans agree with score)
- Objection handling success rate improvement > 20% quarter-over-quarter

### Code Patterns from Repository Analysis
- Multi-input handler framework (Campaign-gen pattern for text/file/URL)
- Conversational onboarding with completion detection (campaign-OS pattern)
- Schema-driven qualification output (structured lead scoring)

---

## Section 5: Lifecycle & Compounding Engine (Retention Phase)
**Hormozi Level**: Level 4-7 (Referral engine → $100M+ machine)
**Core Four Focus**: Long-Term Asset Nurture + Institutional Memory
**Development Priority**: 5 (Build Fifth)

### Description
The Lifecycle & Compounding Engine treats every contact as a long-term asset with continuous nurturing, reactivation, upselling, and referral generation. This cell operates like a customer success + retention team that ensures revenue compounds over time through institutional learning.

### Key Capabilities
- **State Machine Tracking**: pending → generating → completed → error for all assets and campaigns
- **5 Lifecycle Stages**: Lead (not purchased), New Customer (no results yet), Active (engaged), Dormant (30+ days inactive), Churned (cancelled)
- **Automated Sequences**: Stage-specific nurture with triggers (time-based, behavior-based, milestone-based)
- **Reactivation Logic**: Dormant contact detection with personalized re-engagement campaigns
- **Upsell Timing**: Identify optimal moments for upgrade offers based on usage patterns and results achieved
- **Affiliate Launch System**: Whisper-Tease-Shout pattern for customer-to-affiliate conversion
- **Asset Versioning**: Track campaign performance over time, identify winning variants, sunset losers
- **Institutional Memory**: Remember every objection, winning message, channel performance, failed experiment across all time

### Autonomous Decisions
- Which lifecycle stage to transition contacts to
- When to trigger reactivation sequences
- Optimal upsell timing and offer selection
- When to invite customers to become affiliates
- Which campaign variants to scale vs. sunset
- How to apply learnings from one channel to another

### Technical Implementation
- **Model**: Gemini 2.5 Flash for nurture content generation, Gemini 3 Pro for strategic lifecycle decisions
- **Pattern**: State machine for asset lifecycle (Campaign-gen pattern)
- **Storage**: Complete contact history, asset versions, performance tracking, institutional learning database
- **Integration**: Receives contacts from all cells, provides compounding insights back to Strategy Brain

### Success Metrics
- Churn rate < 5% monthly
- Reactivation success rate > 15% on dormant contacts
- Upsell conversion > 20% of active customers annually
- Customer-to-affiliate conversion > 10% of satisfied customers
- Knowledge compounding: Each campaign 10%+ more effective than previous

### Code Patterns from Repository Analysis
- Asset state machine (Campaign-gen `useAssetStudio` pattern)
- Session persistence with localStorage (campaign-OS pattern)
- Asset versioning and performance tracking (Campaign-gen bookmarking system)
- Batch processing for lifecycle transitions

---

## Integration Architecture

### Data Flow
```
Strategy Brain (Decision Core)
    ↓ (Market intelligence, budget allocation)
Offer & Product Cell (Positioning)
    ↓ (Optimized offers)
Distribution Engine (Execution)
    ↓ (Inbound leads)
Conversation & Sales Engine (Qualification)
    ↓ (Qualified contacts)
Lifecycle & Compounding Engine (Retention)
    ↑ (Performance data, learnings)
Strategy Brain (Feedback loop)
```

### Shared Infrastructure
- **Database**: PostgreSQL for all persistent data (decisions, campaigns, contacts, metrics)
- **Authentication**: OAuth (Google/GitHub) for multi-user access
- **Rate Limiting**: API quotas per cell to prevent overuse
- **Monitoring**: Performance dashboards showing LTGP:CAC, conversion rates, constraint detection
- **Webhook System**: External integrations (CRM, email platforms, ad networks)

### Governance Layer
- **Escalation Framework**: Financial (>$10K/day spend), Customer (>$50K deals), Strategic (new channels), Technical (system failures)
- **Weekly Review Board**: Humans review trends, approve strategic changes, set constraints for autonomous operation
- **Audit Trail**: Complete decision history with reasoning for transparency

---

## Development Sequence & Milestones

### Phase 1: Foundation (Months 1-2)
- Build Strategy Brain with pain point extraction and offer engineering
- Implement schema-driven JSON generation pattern
- Set up PostgreSQL database with core tables
- Create governance dashboard for human oversight
- **Milestone**: Can analyze market and generate optimized offers autonomously

### Phase 2: Positioning (Month 3)
- Build Offer & Product Cell with lead magnet generation
- Implement value stacking and guarantee selection
- Add asset versioning system
- **Milestone**: Can generate complete offer stacks with calculated value

### Phase 3: Distribution (Months 4-6)
- Build all four Core Four executors (Warm, Cold, Content, Paid)
- Implement parallel batch processing for simultaneous campaigns
- Add image generation + template injection
- Integrate Lead Getters automation (referrals, affiliates)
- **Milestone**: Running multi-channel campaigns with 1,000+ leads/week

### Phase 4: Qualification (Month 7)
- Build Conversation & Sales Engine with multi-input handler
- Implement PMAU qualification scoring
- Add auto-routing logic with human escalation
- Build objection database with response tracking
- **Milestone**: Qualifying leads autonomously with 90%+ accuracy

### Phase 5: Compounding (Months 8-10)
- Build Lifecycle & Compounding Engine with state machine
- Implement 5 lifecycle stages with automated transitions
- Add institutional memory system
- Build reactivation and upsell logic
- Integrate Whisper-Tease-Shout affiliate system
- **Milestone**: Revenue compounding through retention, upsells, referrals

### Phase 6: Scale & Autonomy (Months 11-12)
- Implement More-Better-New constraint detection across all cells
- Add autonomous budget reallocation between channels
- Build feedback loops (performance → offer refinement)
- Complete governance framework with escalation rules
- **Milestone**: Operating autonomously with minimal human intervention, achieving 5:1+ LTGP:CAC

---

## Hormozi's 7-Level Progression Mapped to AGRD

| Level | Description | AGRD Capabilities | Timeline |
|-------|-------------|-------------------|----------|
| **1** | Your friends know | Strategy Brain + Offer Cell generating targeted warm outreach | Months 1-2 |
| **2** | Consistent personal output | + Distribution Engine with content and warm outreach executors | Months 3-4 |
| **3** | First advertising help | + Cold outreach and paid ads executors at scale | Months 5-6 |
| **4** | Referral engine working | + Conversation Engine with 25%+ referral rate automation | Month 7 |
| **5** | Multi-channel scaling | + All Core Four + Four Lead Getters operating simultaneously | Months 8-9 |
| **6** | Executives running channels | + Lifecycle Engine with institutional memory compounding | Months 10-11 |
| **7** | $100M+ machine | + Full autonomy with More-Better-New constraint detection, minimal human intervention | Month 12+ |

---

## Success Criteria for Full AGRD Deployment

By Month 12, AGRD should demonstrate:

1. **Autonomous Operation**: Making 100+ tactical decisions daily without human input
2. **Multi-Channel Performance**: 3+ channels operating simultaneously with 5:1+ LTGP:CAC
3. **Compounding Growth**: 25%+ monthly referral rate exceeding churn rate
4. **Institutional Learning**: Each campaign measurably more effective than previous
5. **Constraint Detection**: Identifying and responding to bottlenecks within 24 hours
6. **Revenue Impact**: Generating 1,000+ qualified leads monthly, $100K+ pipeline value

---

## Technology Stack Summary

**Frontend** (Design OS application):
- React 19.x
- TypeScript 5.8
- Tailwind CSS v4
- lucide-react icons

**AI Models** (Multi-model orchestration):
- Gemini 3 Pro (complex reasoning, strategic decisions)
- Gemini 2.5 Flash (prose generation, content)
- Imagen 4.0 (visual design)
- @google/genai SDK

**Backend** (To be built):
- PostgreSQL + Supabase (database, auth)
- Node.js/Express or Next.js API routes
- Rate limiting + monitoring
- Webhook system for integrations

**Code Patterns** (From repository analysis):
- Schema-driven JSON generation
- Thinking budget management
- Multi-input type handler
- Parallel batch processing
- State machine for lifecycle
- Completion detection tokens
- Image generation + template injection

---

This roadmap ensures AGRD is built incrementally, with each section functioning independently while contributing to the compound intelligence of the complete system. Each phase delivers measurable value and can be tested/validated before moving to the next.
