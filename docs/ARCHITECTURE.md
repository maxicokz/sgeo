# Архитектура SGEO Dashboard

## Общий обзор

SGEO Dashboard построен на микросервисной архитектуре с разделением на frontend (Next.js), backend API (Next.js + tRPC), и аналитический сервис (Python FastAPI).

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Browser                       │
│                      (React/Next.js UI)                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ HTTPS
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    Next.js Application                       │
│  ┌─────────────────┐  ┌──────────────────┐                 │
│  │  React Frontend │  │  API Routes      │                 │
│  │  - Dashboard    │  │  - tRPC Router   │                 │
│  │  - Topics       │  │  - Middleware    │                 │
│  │  - Sources      │  │  - Auth          │                 │
│  │  - Reports      │  └────────┬─────────┘                 │
│  └─────────────────┘           │                            │
└────────────────────────────────┼────────────────────────────┘
                                 │
                    ┌────────────┼────────────┐
                    │            │            │
         ┌──────────▼───┐   ┌───▼──────────┐ │
         │              │   │              │ │
         │  Supabase    │   │  Python      │ │
         │  PostgreSQL  │   │  FastAPI     │ │
         │              │   │  Service     │ │
         │  - Auth      │   │              │ │
         │  - Database  │   │  - LLM APIs  │ │
         │  - Storage   │   │  - NLP       │ │
         │  - RLS       │   │  - E-E-A-T   │ │
         └──────────────┘   └───┬──────────┘ │
                                │            │
                    ┌───────────┼────────────┘
                    │           │
         ┌──────────▼───┐   ┌──▼───────────┐
         │              │   │              │
         │  Redis       │   │  External    │
         │  Cache       │   │  LLM APIs    │
         │              │   │              │
         │  - Sessions  │   │  - ChatGPT   │
         │  - API Cache │   │  - Bing      │
         │  - Jobs      │   │  - Copilot   │
         │              │   │  - Perplexity│
         └──────────────┘   │  - Gemini    │
                            └──────────────┘
```

---

## Компоненты системы

### 1. Frontend Layer (Next.js 14 + React)

#### Технологии
- **Framework**: Next.js 14 (App Router)
- **UI**: React 18, TypeScript
- **Styling**: TailwindCSS + shadcn/ui
- **State Management**: Zustand / TanStack Query
- **Charts**: Recharts / Victory Charts
- **Forms**: React Hook Form + Zod validation

#### Структура
```
frontend/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/
│   │   ├── page.tsx              # Main dashboard
│   │   ├── topics/
│   │   │   ├── page.tsx          # Topics list
│   │   │   └── [id]/page.tsx    # Topic detail
│   │   ├── sources/
│   │   │   ├── page.tsx          # Sources map
│   │   │   └── [id]/page.tsx    # Source detail
│   │   ├── analytics/
│   │   │   └── page.tsx          # Comparative analytics
│   │   └── reports/
│   │       ├── page.tsx          # Reports list
│   │       └── [id]/page.tsx    # Report view
│   ├── api/
│   │   └── trpc/
│   │       └── [trpc]/route.ts  # tRPC handler
│   └── layout.tsx
├── components/
│   ├── ui/                       # shadcn components
│   ├── dashboard/
│   │   ├── EEATScoreCard.tsx
│   │   ├── TopSourcesChart.tsx
│   │   ├── AlertPanel.tsx
│   │   └── RecommendationsCard.tsx
│   ├── topics/
│   │   ├── TopicTable.tsx
│   │   ├── TopicDetail.tsx
│   │   └── PromptEditor.tsx
│   ├── sources/
│   │   ├── SourceMap.tsx
│   │   ├── SourceCard.tsx
│   │   └── HealthIndexGauge.tsx
│   └── charts/
│       ├── LineChart.tsx
│       ├── BarChart.tsx
│       └── RadarChart.tsx
├── lib/
│   ├── trpc/
│   │   ├── client.ts             # tRPC client
│   │   └── server.ts             # Server-side tRPC
│   ├── utils.ts
│   └── constants.ts
└── styles/
    └── globals.css
