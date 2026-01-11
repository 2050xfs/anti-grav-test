# AGRD Analysis: Repository Patterns & AI Orchestration

## EXECUTIVE SUMMARY

These three repositories demonstrate sophisticated patterns for autonomous AI-driven generation, orchestration, and governance that are highly relevant to AGRD's Strategy Brain, Offer & Product Cell, and agent coordination requirements:

1. **AI-Skills-Directory**: Multi-agent governance system with decision-making, security auditing, and autonomous content generation
2. **ai-site-builder**: Autonomous code generation with Claude Code SDK and Daytona sandbox orchestration
3. **codex-site-builder**: Lightweight Next.js template serving as base for AI-generated applications

---

## 1. AI-SKILLS-DIRECTORY

### Overview
A futuristic enterprise registry for AI "skills" (agent capabilities) that combines marketplace discovery with governance operations and AI-generated analysis. It models an autonomous immune system for managing AI capabilities with specialized agents handling security, content, economics, and knowledge management.

**Key Problem Solved**: How to manage, discover, audit, and govern a dynamic registry of AI agent capabilities with autonomous agents making decisions about trust, safety, content, and resource allocation.

### Architecture & Key Files

**Main Structure**:
```
AI-Skills-Directory/
├── App.tsx                           # Router & layout
├── App.tsx                           # Main routing (HashRouter)
├── components/
│   ├── DiscoveryEngine.tsx          # Marketplace search & filtering
│   ├── BlogPost.tsx                 # AI-generated analysis pages
│   ├── AdminConsole.tsx             # Governance dashboard
│   └── MediaLab.tsx                 # Media generation (unused)
├── services/
│   └── geminiService.ts             # All AI integrations
├── types.ts                         # Data models
├── constants.ts                     # Mock data & org chart
└── vite.config.ts
```

**Key Files & Patterns**:

1. **types.ts** (Line 1-67): Data model architecture
   - `Skill`: capability registry entry with outcomes, risk score, status
   - `BlogPost`: AI-generated content schema with SEO metadata
   - `AgentLog`: event logging with severity & action tracking
   - `AgentProfile`, `Department`, `Division`: organizational hierarchy

2. **services/geminiService.ts** (Line 1-258): AI orchestration layer
   - Model selection strategy: Flash for fast reasoning, Pro for complex tasks
   - Schema-based generation with structured JSON responses
   - Parallel execution with sequential UX simulation
   - Error handling with fallbacks

3. **components/DiscoveryEngine.tsx** (Line 1-202): Intent-driven search
   - AI-powered search intent matching
   - Fallback to fuzzy text search
   - Category filtering with dynamic results
   - Uses `matchSkillsWithIntent()` to rank skills by relevance

4. **components/BlogPost.tsx** (Line 1-194): Autonomous content generation
   - Parallel AI requests: blog content + image generation
   - Sequential UX loading states for cinematic effect
   - Markdown rendering with metadata display
   - Error recovery patterns

5. **components/AdminConsole.tsx** (Line 1-350+): Governance dashboard
   - Neural Architecture tab: org chart with inspector panel
   - Live Logs: activity tracking with severity filtering
   - Manual Audit tab: code security scanning via Gemini

6. **constants.ts** (Line 1-350+): Mock data & org structure
   - MOCK_SKILLS: 5 capabilities with various statuses
   - MOCK_LOGS: Agent activity events
   - ORG_CHART: Hierarchical agent organization

### Relevant Patterns for AGRD

#### 1. Agent Decision-Making Architecture

**Pattern**: Specialized agents with distinct roles, responsibilities, and decision rights

**Agents modeled** (constants.ts, lines 143-350):
- **ARCHITECT-01** (Executive): Constitution & rule-setting, cannot execute
- **ECONOMIST-01** (Executive): Resource governance, token burn forecasting
- **SENTINEL-01** (Trust & Security): Code audit, absolute veto power
- **JANITOR-01** (Infrastructure): Maintenance, API drift detection
- **CURATOR-01** (Knowledge): Outcome mapping, intent translation
- **HERALD-01** (Narrative): Content & SEO strategy
- **ARTIST-01** (Narrative): Visual asset generation

