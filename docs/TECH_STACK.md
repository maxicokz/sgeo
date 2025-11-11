# Технологический стек SGEO Dashboard

## Frontend

### Core
| Технология | Версия | Назначение |
|------------|--------|------------|
| **Next.js** | 14.x | React framework с SSR/SSG |
| **React** | 18.x | UI библиотека |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Node.js** | 20.x LTS | Runtime environment |

### UI & Styling
| Технология | Версия | Назначение |
|------------|--------|------------|
| **TailwindCSS** | 3.x | Utility-first CSS framework |
| **shadcn/ui** | Latest | Headless UI components |
| **Radix UI** | Latest | Accessible primitives |
| **Lucide Icons** | Latest | Icon library |
| **clsx** | Latest | Conditional className utility |

### State Management & Data Fetching
| Технология | Версия | Назначение |
|------------|--------|------------|
| **tRPC** | 10.x | Type-safe API client |
| **TanStack Query** | 5.x | Server state management |
| **Zustand** | 4.x | Client state management |
| **React Hook Form** | 7.x | Form handling |
| **Zod** | 3.x | Schema validation |

### Charts & Visualization
| Технология | Версия | Назначение |
|------------|--------|------------|
| **Recharts** | 2.x | React charting library |
| **D3.js** | 7.x | Low-level visualizations |
| **react-force-graph** | Latest | Network graphs |

### PDF Generation
| Технология | Версия | Назначение |
|------------|--------|------------|
| **Puppeteer** | Latest | Headless browser |
| **@react-pdf/renderer** | 3.x | React to PDF |

---

## Backend (Python)

### Core
| Технология | Версия | Назначение |
|------------|--------|------------|
| **Python** | 3.11+ | Programming language |
| **FastAPI** | 0.109+ | Async web framework |
| **Pydantic** | 2.x | Data validation |
| **Poetry** | 1.7+ | Dependency management |

### LLM & AI
| Технология | Версия | Назначение |
|------------|--------|------------|
| **OpenAI SDK** | Latest | ChatGPT integration |
| **Google AI SDK** | Latest | Gemini integration |
| **Playwright** | Latest | Browser automation (Bing/Copilot) |
| **HuggingFace Transformers** | 4.x | NLP models |
| **spaCy** | 3.x | NLP processing |
| **sentence-transformers** | Latest | Embeddings |
| **langchain** | 0.1+ | LLM orchestration |

### Web Scraping & Analysis
| Технология | Версия | Назначение |
|------------|--------|------------|
| **BeautifulSoup4** | 4.x | HTML parsing |
| **Scrapy** | 2.x | Web scraping framework |
| **requests** | 2.x | HTTP library |
| **aiohttp** | 3.x | Async HTTP client |

### NLP & ML
| Технология | Версия | Назначение |
|------------|--------|------------|
| **textblob** | Latest | Sentiment analysis |
| **NLTK** | 3.x | NLP toolkit |
| **scikit-learn** | 1.x | ML algorithms |
| **pandas** | 2.x | Data manipulation |
| **numpy** | 1.x | Numerical computing |

### Background Jobs
| Технология | Версия | Назначение |
|------------|--------|------------|
| **Celery** | 5.x | Distributed task queue |
| **Redis** | 7.x | Message broker & cache |
| **Flower** | 2.x | Celery monitoring |

---

## Database & Storage

### Primary Database
| Технология | Версия | Назначение |
|------------|--------|------------|
| **PostgreSQL** | 15+ | Relational database |
| **Supabase** | Latest | PostgreSQL hosting + extras |

### Caching & Sessions
| Технология | Версия | Назначение |
|------------|--------|------------|
| **Redis** | 7.x | In-memory cache |
| **Redis Stack** | Latest | JSON, Search, TimeSeries |

### File Storage
| Технология | Версия | Назначение |
|------------|--------|------------|
| **Supabase Storage** | Latest | Object storage (PDFs, screenshots) |
| **AWS S3** (опционально) | Latest | Alternative storage |

---

## DevOps & Infrastructure

### Containerization
| Технология | Версия | Назначение |
|------------|--------|------------|
| **Docker** | 24+ | Containerization |
| **Docker Compose** | 2.x | Multi-container orchestration |

### CI/CD
| Технология | Версия | Назначение |
|------------|--------|------------|
| **GitHub Actions** | Latest | CI/CD pipeline |
| **Vercel** | Latest | Next.js deployment |
| **Railway/Render** | Latest | Python service deployment |

