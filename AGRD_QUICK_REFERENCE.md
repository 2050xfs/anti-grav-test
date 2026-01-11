# AGRD Quick Reference: Key Patterns & Files

## Three Repositories Analyzed

### 1. AI-Skills-Directory
**Purpose**: Multi-agent governance system for AI capability registry
**Key Pattern**: Hierarchical agent organization with decision rights and event logging

**Critical Files**:
- `constants.ts` - Org chart with 7 agent types (ARCHITECT, ECONOMIST, SENTINEL, JANITOR, CURATOR, HERALD, ARTIST)
- `services/geminiService.ts` - AI orchestration (intent matching, security audit, content generation)
- `types.ts` - Data models (Skill, BlogPost, AgentLog, AgentProfile)
- `components/AdminConsole.tsx` - Dashboard with Neural Architecture, Live Logs, Manual Audit tabs

**Reusable Patterns**:
- Intent matching (use Flash model) → Fallback to fuzzy search
- Schema-based JSON generation (guaranteed structure)
- Parallel execution with sequential UX
- Event logging with severity & action tracking

### 2. ai-site-builder
**Purpose**: Autonomous code generation via Claude Code SDK + Daytona sandbox
**Key Pattern**: Multi-step orchestration with real-time message streaming

**Critical Files**:
- `lovable-ui/app/api/generate-daytona/route.ts` - Spawns sandbox, streams messages
- `lovable-ui/scripts/generate-in-daytona.ts` - Sandbox setup & Claude Code execution
- `lovable-ui/lib/claude-code.ts` - SDK wrapper with tool permissions
- `lovable-ui/app/generate/page.tsx` - Frontend UI with SSE streaming

**Reusable Patterns**:
- Spawn child process → Parse __TAGGED__ messages → Stream via SSE
- Daytona sandbox lifecycle (create → setup → install → execute → cleanup)
- Claude Code query() with specific tool permissions
- Real-time message collection with auto-scroll

### 3. codex-site-builder
**Purpose**: Minimal Next.js template for AI-generated apps
**Key Pattern**: Minimal, clean baseline without bloat

**Critical Files**:
- `package.json` - Next.js 15, React 19, Tailwind CSS v4
- `src/app/layout.tsx`, `page.tsx` - Clean app router structure

---

## AGRD Application Mapping

### Strategy Brain (Decision Making) ← AI-Skills-Directory
```
Pattern: Hierarchical Agents with Decision Rights
├── Market Analysis Agent (like CURATOR)
│   └── Decisions: Opportunity ranking, market segment selection
├── Product Strategy Agent (like ARCHITECT)
│   └── Decisions: Product roadmap, feature prioritization
├── Offer Generation Agent (like HERALD)
│   └── Decisions: Offer narrative, pricing strategy
└── Validation Agent (like SENTINEL)
    └── Decisions: Market viability, financial risk approval

Implementation:
- Log all decisions with observation, risk score, action
- Use Gemini Flash for fast filtering
- Use Gemini Pro for complex strategy
- Maintain audit trail of all decisions
```

### Offer & Product Cell (Generation) ← ai-site-builder
```
Pattern: Sandbox Orchestration + Message Streaming
1. Receive request from Strategy Brain
2. Spawn isolated sandbox (Daytona or equivalent)
3. Install Claude Code SDK
4. Run generation with query() - maxTurns: 20
5. Stream progress messages back:
   - __MARKET_ANALYSIS__ → { findings, trends, opportunities }
   - __OFFER_GENERATED__ → { value_prop, pricing, segments }
   - __VALIDATION__ → { viability_score, risks, actions }
6. Return structured offer artifact

Tool Permissions:
- Read: Analyze past offers, market data
- Write: Create offer documents
- Edit: Revise based on feedback
- Bash: Run simulations
- WebSearch/WebFetch: Current market data (if needed)
```

### Agent Coordination ← Both
```
Pattern: Async multi-agent execution with fallbacks
- Run agents in parallel when independent (Promise.all)
- Show sequential steps in UI (cinematic effect)
- Fallback: Primary → Secondary → Manual override
- Dashboard: Real-time status, activity logs, manual controls
```

---

## Code Snippets for AGRD

### 1. Agent Profile Definition (Strategy Brain)

```typescript
// Adapt from AI-Skills-Directory/types.ts
interface AgentProfile {
  id: string;
  name: string;
  role: string;
  purpose: string;
  tasks: string[];
  status: 'active' | 'idle' | 'processing' | 'learning';
  decisions: string[];  // Authority boundaries
}

// Example agents
const MARKET_ANALYST: AgentProfile = {
  id: 'ANALYST-01',
  name: 'Market Analyst',
  role: 'Market Intelligence & Opportunity Identification',
  purpose: 'Evaluate market signals and identify growth opportunities',
  tasks: [
    'Analyze market trends',
    'Evaluate customer segments',
    'Assess competitive landscape',
    'Rank opportunities by ROI'
  ],
  status: 'active',
  decisions: ['PURSUE', 'DEFER', 'REJECT']
};

const OFFER_GENERATOR: AgentProfile = {
  id: 'OFFER-GEN-01',
  name: 'Offer Generator',
  role: 'Product Offering Creation',
  purpose: 'Create compelling and viable product offers',
  tasks: [
    'Generate offer narratives',
    'Calculate pricing models',
    'Define success metrics',
    'Create implementation timeline'
  ],
  status: 'processing',
  decisions: ['CREATE', 'REVISE', 'CANCEL']
};
```