**Key Pattern**:
```typescript
interface AgentProfile {
  id: string;
  name: string;
  role: string;
  purpose: string;
  tasks: string[];
  status: 'active' | 'idle' | 'processing' | 'learning';
  decisions: string[];  // Authority boundaries
}
```

**Decision Boundaries**:
- SENTINEL can QUARANTINE, FLAG, or PASS
- ECONOMIST can DOWNGRADE/UPGRADE models based on costs
- ARCHITECT updates trust thresholds
- CURATOR ranks and indexes capabilities

**AGRD Application**: The Strategy Brain needs similar hierarchical decision-making with agents for market analysis, product decisions, and offer generation.

#### 2. Event-Driven Logging with Action History

**Pattern**: Structured logging of all agent decisions with observation, risk score, and action taken

**Implementation** (types.ts, lines 26-36):
```typescript
interface AgentLog {
  id: string;
  timestamp: string;
  agentId: string;
  eventType: 'PERMISSION_MISMATCH' | 'API_DRIFT' | 'OUTCOME_MAPPING' | 
            'SECURITY_SCAN' | 'AUTO_FIX' | 'CONTENT_GEN' | 'ASSET_RENDER' | 
            'POLICY_UPDATE' | 'ECONOMIC_ADJUSTMENT';
  targetSkill?: string;
  observation: string;
  riskScore?: number;
  actionTaken: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}
```

**Example Log** (constants.ts, lines 77-130):
```
Timestamp: 2024-05-22T14:30:00Z
Agent: SENTINEL-01
EventType: PERMISSION_MISMATCH
Observation: "Skill manifest declares 'offline' but script imports 'requests'"
Action: QUARANTINE_INITIATED
Severity: critical
```

**AGRD Application**: The Offer & Product Cell and Strategy Brain should log all decisions (market analysis, product updates, offer generation) with rationale and outcomes for auditing and learning.

#### 3. AI Model Selection Strategy

**Pattern**: Different models for different tasks based on speed/quality tradeoff

**Implementation** (geminiService.ts):
```
gemini-3-flash-preview     → Fast reasoning (search intent matching)
gemini-3-pro-preview       → Complex reasoning (code audit, blog generation)
gemini-2.5-flash-image     → Image generation (hero images)
veo-3.1-fast-generate      → Video generation
```

**Model Selection Logic**:
- Flash for ranking/filtering (fast, cost-efficient)
- Pro for complex analysis (security audits, content strategy)
- Image models for visual assets
- Polling pattern for long-running video generation

**AGRD Application**: The Strategy Brain needs similar model selection for market analysis (use Flash for quick filtering), offer generation (use Pro for detailed reasoning), and content creation.

#### 4. Schema-Based Generation with Structured Output

**Pattern**: Define response schemas to ensure consistent, parseable AI output

**Example** (geminiService.ts, lines 82-138):
```typescript
const response = await ai.models.generateContent({
  model: 'gemini-3-pro-preview',
  contents: prompt,
  config: {
    responseMimeType: 'application/json',
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        content: { type: Type.STRING },
        seoDescription: { type: Type.STRING },
        keywords: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ["title", "content", "seoDescription", "keywords"]
    }
  }
});
```

**Benefits**:
- Guaranteed valid JSON
- Type safety on client side
- No parsing errors
- Consistent structure

**AGRD Application**: Offer generation and product updates should use schemas for guaranteed consistent output.

#### 5. Fallback & Error Recovery Patterns

**Pattern**: Multi-level fallback when AI fails

**Search Intent Matching Fallback** (DiscoveryEngine.tsx, lines 18-56):
```
1. Try AI intent matching → JSON list of skill names
2. If AI returns empty → Filter by fuzzy text match
3. Fallback to basic substring search
4. Show "no results" message
```

