# Getting Started - SGEO Dashboard

Руководство по быстрому старту разработки SGEO Dashboard.

---

## Предварительные требования

### Системные требования
- **OS**: macOS, Linux, или Windows (WSL2)
- **RAM**: 8GB minimum, 16GB recommended
- **Storage**: 10GB free space

### Установленное ПО
- **Node.js**: 20.x LTS ([скачать](https://nodejs.org/))
- **Python**: 3.11+ ([скачать](https://www.python.org/))
- **Git**: 2.x ([скачать](https://git-scm.com/))
- **Docker**: 24+ (опционально, [скачать](https://www.docker.com/))
- **pnpm**: Latest (опционально, `npm install -g pnpm`)

Проверьте установки:
```bash
node --version  # v20.x.x
python --version  # Python 3.11.x
git --version  # git version 2.x.x
```

---

## Шаг 1: Клонирование репозитория

```bash
git clone <repository-url>
cd sgeo
```

---

## Шаг 2: Настройка Supabase

### 2.1 Создание проекта
1. Перейдите на [supabase.com](https://supabase.com)
2. Создайте аккаунт (если еще нет)
3. Нажмите "New Project"
4. Заполните:
   - **Name**: sgeo-dashboard
   - **Database Password**: (сохраните!)
   - **Region**: выберите ближайший
   - **Plan**: Free (для разработки)

### 2.2 Получение credentials
После создания проекта:
1. Перейдите в **Settings** → **API**
2. Скопируйте:
   - **Project URL** (e.g., `https://xxx.supabase.co`)
   - **anon/public key**
   - **service_role key** (для backend)

### 2.3 Настройка базы данных
1. Перейдите в **SQL Editor**
2. Создайте новый query
3. Скопируйте содержимое из `database/migrations/001_initial_schema.sql`
4. Выполните (Run)

---

## Шаг 3: Frontend Setup (Next.js)

### 3.1 Установка зависимостей
```bash
cd frontend
npm install
# или с pnpm
pnpm install
```

### 3.2 Настройка environment variables
Создайте файл `.env.local`:
```bash
cp .env.example .env.local
```

Отредактируйте `.env.local`:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Backend API (будет настроен позже)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=
```

### 3.3 Запуск dev сервера
```bash
npm run dev
# или
pnpm dev
```

Откройте браузер: http://localhost:3000

---

## Шаг 4: Backend Setup (Python FastAPI)

### 4.1 Установка Poetry (если еще нет)
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

### 4.2 Установка зависимостей
```bash
cd backend
poetry install
```

### 4.3 Настройка environment variables
Создайте файл `.env`:
```bash
cp .env.example .env
```

Отредактируйте `.env`:
```bash
# Database
DATABASE_URL=postgresql://postgres:[password]@db.xxx.supabase.co:5432/postgres
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_KEY=eyJ...  # service_role key!

# Redis (локально)
REDIS_URL=redis://localhost:6379

# LLM APIs
OPENAI_API_KEY=sk-...
GOOGLE_AI_API_KEY=...
PERPLEXITY_API_KEY=...

# Security
SECRET_KEY=your-secret-key-here  # сгенерируйте: openssl rand -hex 32
JWT_SECRET=your-jwt-secret-here

# Environment
ENVIRONMENT=development
```

### 4.4 Запуск FastAPI сервера
```bash
poetry run uvicorn app.main:app --reload --port 8000
```

API docs: http://localhost:8000/docs

---

## Шаг 5: Redis Setup

### Опция A: Docker (рекомендуется)
```bash
docker run -d \
  --name sgeo-redis \
  -p 6379:6379 \
  redis:7-alpine
```

### Опция B: Локальная установка

**macOS** (с Homebrew):
```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian**:
```bash
sudo apt-get install redis-server
sudo systemctl start redis-server
```

**Проверка**:
```bash
redis-cli ping
# Ответ: PONG
```

---

## Шаг 6: Celery Setup (Background Jobs)

### 6.1 Запуск Celery Worker
В отдельном терминале:
```bash
cd backend
poetry run celery -A app.tasks.celery_app worker --loglevel=info
```

### 6.2 Запуск Celery Beat (scheduler)
В еще одном терминале:
```bash
cd backend
poetry run celery -A app.tasks.celery_app beat --loglevel=info
```

### 6.3 Celery Flower (monitoring, опционально)
```bash
poetry run celery -A app.tasks.celery_app flower --port=5555
```

Flower UI: http://localhost:5555

---

## Шаг 7: Проверка установки

### 7.1 Frontend
- Откройте http://localhost:3000
- Вы должны увидеть страницу входа
- Попробуйте зарегистрироваться

### 7.2 Backend API
- Откройте http://localhost:8000/docs
- Swagger UI должен загрузиться
- Попробуйте тестовый endpoint: `GET /api/v1/health`

### 7.3 Database
```bash
# Подключитесь к PostgreSQL
psql $DATABASE_URL

# Проверьте таблицы
\dt

# Должны видеть:
# topics, llm_responses, sources, etc.
```

### 7.4 Redis
```bash
redis-cli
> PING
PONG
> SET test "hello"
OK
> GET test
"hello"
```

---

## Структура проекта

```
sgeo/
├── frontend/                 # Next.js приложение
│   ├── app/                  # App Router pages
│   ├── components/           # React компоненты
│   ├── lib/                  # Utilities, tRPC
│   ├── styles/               # CSS
│   ├── public/               # Static files
│   └── package.json
│
├── backend/                  # Python FastAPI
│   ├── app/
│   │   ├── api/              # API routes
│   │   ├── models/           # Pydantic models
│   │   ├── services/         # Business logic
│   │   ├── db/               # Database
│   │   └── tasks/            # Celery tasks
│   ├── tests/
│   ├── pyproject.toml
│   └── poetry.lock
│
├── database/                 # DB schema & migrations
│   ├── migrations/
│   └── seeds/
│
├── docs/                     # Documentation
│   ├── PROJECT_PLAN.md
│   ├── ARCHITECTURE.md
│   ├── ROADMAP.md
│   └── ...
│
├── scripts/                  # Utility scripts
├── .github/                  # CI/CD workflows
├── docker-compose.yml        # Docker setup
└── README.md
```

---

## Следующие шаги

### Для Frontend разработки:
1. Изучите структуру в `frontend/app/`
2. Посмотрите компоненты в `frontend/components/`
3. Ознакомьтесь с tRPC setup в `frontend/lib/trpc/`
4. Попробуйте создать новую страницу

### Для Backend разработки:
1. Изучите API endpoints в `backend/app/api/`
2. Посмотрите LLM клиенты в `backend/app/services/llm/`
3. Попробуйте добавить новый endpoint
4. Протестируйте через Swagger UI

### Для Fullstack:
1. Создайте новый tRPC endpoint
2. Подключите его к React компоненту
3. Протестируйте end-to-end flow

---

## Полезные команды

### Frontend
```bash
npm run dev          # Запуск dev сервера
npm run build        # Production build
npm run start        # Запуск production
npm run lint         # ESLint
npm run format       # Prettier
npm test             # Jest tests
```

### Backend
```bash
poetry run uvicorn app.main:app --reload  # Dev server
poetry run pytest                          # Run tests
poetry run pytest --cov                    # With coverage
poetry run black .                         # Format code
poetry run ruff .                          # Lint code
poetry run mypy .                          # Type check
```

### Docker (если используете)
```bash
docker-compose up -d          # Запустить все сервисы
docker-compose down           # Остановить
docker-compose logs -f        # Логи
docker-compose ps             # Статус
```

---

## Troubleshooting

### "Cannot connect to Supabase"
- Проверьте SUPABASE_URL и SUPABASE_ANON_KEY в .env
- Убедитесь что проект активен на supabase.com

### "Redis connection refused"
- Убедитесь что Redis запущен: `redis-cli ping`
- Проверьте REDIS_URL в .env

### "Module not found" (Python)
- Убедитесь что venv активирован
- Переустановите: `poetry install`

### "Module not found" (Node)
- Удалите node_modules: `rm -rf node_modules`
- Переустановите: `npm install`

### Port already in use
```bash
# Найдите процесс
lsof -ti:3000  # для Next.js
lsof -ti:8000  # для FastAPI

# Убейте процесс
kill -9 <PID>
```

---

## Полезные ресурсы

### Документация
- [Next.js Docs](https://nextjs.org/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [Supabase Docs](https://supabase.com/docs)
- [tRPC Docs](https://trpc.io/docs)

### Tutorials
- [Next.js 14 Tutorial](https://nextjs.org/learn)
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)

### Community
- [Next.js Discord](https://discord.gg/nextjs)
- [FastAPI Discord](https://discord.gg/fastapi)

---

## Support

Если возникли проблемы:
1. Проверьте [Troubleshooting](#troubleshooting) секцию
2. Поищите в GitHub Issues
3. Спросите в команде

---

## Лицензия

Proprietary - All rights reserved