### Monitoring & Logging
| Технология | Версия | Назначение |
|------------|--------|------------|
| **Sentry** | Latest | Error tracking |
| **Vercel Analytics** | Latest | Web analytics |
| **structlog** | Latest | Structured logging (Python) |
| **winston** | Latest | Logging (Node.js) |

---

## Development Tools

### Code Quality
| Технология | Версия | Назначение |
|------------|--------|------------|
| **ESLint** | 8.x | JavaScript linter |
| **Prettier** | 3.x | Code formatter |
| **black** | Latest | Python formatter |
| **ruff** | Latest | Fast Python linter |
| **mypy** | Latest | Python type checker |
| **Husky** | 9.x | Git hooks |
| **lint-staged** | Latest | Pre-commit linting |

### Testing
| Технология | Версия | Назначение |
|------------|--------|------------|
| **Jest** | 29.x | JavaScript testing |
| **React Testing Library** | 14.x | React component testing |
| **Playwright** | Latest | E2E testing |
| **pytest** | 7.x | Python testing |
| **pytest-asyncio** | Latest | Async testing |
| **pytest-cov** | Latest | Coverage reporting |

### API Documentation
| Технология | Версия | Назначение |
|------------|--------|------------|
| **Swagger UI** | Latest | FastAPI auto-docs |
| **Redoc** | Latest | API documentation |
| **tRPC Panel** | Latest | tRPC playground |

---

## Security

### Authentication & Authorization
| Технология | Версия | Назначение |
|------------|--------|------------|
| **Supabase Auth** | Latest | User authentication |
| **JWT** | Latest | Token-based auth |
| **bcrypt** | Latest | Password hashing |

### Security Tools
| Технология | Версия | Назначение |
|------------|--------|------------|
| **helmet** | Latest | HTTP headers security |
| **express-rate-limit** | Latest | Rate limiting |
| **OWASP ZAP** | Latest | Security testing |
| **Snyk** | Latest | Dependency scanning |

---

## Package Management

### Frontend
```json
{
  "dependencies": {
    "next": "^14.1.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@trpc/client": "^10.45.0",
    "@trpc/server": "^10.45.0",
    "@trpc/react-query": "^10.45.0",
    "@tanstack/react-query": "^5.17.0",
    "zustand": "^4.5.0",
    "react-hook-form": "^7.49.0",
    "zod": "^3.22.0",
    "tailwindcss": "^3.4.0",
    "@radix-ui/react-*": "latest",
    "lucide-react": "^0.314.0",
    "recharts": "^2.10.0",
    "d3": "^7.8.0",
    "clsx": "^2.1.0",
    "class-variance-authority": "^0.7.0",
    "tailwind-merge": "^2.2.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.3.0",
    "eslint": "^8.56.0",
    "prettier": "^3.2.0",
    "jest": "^29.7.0",
    "@testing-library/react": "^14.1.0",
    "playwright": "^1.41.0"
  }
}
```

### Backend (Python)
```toml
[tool.poetry.dependencies]
python = "^3.11"
fastapi = "^0.109.0"
uvicorn = {extras = ["standard"], version = "^0.27.0"}
pydantic = "^2.5.0"
pydantic-settings = "^2.1.0"
sqlalchemy = "^2.0.0"
asyncpg = "^0.29.0"
supabase = "^2.3.0"
openai = "^1.10.0"
google-generativeai = "^0.3.0"
playwright = "^1.41.0"
transformers = "^4.37.0"
spacy = "^3.7.0"
sentence-transformers = "^2.3.0"
langchain = "^0.1.0"
beautifulsoup4 = "^4.12.0"
aiohttp = "^3.9.0"
celery = "^5.3.0"
redis = "^5.0.0"
pandas = "^2.2.0"
numpy = "^1.26.0"
scikit-learn = "^1.4.0"
textblob = "^0.17.0"
nltk = "^3.8.0"

[tool.poetry.dev-dependencies]
pytest = "^7.4.0"
pytest-asyncio = "^0.23.0"
pytest-cov = "^4.1.0"
black = "^24.1.0"
ruff = "^0.1.0"
mypy = "^1.8.0"
```

---

## Environment Variables

### Frontend (.env.local)
```bash
# Database
DATABASE_URL=postgresql://...
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000
API_SECRET_KEY=xxx

# Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=xxx
SENTRY_DSN=https://xxx@sentry.io/xxx
```