**Blog Generation Fallback** (BlogPost.tsx, lines 20-58):
```
1. Try blog generation in parallel with image generation
2. If image generation fails → Use placeholder image
3. If blog generation fails → Show error: "Agents offline"
```

**AGRD Application**: Offer generation should have fallbacks (manual templates, previous offers) when AI fails.

#### 6. Activity Monitoring & System Health Dashboard

**Pattern**: Real-time visibility into agent status and system health

**Implementation** (AdminConsole.tsx, lines 101-212):
```
Neural Architecture Tab:
- Org chart showing all agents grouped by division
- Agent cards showing: name, role, status, tasks
- Inspector panel: full agent profile including decisions

Live Logs Tab:
- Bar chart of 24-hour agent activity volume
- Quick stats: Open PRs, Quarantined Skills
- Event log table: timestamps, agents, events, observations

Manual Audit Tab:
- Code input area
- Run security scan via Gemini
- Risk score visualization
- Findings list
```

**AGRD Application**: The Strategy Brain dashboard should show agent activity, offer generation pipeline, market analysis status, and product update decisions.

#### 7. Multi-Step Orchestration with Loading States

**Pattern**: Simulate multi-step agent work for UX while actually running in parallel

**Implementation** (BlogPost.tsx, lines 28-47):
```typescript
setLoadingStep('AGENT: WRITER-01 > INITIALIZING CONTEXT...');
await new Promise(r => setTimeout(r, 800)); // Cinematic delay

setLoadingStep(`AGENT: WRITER-01 > ANALYZING SKILL: ${skill.name.toUpperCase()}...`);
const [blogData, imageUrl] = await Promise.all([blogPromise, imagePromise]);

setLoadingStep('AGENT: ARTIST-01 > REQUESTING VISUAL ASSETS...');
await new Promise(r => setTimeout(r, 500));
```

**Key Insight**: The UI shows sequential steps ("First writer, then artist") but code runs parallel Promise.all(). This creates the illusion of orchestration while maintaining performance.

**AGRD Application**: Offer generation pipeline should show: Market Analysis → Product Strategy → Offer Design → Validation steps.

### Reusable Code/Patterns

**File**: `/tmp/2050xfs-repos/AI-Skills-Directory/services/geminiService.ts`

**Pattern 1: Outcome Matcher** (Lines 15-46)
```typescript
export const matchSkillsWithIntent = async (query: string, availableSkills: string[]) => {
  const prompt = `
    User Query: "${query}"
    Available Skills Database (JSON): ${JSON.stringify(availableSkills)}
    
    Task: Return JSON array of skill names that match, sorted by relevance.
    Format: just the JSON array of strings, nothing else.
  `;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });
  
  return response.text || "[]";
};
```

**AGRD Application**: Adapt for market opportunity matching - given market signals, return relevant product opportunities.

**Pattern 2: Security Audit** (Lines 49-79)
```typescript
export const auditCodeSnippet = async (code: string) => {
  const prompt = `
    Analyze code for high-risk primitives (fs:write, network calls, shell execution).
    Return JSON with:
    - riskScore (0-100)
    - findings (array of strings)
    - status (APPROVED | FLAGGED | QUARANTINED)
  `;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });
  
  return response.text || "{}";
};
```

**AGRD Application**: Adapt for offer validation - check offers for market viability, financial risk, execution feasibility.

**Pattern 3: Content Generation** (Lines 82-138)
Creates structured blog posts with SEO metadata - adapt for product descriptions, offer narratives, market analysis summaries.

### Tech Stack

- **React 19** with Hooks for state management
- **React Router (HashRouter)** for client-side navigation
- **Tailwind CSS v4** via CDN (dark mode support)
- **Lucide Icons** for UI iconography
- **Recharts** for data visualization (bar charts, tooltips)
- **ReactMarkdown** for rendering markdown content
- **Google Gemini API SDK** (`@google/genai`)
  - Models: Gemini 3 Flash, Gemini 3 Pro, Gemini 2.5 Flash Image, Veo
  - Streaming support (query async iterator)
  - Structured JSON output with schemas
