# Database Schema - SGEO Dashboard

## Entity Relationship Diagram

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────────┐
│   topics    │────1:N──│  llm_responses   │────N:M──│    sources      │
└─────────────┘         └──────────────────┘    │    └─────────────────┘
                                 │              │              │
                                 │              │              │ 1:N
                                 │ 1:1          │              │
                                 │      ┌───────┴────────┐     ▼
                                 │      │source_citations│  ┌──────────────┐
                                 │      └────────────────┘  │eeat_scores   │
                                 │                          └──────────────┘
                                 │ 1:1
                                 │
                        ┌────────┴────────┐
                        │analysis_results │
                        └─────────────────┘

┌──────────────┐         ┌─────────────┐
│analysis_runs │         │   reports   │
└──────────────┘         └─────────────┘
```

---

## Tables

### 1. topics

**Описание**: Приоритетные темы для мониторинга (20 тем).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() | Уникальный идентификатор |
| `name` | VARCHAR(255) | NOT NULL, UNIQUE | Название темы (e.g., "Kazakhstan Economy") |
| `name_ru` | VARCHAR(255) | | Название на русском |
| `name_kz` | VARCHAR(255) | | Название на казахском |
| `description` | TEXT | | Описание темы |
| `priority` | INTEGER | NOT NULL, DEFAULT 1 | Приоритет (1-5, где 5 = highest) |
| `status` | VARCHAR(50) | DEFAULT 'active' | Status: active, paused, archived |
| `category` | VARCHAR(100) | | Категория (economy, culture, tourism, etc.) |
| `prompts` | JSONB | NOT NULL | Массив из 5 промптов для каждой темы |
| `reference_data` | JSONB | | Эталонные данные для проверки корректности |
| `keywords` | TEXT[] | | Ключевые слова для анализа |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Дата создания |
| `updated_at` | TIMESTAMP | DEFAULT NOW() | Дата последнего обновления |
| `created_by` | UUID | REFERENCES auth.users(id) | Кто создал |

**Indexes**:
```sql
CREATE INDEX idx_topics_status ON topics(status);
CREATE INDEX idx_topics_priority ON topics(priority DESC);
CREATE INDEX idx_topics_category ON topics(category);
```

**Example Data**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "Kazakhstan Economy",
  "name_ru": "Экономика Казахстана",
  "priority": 5,
  "status": "active",
  "category": "economy",
  "prompts": [
    "Tell me about Kazakhstan's economy",
    "What are the main industries in Kazakhstan?",
    "Describe Kazakhstan's economic development",
    "What is Kazakhstan's GDP and economic indicators?",
    "How is Kazakhstan's economy performing?"
  ],
  "reference_data": {
    "gdp": "225.6 billion USD",
    "main_industries": ["oil", "gas", "mining", "agriculture"]
  },
  "keywords": ["GDP", "economy", "trade", "investment"]
}
```

---

### 2. llm_responses

**Описание**: Ответы от LLM систем на запросы по темам.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Уникальный идентификатор |
| `topic_id` | UUID | REFERENCES topics(id) ON DELETE CASCADE | Ссылка на тему |
| `llm_system` | VARCHAR(50) | NOT NULL | Система: chatgpt, bing, copilot, perplexity, gemini |
| `model_version` | VARCHAR(100) | | Версия модели (e.g., "gpt-4-turbo-preview") |
| `prompt_index` | INTEGER | NOT NULL | Индекс промпта (0-4) |
| `prompt_text` | TEXT | NOT NULL | Текст использованного промпта |
| `content` | TEXT | NOT NULL | Текст ответа от LLM |
| `raw_response` | JSONB | | Полный raw response от API |
| `tokens_used` | INTEGER | | Количество токенов (если доступно) |
| `response_time_ms` | INTEGER | | Время ответа в миллисекундах |
| `screenshot_url` | TEXT | | URL скриншота ответа (для Bing/Copilot) |
| `metadata` | JSONB | | Дополнительные метаданные |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Время получения ответа |
| `analysis_run_id` | UUID | REFERENCES analysis_runs(id) | К какому запуску относится |