```

#### Ключевые паттерны
- **Server Components** для статического контента
- **Client Components** для интерактивности
- **Streaming** для больших данных
- **Optimistic Updates** для лучшего UX
- **Error Boundaries** для обработки ошибок

---

### 2. API Layer (Next.js API Routes + tRPC)

#### Структура API
```typescript
// server/routers/index.ts
export const appRouter = router({
  topics: topicsRouter,
  sources: sourcesRouter,
  analysis: analysisRouter,
  reports: reportsRouter,
  dashboard: dashboardRouter,
  auth: authRouter,
});

// server/routers/topics.ts
export const topicsRouter = router({
  list: publicProcedure
    .input(z.object({
      filter: z.string().optional(),
      sort: z.enum(['name', 'priority', 'status']),
    }))
    .query(async ({ input }) => {
      // Get topics from DB
    }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      // Get single topic
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string(),
      priority: z.number(),
      prompts: z.array(z.string()),
    }))
    .mutation(async ({ input }) => {
      // Create topic
    }),

  runAnalysis: protectedProcedure
    .input(z.object({
      topicId: z.string(),
      llms: z.array(z.enum(['chatgpt', 'bing', 'copilot', 'perplexity', 'gemini'])),
    }))
    .mutation(async ({ input }) => {
      // Trigger analysis via FastAPI
    }),
});
```

#### Middleware
```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  // 1. Auth check
  const session = await getSession(request);

  // 2. Rate limiting
  const rateLimit = await checkRateLimit(session?.user?.id);

  // 3. CORS
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');

  return response;
}
```

---

### 3. Backend Service (Python FastAPI)

#### Структура
```
backend/
├── app/
│   ├── main.py                   # FastAPI app
│   ├── config.py                 # Settings
│   ├── api/
│   │   ├── v1/
│   │   │   ├── endpoints/
│   │   │   │   ├── analysis.py
│   │   │   │   ├── llm.py
│   │   │   │   └── scoring.py
│   │   │   └── router.py
│   ├── core/
│   │   ├── security.py
│   │   └── logging.py
│   ├── models/
│   │   ├── topic.py
│   │   ├── llm_response.py
│   │   └── eeat_score.py
│   ├── services/
│   │   ├── llm/
│   │   │   ├── base.py           # Abstract LLM client
│   │   │   ├── chatgpt.py
│   │   │   ├── bing.py
│   │   │   ├── copilot.py
│   │   │   ├── perplexity.py
│   │   │   └── gemini.py
│   │   ├── nlp/
│   │   │   ├── sentiment.py      # Sentiment analysis
│   │   │   ├── completeness.py   # Completeness scoring
│   │   │   ├── correctness.py    # Fact-checking
│   │   │   └── source_extractor.py
│   │   ├── scoring/
│   │   │   ├── eeat.py           # E-E-A-T scorer
│   │   │   ├── authorship.py
│   │   │   ├── reputation.py
│   │   │   ├── security.py
│   │   │   └── freshness.py
│   │   └── analysis.py           # Main analysis orchestrator
│   ├── db/
│   │   ├── supabase.py           # Supabase client
│   │   └── repositories/
│   │       ├── topic_repo.py
│   │       └── source_repo.py
│   └── tasks/
│       ├── celery_app.py         # Celery setup
│       └── analysis_tasks.py     # Background tasks
├── tests/
└── requirements.txt
```

#### LLM Integration Pattern
```python
# services/llm/base.py
from abc import ABC, abstractmethod
from typing import List, Dict

class BaseLLMClient(ABC):
    @abstractmethod
    async def query(self, prompt: str, **kwargs) -> Dict:
        """Execute a query and return structured response"""
        pass

    @abstractmethod
    async def extract_sources(self, response: Dict) -> List[str]:
        """Extract cited sources from response"""
        pass

    @abstractmethod
    async def take_screenshot(self) -> bytes:
        """Capture screenshot of response"""
        pass