- **Vite** for build tooling
- **TypeScript** for type safety

---

## 2. AI-SITE-BUILDER

### Overview
A Next.js application that orchestrates autonomous website generation using the Claude Code SDK. It spawns Daytona sandboxes, runs Claude Code agents to generate full applications, and streams back real-time progress/messages.

**Key Problem Solved**: How to autonomously generate production-ready web applications from natural language prompts by orchestrating AI agents in isolated sandboxes.

### Architecture & Key Files

**Main Structure**:
```
ai-site-builder/lovable-clone-main/
├── lovable-ui/                           # Next.js frontend
│   ├── app/
│   │   ├── page.tsx                      # Home page with prompt input
│   │   ├── generate/page.tsx             # Generation UI with live updates
│   │   ├── api/
│   │   │   ├── generate/route.ts         # Local Claude Code API
│   │   │   └── generate-daytona/route.ts # Sandbox generation API
│   │   └── layout.tsx
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── MessageDisplay.tsx
│   ├── lib/
│   │   └── claude-code.ts                # Claude Code SDK wrapper
│   └── scripts/
│       └── generate-in-daytona.ts        # Daytona orchestration script
├── generateWithClaudeCode.ts             # Standalone generation function
└── lovable-ui/package.json
```

### Relevant Patterns for AGRD

#### 1. Multi-Agent Code Generation Orchestration

**Pattern**: Spawn isolated sandbox, install Claude Code SDK, run generation script, stream messages back

**Flow Diagram**:
```
User Prompt
    ↓
POST /api/generate-daytona
    ↓
spawn("npx tsx generate-in-daytona.ts")
    ↓
Daytona Sandbox Creation
    ↓
Install Claude Code SDK in Sandbox
    ↓
Run generation script with query()
    ↓
Stream messages: Text, Tool Uses, Progress
    ↓
Extract preview URL when ready
    ↓
iframe shows live preview
```

**File**: `/tmp/2050xfs-repos/ai-site-builder/lovable-clone-main/lovable-ui/app/api/generate-daytona/route.ts` (Lines 1-160+)

**Implementation**:
```typescript
// 1. Spawn generation process
const child = spawn("npx", ["tsx", scriptPath, prompt], {
  env: { DAYTONA_API_KEY, ANTHROPIC_API_KEY }
});

// 2. Listen to stdout and parse messages
child.stdout.on("data", async (data) => {
  // Parse __CLAUDE_MESSAGE__, __TOOL_USE__, __TOOL_RESULT__ markers
  // Stream as Server-Sent Events (SSE)
  await writer.write(encoder.encode(`data: ${JSON.stringify(message)}\n\n`));
});

// 3. Wait for completion
await new Promise((resolve, reject) => {
  child.on("exit", (code) => {
    if (code === 0) resolve(code);
    else reject(new Error(`Process exited with code ${code}`));
  });
});
```

**AGRD Application**: The Offer & Product Cell should use similar orchestration:
- Spawn isolated work environment
- Run AI agents for offer generation
- Stream progress back to Strategy Brain
- Return structured offers

#### 2. Sandbox Lifecycle Management

**Pattern**: Create sandbox, configure environment, execute code, clean up

**Implementation** (generate-in-daytona.ts, lines 1-80):
```typescript
const daytona = new Daytona({ apiKey: process.env.DAYTONA_API_KEY });

// 1. Create or get sandbox
const sandbox = await daytona.create({
  public: true,
  image: "node:20",
});
const sandboxId = sandbox.id;

// 2. Get working directory
const rootDir = await sandbox.getUserRootDir();

// 3. Set up project
await sandbox.process.executeCommand(`mkdir -p ${projectDir}`, rootDir);
await sandbox.process.executeCommand("npm init -y", projectDir);

// 4. Install dependencies
const installResult = await sandbox.process.executeCommand(
  "npm install @anthropic-ai/claude-code@latest",
  projectDir,
  undefined,
  180000 // 3 minute timeout
);

// 5. Run generation
const genResult = await sandbox.process.executeCommand(
  "node generate.js",
  projectDir,
  { ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY },
  600000 // 10 minute timeout
);

// 6. Check results
const filesResult = await sandbox.process.executeCommand("ls -la", projectDir);
```