**Indexes**:
```sql
CREATE INDEX idx_llm_responses_topic ON llm_responses(topic_id);
CREATE INDEX idx_llm_responses_llm ON llm_responses(llm_system);
CREATE INDEX idx_llm_responses_created ON llm_responses(created_at DESC);
CREATE INDEX idx_llm_responses_run ON llm_responses(analysis_run_id);
```

**Example Data**:
```json
{
  "id": "abc-123",
  "topic_id": "123e4567-e89b-12d3-a456-426614174000",
  "llm_system": "chatgpt",
  "model_version": "gpt-4-turbo-preview",
  "prompt_index": 0,
  "prompt_text": "Tell me about Kazakhstan's economy",
  "content": "Kazakhstan has a rapidly developing economy...",
  "tokens_used": 450,
  "response_time_ms": 1200,
  "screenshot_url": null
}
```

---

### 3. sources

**Описание**: Источники, цитируемые в ответах LLM.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Уникальный идентификатор |
| `url` | TEXT | UNIQUE, NOT NULL | Полный URL источника |
| `domain` | VARCHAR(255) | NOT NULL | Домен (e.g., "worldbank.org") |
| `title` | VARCHAR(500) | | Заголовок страницы |
| `source_type` | VARCHAR(50) | | Тип: official, news, academic, blog, social, etc. |
| `is_official` | BOOLEAN | DEFAULT false | Официальный источник (gov, edu) |
| `language` | VARCHAR(10) | | Язык контента (en, ru, kz) |
| `first_seen` | TIMESTAMP | DEFAULT NOW() | Когда первый раз обнаружен |
| `last_seen` | TIMESTAMP | DEFAULT NOW() | Последнее цитирование |
| `citation_count` | INTEGER | DEFAULT 0 | Сколько раз процитирован |
| `metadata` | JSONB | | Дополнительные данные |

**Indexes**:
```sql
CREATE INDEX idx_sources_domain ON sources(domain);
CREATE INDEX idx_sources_type ON sources(source_type);
CREATE INDEX idx_sources_official ON sources(is_official);
CREATE UNIQUE INDEX idx_sources_url ON sources(url);
```

**Example Data**:
```json
{
  "id": "src-123",
  "url": "https://www.worldbank.org/en/country/kazakhstan",
  "domain": "worldbank.org",
  "title": "Kazakhstan | World Bank",
  "source_type": "official",
  "is_official": true,
  "language": "en",
  "citation_count": 45
}
```

---

### 4. eeat_scores

**Описание**: E-E-A-T оценки источников.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Уникальный идентификатор |
| `source_id` | UUID | REFERENCES sources(id) ON DELETE CASCADE | Ссылка на источник |
| `total_score` | DECIMAL(5,2) | NOT NULL, CHECK (0 <= total_score <= 100) | Общий скор (0-100) |
| `authorship_score` | DECIMAL(4,2) | CHECK (0 <= authorship_score <= 10) | Authorship Clarity (0-10) |
| `authorship_details` | JSONB | | Детали оценки |
| `reputation_score` | DECIMAL(4,2) | CHECK (0 <= reputation_score <= 10) | Reputation (0-10) |
| `reputation_details` | JSONB | | Детали оценки |
| `security_score` | DECIMAL(4,2) | CHECK (0 <= security_score <= 10) | Security (0-10) |
| `security_details` | JSONB | | Детали оценки |
| `freshness_score` | DECIMAL(4,2) | CHECK (0 <= freshness_score <= 10) | Freshness (0-10) |
| `freshness_details` | JSONB | | Детали оценки |
| `health_index` | DECIMAL(5,2) | CHECK (0 <= health_index <= 100) | Индекс здоровья (0-100) |
| `checked_at` | TIMESTAMP | DEFAULT NOW() | Когда проверено |
| `next_check_at` | TIMESTAMP | | Когда следующая проверка |

**Indexes**:
```sql
CREATE INDEX idx_eeat_source ON eeat_scores(source_id);
CREATE INDEX idx_eeat_total ON eeat_scores(total_score DESC);
CREATE INDEX idx_eeat_checked ON eeat_scores(checked_at DESC);
```

