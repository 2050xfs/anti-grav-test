# Repository Analysis for AGRD (Autonomous Growth & Revenue Department)
## Comprehensive Pattern Extraction Report

---

## Executive Summary

This analysis covers 5 key repositories, extracting patterns relevant to building autonomous agent systems. The repositories demonstrate sophisticated patterns for:

1. **Multi-step workflow orchestration** (wild-gibbon-roll)
2. **Real-time reactive systems** (particles)
3. **AI service integration** (Ebook-creator, campaign-OS, Rice)
4. **State management & persistence** (wild-gibbon-roll with Zustand + Supabase)
5. **Asynchronous task management** (wild-gibbon-roll polling/webhook patterns)
6. **Data-driven decision making** (autofill, analysis, compliance systems)

---

# REPOSITORY ANALYSIS

---

## 1. WILD-GIBBON-ROLL: Multi-Stage Video Generation Orchestration

### Overview
**Purpose**: User-Generated Content (UGC) video production platform with AI-driven creative brief generation, video/image synthesis, and video stitching.

**Problem Solved**: 
- Streamlines the creation of professional UGC videos from a single product image
- Automates script generation, scene composition, and final video stitching
- Provides real-time tracking of generation tasks

### Architecture & Key Files

```
wild-gibbon-roll/
├── supabase/functions/          # Edge functions (Deno-based)
│   ├── veo-build/               # Builds VEO-compatible JSON prompts
│   ├── create-video-task/       # KIE AI video task creation
│   ├── create-image-task/       # Image generation proxy
│   ├── analyze-image/           # Vision analysis via OpenAI GPT-4o
│   ├── autofill-from-image/     # Creative brief generation
│   ├── poll-video-tasks/        # Async task polling
│   ├── reels-stitch/            # Video composition (Shotstack)
│   └── shotstack-webhook/       # Render status tracking
├── src/
│   ├── types/ugc.ts             # Domain types
│   ├── features/ugc/
│   │   ├── state/ugcStore.ts    # Zustand state (scenes, versions, jobs)
│   │   ├── hooks/
│   │   │   ├── useAutofillFromImage.ts
│   │   │   ├── usePromptLibrary.ts
│   │   │   ├── useSceneVersionsSubscription.ts
│   │   └── pages/UgcStudio.tsx
│   └── utils/veo/
│       ├── promptBuilder.ts      # Prompt composition logic
│       └── promptTypes.ts
└── package.json                  # TanStack Query, Zustand, shadcn/ui
```

**Key Configuration Files**:
- `/package.json`: React 18, React Router, Zustand, TanStack Query
- `/supabase/migrations/`: 4 SQL migrations for scenes, versions, renders, prompts tables

### Relevant Patterns for AGRD

#### 1. **Multi-Step Workflow Orchestration**

**Pattern**: Sequential function composition with state checkpoints

**Implementation** (`veo-build/index.ts`):
```typescript
// Server-side prompt template building
function buildVeoJSONScenes(args): VeoJSONPrompt[] {
  // Validates input constraints (1-6 scenes, valid aspect)
  // Builds structured prompt with:
  //   - Base keywords (aspect-specific)
  //   - Talent descriptions
  //   - Style/camera/lighting guidance
  //   - Compliance checks for regulated terms
  // Returns array of scene prompts + fingerprint
}
```

**Key Insight**: Each workflow stage has:
- Input validation with guardrails
- Version tracking (SHA256 fingerprint)
- Idempotent composition
- Server-side guards (constrains input before forwarding)

#### 2. **Decision Logic with External Validation**

**Pattern**: Image analysis → auto-complete creative brief

**Implementation** (`autofill-from-image/index.ts`):
```typescript
serve(async (req) => {
  // 1) Analyze image (vision AI extraction)
  const vision = {
    text: ["BrandX", "Zero Sugar", "SPF 30"],
    labels: ["beverage", "can"],
    colors: randomPalette(),
    envHints: ["kitchen", "daylight"]
  };
  
  // 2) Infer product category → scene templates
  const product = { brand, name, category, claims };
  const sceneTemplates = CATEGORY_SCENES[product.category];
  
  // 3) Build creative brief (structured template)
  const creative_brief = {
    product, palette, aspect, numScenes, influencer, themeHint
  };
  
  // 4) Compliance check (regulated terms detection)
  const { warnings, disclaimers } = compliance(product, vision);
  
  // 5) Return confidence scores + warnings
  return { creative_brief, scenes, confidence, warnings };
});
```