**AGRD Application**: The Offer & Product Cell needs similar sandbox setup for isolated offer generation with timeout management.

#### 3. Message Parsing & Streaming Architecture

**Pattern**: Tagged messages from agent subprocess → Parse → Stream as SSE → Display in frontend

**Tags** (generate-in-daytona.ts, lines 136-149):
```javascript
console.log('[Claude]:', message.text);
console.log('__CLAUDE_MESSAGE__', JSON.stringify({ type: 'assistant', content: message.text }));

console.log('[Tool]:', message.name);
console.log('__TOOL_USE__', JSON.stringify({ 
  type: 'tool_use', 
  name: message.name, 
  input: message.input 
}));

console.log('__TOOL_RESULT__', JSON.stringify({ 
  type: 'tool_result', 
  result: message.result 
}));
```

**Parser** (route.ts, lines 48-123):
```typescript
if (line.includes('__CLAUDE_MESSAGE__')) {
  const message = JSON.parse(line.substring(jsonStart).trim());
  await writer.write(encoder.encode(`data: ${JSON.stringify({ 
    type: "claude_message", 
    content: message.content 
  })}\n\n`));
}
else if (line.includes('__TOOL_USE__')) {
  const toolUse = JSON.parse(line.substring(jsonStart).trim());
  await writer.write(encoder.encode(`data: ${JSON.stringify({ 
    type: "tool_use", 
    name: toolUse.name,
    input: toolUse.input 
  })}\n\n`));
}
```

**Frontend** (generate/page.tsx, lines 55-115):
```typescript
const generateWebsite = async () => {
  const response = await fetch("/api/generate-daytona", {
    method: "POST",
    body: JSON.stringify({ prompt })
  });
  
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    const lines = chunk.split("\n");
    
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (data === "[DONE]") {
          setIsGenerating(false);
          break;
        }
        
        try {
          const message = JSON.parse(data);
          if (message.type === "error") {
            setError(message.message);
          } else if (message.type === "complete") {
            setPreviewUrl(message.previewUrl);
          } else {
            setMessages((prev) => [...prev, message]);
          }
        } catch (e) {
          // Ignore parse errors
        }
      }
    }
  }
};
```

**AGRD Application**: The Offer & Product Cell should use similar streaming for:
- Market analysis progress
- Offer generation steps
- Product decision updates
- Error reporting

#### 4. Claude Code SDK Integration Pattern

**Pattern**: Use `query()` async iterator to run AI agents with tool permissions

**File**: `/tmp/2050xfs-repos/ai-site-builder/lovable-clone-main/lovable-ui/lib/claude-code.ts`

```typescript
import { query, type SDKMessage } from "@anthropic-ai/claude-code";

export async function generateCodeWithClaude(prompt: string): Promise<CodeGenerationResult> {
  try {
    const messages: SDKMessage[] = [];
    const abortController = new AbortController();
    
    // Execute the query and collect all messages
    for await (const message of query({
      prompt: prompt,
      abortController: abortController,
      options: {
        maxTurns: 10, // Allow multiple turns for complex builds
        // Grant all necessary permissions for code generation
        allowedTools: [
          "Read",    // Read files
          "Write",   // Create files
          "Edit",    // Modify files
          "MultiEdit", // Batch edits
          "Bash",    // Run commands
          "LS",      // List files
          "Glob",    // Pattern matching
          "Grep",    // Search
          "WebSearch", // Search the web
          "WebFetch"   // Fetch URLs
        ]
      }
    })) {
      messages.push(message);
      console.log(`[${message.type}]`, message);
    }
    
    return {
      success: true,
      messages: messages
    };
    
  } catch (error: any) {
    console.error("Error generating code:", error);
    return {
      success: false,
      messages: [],
      error: error.message
    };
  }
}
```