**Example Data**:
```json
{
  "id": "eeat-123",
  "source_id": "src-123",
  "total_score": 92.5,
  "authorship_score": 9.2,
  "authorship_details": {
    "has_author": true,
    "author_verified": true,
    "author_expertise": "high"
  },
  "reputation_score": 9.5,
  "security_score": 10.0,
  "freshness_score": 8.5,
  "health_index": 93.0
}
```

---

### 5. analysis_results

**Описание**: Результаты NLP анализа ответов.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Уникальный идентификатор |
| `llm_response_id` | UUID | UNIQUE, REFERENCES llm_responses(id) ON DELETE CASCADE | Ссылка на ответ |
| `sentiment_score` | DECIMAL(3,2) | CHECK (0 <= sentiment_score <= 5) | Тональность (0-5) |
| `sentiment_label` | VARCHAR(20) | | Label: very_negative, negative, neutral, positive, very_positive |
| `sentiment_details` | JSONB | | Детали анализа |
| `completeness_score` | DECIMAL(3,2) | CHECK (0 <= completeness_score <= 5) | Полнота (0-5) |
| `completeness_details` | JSONB | | Какие факты найдены/пропущены |
| `correctness_score` | DECIMAL(3,2) | CHECK (0 <= correctness_score <= 5) | Корректность (0-5) |
| `correctness_details` | JSONB | | Найденные ошибки |
| `key_facts_extracted` | TEXT[] | | Извлечённые ключевые факты |
| `issues_found` | JSONB | | Найденные проблемы |
| `analyzed_at` | TIMESTAMP | DEFAULT NOW() | Время анализа |
| `analyzer_version` | VARCHAR(50) | | Версия анализатора |

**Indexes**:
```sql
CREATE INDEX idx_analysis_response ON analysis_results(llm_response_id);
CREATE INDEX idx_analysis_sentiment ON analysis_results(sentiment_score);
CREATE INDEX idx_analysis_completeness ON analysis_results(completeness_score);
CREATE INDEX idx_analysis_correctness ON analysis_results(correctness_score);
```

**Example Data**:
```json
{
  "id": "analysis-123",
  "llm_response_id": "abc-123",
  "sentiment_score": 4.2,
  "sentiment_label": "positive",
  "completeness_score": 3.8,
  "correctness_score": 4.5,
  "key_facts_extracted": [
    "GDP: 225.6 billion USD",
    "Main industries: oil, gas, mining"
  ],
  "issues_found": {
    "missing_facts": ["unemployment rate"],
    "potential_errors": []
  }
}
```

---

### 6. source_citations

**Описание**: Связь between LLM responses и cited sources (many-to-many).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Уникальный идентификатор |
| `llm_response_id` | UUID | REFERENCES llm_responses(id) ON DELETE CASCADE | Ссылка на ответ |
| `source_id` | UUID | REFERENCES sources(id) ON DELETE CASCADE | Ссылка на источник |
| `position` | INTEGER | | Позиция в списке источников (0-based) |
| `citation_text` | TEXT | | Как источник процитирован в ответе |
| `relevance_score` | DECIMAL(3,2) | | Релевантность источника (0-5) |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Когда добавлено |

**Indexes**:
```sql
CREATE INDEX idx_citations_response ON source_citations(llm_response_id);
CREATE INDEX idx_citations_source ON source_citations(source_id);
CREATE UNIQUE INDEX idx_citations_unique ON source_citations(llm_response_id, source_id);
```

**Constraints**:
```sql
ALTER TABLE source_citations ADD CONSTRAINT unique_response_source
UNIQUE(llm_response_id, source_id);
```

---

### 7. analysis_runs