**Pattern Name**: "Analyze-Infer-Compose-Validate"

**Key for AGRD**: Demonstrates autonomous decision-making with human review gates (confidence scores + warnings).

#### 3. **Asynchronous Task Management with Polling**

**Pattern**: Create task → Poll status → Download → Update DB

**Implementation** (`poll-video-tasks/index.ts`):
```typescript
serve(async (req) => {
  // Get all pending tasks
  const { data: tasks } = await supabase
    .from("video_tasks")
    .select("*")
    .eq("status", "pending");
  
  let updated = 0;
  for (const task of tasks) {
    // Poll KIE AI for status
    const res = await fetch(`${KIE_BASE}/api/v1/veo/record-info?taskId=${task.task_id}`);
    const result = await res.json();
    
    // Handle status transitions: 0=generating, 1=success, 2/3=failed
    if (data.successFlag === 1 && data.resultUrls) {
      // Download video, store in Supabase
      const supabaseUrl = await downloadAndStoreVideo(kieVideoUrl, task.task_id);
      
      // Update DB with result + metadata
      await supabase
        .from("video_tasks")
        .update({
          status: "ready",
          video_url: supabaseUrl,
          kie_ai_credits: data.creditsConsumed,
          updated_at: new Date().toISOString()
        })
        .eq("id", task.id);
      updated++;
    }
  }
  return { updated };
});
```

**Key Pattern**: 
- External service task tracking via ID
- Status polling with exponential backoff
- Side effects: download, store, update DB
- Batch processing with error tolerance

#### 4. **State Management with Zustand + Polling**

**Implementation** (`ugcStore.ts`):
```typescript
export const useUgcStore = create<UgcState>((set, get) => ({
  scenes: [],
  sceneStatus: Record<string, SceneStatus>,
  versions: Record<string, SceneVersion[]>,
  selectedVersionIds: {},
  
  // State-driven generation
  generateScenes: () => {
    const brief = get().brief;
    const scenes = Array.from({ length: brief.numVideos }, (_, i) => ({
      id: `scene-${i + 1}`,
      index: i,
      prompt: `Scene ${i + 1} prompt goes here.`
    }));
    set({ scenes, sceneStatus });
  },
  
  // Stitching workflow
  startStitch: async ({ sceneUrls, order, transition, aspect }) => {
    const res = await fetch("/reels-stitch", { /* ... */ });
    set({ stitchJob: { renderId, status: "queued" } });
    get().pollStitch?.(); // Start polling
  },
  
  pollStitch: async () => {
    let done = false;
    let tries = 0;
    while (!done && tries < 60) {
      const data = await getRenderStatus(job.renderId);
      if (data.status === "done" && data.url) {
        set({ stitchJob: { status: "done", url: data.url } });
        done = true;
      }
      await new Promise(r => setTimeout(r, 4000)); // 4s poll interval
    }
  }
}));
```

**Key for AGRD**: Demonstrates state-driven orchestration with automatic polling loops, clear status transitions, and timeout handling.

#### 5. **Real-time Subscriptions for Reactive Updates**

**Implementation** (`useSceneVersionsSubscription.ts`):
```typescript
export function useSceneVersionsSubscription(sceneIds, onUpdate) {
  useEffect(() => {
    const channel = supabase
      .channel("scene_versions_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "scene_versions",
          filter: `scene_id=in.(${sceneIds.map(id => `"${id}"`).join(",")})`
        },
        (payload) => {
          onUpdate({ eventType: payload.eventType, new: payload.new, old: payload.old });
        }
      )
      .subscribe();
    
    return () => supabase.removeChannel(channel);
  }, [sceneIds, onUpdate]);
}
```

**Pattern**: Reactive event streaming from database → reactive UI updates

#### 6. **Webhook-Based Status Updates**

**Implementation** (`shotstack-webhook/index.ts`):
```typescript
serve(async (req) => {
  const payload = await req.json();
  
  // Upsert render status
  const { error } = await supabase
    .from("renders")
    .upsert({
      id: payload.id,
      status: payload.status,
      url: payload.url ?? null,
      updated_at: new Date().toISOString()
    });
});
```