### 2. Decision Event Logging (Strategy Brain)

```typescript
// Adapt from AI-Skills-Directory/types.ts
interface OfferDecisionLog {
  id: string;
  timestamp: string;
  agentId: string;
  eventType: 'MARKET_ANALYSIS' | 'OPPORTUNITY_IDENTIFIED' | 'OFFER_GENERATED' | 
            'VALIDATION' | 'PRICING_SET' | 'PUBLISHED' | 'REJECTED';
  observation: string;
  riskScore?: number;  // 0-100
  actionTaken: string;
  decision?: {
    choice: string;  // PURSUE, REJECT, DEFER
    rationale: string;
    confidence: number;  // 0-100
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  metadata?: Record<string, any>;
}

// Example log entry
const exampleLog: OfferDecisionLog = {
  id: 'log-2024-01-15-001',
  timestamp: new Date().toISOString(),
  agentId: 'ANALYST-01',
  eventType: 'OPPORTUNITY_IDENTIFIED',
  observation: 'SaaS market expanding 15% YoY, customer demand for API governance high',
  riskScore: 25,
  actionTaken: 'ESCALATE_TO_OFFER_GEN',
  decision: {
    choice: 'PURSUE',
    rationale: 'High market growth, low competitive intensity, clear use case',
    confidence: 85
  },
  severity: 'low'
};
```

### 3. Offer Generation Sandbox (Offer Cell)

```typescript
// Adapt from ai-site-builder/generate-in-daytona.ts
import { Daytona } from "@daytonaio/sdk";
import { query } from "@anthropic-ai/claude-code";

async function generateOffer(offerPrompt: string) {
  const daytona = new Daytona({ apiKey: process.env.DAYTONA_API_KEY });
  
  // 1. Create sandbox
  const sandbox = await daytona.create({
    public: true,
    image: "node:20"
  });
  
  // 2. Setup
  const rootDir = await sandbox.getUserRootDir();
  const offerDir = `${rootDir}/offer-gen`;
  await sandbox.process.executeCommand(`mkdir -p ${offerDir}`, rootDir);
  
  // 3. Install dependencies
  await sandbox.process.executeCommand(
    "npm init -y && npm install @anthropic-ai/claude-code",
    offerDir,
    undefined,
    180000
  );
  
  // 4. Create generation script
  const script = `
    const { query } = require('@anthropic-ai/claude-code');
    
    async function generateOffer() {
      const prompt = \`${offerPrompt}
      
      Generate structured offer with:
      - Value proposition
      - Target segments
      - Pricing models
      - Success metrics
      - Implementation timeline
      \`;
      
      const messages = [];
      for await (const message of query({
        prompt: prompt,
        options: {
          maxTurns: 20,
          allowedTools: ['Read', 'Write', 'Edit', 'Bash']
        }
      })) {
        messages.push(message);
        console.log('__MESSAGE__', JSON.stringify(message));
      }
      
      return messages;
    }
    
    generateOffer();
  `;
  
  await sandbox.process.executeCommand(
    `cat > generate.js << 'EOF'\n${script}\nEOF`,
    offerDir
  );
  
  // 5. Run generation
  const result = await sandbox.process.executeCommand(
    "node generate.js",
    offerDir,
    { ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY },
    600000  // 10 minute timeout
  );
  
  return result;
}
```

### 4. Message Streaming (Backend → Frontend)

```typescript
// Adapt from ai-site-builder route.ts
export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();
  
  (async () => {
    try {
      const child = spawn("npx", ["tsx", "generate-offer.ts", prompt]);
      
      child.stdout.on("data", async (data) => {
        const lines = data.toString().split('\n');
        for (const line of lines) {
          if (line.includes('__MESSAGE__')) {
            const json = line.substring(line.indexOf('{'));
            const message = JSON.parse(json);
            
            // Stream each message type
            await writer.write(encoder.encode(
              `data: ${JSON.stringify({
                type: message.type,
                content: message.text,
                tool: message.name,
                input: message.input
              })}\n\n`
            ));
          }
        }
      });
      
      await new Promise((resolve, reject) => {
        child.on("exit", (code) => {
          if (code === 0) resolve(code);
          else reject(new Error(`Failed: ${code}`));
        });
      });
      
      await writer.write(encoder.encode("data: [DONE]\n\n"));
    } finally {
      await writer.close();
    }
  })();
  
  return new Response(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache"
    }
  });
}
```

### 5. Frontend Message Collection

```typescript
// Adapt from ai-site-builder generate/page.tsx
const [messages, setMessages] = useState<GenerationMessage[]>([]);
const [isGenerating, setIsGenerating] = useState(false);
const messagesEndRef = useRef<HTMLDivElement>(null);