**AGRD Application**: The Strategy Brain and Offer & Product Cell should use similar patterns with different tool permissions:
- Strategy Brain: WebSearch, WebFetch, Grep (market research)
- Offer Cell: Read, Write, Edit, Bash (offer generation)
- Product Cell: Glob, Read, Edit (product updates)

#### 5. Real-Time UI State Management

**Pattern**: Stream-based message collection with scroll-to-bottom and loading states

**File**: `/tmp/2050xfs-repos/ai-site-builder/lovable-clone-main/lovable-ui/app/generate/page.tsx`

```typescript
const [messages, setMessages] = useState<Message[]>([]);
const [previewUrl, setPreviewUrl] = useState<string | null>(null);
const [isGenerating, setIsGenerating] = useState(false);
const [error, setError] = useState<string | null>(null);
const messagesEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  scrollToBottom();
}, [messages]); // Auto-scroll as messages arrive

const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
};

// Message types
interface Message {
  type: "claude_message" | "tool_use" | "tool_result" | "progress" | "error" | "complete";
  content?: string;
  name?: string;
  input?: any;
  message?: string;
  previewUrl?: string;
}
```

**AGRD Application**: Similar state management for offer generation pipeline with message types:
- "market_analysis" - Market research results
- "product_strategy" - Product decisions
- "offer_generated" - Completed offer
- "validation" - Offer validation results

### Reusable Code/Patterns

**Pattern**: Daytona Sandbox Setup
```typescript
const daytona = new Daytona({ apiKey: process.env.DAYTONA_API_KEY });
const sandbox = await daytona.create({ public: true, image: "node:20" });
const rootDir = await sandbox.getUserRootDir();

// Execute command with timeout
const result = await sandbox.process.executeCommand(
  "npm install @anthropic-ai/claude-code@latest",
  projectDir,
  undefined,
  180000
);
```

**Pattern**: Stream-based Message Processing
```typescript
const encoder = new TextEncoder();
const stream = new TransformStream();
const writer = stream.writable.getWriter();

// In subprocess loop
for (const line of lines) {
  if (line.includes('__CLAUDE_MESSAGE__')) {
    const message = JSON.parse(extractJson(line));
    await writer.write(encoder.encode(`data: ${JSON.stringify(message)}\n\n`));
  }
}

// On client
for await (const message of query({ ... })) {
  messages.push(message);
  // Stream to frontend
}
```

### Tech Stack

- **Next.js 15** with App Router
- **React 19** with Hooks
- **TypeScript 5.8**
- **Tailwind CSS v4**
- **Claude Code SDK** (`@anthropic-ai/claude-code`)
  - `query()` async iterator for agent execution
  - Tool permissions system
  - Multi-turn conversations (maxTurns: 10-20)
- **Daytona SDK** for sandbox management
- **Node.js child_process** for spawning agents
- **Server-Sent Events (SSE)** for streaming

---

## 3. CODEX-SITE-BUILDER

### Overview
A minimal Next.js 15 template configured with Tailwind CSS v4 and modern tooling. Serves as a base template for AI-generated applications.

**Key Problem Solved**: Provides a clean, modern starting point for generated web applications with minimal overhead.

### Architecture & Key Files

**Structure**:
```
codex-site-builder/web/
├── src/app/
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── package.json        # Next.js 15, React 19, Tailwind CSS v4
├── tsconfig.json
├── next.config.ts
└── tailwind.config.ts
```

### Relevant Patterns for AGRD

#### 1. Minimal Template Architecture

The template is intentionally minimal - just enough for AI to generate on top of without bloat. Key lessons:
- Remove boilerplate comments and examples
- Pre-configure Tailwind CSS v4 (no config.js needed)
- Use Next.js App Router (not Pages Router)
- Include TypeScript by default
- Clean file structure

**AGRD Application**: The Offer & Product Cell should maintain minimal templates for generated offers that AI can safely extend.