# services/llm/chatgpt.py
class ChatGPTClient(BaseLLMClient):
    def __init__(self, api_key: str):
        self.client = OpenAI(api_key=api_key)

    async def query(self, prompt: str, model: str = "gpt-4") -> Dict:
        response = await self.client.chat.completions.create(
            model=model,
            messages=[{"role": "user", "content": prompt}]
        )

        return {
            "content": response.choices[0].message.content,
            "model": model,
            "timestamp": datetime.utcnow(),
            "tokens_used": response.usage.total_tokens,
        }
```

#### NLP Analysis Pipeline
```python
# services/analysis.py
class AnalysisService:
    def __init__(self):
        self.sentiment_analyzer = SentimentAnalyzer()
        self.completeness_scorer = CompletenessScorer()
        self.correctness_checker = CorrectnessChecker()
        self.source_extractor = SourceExtractor()

    async def analyze_response(
        self,
        topic_id: str,
        llm_response: Dict,
        reference_data: Dict
    ) -> AnalysisResult:
        """Full analysis pipeline"""

        # 1. Extract sources
        sources = await self.source_extractor.extract(llm_response)

        # 2. Sentiment analysis (0-5)
        sentiment_score = await self.sentiment_analyzer.score(
            llm_response["content"]
        )

        # 3. Completeness check (0-5)
        completeness_score = await self.completeness_scorer.score(
            llm_response["content"],
            reference_data
        )

        # 4. Correctness check (0-5)
        correctness_score = await self.correctness_checker.score(
            llm_response["content"],
            reference_data
        )

        # 5. Save to DB
        return AnalysisResult(
            topic_id=topic_id,
            sentiment=sentiment_score,
            completeness=completeness_score,
            correctness=correctness_score,
            sources=sources,
        )
```

#### E-E-A-T Scoring
```python
# services/scoring/eeat.py
class EEATScorer:
    async def calculate_score(self, source_url: str) -> EEATScore:
        """Calculate E-E-A-T score (0-100)"""

        # 1. Authorship Clarity (0-10)
        authorship = await self.check_authorship(source_url)

        # 2. Reputation (0-10)
        reputation = await self.check_reputation(source_url)

        # 3. Security (0-10)
        security = await self.check_security(source_url)

        # 4. Freshness (0-10)
        freshness = await self.check_freshness(source_url)

        # Weighted average
        total_score = (
            authorship * 0.3 +
            reputation * 0.35 +
            security * 0.15 +
            freshness * 0.2
        ) * 10  # Scale to 0-100

        return EEATScore(
            total=total_score,
            authorship=authorship,
            reputation=reputation,
            security=security,
            freshness=freshness,
        )
```

---

### 4. Database Layer (Supabase PostgreSQL)

#### Schema
```sql
-- Topics table
CREATE TABLE topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    priority INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    prompts JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- LLM Responses table
CREATE TABLE llm_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    topic_id UUID REFERENCES topics(id),
    llm_system VARCHAR(50) NOT NULL,
    prompt_index INTEGER NOT NULL,
    content TEXT NOT NULL,
    model_version VARCHAR(100),
    tokens_used INTEGER,
    screenshot_url TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Sources table
CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    url TEXT UNIQUE NOT NULL,
    domain VARCHAR(255) NOT NULL,
    title VARCHAR(500),
    source_type VARCHAR(50),
    first_seen TIMESTAMP DEFAULT NOW(),
    last_seen TIMESTAMP DEFAULT NOW(),
    citation_count INTEGER DEFAULT 0
);

-- E-E-A-T Scores table
CREATE TABLE eeat_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id UUID REFERENCES sources(id),
    total_score DECIMAL(5,2) NOT NULL,
    authorship_score DECIMAL(4,2),
    reputation_score DECIMAL(4,2),
    security_score DECIMAL(4,2),
    freshness_score DECIMAL(4,2),
    checked_at TIMESTAMP DEFAULT NOW()
);