**Описание**: Журнал запусков анализа (для мониторинга и отладки).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Уникальный идентификатор |
| `run_type` | VARCHAR(50) | NOT NULL | Тип: manual, scheduled_daily, scheduled_weekly, etc. |
| `status` | VARCHAR(50) | DEFAULT 'running' | Status: running, completed, failed, partial |
| `topics_analyzed` | INTEGER | DEFAULT 0 | Количество проанализированных тем |
| `total_topics` | INTEGER | | Всего тем для анализа |
| `llm_systems` | JSONB | NOT NULL | Какие LLM использовались |
| `config` | JSONB | | Конфигурация запуска |
| `started_at` | TIMESTAMP | DEFAULT NOW() | Время начала |
| `completed_at` | TIMESTAMP | | Время завершения |
| `duration_seconds` | INTEGER | | Длительность в секундах |
| `error_message` | TEXT | | Сообщение об ошибке |
| `stats` | JSONB | | Статистика (успешно/ошибок) |
| `triggered_by` | UUID | REFERENCES auth.users(id) | Кто запустил |

**Indexes**:
```sql
CREATE INDEX idx_runs_status ON analysis_runs(status);
CREATE INDEX idx_runs_started ON analysis_runs(started_at DESC);
CREATE INDEX idx_runs_type ON analysis_runs(run_type);
```

**Example Data**:
```json
{
  "id": "run-123",
  "run_type": "scheduled_daily",
  "status": "completed",
  "topics_analyzed": 20,
  "total_topics": 20,
  "llm_systems": ["chatgpt", "bing", "gemini", "perplexity", "copilot"],
  "stats": {
    "total_queries": 500,
    "successful": 495,
    "failed": 5,
    "avg_response_time_ms": 1500
  },
  "duration_seconds": 780
}
```

---

### 8. reports

**Описание**: Сгенерированные отчёты.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Уникальный идентификатор |
| `report_type` | VARCHAR(50) | NOT NULL | Тип: weekly, monthly, comprehensive, custom |
| `title` | VARCHAR(255) | NOT NULL | Заголовок отчёта |
| `period_start` | DATE | | Начало периода |
| `period_end` | DATE | | Конец периода |
| `pdf_url` | TEXT | | URL PDF файла (Supabase Storage) |
| `data` | JSONB | NOT NULL | JSON данные отчёта |
| `metadata` | JSONB | | Дополнительные метаданные |
| `generated_at` | TIMESTAMP | DEFAULT NOW() | Время генерации |
| `generated_by` | UUID | REFERENCES auth.users(id) | Кто сгенерировал |
| `status` | VARCHAR(50) | DEFAULT 'completed' | Status: generating, completed, failed |
| `views_count` | INTEGER | DEFAULT 0 | Сколько раз просмотрен |

**Indexes**:
```sql
CREATE INDEX idx_reports_type ON reports(report_type);
CREATE INDEX idx_reports_period ON reports(period_start, period_end);
CREATE INDEX idx_reports_generated ON reports(generated_at DESC);
```

---

## Views

### v_topic_summary

**Описание**: Сводка по темам с последними метриками.

```sql
CREATE VIEW v_topic_summary AS
SELECT
    t.id,
    t.name,
    t.priority,
    t.status,
    COUNT(DISTINCT lr.id) as total_responses,
    AVG(ar.sentiment_score) as avg_sentiment,
    AVG(ar.completeness_score) as avg_completeness,
    AVG(ar.correctness_score) as avg_correctness,
    MAX(lr.created_at) as last_analyzed
FROM topics t
LEFT JOIN llm_responses lr ON t.id = lr.topic_id
LEFT JOIN analysis_results ar ON lr.id = ar.llm_response_id
GROUP BY t.id, t.name, t.priority, t.status;
```

### v_source_stats

**Описание**: Статистика по источникам.

```sql
CREATE VIEW v_source_stats AS
SELECT
    s.id,
    s.url,
    s.domain,
    s.source_type,
    s.citation_count,
    e.total_score as eeat_score,
    e.health_index,
    COUNT(DISTINCT sc.llm_response_id) as unique_citations,
    MAX(sc.created_at) as last_cited
FROM sources s
LEFT JOIN eeat_scores e ON s.id = e.source_id
LEFT JOIN source_citations sc ON s.id = sc.source_id
GROUP BY s.id, s.url, s.domain, s.source_type, s.citation_count,
         e.total_score, e.health_index;
```