**Pattern**: External service pushes status → DB upsert → reactive UI

### Reusable Code/Patterns for AGRD

1. **Prompt Template Builder** (`veo-build/index.ts`): 
   - Composable prompt construction with guardrails
   - Version fingerprinting for reproducibility

2. **Task Polling Loop** (`poll-video-tasks/index.ts`):
   - Status enum handling (pending → ready/failed)
   - Batch processing with side effects
   - Time-limited retries

3. **State-Driven Orchestration** (`ugcStore.ts`):
   - Clear state machine (idle → pending → ready/error)
   - Automatic polling triggers
   - Timeout handling

4. **Zustand Store Pattern**:
   ```typescript
   create((set, get) => ({
     // State
     data: initialValue,
     // Getters
     getData: () => get().data,
     // Mutations
     setData: (value) => set({ data: value }),
     // Async actions
     asyncAction: async () => {
       const result = await fetch(...);
       set({ data: result });
     }
   }))
   ```

### Tech Stack

| Category | Technologies |
|----------|---------------|
| **Frontend** | React 18, React Router, TypeScript, Tailwind CSS, shadcn/ui |
| **State** | Zustand, TanStack Query (React Query) |
| **Backend** | Supabase Edge Functions (Deno), Deno std library |
| **APIs** | KIE AI (video), OpenAI (vision/GPT-4o), Shotstack (video editing) |
| **Database** | PostgreSQL (Supabase), Real-time subscriptions |
| **HTTP** | Fetch API (Deno + browser), CORS handling |

---

## 2. PARTICLES: Real-Time Hand Gesture Detection & 3D Rendering

### Overview
**Purpose**: Interactive 3D particle system controlled by hand gestures via MediaPipe + Three.js

**Problem Solved**: 
- Real-time hand tracking from webcam
- Gesture-driven particle emission and control
- High-frequency updates without React re-renders (using refs)

### Architecture & Key Files

```
particles/
├── App.tsx                  # Root component, state management
├── components/
│   ├── HandTracker.tsx      # WebRTC video capture + MediaPipe processing
│   ├── ParticleSystem.tsx   # Three.js 3D particle engine
│   └── UI.tsx               # Control panel (template, color, count)
├── services/
│   └── mediapipe.ts         # MediaPipe HandLandmarker initialization
├── types.ts                 # ParticleTemplate, HandData, AppState
├── constants.ts             # Template configs, emoji textures
└── package.json             # React Three Fiber, Drei, MediaPipe
```

### Relevant Patterns for AGRD

#### 1. **High-Frequency State Updates Without React Re-renders**

**Pattern**: Mutable ref for sensor data, state for configuration

**Implementation** (`App.tsx`):
```typescript
const [appState, setAppState] = useState<AppState>({
  template: ParticleTemplate.BUBBLES,
  color: DEFAULT_COLOR,
  particleCount: 1000
});

// Mutable ref for high-frequency hand updates
const handDataRef = useRef<HandData>({
  left: { present: false, x: 0, y: 0, pinchDistance: 0 },
  right: { present: false, x: 0, y: 0, pinchDistance: 0 }
});

const handleHandUpdate = (data: HandData) => {
  handDataRef.current = data;  // No React re-render
};

return (
  <Canvas>
    <ParticleSystem 
      template={appState.template} 
      color={appState.color}
      handDataRef={handDataRef}  // Pass ref to 3D system
    />
  </Canvas>
);
```

**Key Insight**: Separates low-frequency configuration state from high-frequency sensor data. Particle engine reads `handDataRef.current` every frame without triggering React updates.

#### 2. **Sensor Integration Pattern**

**Implementation** (`services/mediapipe.ts`):
```typescript
export const initializeHandLandmarker = async (): Promise<HandLandmarker> => {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
  );
  
  const handLandmarker = await HandLandmarker.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
      delegate: "GPU"
    },
    runningMode: "VIDEO",
    numHands: 2
  });
  
  return handLandmarker;
};
```

**Pattern**: 
- Lazy initialization (singleton pattern)
- GPU acceleration delegate
- Streaming video processing mode

#### 3. **Template-Driven Configuration System**

