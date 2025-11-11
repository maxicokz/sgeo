# План разработки SGEO Dashboard

## Обзор проекта

Веб-приложение для мониторинга и аналитики представления информации о Казахстане в 5 LLM-системах (ChatGPT, Bing, Copilot, Perplexity, Gemini).

---

## Фаза 1: Подготовка и Infrastructure (2 недели)

### 1.1 Настройка проекта
- [ ] Инициализация Next.js 14 проекта с TypeScript
- [ ] Настройка ESLint, Prettier, Husky
- [ ] Настройка TailwindCSS и shadcn/ui
- [ ] Конфигурация монорепо структуры
- [ ] Настройка CI/CD pipeline (GitHub Actions)

### 1.2 База данных
- [ ] Создание Supabase проекта
- [ ] Проектирование схемы БД:
  - Таблица `llm_responses` (ответы от LLM)
  - Таблица `topics` (20 приоритетных тем)
  - Таблица `sources` (источники цитирования)
  - Таблица `eeat_scores` (E-E-A-T метрики)
  - Таблица `analysis_runs` (журнал запусков)
  - Таблица `reports` (сгенерированные отчёты)
- [ ] Создание миграций и сидов
- [ ] Настройка Row Level Security (RLS)
- [ ] Настройка бэкапов

### 1.3 Аутентификация
- [ ] Интеграция Supabase Auth
- [ ] Создание страниц Login/Register
- [ ] Настройка ролей и прав доступа
- [ ] Middleware для защиты маршрутов

**Результат**: Готовая инфраструктура для разработки

---

## Фаза 2: Backend и API (3 недели)

### 2.1 Python FastAPI сервис
- [ ] Инициализация FastAPI проекта
- [ ] Настройка Poetry для управления зависимостями
- [ ] Структура микросервиса:
  ```
  backend/
  ├── app/
  │   ├── api/          # API endpoints
  │   ├── core/         # Конфигурация
  │   ├── models/       # Pydantic модели
  │   ├── services/     # Бизнес-логика
  │   └── llm/          # Интеграции с LLM
  ```

### 2.2 LLM интеграции
- [ ] **ChatGPT API**:
  - Клиент для OpenAI API
  - Обработка rate limits
  - Сохранение версий моделей
- [ ] **Bing/Copilot**:
  - Selenium/Playwright для скрейпинга
  - Обработка скриншотов
- [ ] **Perplexity API**:
  - API клиент
  - Парсинг источников
- [ ] **Gemini API**:
  - Google AI API интеграция
  - Обработка ответов
- [ ] Унифицированный интерфейс для всех LLM
- [ ] Система очередей (Celery/BullMQ) для асинхронной обработки

### 2.3 NLP Analysis Engine
- [ ] Модуль оценки тональности (Sentiment Analysis):
  - Интеграция HuggingFace Transformers
  - Multilingual модели (EN/RU/KZ)
  - Шкала оценки 0-5
- [ ] Модуль оценки полноты (Completeness):
  - Проверка наличия ключевых фактов
  - Сравнение с эталонными данными
- [ ] Модуль оценки корректности (Correctness):
  - Fact-checking алгоритмы
  - Выявление неточностей
- [ ] Модуль извлечения источников:
  - Парсинг URL и цитат
  - Классификация типов источников

### 2.4 E-E-A-T Scoring System
- [ ] Модуль анализа авторства (Authorship Clarity):
  - Проверка metadata автора
  - Оценка экспертности
- [ ] Модуль анализа репутации (Reputation):
  - Domain authority проверка
  - Backlink analysis
- [ ] Модуль безопасности (Security):
  - HTTPS проверка
  - SSL сертификаты
- [ ] Модуль свежести контента (Freshness):
  - Анализ дат публикации
  - Частота обновлений
- [ ] Агрегированный E-E-A-T скор (0-100)