#### 2. Build Configuration

```typescript
// next.config.ts
import type { NextConfig } from "next";

const config: NextConfig = {};
export default config;
```

**AGRD Application**: Keep configuration minimal and let Claude Code agents generate necessary configs (tailwind, vite, etc.) on demand.

### Tech Stack

- **Next.js 15.5.4** (Turbopack enabled)
- **React 19.1.0**
- **TypeScript 5**
- **Tailwind CSS v4** (no tailwind.config.js)
- **Node 20+**

---

## PATTERNS SUMMARY FOR AGRD

### 1. Strategy Brain (Decision Making)

**Patterns to adopt**:
1. **Hierarchical Agent Organization** (from AI-Skills-Directory)
   - Market Analysis Agent: evaluates opportunities
   - Product Strategy Agent: makes product decisions
   - Offer Generation Agent: creates offers
   - Validation Agent: checks viability

2. **Event-Driven Decision Logging** (from AI-Skills-Directory)
   - Log every decision with reasoning, risk score, and action
   - Maintain decision audit trail
   - Support reversal/rollback capabilities

3. **Model Selection Strategy** (from AI-Skills-Directory)
   - Flash models for fast market filtering
   - Pro models for strategic analysis
   - Cost-aware model selection

4. **Structured Output with Schemas** (from AI-Skills-Directory)
   - Guaranteed valid JSON responses
   - Type-safe data structures
   - No parsing errors

### 2. Offer & Product Cell (Generation)

**Patterns to adopt**:
1. **Sandbox Orchestration** (from ai-site-builder)
   - Isolated execution environment for offer generation
   - Timeout management (5-10 minutes)
   - Clean up after generation

2. **Message Streaming & Real-Time Updates** (from ai-site-builder)
   - Stream progress back to Strategy Brain
   - Parse multi-level message tags
   - Display real-time generation steps

3. **Claude Code SDK Integration** (from ai-site-builder)
   - Use `query()` with specific tool permissions
   - Multi-turn generation (maxTurns: 20)
   - Collect all messages for audit trail

4. **Minimal Templates** (from codex-site-builder)
   - Provide clean base templates
   - Let AI extend and customize
   - Version control generated offers

### 3. Agent Coordination

**Patterns to adopt**:
1. **Asynchronous Multi-Agent Execution** (from AI-Skills-Directory & ai-site-builder)
   - Run agents in parallel when possible (Promise.all)
   - Show sequential steps in UX (cinematic effect)
   - Aggregate results

2. **Fallback Chains** (from AI-Skills-Directory)
   - Primary approach → Secondary approach → Manual override
   - Graceful degradation
   - Always have human escape hatch

3. **Activity Monitoring Dashboard** (from AI-Skills-Directory)
   - Real-time agent status
   - Activity logs with filters
   - Manual intervention tools

---

## REUSABLE CODE SNIPPETS

### 1. Intent Matching (Strategy Brain)

```typescript
// From geminiService.ts
export const matchMarketOpportunities = async (
  marketSignals: string[],
  availableProducts: string[]
): Promise<string[]> => {
  const ai = getAiClient();
  const prompt = `
    Market Signals: ${marketSignals.join(", ")}
    Available Products: ${availableProducts.join(", ")}
    
    Return JSON array of product names that match market opportunities.
  `;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });
  
  return JSON.parse(response.text || "[]");
};
```

### 2. Offer Generation (Offer & Product Cell)

```typescript
// Adapt from generate-in-daytona.ts
const generationScript = `
const { query } = require('@anthropic-ai/claude-code');