interface GenerationMessage {
  type: 'agent_thinking' | 'market_analysis' | 'offer_generated' | 
        'tool_use' | 'error' | 'complete';
  content?: string;
  toolName?: string;
  toolInput?: any;
}

const streamOffer = async (offerPrompt: string) => {
  setIsGenerating(true);
  const response = await fetch('/api/generate-offer', {
    method: 'POST',
    body: JSON.stringify({ prompt: offerPrompt })
  });
  
  const reader = response.body?.getReader();
  const decoder = new TextDecoder();
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    
    const chunk = decoder.decode(value);
    for (const line of chunk.split('\n')) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        if (data === '[DONE]') {
          setIsGenerating(false);
          break;
        }
        
        const message = JSON.parse(data);
        setMessages(prev => [...prev, message]);
      }
    }
  }
};

// Auto-scroll as messages arrive
useEffect(() => {
  messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [messages]);
```

---

## Model Selection Strategy

| Task | Model | Speed | Cost | Use Case |
|------|-------|-------|------|----------|
| Market filtering | Gemini Flash | Fast | Low | Rank opportunities, quick analysis |
| Strategic analysis | Gemini Pro | Slow | High | Complex decisions, offer strategy |
| Offer validation | Gemini Flash | Fast | Low | Risk assessment, feasibility check |
| Content generation | Gemini Pro | Slow | Medium | Offer narrative, messaging |
| Visual assets | Gemini Image | Medium | Medium | Offer mockups, product visuals |

---

## Fallback Strategy

```
Generate Offer
├─ Try: Gemini Pro with Schema ✓
├─ Fallback: Gemini Flash without schema
├─ Fallback: Use template + manual fill-in
└─ Fallback: Return error, request manual creation

Validate Offer
├─ Try: Gemini Pro analysis ✓
├─ Fallback: Gemini Flash quick check
├─ Fallback: Basic rule-based validation
└─ Fallback: Mark as "needs human review"

Stream Updates
├─ Try: Real-time SSE streaming ✓
├─ Fallback: Polling every 2 seconds
├─ Fallback: Batch updates at completion
└─ Fallback: Show "processing" message
```

---

## Dashboard Components (from AdminConsole)

**Strategy Brain Dashboard Should Include**:

1. **Agent Neural Architecture**
   - Org chart with divisions (Executive, Market, Product, Validation)
   - Agent cards: name, role, status, current tasks
   - Inspector panel with agent decisions & authority

2. **Live Activity Stream**
   - Timeline of all decisions with timestamps
   - Activity volume chart (24h view)
   - Quick stats: offers generated, validations passed/failed

3. **Manual Audit/Override**
   - Review pending offers
   - Override agent decisions
   - Inject market data
   - Emergency controls

---

## File Locations (Reference)

**AI-Skills-Directory**:
- `/tmp/2050xfs-repos/AI-Skills-Directory/constants.ts` - Org chart & data
- `/tmp/2050xfs-repos/AI-Skills-Directory/services/geminiService.ts` - AI patterns
- `/tmp/2050xfs-repos/AI-Skills-Directory/types.ts` - Data models
- `/tmp/2050xfs-repos/AI-Skills-Directory/components/AdminConsole.tsx` - Dashboard

**ai-site-builder**:
- `/tmp/2050xfs-repos/ai-site-builder/lovable-clone-main/lovable-ui/app/api/generate-daytona/route.ts` - API
- `/tmp/2050xfs-repos/ai-site-builder/lovable-clone-main/lovable-ui/scripts/generate-in-daytona.ts` - Sandbox setup
- `/tmp/2050xfs-repos/ai-site-builder/lovable-clone-main/lovable-ui/lib/claude-code.ts` - SDK wrapper
- `/tmp/2050xfs-repos/ai-site-builder/lovable-clone-main/lovable-ui/app/generate/page.tsx` - Frontend

**codex-site-builder**:
- `/tmp/2050xfs-repos/codex-site-builder/web/package.json` - Minimal template

---

## Key Takeaways

1. **Hierarchical Decision-Making**: AI agents with clear roles, tasks, and decision boundaries
2. **Transparent Logging**: Every decision logged with rationale, risk, and action
3. **Isolated Execution**: Sandbox each generation task with timeout management
4. **Real-Time Streaming**: SSE to show progress, never block UI
5. **Fallback Chains**: Always have secondary and manual options
6. **Structured Output**: Schema-based JSON from Gemini for guaranteed parsing
7. **Multi-Model Strategy**: Flash for speed, Pro for complex reasoning
8. **Audit Trail**: Enable learning from outcomes and decision reversals

