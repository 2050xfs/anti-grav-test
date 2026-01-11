# AGRD Pattern Summary: Quick Reference

## Key Repositories Analyzed

1. **wild-gibbon-roll** - Multi-stage video generation with task orchestration
2. **particles** - Real-time gesture-based 3D rendering
3. **seta-resources** - Data filtering and export
4. **Ebook-creator** - Multi-step LLM workflow with extended thinking
5. **campaign-OS** - Conversational AI for campaign generation
6. **Rice** - Next.js with Genkit AI integration

---

## Critical Patterns for AGRD Implementation

### 1. Multi-Step Workflow Orchestration (wild-gibbon-roll)

**Key File**: `/supabase/functions/veo-build/index.ts`

**Pattern**:
```typescript
function orchestrateWorkflow(input) {
  // 1. Validate input with guardrails
  if (!isValid(input)) throw new Error("Invalid input");
  
  // 2. Transform/enrich
  const enriched = enrich(input);
  
  // 3. Compose (template-driven)
  const prompts = buildPrompts(enriched);
  
  // 4. Validate output (compliance checks)
  const { warnings } = validate(prompts);
  
  // 5. Add version fingerprint for reproducibility
  const fingerprint = sha256(JSON.stringify(prompts));
  
  return { prompts, fingerprint, warnings };
}
```

**Why This Matters**:
- Clear checkpoints for error recovery
- Versioning enables reproducibility
- Confidence scores guide human review
- Server-side guardrails prevent invalid downstream calls

---

### 2. Asynchronous Task Management (wild-gibbon-roll)

**Key File**: `/supabase/functions/poll-video-tasks/index.ts`

**Pattern**:
```typescript
// Create task (get ID)
const { taskId } = await createTask(prompt);

// Poll status periodically
async function pollTask(taskId) {
  let tries = 0;
  while (tries < 60) {
    const result = await getStatus(taskId);
    
    // Handle enum states
    if (result.status === 1) {  // success
      const video = await downloadVideo(result.url);
      await updateDB({ status: 'ready', video_url: video });
      return;
    }
    if (result.status === 2 || 3) {  // failed
      await updateDB({ status: 'failed', error: result.msg });
      return;
    }
    
    // Wait before retry
    await new Promise(r => setTimeout(r, 4000));
    tries++;
  }
}
```

**Why This Matters**:
- Handles external service latency
- Batch processing of multiple tasks
- Side effects (download, store) only on success
- Timeout protection prevents infinite loops

---

### 3. State Management with Zustand (wild-gibbon-roll)

**Key File**: `/src/features/ugc/state/ugcStore.ts`

**Pattern**:
```typescript
const useStore = create((set, get) => ({
  // State
  scenes: [],
  sceneStatus: {},
  
  // Actions
  addScene: (scene) => set(state => ({ 
    scenes: [...state.scenes, scene],
    sceneStatus: { ...state.sceneStatus, [scene.id]: 'idle' }
  })),
  
  // Async actions with polling
  generateScene: async (sceneId) => {
    set(state => ({ sceneStatus: { ...state.sceneStatus, [sceneId]: 'pending' } }));
    
    const result = await fetch('/generate', { body: JSON.stringify(scene) });
    
    set(state => ({ 
      sceneStatus: { ...state.sceneStatus, [sceneId]: 'ready' } 
    }));
  },
  
  // Polling loop
  pollStitch: async () => {
    while (true) {
      const data = await getStatus(get().stitchJob.id);
      set({ stitchJob: { ...get().stitchJob, status: data.status } });
      
      if (data.status === 'done') break;
      await new Promise(r => setTimeout(r, 4000));
    }
  }
}));
```

**Why This Matters**:
- Centralized state mutations
- Async actions that trigger polling
- Clear status transitions
- DevTools compatibility for debugging

---

### 4. Real-Time Subscriptions (wild-gibbon-roll)