**Implementation** (`constants.ts`):
```typescript
export const TEMPLATE_CONFIG: Record<ParticleTemplate, { 
  emoji?: string; 
  size: number; 
  speed: number; 
  opacity: number;
  blending?: string;
}> = {
  [ParticleTemplate.BUBBLES]: { size: 0.5, speed: 1.0, opacity: 0.6 },
  [ParticleTemplate.LOL]: { emoji: '😂', size: 0.8, speed: 1.5, opacity: 1.0 },
  [ParticleTemplate.FLOWERS]: { emoji: '🌸', size: 0.7, speed: 0.8, opacity: 1.0 },
  [ParticleTemplate.SATURN]: { emoji: '🪐', size: 1.0, speed: 0.5, opacity: 1.0 },
  [ParticleTemplate.FIREWORKS]: { size: 0.2, speed: 3.0, opacity: 1.0 }
};
```

**Pattern**: Configuration map enables runtime switching without code changes.

### Reusable Code/Patterns

1. **Mutable Ref for High-Frequency State**:
   ```typescript
   const sensorDataRef = useRef(initialValue);
   const updateSensor = (newValue) => { sensorDataRef.current = newValue; };
   // In useFrame/animate: const value = sensorDataRef.current;
   ```

2. **Template Configuration Pattern**:
   ```typescript
   const configs = Record<Type, Config> = { /* ... */ };
   const activeConfig = configs[activeType];
   ```

### Tech Stack

| Category | Technologies |
|----------|---------------|
| **Frontend** | React, TypeScript, Vite |
| **3D Rendering** | Three.js, React Three Fiber, Drei |
| **ML/Vision** | MediaPipe Tasks Vision (GPU-accelerated) |
| **Styling** | Tailwind CSS |

---

## 3. SETA-RESOURCES: Structured Data Management & PDF Generation

### Overview
**Purpose**: Community resource directory with filtering, categorization, and PDF export

**Problem Solved**: 
- Multi-dimensional filtering (category + text search + location)
- Dynamic PDF generation
- Real-time result counts

### Architecture & Key Files

```
seta-resources/
├── App.tsx                  # Main app with filtering logic
├── types.ts                 # Category enum, ResourceItem, ReferenceLink
├── data.ts                  # Hardcoded resource dataset
├── utils/
│   └── pdfGenerator.ts      # PDF export utility
└── components/
    ├── Header.tsx
    ├── CategoryFilter.tsx
    ├── ResourceCard.tsx
    └── InfoModal.tsx
```

### Relevant Patterns for AGRD

#### 1. **Multi-Stage Filtering with Count Calculation**

**Implementation** (`App.tsx`):
```typescript
// Stage 1: Base filter (text search + location)
const baseSearchResults = useMemo(() => {
  const searchTerms = searchQuery.toLowerCase().split(/\s+/).filter(t => t.length > 0);
  
  return resources.filter((resource) => {
    // Step A: Local filter
    if (showLocalOnly && resource.locationScope === 'regional') return false;
    
    // Step B: Text search
    if (searchTerms.length === 0) return true;
    const searchableText = `
      ${resource.name} 
      ${resource.category}
      ${resource.description} 
      ${resource.address || ''} 
      ${resource.phone || ''}
      ${resource.notes?.join(' ') || ''}
    `.toLowerCase();
    
    return searchTerms.every(term => searchableText.includes(term));
  });
}, [searchQuery, showLocalOnly]);

// Stage 2: Count categories
const categoryCounts = useMemo(() => {
  const counts: Record<string, number> = { All: baseSearchResults.length };
  baseSearchResults.forEach(r => {
    if (counts[r.category] !== undefined) counts[r.category]++;
  });
  return counts;
}, [baseSearchResults]);

// Stage 3: Apply category filter
const finalFilteredResources = useMemo(() => {
  if (selectedCategory === 'All') return baseSearchResults;
  return baseSearchResults.filter(r => r.category === selectedCategory);
}, [selectedCategory, baseSearchResults]);
```

**Key Pattern**: 
- Multi-stage memoized computation
- Each stage depends on previous (reactive chain)
- Category counts reflect current search state

#### 2. **Data Export Pattern**

**Implementation** (`pdfGenerator.ts`):
```typescript
export const generatePDF = (resources: ResourceItem[]) => {
  // Generate PDF from filtered dataset
  // Used in: <button onClick={() => generatePDF(finalFilteredResources)} />
};
```