-- Analysis Results table
CREATE TABLE analysis_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    llm_response_id UUID REFERENCES llm_responses(id),
    sentiment_score DECIMAL(3,2),
    completeness_score DECIMAL(3,2),
    correctness_score DECIMAL(3,2),
    analyzed_at TIMESTAMP DEFAULT NOW()
);

-- Source Citations table (many-to-many)
CREATE TABLE source_citations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    llm_response_id UUID REFERENCES llm_responses(id),
    source_id UUID REFERENCES sources(id),
    position INTEGER,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(llm_response_id, source_id)
);

-- Analysis Runs table (job log)
CREATE TABLE analysis_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'running',
    topics_analyzed INTEGER,
    llm_systems JSONB,
    started_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    error_message TEXT
);

-- Reports table
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_type VARCHAR(50) NOT NULL,
    period_start DATE,
    period_end DATE,
    pdf_url TEXT,
    data JSONB,
    generated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_llm_responses_topic ON llm_responses(topic_id);
CREATE INDEX idx_llm_responses_llm ON llm_responses(llm_system);
CREATE INDEX idx_sources_domain ON sources(domain);
CREATE INDEX idx_source_citations_response ON source_citations(llm_response_id);
CREATE INDEX idx_source_citations_source ON source_citations(source_id);
```

#### Row Level Security (RLS)
```sql
-- Enable RLS
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE llm_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all data
CREATE POLICY "Allow read access to authenticated users"
ON topics FOR SELECT
TO authenticated
USING (true);

-- Policy: Only admins can modify
CREATE POLICY "Allow write access to admins"
ON topics FOR ALL
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin');
```

---

### 5. Caching Layer (Redis)

#### Использование
```python
# Cache LLM responses (expensive)
redis_client.setex(
    f"llm:chatgpt:{topic_id}:{prompt_hash}",
    3600 * 24,  # 24 hours
    json.dumps(response)
)

# Cache E-E-A-T scores
redis_client.setex(
    f"eeat:{source_url_hash}",
    3600 * 24 * 7,  # 7 days
    json.dumps(score)
)

# Session storage
redis_client.setex(
    f"session:{session_id}",
    3600 * 24 * 30,  # 30 days
    json.dumps(user_data)
)
```

---

### 6. Background Jobs (Celery)

#### Task Queue
```python
# tasks/analysis_tasks.py
@celery_app.task
def analyze_topic_across_llms(topic_id: str, llm_systems: List[str]):
    """Run analysis for a topic across multiple LLMs"""

    for llm in llm_systems:
        for prompt_idx, prompt in enumerate(topic.prompts):
            # Queue individual analysis
            analyze_llm_response.delay(
                topic_id, llm, prompt_idx, prompt
            )

@celery_app.task(max_retries=3)
def analyze_llm_response(
    topic_id: str,
    llm: str,
    prompt_idx: int,
    prompt: str
):
    """Analyze single LLM response"""
    try:
        # 1. Get LLM response
        client = get_llm_client(llm)
        response = await client.query(prompt)

        # 2. Save response
        db_response = save_llm_response(topic_id, llm, prompt_idx, response)

        # 3. Run NLP analysis
        analysis = await run_analysis(db_response)

        # 4. Extract and score sources
        sources = await extract_sources(response)
        for source in sources:
            eeat_score = await calculate_eeat(source)
            save_eeat_score(source, eeat_score)

    except Exception as e:
        # Retry with exponential backoff
        raise self.retry(exc=e, countdown=60 * (2 ** self.request.retries))

# Scheduled tasks
@celery_app.task
@periodic_task(run_every=crontab(hour=2, minute=0))  # 2 AM daily
def daily_analysis():
    """Run daily analysis for all topics"""
    topics = get_active_topics()
    for topic in topics:
        analyze_topic_across_llms.delay(topic.id, ALL_LLM_SYSTEMS)