**Key File**: `/src/features/ugc/hooks/useSceneVersionsSubscription.ts`

**Pattern**:
```typescript
function useRealtimeUpdates(ids, onUpdate) {
  useEffect(() => {
    const subscription = supabase
      .channel('table_name')
      .on(
        'postgres_changes',
        {
          event: '*',  // INSERT, UPDATE, DELETE
          table: 'my_table',
          filter: `id=in.(${ids})`
        },
        (payload) => {
          onUpdate({
            type: payload.eventType,
            new: payload.new,
            old: payload.old
          });
        }
      )
      .subscribe();
    
    return () => subscription.unsubscribe();
  }, [ids, onUpdate]);
}
```

**Why This Matters**:
- Push updates from database
- Reactive UI without polling
- Automatic reconnection
- Efficient filtering on server

---

### 5. Structured LLM Output with Schema (Ebook-creator)

**Key File**: `/geminiService.ts`

**Pattern**:
```typescript
const response = await ai.generateContent({
  model: 'gemini-3-pro-preview',
  contents: prompt,
  config: {
    // Extended thinking for complex reasoning
    thinkingConfig: { thinkingBudget: 2048 },
    
    // Force JSON output with schema validation
    responseMimeType: "application/json",
    responseSchema: {
      type: Type.OBJECT,
      properties: {
        painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
        solutions: { type: Type.ARRAY, items: { type: Type.STRING } },
        hormoziOffer: {
          type: Type.OBJECT,
          properties: {
            dreamOutcome: { type: Type.STRING },
            perceivedLikelihood: { type: Type.STRING }
          }
        }
      }
    }
  }
});

// Safe parsing
try {
  const parsed = JSON.parse(response.text);
  // Type-safe data access
  const dreams = parsed.hormoziOffer.dreamOutcome;
} catch (e) {
  // Fallback to default
}
```

**Why This Matters**:
- Guaranteed JSON structure
- Type-safe parsing
- Schema validation in model
- Fallback handling

---

### 6. Multi-Modal Content Generation (Ebook-creator, campaign-OS)

**Pattern**:
```typescript
// Step 1: Generate text with extended thinking
const research = await performMarketResearch(keyword);

// Step 2: Use result in next step
const outline = await generateOutline(keyword, research);

// Step 3: Generate cover image
const coverImage = await generateImage(outline.coverPrompt);

// Step 4: Edit image based on feedback
const refinedImage = await editImage(coverImage, userFeedback);

// Step 5: Combine all outputs
return {
  research,
  outline,
  coverImage: refinedImage,
  chapters: await Promise.all(outline.sections.map(writeChapter))
};
```

**Why This Matters**:
- Context flows through pipeline
- Different models for different tasks
- Parallel processing where possible
- Single source of truth per step

---

### 7. Conversational Data Collection (campaign-OS)

**Key File**: `/geminiService.ts`

**Pattern**:
```typescript
// Multi-turn conversation
const messages = [
  { role: 'user', parts: [{ text: "Create a campaign" }] },
  { role: 'model', parts: [{ text: "What's your brand name?" }] },
  { role: 'user', parts: [{ text: "Acme Corp" }] },
  { role: 'model', parts: [{ text: "What's your target audience?" }] }
];

// Get next response
const response = await getOnboardingResponse(messages);
// "Female entrepreneurs aged 25-35 interested in SaaS"

// Extract structured data when complete
const campaignData = await extractCampaignData(messages);
// { brandName: "Acme Corp", targetAudience: "Female entrepreneurs..." }
```

**Why This Matters**:
- Natural data collection
- Multi-turn context preservation
- Conversion to structured format
- Completion signal ([COMPLETE])

---

### 8. High-Frequency State Without React Re-renders (particles)

**Key File**: `/App.tsx`