### Tech Stack

| Category | Technologies |
|----------|---------------|
| **Frontend** | React, TypeScript, Tailwind CSS |
| **State** | React hooks (useState, useMemo) |
| **PDF Generation** | (pdfGenerator implementation) |

---

## 4. EBOOK-CREATOR: Multi-Step LLM-Driven Content Generation

### Overview
**Purpose**: AI-powered ebook creation platform using Google Gemini's extended thinking and image generation

**Problem Solved**: 
- Market research → Offer creation → Book structure → Chapter writing → Value stacking
- Multi-modal content generation (text + images)
- Real-time editing and refinement

### Architecture & Key Files

```
ebook-creator/
├── App.tsx                  # Main orchestrator
├── geminiService.ts         # AI service layer
├── types.ts                 # AspectRatio, ValueStack
└── components/
```

### Relevant Patterns for AGRD

#### 1. **Multi-Step AI Workflow with Extended Thinking**

**Implementation** (`geminiService.ts`):
```typescript
// STEP 1-3: Market Research
export const performMarketResearch = async (keyword: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `
      Step 1: Pain Points Analysis (10 points)
      Step 2: Solutions Generation
      Step 3: $100M Offer Creation (Alex Hormozi Framework)
      Return as JSON.
    `,
    config: {
      thinkingConfig: { thinkingBudget: 2048 },  // Extended reasoning
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          painPoints: { type: Type.ARRAY, items: { type: Type.STRING } },
          solutions: { type: Type.ARRAY, items: { type: Type.STRING } },
          hormoziOffer: { /* ... */ }
        }
      }
    }
  });
  return JSON.parse(response.text);
};

// STEP 4-5: Title & Outline
export const generateTitleAndOutline = async (keyword: string, researchData: any) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `
      Context: ${JSON.stringify(researchData)}
      
      Step 4: Title Generation (3 options)
      Step 5: Outline Building (6 sections, 3-5 bullets each)
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: { /* structured output */ }
    }
  });
  return JSON.parse(response.text);
};

// STEP 7: Chapter Writing
export const writeChapter = async (chapterTitle: string, bullets: string[], assetTitle: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',  // Flash for prose generation
    contents: `Write a 400-500 word chapter...`
  });
  return response.text;  // Markdown
};

// STEP 8: Value Stack
export const generateValueStack = async (title: string, keyword: string): Promise<ValueStack> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate 5 bonuses, 1 workbook, 1 OTO...`,
    config: {
      thinkingConfig: { thinkingBudget: 2048 },
      responseMimeType: "application/json"
    }
  });
  return JSON.parse(response.text);
};

// STEP 6: Cover Image
export const generateCoverImage = async (prompt: string, aspectRatio: AspectRatio = '3:4') => {
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: `Professional ebook cover, portrait orientation. ${prompt}...`,
    config: { numberOfImages: 1, aspectRatio, outputMimeType: 'image/jpeg' }
  });
  return `data:image/jpeg;base64,${response.generatedImages[0].image.imageBytes}`;
};

// Image Editing
export const editImageWithPrompt = async (imageBase64: string, prompt: string) => {
  const cleanBase64 = imageBase64.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } },
        { text: `Edit this image: ${prompt}...` }
      ]
    },
    config: { responseModalities: [Modality.IMAGE] }
  });
  return `data:image/png;base64,${response.candidates[0].content.parts[0].inlineData.data}`;
};
```

**Key Pattern**: 
- Sequential steps with shared context
- Model selection by use case (Pro for reasoning, Flash for prose, Imagen for images)
- Structured JSON output with schema validation
- Extended thinking budgets for complex reasoning

#### 2. **Multi-Modal Content Generation**

**Pattern**: Text generation → Image generation → Image editing

**Key for AGRD**: Demonstrates orchestration of different AI modalities in sequence.

### Reusable Code/Patterns

1. **Structured Output with Schema**:
   ```typescript
   config: {
     responseMimeType: "application/json",
     responseSchema: { 
       type: Type.OBJECT, 
       properties: { /* ... */ } 
     }
   }
   ```