### 2.5 Next.js API Routes
- [ ] tRPC setup для type-safe API
- [ ] API endpoints:
  - `/api/trpc/topics.*` - управление темами
  - `/api/trpc/analysis.*` - запуск анализа
  - `/api/trpc/reports.*` - генерация отчётов
  - `/api/trpc/sources.*` - управление источниками
  - `/api/trpc/dashboard.*` - данные для дашборда
- [ ] Валидация данных с Zod
- [ ] Error handling и logging

**Результат**: Полнофункциональный backend с LLM интеграциями и аналитикой

---

## Фаза 3: Frontend - Core Dashboard (4 недели)

### 3.1 Дизайн-система
- [ ] Настройка shadcn/ui компонентов
- [ ] Кастомизация темы (цвета, типографика)
- [ ] Тёмная/светлая тема
- [ ] Библиотека UI компонентов:
  - Cards, Badges, Buttons
  - Tables, Modals, Dropdowns
  - Charts компоненты
  - Alert/Notification система

### 3.2 Главная панель (Dashboard Overview)
- [ ] Layout с навигацией
- [ ] Overall E-E-A-T Score:
  - Круговая диаграмма (Recharts/Victory)
  - Детальная разбивка по критериям
  - Цветовая индикация (зелёный/жёлтый/красный)
- [ ] Top Cited Sources:
  - Гистограмма источников
  - Интерактивные фильтры
- [ ] Alert панель:
  - Real-time уведомления
  - Система приоритетов
- [ ] Фильтры:
  - По источникам (Official/All)
  - По периоду (день/неделя/месяц)
  - По LLM системам
- [ ] Рекомендации:
  - Автоматические suggestions
  - Action items

### 3.3 Модуль тем (Topics Module)
- [ ] Список 20 приоритетных тем:
  - Табличное представление
  - Сортировка и фильтрация
  - Статус индикаторы (🔴🟡🟢)
- [ ] Детальная страница темы:
  - Метрики по теме
  - Сравнение между LLM
  - История изменений
  - Источники цитирования
- [ ] Управление темами:
  - Добавление/редактирование тем
  - Настройка промптов (5 вариантов на тему)
  - Приоритизация

### 3.4 Модуль источников (Sources Module)
- [ ] Карта источников:
  - Визуализация всех источников
  - Иерархическая структура
  - Фильтры по типам
- [ ] Source Detail View:
  - E-E-A-T метрики
  - Индекс здоровья (Health Index)
  - Частота цитирования
  - Timeline присутствия в LLM
- [ ] Source Optimization Planner:
  - Рекомендации по улучшению
  - План действий
  - Отслеживание прогресса

### 3.5 Модуль сравнительной аналитики
- [ ] LLM Comparison View:
  - Side-by-side сравнение ответов
  - Highlight различий
  - Оценка качества по LLM
- [ ] Тренды и динамика:
  - Графики изменений во времени
  - До/После сравнение
  - Эффективность SGEO-вмешательств
- [ ] Корреляционный анализ:
  - Связь между E-E-A-T и цитированием
  - Паттерны поведения LLM

**Результат**: Полнофункциональный дашборд с интерактивной аналитикой

---

## Фаза 4: Автоматизация и Отчётность (2 недели)

### 4.1 Scheduler для автоматического сбора
- [ ] Настройка cron jobs:
  - Ежедневный сбор данных (20 тем × 5 LLM × 5 промптов = 500 запросов)
  - Еженедельный full analysis
  - Ежемесячный comprehensive report
- [ ] Queue management:
  - Приоритизация задач
  - Retry логика
  - Rate limiting для API
- [ ] Monitoring и logging:
  - Журнал запусков
  - Error tracking
  - Performance metrics

### 4.2 PDF Генерация
- [ ] Настройка Puppeteer/React-PDF
- [ ] Шаблоны отчётов:
  - **Еженедельный отчёт**:
    - Executive Summary
    - Ключевые метрики
    - Top insights
    - Action items
  - **Итоговый отчёт**:
    - Методология
    - Индексы до/после
    - Карта источников
    - SGEO-вмешательства
    - Case studies
    - Roadmap масштабирования