**Pattern**:
```typescript
// Configuration state (low-frequency)
const [config, setConfig] = useState({ template, color, count });

// Sensor data ref (high-frequency, no re-renders)
const sensorRef = useRef({
  left: { x: 0, y: 0, pinch: 0 },
  right: { x: 0, y: 0, pinch: 0 }
});

// Update without triggering React
const handleSensorUpdate = (data) => {
  sensorRef.current = data;  // Mutation, no setState
};

// In 3D loop
function useFrame() {
  const current = sensorRef.current;  // Read latest sensor data
  updateParticles(current);
}
```

**Why This Matters**:
- Avoids React re-render overhead
- Maintains 60+ FPS for real-time updates
- Config changes still trigger renders
- Refs for imperatively updated data

---

### 9. Webhook + Polling Hybrid (wild-gibbon-roll)

**Pattern**:
```typescript
// External service calls webhook when done
POST /webhook → upsert(status: 'ready', video_url)

// Meanwhile, polling loop checks periodically
while (true) {
  const task = getTask(taskId);
  if (task.status === 'ready') {
    // Webhook already updated, or poll found it
    break;
  }
  await wait(4000);  // 4s poll interval
}
```

**Why This Matters**:
- Webhook handles fast updates
- Polling is fallback safety net
- Idempotent upserts prevent duplicates
- Converges on success regardless of path

---

### 10. Template Configuration Map (particles, Ebook-creator)

**Pattern**:
```typescript
const TEMPLATE_CONFIG = {
  'bubbles': { size: 0.5, speed: 1.0, opacity: 0.6 },
  'fireworks': { size: 0.2, speed: 3.0, opacity: 1.0 },
  'saturn': { emoji: '🪐', size: 1.0, speed: 0.5 }
};

// Runtime switching without code changes
const config = TEMPLATE_CONFIG[selectedTemplate];
renderParticles(config);

// Same pattern for:
const CATEGORY_SCENES = {
  'beverage': ['hero shot', 'on-the-go', 'reaction'],
  'skincare': ['mirror selfie', 'application', 'glow']
};
```

**Why This Matters**:
- Configuration-driven behavior
- Easy A/B testing
- No deployment needed for config changes
- Type-safe lookups

---

## Tech Stack Recommendations

```
Frontend:
  - React 18 + TypeScript
  - Zustand for state
  - TanStack Query for async
  - Tailwind + shadcn/ui for UI
  - React Three Fiber for 3D (if needed)

Backend:
  - Supabase (PostgreSQL + Edge Functions)
  - Deno for Edge Functions
  - Genkit/Anthropic for AI orchestration

AI:
  - Google Gemini (Pro, Flash, Imagen)
  - Extended thinking for complex reasoning
  - Structured JSON outputs

Real-time:
  - Supabase subscriptions
  - Webhooks for external services
  - Polling with exponential backoff
```

---

## Implementation Checklist for AGRD

- [ ] Design state machine for agent workflows
- [ ] Implement Zustand store with async actions
- [ ] Set up Supabase Edge Functions for orchestration
- [ ] Create polling loop with timeout protection
- [ ] Implement real-time subscriptions for UI updates
- [ ] Configure Genkit with structured outputs
- [ ] Add extended thinking for complex reasoning
- [ ] Implement webhook handlers for external services
- [ ] Create conversion script (status updates to UI)
- [ ] Add error recovery and fallback paths

---

## References

All code examples and patterns are derived from:

- `/tmp/2050xfs-repos/wild-gibbon-roll/` - Workflow orchestration
- `/tmp/2050xfs-repos/particles/` - Real-time updates
- `/tmp/2050xfs-repos/Ebook-creator/` - LLM workflows
- `/tmp/2050xfs-repos/campaign-OS/` - Conversational agents
- `/tmp/2050xfs-repos/Rice/` - Next.js + Genkit
- `/tmp/2050xfs-repos/seta-resources/` - Data filtering

See `REPOSITORY_ANALYSIS_FOR_AGRD.md` for complete details.