2. **Context Chaining**:
   ```typescript
   const research = await performMarketResearch(keyword);
   const outline = await generateTitleAndOutline(keyword, research);
   const chapter = await writeChapter(outline.selectedTitle, outline.outline[0].bullets, title);
   ```

3. **Extended Thinking for Complex Reasoning**:
   ```typescript
   config: { thinkingConfig: { thinkingBudget: 2048 } }
   ```

### Tech Stack

| Category | Technologies |
|----------|---------------|
| **AI** | Google Gemini (Pro, Flash, Imagen) |
| **Frontend** | React, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui |

---

## 5. CAMPAIGN-OS: Enterprise GTM Strategy Generation

### Overview
**Purpose**: AI-powered go-to-market (GTM) campaign orchestration platform

**Problem Solved**: 
- Multi-channel campaign generation (landing pages, emails, SMS, automation flows)
- Conversational onboarding for campaign briefs
- Dynamic visual asset generation

### Architecture & Key Files

```
campaign-OS/
├── App.tsx                   # Multi-page app
├── geminiService.ts          # Campaign strategy service
├── types.ts                  # CampaignInput, CampaignResult, VisualAsset
```

### Relevant Patterns for AGRD

#### 1. **Conversational Data Collection**

**Implementation** (`geminiService.ts`):
```typescript
export const getOnboardingResponse = async (
  messages: { role: 'user' | 'model', parts: { text: string }[] }[], 
  campaignType: CampaignType
) => {
  const systemInstruction = `
    You are the "CampaignOS Strategic Consultant". 
    Conversationally extract 5 key pieces of info:
    1. Brand
    2. Audience
    3. Objective
    4. Features
    5. Tone
    Ask one at a time. 
    Once all five are captured, conclude strategically and append [COMPLETE].
  `;
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: messages,
    config: { systemInstruction }
  });
  
  return response.text;
};

export const extractCampaignData = async (
  messages: { role: 'user' | 'model', parts: { text: string }[] }[]
): Promise<Partial<CampaignInput>> => {
  const prompt = `Extract: brandName, targetAudience, objective, keyFeatures, tone. Return JSON only.`;
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [...messages, { role: 'user', parts: [{ text: prompt }] }],
    config: { responseMimeType: "application/json" }
  });
  return JSON.parse(response.text);
};
```

**Pattern**: 
- Multi-turn conversation for data collection
- Structured extraction from conversation
- System instruction for agentic behavior

#### 2. **Multi-Document + Multi-Asset Generation**

**Implementation** (`geminiService.ts`):
```typescript
export const generateCampaignStrategy = async (input: CampaignInput): Promise<CampaignResult> => {
  const strategyModel = 'gemini-3-pro-preview';
  
  const prompt = `
    Act as a World-Class GTM Strategist, Creative Director and CMO. 
    Create an all-in-one campaign execution package for: ${input.type}.
    
    PROJECT DETAILS:
    - Brand: ${input.brandName}
    - Audience: ${input.targetAudience}
    - Objective: ${input.objective}
    - Key Features: ${input.keyFeatures}
    - Tone: ${input.tone}
    
    Output JSON with two sections:
    
    DOCUMENTS (Markdown):
    - Strategy Document
    - Technical Spec
    - Performance Framework
    
    VISUAL ASSETS (Specific Formats):
    1. Sales Funnel: Full-page HTML (Tailwind CSS)
    2. Email/Newsletter: HTML email template
    3. SMS: List of text messages
    4. GTM Automation: Step-by-step logic flow
    
    Response format:
    {
      "campaignName": "string",
      "documents": [
        { "id": "strat", "title": "...", "category": "Strategy", "content": "Markdown..." },
        { "id": "tech", "title": "...", "category": "Technical", "content": "Markdown..." }
      ],
      "visualAssets": [
        { "id": "v1", "type": "html", "title": "...", "content": "HTML...", "description": "..." },
        { "id": "v2", "type": "html", "title": "...", "content": "HTML EMAIL...", "description": "..." },
        { "id": "v3", "type": "sms", "title": "...", "content": "SMS STRINGS...", "description": "..." },
        { "id": "v4", "type": "gtm_flow", "title": "...", "content": "LOGIC FLOW...", "description": "..." }
      ]
    }
  `;
  
  const response = await ai.models.generateContent({
    model: strategyModel,
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget: 32768 },  // Large thinking budget
      responseMimeType: "application/json"
    }
  });
  
  const parsed = JSON.parse(response.text || '{}');
  const result: CampaignResult = {
    campaignName: parsed.campaignName,
    documents: parsed.documents || [],
    visualAssets: parsed.visualAssets || []
  };
  
  // Generate hero image
  const imagePrompt = `A professional, high-end enterprise hero image for ${input.brandName}...`;
  const heroImage = await generateCampaignImage(imagePrompt);
  
  // Inject image into assets
  result.visualAssets = result.visualAssets.map(asset => {
    if (asset.type === 'html' && asset.content) {
      asset.content = asset.content.replace('[HERO_IMAGE]', heroImage);
    }
    return { ...asset, imageUrl: heroImage };
  });
  
  return result;
};
```