- [ ] Кастомизация отчётов:
  - Выбор разделов
  - Фильтры данных
  - Брендирование
- [ ] Export функционал:
  - PDF
  - Excel (xlsx)
  - CSV

### 4.3 Email уведомления
- [ ] Интеграция SendGrid/Resend
- [ ] Email шаблоны:
  - Еженедельный digest
  - Критические алерты
  - Отчёты по запросу
- [ ] Настройки подписок:
  - Управление уведомлениями
  - Частота отправки

**Результат**: Полная автоматизация сбора данных и отчётности

---

## Фаза 5: Advanced Features (3 недели)

### 5.1 AI-powered Insights
- [ ] Автоматическое выявление аномалий:
  - Резкие изменения в метриках
  - Необычные паттерны цитирования
  - Новые источники
- [ ] Predictive analytics:
  - Прогноз трендов
  - Рекомендации по оптимизации
- [ ] Natural Language Insights:
  - Генерация текстовых summary
  - Автоматические комментарии к данным

### 5.2 Collaboration Tools
- [ ] Комментарии и заметки:
  - Комментарии к темам/источникам
  - Shared notes
  - @mentions
- [ ] Task Management:
  - Создание задач из рекомендаций
  - Назначение ответственных
  - Отслеживание выполнения
- [ ] Версионирование:
  - История изменений
  - Сравнение версий
  - Rollback функционал

### 5.3 Advanced Visualizations
- [ ] Interactive Network Graph:
  - Связи между источниками и темами
  - Influence mapping
- [ ] Heatmaps:
  - Временные паттерны
  - Корреляции
- [ ] Geospatial visualization (опционально):
  - Географическое распределение источников

### 5.4 API для внешних интеграций
- [ ] REST API документация (OpenAPI/Swagger)
- [ ] Webhooks для событий:
  - Новые алерты
  - Завершение анализа
  - Критические изменения
- [ ] SDK для популярных языков (опционально)

**Результат**: Продвинутые функции для глубокого анализа

---

## Фаза 6: Testing & Optimization (2 недели)

### 6.1 Тестирование
- [ ] Unit тесты:
  - Frontend компоненты (Jest + React Testing Library)
  - Backend сервисы (Pytest)
  - Покрытие >80%
- [ ] Integration тесты:
  - API endpoints
  - Database operations
  - LLM интеграции (mocked)
- [ ] E2E тесты:
  - Playwright для критических user flows
  - Автоматизация UI тестов
- [ ] Performance тестирование:
  - Load testing (k6/Artillery)
  - Database query optimization

### 6.2 Оптимизация
- [ ] Frontend:
  - Code splitting
  - Lazy loading
  - Image optimization
  - Bundle size analysis
- [ ] Backend:
  - Database indexing
  - Caching стратегия (Redis)
  - Query optimization
- [ ] SEO (если публичный):
  - Meta tags
  - Sitemap
  - Structured data

### 6.3 Security
- [ ] Security audit:
  - OWASP Top 10 проверка
  - Dependency vulnerabilities scan
- [ ] Penetration testing
- [ ] Data encryption:
  - At rest
  - In transit
- [ ] Rate limiting и DDoS protection

**Результат**: Протестированное и оптимизированное приложение

---

## Фаза 7: Deployment & Documentation (1 неделя)

### 7.1 Deployment
- [ ] Production environment setup:
  - Vercel для Next.js
  - Railway/Render для Python FastAPI
  - Supabase production instance
- [ ] Docker контейнеризация
- [ ] Environment variables management
- [ ] Monitoring setup:
  - Sentry для error tracking
  - Vercel Analytics
  - Database monitoring

### 7.2 Документация
- [ ] User Guide:
  - Введение
  - Основные функции
  - Tutorials
  - FAQ
- [ ] Developer Documentation:
  - Architecture overview
  - API documentation
  - Database schema
  - Deployment guide
