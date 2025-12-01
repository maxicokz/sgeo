# LLM Evaluation Service

Node.js сервис для автоматической оценки ответов LLM по методологии G-Eval.

## Возможности

- **G-Eval оценка** по 4 критериям (шкала 1-5):
  - Coherence (связность)
  - Consistency (непротиворечивость)
  - Fluency (читаемость)
  - Relevance (релевантность)

- **REST API** для управления оценками
- **Cron планировщик** для еженедельных автоматических прогонов
- **Retry logic** для устойчивости к сбоям API
- **Rate limiting** через p-limit

## Технологии

- Node.js 20+
- Fastify
- Supabase (PostgreSQL)
- OpenRouter API (GPT-4o-mini как оценщик)
- pino (логирование)
- node-cron (планировщик)

## Установка

```bash
cd llm-evaluation-service
npm install
```

## Конфигурация

Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Заполните переменные окружения:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-anon-key

# OpenRouter
OPENROUTER_API_KEY=your-openrouter-api-key
OPENROUTER_MODEL=openai/gpt-4o-mini

# Server
PORT=3001
NODE_ENV=development

# Cron (по воскресеньям в 00:00 UTC)
CRON_SCHEDULE=0 0 * * 0
CRON_ENABLED=true
```

## База данных

Выполните SQL миграцию в Supabase SQL Editor:

```bash
# Файл: migrations/001_create_tables.sql
```

## Запуск

```bash
# Development (с hot reload)
npm run dev

# Production
npm start
```

## API Endpoints

### POST /api/evaluate
Оценить новые неоцененные ответы.

```bash
curl -X POST "http://localhost:3001/api/evaluate?limit=10"
```

**Response:**
```json
{
  "success": true,
  "message": "Evaluated 5 responses",
  "evaluated": 5,
  "failed": 0,
  "duration": 12500
}
```

### POST /api/evaluate/:id
Оценить ответы для конкретного промпта.

```bash
curl -X POST "http://localhost:3001/api/evaluate/550e8400-e29b-41d4-a716-446655440000"
```

### GET /api/status
Получить статус и статистику оценок.

```bash
curl "http://localhost:3001/api/status"
```

**Response:**
```json
{
  "success": true,
  "data": {
    "lastEvaluationAt": "2024-01-15T10:30:00Z",
    "lastEvaluatorModel": "openai/gpt-4o-mini",
    "statistics": {
      "totalPrompts": 50,
      "totalResponses": 250,
      "totalEvaluations": 200,
      "pendingEvaluations": 50
    },
    "averageScores": {
      "coherence": 4.2,
      "consistency": 4.1,
      "fluency": 4.5,
      "relevance": 3.9,
      "avg_score": 4.17
    }
  }
}
```

### GET /api/results
Получить все результаты оценок с пагинацией.

```bash
curl "http://localhost:3001/api/results?limit=20&offset=0"
```

### GET /api/scheduler
Статус cron планировщика.

```bash
curl "http://localhost:3001/api/scheduler"
```

### GET /health
Health check endpoint.

```bash
curl "http://localhost:3001/health"
```

## Структура проекта

```
llm-evaluation-service/
├── src/
│   ├── index.js           # Entry point
│   ├── config.js          # Configuration
│   ├── db/
│   │   ├── supabase.js    # Supabase client
│   │   └── repository.js  # Data access layer
│   ├── services/
│   │   ├── openrouter.js  # OpenRouter API client
│   │   ├── geval.js       # G-Eval evaluation logic
│   │   └── scheduler.js   # Cron scheduler
│   ├── routes/
│   │   └── evaluate.js    # API routes
│   └── utils/
│       └── logger.js      # Pino logger
├── migrations/
│   └── 001_create_tables.sql
├── .env.example
├── package.json
└── README.md
```

## G-Eval Методология

Сервис использует GPT для оценки ответов по следующим критериям:

| Критерий | Описание |
|----------|----------|
| **Coherence** | Структурированность и логическая организация ответа |
| **Consistency** | Внутренняя непротиворечивость и фактическая точность |
| **Fluency** | Естественность языка и читаемость |
| **Relevance** | Соответствие ответа исходному вопросу |

Каждый критерий оценивается по шкале 1-5, где:
- 1 = Очень плохо
- 3 = Удовлетворительно
- 5 = Отлично

## Логирование

Сервис использует pino для структурированного логирования:

```
[10:30:00] INFO (llm-evaluation): Server started {"port":3001,"env":"development"}
[10:30:05] INFO (geval): Evaluating prompt responses {"promptId":"...","responsesCount":5}
[10:30:15] DEBUG (geval): Response evaluated {"responseId":"...","avgScore":4.25}
```

## Docker (опционально)

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## Лицензия

MIT