**Key Pattern**:
- Multi-modal output (Markdown + HTML + SMS + Logic)
- Placeholder replacement for post-generation asset injection
- Context propagation across sequential calls

### Tech Stack

| Category | Technologies |
|----------|---------------|
| **AI** | Google Gemini (Pro, Flash with extended thinking) |
| **Frontend** | React, TypeScript, Vite |
| **Styling** | Tailwind CSS, shadcn/ui |

---

## 6. RICE: Next.js with Genkit AI Integration

### Overview
**Purpose**: Next.js starter with Firebase and Genkit AI orchestration

**Problem Solved**: 
- Server-side AI integration in Next.js
- Booking system with webhook integration
- Firebase integration for content management

### Architecture & Key Files

```
Rice/
├── src/
│   ├── ai/
│   │   └── genkit.ts          # Genkit initialization
│   ├── services/
│   │   └── bookingService.ts  # Webhook integration
│   ├── content/               # Content data files
│   ├── config/                # Navigation config
│   └── app/                   # Next.js pages
└── package.json               # Next.js 15, Genkit, Firebase
```

### Relevant Patterns for AGRD

#### 1. **Server-Side AI Initialization**

**Implementation** (`src/ai/genkit.ts`):
```typescript
import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/googleai';

export const ai = genkit({
  plugins: [googleAI()],
  model: 'googleai/gemini-2.0-flash'
});
```

**Pattern**: Singleton AI instance for server-side flows

#### 2. **Webhook Integration for CRM**

**Implementation** (`src/services/bookingService.ts`):
```typescript
'use server'; // Mark for server-side execution

export async function submitBookingRequest(data: BookingFormData): Promise<void> {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error(`Webhook submission failed with status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error submitting booking request:', error);
    throw error;
  }
}
```

**Pattern**: Server actions for external API integration

### Tech Stack

| Category | Technologies |
|----------|---------------|
| **Frontend** | Next.js 15, React 18, TypeScript |
| **AI** | Genkit with Google AI plugin (Gemini 2.0) |
| **Database** | Firebase Firestore, Realtime DB |
| **Styling** | Tailwind CSS, shadcn/ui |
| **State** | TanStack Query (React Query) |

---

# CROSS-CUTTING PATTERNS FOR AGRD

## 1. **State Machine Pattern**

Appears in: wild-gibbon-roll, particles

```typescript
type Status = 'idle' | 'pending' | 'ready' | 'error';

// Clear transitions
sceneStatus[sceneId] = 'idle';     // Initial
sceneStatus[sceneId] = 'pending';  // In progress
sceneStatus[sceneId] = 'ready';    // Complete
sceneStatus[sceneId] = 'error';    // Failed
```

## 2. **Polling with Exponential Backoff**

Appears in: wild-gibbon-roll

```typescript
let tries = 0;
let done = false;
while (!done && tries < 60) {
  const data = await getRenderStatus(jobId);
  if (data.status === 'done') done = true;
  await new Promise(r => setTimeout(r, 4000));
  tries++;
}
```

## 3. **Zustand State Management**

Appears in: wild-gibbon-roll

```typescript
const store = create((set, get) => ({
  state: initialValue,
  mutation: (value) => set({ state: value }),
  asyncAction: async () => {
    const result = await fetch(...);
    set({ data: result });
  }
}));
```

## 4. **Structured JSON Output from LLMs**

Appears in: Ebook-creator, campaign-OS

```typescript
config: {
  responseMimeType: "application/json",
  responseSchema: {
    type: Type.OBJECT,
    properties: { /* schema */ }
  }
}
```

## 5. **Extended Thinking for Complex Reasoning**

Appears in: Ebook-creator, campaign-OS

```typescript
config: {
  thinkingConfig: { thinkingBudget: 2048 }  // More tokens for reasoning
}
```

## 6. **Real-Time Subscriptions**

Appears in: wild-gibbon-roll

```typescript
supabase
  .channel("topic")
  .on("postgres_changes", { /* filter */ }, (payload) => {
    onUpdate(payload);
  })
  .subscribe();