- [ ] Admin Guide:
  - Управление пользователями
  - Конфигурация системы
  - Maintenance procedures

### 7.3 Training & Handoff
- [ ] Обучающие видео
- [ ] Live demo сессии
- [ ] Onboarding чеклисты

**Результат**: Production-ready приложение с полной документацией

---

## Приоритизация и зависимости

### Critical Path
1. Фаза 1 → Фаза 2 → Фаза 3 (последовательно)
2. Фаза 4 может начаться после завершения Фазы 2
3. Фаза 5 параллельно с Фазой 4
4. Фаза 6 и 7 в конце

### MVP Scope (первые 8 недель)
- Фаза 1: Infrastructure
- Фаза 2: Backend с базовой LLM интеграцией (хотя бы ChatGPT + 1 другая)
- Фаза 3: Core Dashboard (главная панель + модуль тем)
- Фаза 4: Базовая автоматизация и PDF отчёты

### Post-MVP
- Остальные LLM интеграции
- Advanced features (Фаза 5)
- Полное тестирование (Фаза 6)

---

## Команда и роли

### Рекомендуемый состав
- **1 Frontend Developer** (React/Next.js)
- **1 Backend Developer** (Python/FastAPI)
- **1 Full-stack Developer** (Next.js API + интеграции)
- **1 ML/NLP Engineer** (part-time для NLP модулей)
- **1 DevOps Engineer** (part-time для infrastructure)
- **1 UI/UX Designer** (part-time)
- **1 Project Manager**

### Альтернатива для малой команды (2-3 разработчика)
- **1 Full-stack** (Next.js + Backend)
- **1 Python Developer** (FastAPI + NLP)
- **1 Designer/Frontend** (UI/UX + React)

---

## Риски и митигация

### Технические риски
| Риск | Вероятность | Влияние | Митигация |
|------|-------------|---------|-----------|
| LLM API ограничения/изменения | Высокая | Высокое | Абстракция интеграций, fallback механизмы |
| Сложность NLP анализа | Средняя | Высокое | Использование готовых моделей, упрощение MVP |
| Performance при больших объёмах | Средняя | Среднее | Caching, pagination, background jobs |
| Изменения в структуре ответов LLM | Высокая | Среднее | Гибкие парсеры, версионирование |

### Бизнес риски
| Риск | Вероятность | Влияние | Митигация |
|------|-------------|---------|-----------|
| Изменение требований | Средняя | Среднее | Agile подход, итеративная разработка |
| Нехватка ресурсов | Средняя | Высокое | Приоритизация MVP, автоматизация |

---

## Timeline Summary

| Фаза | Длительность | Недели |
|------|--------------|--------|
| Фаза 1: Infrastructure | 2 недели | 1-2 |
| Фаза 2: Backend & API | 3 недели | 3-5 |
| Фаза 3: Frontend Dashboard | 4 недели | 6-9 |
| Фаза 4: Automation | 2 недели | 8-9 (параллельно) |
| Фаза 5: Advanced Features | 3 недели | 10-12 |
| Фаза 6: Testing | 2 недели | 13-14 |
| Фаза 7: Deployment | 1 неделя | 15 |

**Общая длительность**: 15-17 недель (~4 месяца)

**MVP**: 8-9 недель (~2 месяца)

---

## Метрики успеха

### Технические KPI
- [ ] Uptime > 99.5%
- [ ] API response time < 200ms (p95)
- [ ] Test coverage > 80%
- [ ] Page load time < 2s

### Бизнес KPI
- [ ] Покрытие всех 20 приоритетных тем
- [ ] Успешность анализа > 95%
- [ ] Точность E-E-A-T оценки (validated)
- [ ] Пользовательская удовлетворённость (user feedback)

---

## Следующие шаги

1. ✅ Утверждение плана
2. Формирование команды
3. Kick-off meeting
4. Создание детальных задач в Jira/Linear
5. Начало Фазы 1