---

## Functions

### update_updated_at()

**Описание**: Автоматически обновляет updated_at при изменении записи.

```sql
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Применяем к topics
CREATE TRIGGER update_topics_updated_at
BEFORE UPDATE ON topics
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
```

### increment_citation_count()

**Описание**: Увеличивает счётчик цитирований при добавлении source_citation.

```sql
CREATE OR REPLACE FUNCTION increment_citation_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE sources
    SET citation_count = citation_count + 1,
        last_seen = NOW()
    WHERE id = NEW.source_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER increment_citation
AFTER INSERT ON source_citations
FOR EACH ROW
EXECUTE FUNCTION increment_citation_count();
```

---

## Row Level Security (RLS)

### Topics

```sql
-- Enable RLS
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;

-- Everyone can read
CREATE POLICY "Public read access"
ON topics FOR SELECT
USING (true);

-- Only authenticated admins can modify
CREATE POLICY "Admin write access"
ON topics FOR ALL
USING (
  auth.jwt() ->> 'role' = 'admin'
);
```

### LLM Responses

```sql
ALTER TABLE llm_responses ENABLE ROW LEVEL SECURITY;

-- Authenticated users can read
CREATE POLICY "Authenticated read access"
ON llm_responses FOR SELECT
TO authenticated
USING (true);

-- System can write
CREATE POLICY "System write access"
ON llm_responses FOR INSERT
TO authenticated
WITH CHECK (
  auth.jwt() ->> 'role' IN ('admin', 'system')
);
```

---

## Migration Scripts

### Initial Migration

```sql
-- migrations/001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables in order (respecting foreign keys)
CREATE TABLE topics (...);
CREATE TABLE llm_responses (...);
CREATE TABLE sources (...);
CREATE TABLE eeat_scores (...);
CREATE TABLE analysis_results (...);
CREATE TABLE source_citations (...);
CREATE TABLE analysis_runs (...);
CREATE TABLE reports (...);

-- Create indexes
-- Create views
-- Create functions
-- Create triggers
-- Setup RLS
```

---

## Seed Data

### Priority Topics (20)

```sql
INSERT INTO topics (name, name_ru, priority, category, prompts) VALUES
('Kazakhstan Economy', 'Экономика Казахстана', 5, 'economy',
 '["Tell me about Kazakhstan''s economy", "What are the main industries in Kazakhstan?", ...]'),
('Kazakhstan Tourism', 'Туризм в Казахстане', 4, 'tourism',
 '["What are the tourist attractions in Kazakhstan?", ...]'),
('Astana City', 'Город Астана', 5, 'geography',
 '["Tell me about Astana, Kazakhstan", ...]'),
-- ... 17 more topics
```

---

## Performance Considerations

### Partitioning (Future)

Для масштабирования при больших объёмах данных:

```sql
-- Partition llm_responses by created_at (monthly)
CREATE TABLE llm_responses_2024_01 PARTITION OF llm_responses
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE llm_responses_2024_02 PARTITION OF llm_responses
FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');
```

### Indexes Strategy

- **B-tree indexes**: для equality и range queries
- **GIN indexes**: для JSONB и array поиска
- **Partial indexes**: для часто используемых фильтров

```sql
-- Partial index for active topics only
CREATE INDEX idx_topics_active ON topics(priority DESC)
WHERE status = 'active';

-- GIN index for JSONB search
CREATE INDEX idx_llm_responses_metadata ON llm_responses USING GIN (metadata);
```

---

## Backup Strategy

- **Daily backups**: Automated via Supabase
- **Point-in-time recovery**: Enabled
- **Retention**: 30 days
- **Export**: Weekly export to S3 (optional)

---

## Monitoring Queries

### Check database size

```sql
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Active analysis runs

```sql
SELECT * FROM analysis_runs
WHERE status = 'running'
ORDER BY started_at DESC;
```

### Top cited sources

```sql
SELECT domain, citation_count
FROM sources
ORDER BY citation_count DESC
LIMIT 10;
```