```

## 7. **Webhook-Based Status Updates**

Appears in: wild-gibbon-roll

```typescript
serve(async (req) => {
  const payload = await req.json();
  await db.upsert({ id: payload.id, status: payload.status });
});
```

---

# KEY ARCHITECTURAL DECISIONS FOR AGRD

## 1. **State Separation**
- **Low-frequency configuration** → React state (setAppState)
- **High-frequency sensor data** → Mutable refs (handDataRef.current)
- **Business logic** → Zustand store (ugcStore)

## 2. **Async Task Management**
- **Create** → API call with ID return
- **Poll** → Periodic status checks
- **Webhook** → Push status updates when available
- **Update** → Batch updates with side effects

## 3. **Multi-Step Workflows**
- **Sequential execution** with context chaining
- **Checkpoints** for state validation
- **Rollback** capability (clear error states)
- **Timeout protection** (max retries)

## 4. **Data Persistence**
- **PostgreSQL** for structured data (Supabase)
- **Real-time subscriptions** for reactive updates
- **Soft deletes** (status column) instead of actual deletion

## 5. **AI Integration**
- **Model selection** by use case (Pro for reasoning, Flash for speed)
- **Structured outputs** for programmatic access
- **Extended thinking** for complex reasoning
- **Multi-modal** support (text → image → video)

---

# RECOMMENDATIONS FOR AGRD IMPLEMENTATION

## 1. **Adopt Zustand + TanStack Query**
- Clear separation of sync/async state
- Minimal boilerplate
- Excellent DevTools support

## 2. **Use Supabase for Data Layer**
- Real-time subscriptions out of box
- PostgreSQL reliability
- Edge Functions for orchestration

## 3. **Implement State Machines**
- Clear status transitions
- Timeout protection
- Error recovery paths

## 4. **Structured LLM Outputs**
- Always use `responseMimeType: "application/json"` with schema
- Validate output before using
- Include fallbacks

## 5. **Webhook + Polling Hybrid**
- Webhooks for fast updates (when available)
- Polling as fallback with exponential backoff
- Idempotent upserts for convergence

## 6. **Mutable Refs for High-Frequency Data**
- Avoid React re-renders for sensor data
- Use hooks for low-frequency updates only
- Example: hand tracking, particle positions

## 7. **Conversational Data Collection**
- Multi-turn exchanges with system instructions
- Extract structured data from conversation
- Include completion signals ([COMPLETE])

---

# SUMMARY TABLE: Pattern Mapping

| Pattern | Repos | Use Case | Key Code File |
|---------|-------|----------|---------------|
| Multi-step workflows | wild-gibbon-roll | Video generation pipeline | veo-build, poll-video-tasks |
| Real-time updates | wild-gibbon-roll | Scene version tracking | useSceneVersionsSubscription |
| Polling with retries | wild-gibbon-roll | Task status monitoring | pollStitch |
| State machines | wild-gibbon-roll, particles | Status tracking | ugcStore, App |
| Zustand state | wild-gibbon-roll | Centralized state | ugcStore |
| Mutable refs | particles | High-frequency data | App (handDataRef) |
| Structured LLM output | Ebook-creator, campaign-OS | AI orchestration | geminiService |
| Extended thinking | Ebook-creator, campaign-OS | Complex reasoning | geminiService |
| Conversational agents | campaign-OS | Data collection | getOnboardingResponse |
| Webhook + polling | wild-gibbon-roll | External service tracking | shotstack-webhook, poll-video-tasks |
| Template configs | particles, Ebook-creator | Runtime variability | TEMPLATE_CONFIG, CATEGORY_SCENES |
| Multi-stage filtering | seta-resources | Complex queries | App.tsx useMemo chain |