@celery_app.task
@periodic_task(run_every=crontab(day_of_week=1, hour=3, minute=0))  # Monday 3 AM
def weekly_report():
    """Generate weekly report"""
    generate_report.delay('weekly')
```

---

## Data Flow

### 1. Analysis Flow
```
User triggers analysis
    ↓
Next.js API (tRPC)
    ↓
Celery task queued
    ↓
Python FastAPI
    ↓
LLM API calls (ChatGPT, Bing, etc.)
    ↓
NLP Analysis (Sentiment, Completeness, Correctness)
    ↓
Source Extraction
    ↓
E-E-A-T Scoring
    ↓
Save to PostgreSQL
    ↓
Update cache (Redis)
    ↓
Notify frontend (WebSocket/Polling)
```

### 2. Dashboard Data Flow
```
User opens dashboard
    ↓
Next.js Server Component
    ↓
tRPC query
    ↓
Check Redis cache
    ├─ Hit → Return cached data
    └─ Miss → Query PostgreSQL
        ↓
        Aggregate data
        ↓
        Cache in Redis
        ↓
        Return to frontend
```

---

## Security Architecture

### Authentication Flow
```
1. User login → Supabase Auth
2. JWT token issued
3. Token stored in httpOnly cookie
4. Middleware validates token on each request
5. RLS policies enforce data access
```

### API Security
- **Rate Limiting**: 100 requests/minute per user
- **CORS**: Whitelist specific origins
- **Input Validation**: Zod schemas on all inputs
- **SQL Injection**: Parameterized queries
- **XSS**: Content sanitization
- **CSRF**: SameSite cookies

---

## Scalability Considerations

### Horizontal Scaling
- **Next.js**: Stateless, can scale horizontally on Vercel
- **FastAPI**: Dockerized, can run multiple instances behind load balancer
- **PostgreSQL**: Read replicas for heavy queries
- **Redis**: Redis Cluster for distributed caching
- **Celery**: Multiple workers

### Performance Optimizations
- **Database**: Proper indexing, query optimization
- **Caching**: Multi-layer (Redis, CDN)
- **Code Splitting**: Lazy load components
- **Image Optimization**: Next.js Image component
- **API**: Pagination, field selection

---

## Monitoring & Observability

### Metrics
- **Application**: Response times, error rates (Sentry)
- **Database**: Query performance, connection pool (Supabase dashboard)
- **Background Jobs**: Queue length, task duration (Celery Flower)
- **Infrastructure**: CPU, memory, network (Vercel Analytics)

### Logging
```python
# Structured logging
import structlog

logger = structlog.get_logger()

logger.info(
    "llm_query_completed",
    topic_id=topic_id,
    llm="chatgpt",
    duration_ms=duration,
    tokens_used=tokens
)
```

---

## Disaster Recovery

### Backups
- **Database**: Daily automated backups (Supabase)
- **Storage**: Replicated across regions
- **Code**: Git version control

### Recovery Plan
1. Restore DB from latest backup
2. Redeploy from Git
3. Rerun failed analysis jobs
4. Validate data integrity

---

## Technology Choices Rationale

| Technology | Reasoning |
|------------|-----------|
| Next.js | Full-stack framework, SSR, API routes, great DX |
| TypeScript | Type safety, better IDE support |
| Supabase | PostgreSQL + Auth + Storage in one, RLS |
| FastAPI | Fast Python API, async support, auto docs |
| tRPC | End-to-end type safety, no code generation |
| Celery | Proven background job system for Python |
| Redis | Fast in-memory cache, session storage |
| TailwindCSS | Utility-first, fast development |
| shadcn/ui | High-quality React components |

---

## Следующие шаги

1. ✅ Утверждение архитектуры
2. Создание прототипа (PoC) для LLM интеграции
3. Database schema validation
4. API contract definition
5. Frontend wireframes/mockups