### Backend (.env)
```bash
# Database
DATABASE_URL=postgresql://...
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...

# Redis
REDIS_URL=redis://localhost:6379

# LLM APIs
OPENAI_API_KEY=sk-...
GOOGLE_AI_API_KEY=...
PERPLEXITY_API_KEY=...

# Celery
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Security
SECRET_KEY=xxx
JWT_SECRET=xxx

# Monitoring
SENTRY_DSN=https://xxx@sentry.io/xxx
```

---

## System Requirements

### Development
- **OS**: macOS, Linux, or Windows (WSL2)
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 10GB free space
- **Node.js**: 20.x LTS
- **Python**: 3.11+
- **Docker**: 24+
- **Git**: 2.x

### Production
- **Next.js**: Vercel (Hobby/Pro plan)
- **FastAPI**: 1 vCPU, 512MB RAM minimum
- **PostgreSQL**: Supabase (Free/Pro plan)
- **Redis**: 256MB RAM minimum
- **Storage**: 10GB for PDF/screenshots

---

## Architectural Patterns

### Frontend Patterns
- **Server Components** (Next.js 14)
- **Repository Pattern** для data fetching
- **Atomic Design** для UI components
- **Compound Components** для сложных UI
- **Custom Hooks** для reusable logic

### Backend Patterns
- **Repository Pattern** для database access
- **Service Layer** для business logic
- **Factory Pattern** для LLM clients
- **Strategy Pattern** для scoring algorithms
- **Observer Pattern** для webhooks/notifications

---

## API Conventions

### REST (FastAPI)
```
GET    /api/v1/topics          # List all topics
GET    /api/v1/topics/:id      # Get single topic
POST   /api/v1/topics          # Create topic
PUT    /api/v1/topics/:id      # Update topic
DELETE /api/v1/topics/:id      # Delete topic
POST   /api/v1/topics/:id/analyze  # Trigger analysis
```

### tRPC (Next.js)
```typescript
trpc.topics.list.useQuery({ filter: 'active' })
trpc.topics.getById.useQuery({ id: '123' })
trpc.topics.create.useMutation()
trpc.topics.update.useMutation()
```

---

## Performance Budgets

### Frontend
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.0s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Bundle Size**: < 500KB (initial)

### Backend
- **API Response Time**: < 200ms (p95)
- **Database Query Time**: < 50ms (p95)
- **LLM Query Time**: < 10s (зависит от API)
- **Background Job Processing**: < 30s per job

---

## Browser Support

### Supported Browsers
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android 90+)

### Polyfills
- No polyfills required (modern browsers only)

---

## Accessibility (a11y)

### Standards
- **WCAG 2.1 Level AA** compliance
- **ARIA** labels on interactive elements
- **Keyboard navigation** support
- **Screen reader** tested (NVDA, VoiceOver)

### Tools
- **axe DevTools** for automated testing
- **Lighthouse** accessibility score > 90

---

## Локализация (i18n)

### Будущая поддержка
- **next-intl** для Next.js
- Языки: RU, EN, KZ (приоритет)
- RTL support (опционально)

---

## Обновления и поддержка

### Стратегия обновлений
- **Major versions**: Ежегодно (с testing)
- **Minor versions**: Ежеквартально
- **Security patches**: Немедленно
- **Dependencies**: Automated updates (Dependabot)

---

## Альтернативные варианты (рассмотренные)

| Вместо | Рассматривалось | Почему отклонено |
|--------|-----------------|-------------------|
| Next.js | Remix, SvelteKit | Next.js - industry standard, лучшая ecosystem |
| FastAPI | Django, Flask | FastAPI - async, быстрее, auto-docs |
| Supabase | Firebase, AWS RDS | Supabase - PostgreSQL + Auth + Storage |
| tRPC | GraphQL, REST | tRPC - type safety, проще GraphQL |
| TailwindCSS | Styled Components, CSS Modules | Tailwind - быстрее, меньше bundle size |
| Celery | BullMQ, Temporal | Celery - proven для Python |

---

## Ресурсы и документация

### Официальная документация
- Next.js: https://nextjs.org/docs
- FastAPI: https://fastapi.tiangolo.com
- Supabase: https://supabase.com/docs
- tRPC: https://trpc.io/docs
- TailwindCSS: https://tailwindcss.com/docs

### Обучающие материалы
- Next.js 14 App Router: https://nextjs.org/learn
- FastAPI Tutorial: https://fastapi.tiangolo.com/tutorial
- HuggingFace Transformers: https://huggingface.co/docs

### Community
- Next.js Discord: https://discord.gg/nextjs
- FastAPI Discord: https://discord.gg/fastapi
- Supabase Discord: https://discord.supabase.com