async function generateOffer() {
  const prompt = \`
    Generate a product offer with:
    - Clear value proposition
    - Target market segments
    - Pricing strategy
    - Success metrics
  \`;
  
  const messages = [];
  for await (const message of query({
    prompt: prompt,
    options: {
      maxTurns: 10,
      allowedTools: ['Read', 'Write', 'Edit', 'Bash']
    }
  })) {
    messages.push(message);
  }
  
  return messages;
}
`;
```

### 3. Agent Decision Logging (Both)

```typescript
// From constants.ts - AgentLog model
interface OfferGenerationLog {
  id: string;
  timestamp: string;
  agentId: string; // e.g., OFFER-GENERATOR-01
  eventType: 'MARKET_ANALYSIS' | 'OFFER_GENERATED' | 'VALIDATION' | 
            'PRICING_SET' | 'PUBLISHED' | 'REJECTED';
  observation: string;
  riskScore?: number;
  actionTaken: string;
  metadata?: Record<string, any>;
}
```

---

## TECHNICAL RECOMMENDATIONS

### 1. Use Gemini API with Structured Output
- Implement schema-based generation for all AI outputs
- Use `responseMimeType: 'application/json'` with `responseSchema`
- Avoid parsing errors through guaranteed structure

### 2. Implement Sandbox Isolation
- Use Daytona or similar for offer generation
- Timeout all long-running operations (5-10 min for generation, 1 min for analysis)
- Clean up sandbox after completion

### 3. Stream Everything
- Use Server-Sent Events for real-time updates
- Tag messages: `__MESSAGE__`, `__TOOL_USE__`, `__ERROR__`
- Never block UI - always stream progress

### 4. Maintain Audit Trails
- Log every agent decision with reasoning
- Record fallbacks and manual overrides
- Enable learning from outcomes

### 5. Hierarchical Error Handling
```
Try AI Model (Pro for complex, Flash for fast)
  ↓ Fail
Try Alternative Model
  ↓ Fail
Try Fallback Template/Data
  ↓ Fail
Alert human & request manual intervention
```

### 6. Model Selection Strategy
```
Market Analysis: Gemini Flash + WebSearch/WebFetch
Offer Generation: Gemini Pro + Claude Code
Validation: Gemini Flash (quick check)
Content Creation: Gemini Pro for text + Gemini Image for visuals
```

---

## FILE REFERENCES FOR IMPLEMENTATION

### AI-Skills-Directory (Governance & Decision Patterns)
- **Org Chart Model**: `/tmp/2050xfs-repos/AI-Skills-Directory/constants.ts` (Lines 132-350)
- **Agent Profiles**: `/tmp/2050xfs-repos/AI-Skills-Directory/types.ts` (Lines 44-67)
- **Event Logging**: `/tmp/2050xfs-repos/AI-Skills-Directory/types.ts` (Lines 26-36)
- **Intent Matching**: `/tmp/2050xfs-repos/AI-Skills-Directory/services/geminiService.ts` (Lines 15-46)
- **Code Auditing**: `/tmp/2050xfs-repos/AI-Skills-Directory/services/geminiService.ts` (Lines 49-79)
- **Content Generation**: `/tmp/2050xfs-repos/AI-Skills-Directory/services/geminiService.ts` (Lines 82-138)
- **Admin Dashboard**: `/tmp/2050xfs-repos/AI-Skills-Directory/components/AdminConsole.tsx` (Full file)

### ai-site-builder (Orchestration & Streaming Patterns)
- **Claude Code Integration**: `/tmp/2050xfs-repos/ai-site-builder/lovable-clone-main/lovable-ui/lib/claude-code.ts`
- **API Route**: `/tmp/2050xfs-repos/ai-site-builder/lovable-clone-main/lovable-ui/app/api/generate-daytona/route.ts`
- **Sandbox Orchestration**: `/tmp/2050xfs-repos/ai-site-builder/lovable-clone-main/lovable-ui/scripts/generate-in-daytona.ts`
- **Frontend UI**: `/tmp/2050xfs-repos/ai-site-builder/lovable-clone-main/lovable-ui/app/generate/page.tsx`

### codex-site-builder (Minimal Template)
- **Package Config**: `/tmp/2050xfs-repos/codex-site-builder/web/package.json`
- **Layout Template**: `/tmp/2050xfs-repos/codex-site-builder/web/src/app/layout.tsx`

