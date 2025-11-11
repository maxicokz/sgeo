# Дорожная карта SGEO Dashboard

## Обзор

Разработка SGEO Dashboard разделена на 7 фаз с общей длительностью **15-17 недель** (~4 месяца).
**MVP** будет готов через **8-9 недель** (~2 месяца).

---

## Временная шкала

```
Q1 2024                Q2 2024                Q3 2024
│                      │                      │
├─────┬─────┬─────┬───┼─────┬─────┬─────┬───┼─────┬─────┐
│ Week│ Week│ Week│Week│ Week│ Week│ Week│Week│ Week│ Week│
│ 1-2 │ 3-5 │ 6-9 │8-9 │10-12│13-14│ 15  │ 16 │ 17  │ 18+ │
├─────┼─────┼─────┼───┼─────┼─────┼─────┼───┼─────┼─────┤
│  1  │  2  │  3  │ 4 │  5  │  6  │  7  │   │     │Post │
│Infra│Back │Front│Auto│Adv  │Test │Deploy│   │     │MVP  │
│     │end  │end  │    │Feat │     │     │   │     │     │
└─────┴─────┴─────┴───┴─────┴─────┴─────┴───┴─────┴─────┘
                        ▲
                       MVP
```

---

## Фаза 1: Infrastructure Setup (Недели 1-2)

### Цели
Подготовить фундамент для разработки: проект, база данных, аутентификация.

### Deliverables
- ✅ Next.js 14 проект с TypeScript
- ✅ Supabase: PostgreSQL + Auth + Storage
- ✅ Схема базы данных (7 таблиц)
- ✅ CI/CD pipeline (GitHub Actions)
- ✅ Система аутентификации
- ✅ Development environment

### Команда
- 1 Full-stack Developer
- 0.5 DevOps Engineer

### Критерии приёмки
- [ ] Проект запускается локально (`npm run dev`)
- [ ] Пользователь может зарегистрироваться и войти
- [ ] База данных создана и миграции работают
- [ ] CI/CD pipeline выполняет lint и тесты

---

## Фаза 2: Backend & LLM Integration (Недели 3-5)

### Цели
Разработать Python FastAPI сервис с интеграцией LLM и аналитикой.

### Deliverables
- ✅ FastAPI сервис с API endpoints
- ✅ ChatGPT API интеграция
- ✅ Bing/Copilot web scraping (Playwright)
- ✅ Perplexity API интеграция
- ✅ Gemini API интеграция
- ✅ NLP Analysis Engine:
  - Sentiment Analysis
  - Completeness Scoring
  - Correctness Checking
- ✅ E-E-A-T Scoring System
- ✅ Celery background jobs
- ✅ Next.js API Routes + tRPC

### Команда
- 1 Backend Developer (Python)
- 0.5 ML/NLP Engineer
- 1 Full-stack Developer (tRPC)

### Критерии приёмки
- [ ] API может получить ответ от всех 5 LLM
- [ ] NLP анализ возвращает корректные оценки (0-5)
- [ ] E-E-A-T скор рассчитывается для источника
- [ ] Background job успешно обрабатывает тему
- [ ] API документация (Swagger) доступна

### Риски
- **Высокий**: Изменения в API LLM → Митигация: абстракция клиентов
- **Средний**: Сложность NLP → Митигация: использование готовых моделей

---

## Фаза 3: Frontend Dashboard (Недели 6-9)

### Цели
Создать интерактивный дашборд с основными модулями.

### Deliverables
- ✅ Дизайн-система (shadcn/ui + Tailwind)
- ✅ Главная панель (Dashboard Overview):
  - Overall E-E-A-T Score
  - Top Cited Sources
  - Alert Panel
  - Recommendations
- ✅ Модуль тем (Topics):
  - Список 20 тем
  - Детальная страница темы
  - Управление промптами
- ✅ Модуль источников (Sources):
  - Карта источников
  - Source Detail View
  - Optimization Planner
- ✅ Сравнительная аналитика:
  - LLM Comparison
  - Тренды

### Команда
- 1 Frontend Developer
- 1 Full-stack Developer
- 0.5 UI/UX Designer

### Критерии приёмки
- [ ] Пользователь видит дашборд с реальными данными
- [ ] Можно создать/редактировать тему
- [ ] Графики отображаются корректно
- [ ] Responsive design (desktop + tablet)
- [ ] Lighthouse score > 85

### UI/UX Milestones
- Week 6: Wireframes утверждены
- Week 7: Дизайн-система готова
- Week 8: Главная панель + Topics
- Week 9: Sources + Analytics

---

## Фаза 4: Automation & Reporting (Недели 8-9, параллельно)

### Цели
Автоматизировать сбор данных и генерацию отчётов.

### Deliverables
- ✅ Scheduler (Celery Cron):
  - Ежедневный сбор данных
  - Еженедельный full analysis
  - Ежемесячный comprehensive report
- ✅ PDF генерация (Puppeteer):
  - Еженедельный отчёт
  - Итоговый отчёт
- ✅ Email уведомления (SendGrid/Resend)
- ✅ Export функционал (PDF, Excel, CSV)

### Команда
- 1 Backend Developer
- 1 Full-stack Developer

### Критерии приёмки
- [ ] Ежедневный cron job запускается автоматически
- [ ] PDF отчёт генерируется корректно
- [ ] Email отправляется с отчётом
- [ ] Можно скачать данные в Excel

---

## 🎯 **MVP (Недели 1-9)**

### Что включено в MVP
1. **Infrastructure**: PostgreSQL, Auth, CI/CD
2. **Backend**:
   - ChatGPT + 1 другой LLM (Gemini)
   - Базовый NLP анализ (sentiment)
   - E-E-A-T скоринг
3. **Frontend**:
   - Главная панель
   - Модуль тем (CRUD + анализ)
   - Базовые графики
4. **Automation**:
   - Ручной запуск анализа
   - Базовый PDF отчёт

### Что НЕ включено в MVP
- Остальные LLM (Bing, Copilot, Perplexity)
- Продвинутый NLP (completeness, correctness)
- Модуль источников (карта)
- Collaboration tools
- Advanced visualizations

### MVP Demo (Неделя 9)
- Presentation для stakeholders
- User feedback session
- Go/No-Go решение для продолжения

---

## Фаза 5: Advanced Features (Недели 10-12)

### Цели
Добавить продвинутые функции для глубокого анализа.

### Deliverables
- ✅ AI-powered Insights:
  - Автоматическое выявление аномалий
  - Predictive analytics
  - Natural Language Insights
- ✅ Collaboration Tools:
  - Комментарии и заметки
  - Task Management
  - Версионирование
- ✅ Advanced Visualizations:
  - Network Graph (источники ↔ темы)
  - Heatmaps
  - Geospatial visualization
- ✅ Webhooks API для интеграций

### Команда
- 1 Full-stack Developer
- 0.5 ML Engineer
- 1 Frontend Developer

### Критерии приёмки
- [ ] Система автоматически выявляет аномалии
- [ ] Пользователи могут создавать задачи
- [ ] Network graph визуализирует связи
- [ ] Webhooks отправляют уведомления

---

## Фаза 6: Testing & Optimization (Недели 13-14)

### Цели
Протестировать и оптимизировать приложение для production.

### Deliverables
- ✅ Unit тесты (coverage > 80%)
- ✅ Integration тесты (API, DB)
- ✅ E2E тесты (Playwright)
- ✅ Performance optimization:
  - Code splitting
  - Lazy loading
  - Caching strategy
  - Database indexing
- ✅ Security audit:
  - OWASP Top 10
  - Dependency scan
  - Penetration testing

### Команда
- 2 Full-stack Developers
- 0.5 QA Engineer
- 0.5 Security Expert

### Критерии приёмки
- [ ] Test coverage > 80%
- [ ] Lighthouse score > 90
- [ ] Page load time < 2s
- [ ] API response time < 200ms (p95)
- [ ] Нет критических уязвимостей

### Testing Milestones
- Week 13: Unit + Integration tests
- Week 14: E2E tests + Performance testing

---

## Фаза 7: Deployment & Documentation (Неделя 15)

### Цели
Развернуть приложение в production и подготовить документацию.

### Deliverables
- ✅ Production deployment:
  - Vercel (Next.js)
  - Railway/Render (FastAPI)
  - Supabase (PostgreSQL)
- ✅ Monitoring setup (Sentry, Vercel Analytics)
- ✅ User Guide
- ✅ Developer Documentation
- ✅ Admin Guide
- ✅ Training materials (видео, tutorials)

### Команда
- 1 Full-stack Developer
- 0.5 DevOps Engineer
- 0.5 Technical Writer

### Критерии приёмки
- [ ] Production environment работает стабильно
- [ ] Monitoring настроен и работает
- [ ] Документация полная и актуальная
- [ ] Обучение проведено для пользователей

---

## Post-MVP Roadmap (Недели 16+)

### Q3 2024: Iteration & Enhancement

#### Неделя 16-18: User Feedback Loop
- **Цель**: Собрать и обработать feedback от MVP
- **Deliverables**:
  - Анализ метрик использования
  - User interviews
  - Приоритизация backlog
  - Bug fixes и UX improvements

#### Неделя 19-22: Scaling & Internationalization
- **Цель**: Масштабировать систему и добавить локализацию
- **Deliverables**:
  - Поддержка 50+ тем (вместо 20)
  - Локализация (RU, EN, KZ)
  - Performance optimization для больших объёмов
  - Multi-region deployment

#### Неделя 23-26: Advanced Analytics
- **Цель**: Углубить аналитику и ML capabilities
- **Deliverables**:
  - Custom ML модели для fact-checking
  - Конкурентный анализ (сравнение с другими странами)
  - Sentiment trend forecasting
  - Automated content recommendations

### Q4 2024: Enterprise Features

#### Неделя 27-30: Multi-tenant Architecture
- **Цель**: Поддержка нескольких организаций
- **Deliverables**:
  - Multi-tenancy support
  - White-labeling
  - Custom branding
  - SSO integration (SAML, OAuth)

#### Неделя 31-34: Mobile Application
- **Цель**: Создать мобильное приложение
- **Deliverables**:
  - React Native app (iOS + Android)
  - Push notifications
  - Offline mode
  - Mobile-optimized reports

---

## Ключевые вехи (Milestones)

| Milestone | Дата (примерная) | Описание |
|-----------|------------------|----------|
| **M1: Kickoff** | Week 1 | Формирование команды, planning |
| **M2: Infrastructure Ready** | Week 2 | База данных, auth, CI/CD |
| **M3: Backend API Complete** | Week 5 | Все LLM интеграции работают |
| **M4: MVP Frontend** | Week 9 | Основной дашборд готов |
| **M5: MVP Demo** | Week 9 | Презентация MVP stakeholders |
| **M6: Feature Complete** | Week 12 | Все функции реализованы |
| **M7: Production Ready** | Week 15 | Тестирование завершено |
| **M8: Launch** | Week 15 | Public release |
| **M9: Post-Launch Review** | Week 18 | Анализ метрик, feedback |

---

## Зависимости между фазами

```
Фаза 1 (Infrastructure)
    ↓
    ├─→ Фаза 2 (Backend)
    │       ↓
    │   Фаза 3 (Frontend) ←─┐
    │       ↓               │
    └─→ Фаза 4 (Automation)─┘
            ↓
        Фаза 5 (Advanced Features)
            ↓
        Фаза 6 (Testing)
            ↓
        Фаза 7 (Deployment)
```

### Параллельная работа
- **Фаза 3 + Фаза 4**: Недели 8-9 (разные команды)
- **Unit тесты**: Во время разработки (continuous)

---

## Риски и митигация

### Критические риски

| Риск | Фаза | Вероятность | Влияние | Митигация |
|------|------|-------------|---------|-----------|
| LLM API лимиты | 2 | Высокая | Критическое | Rate limiting, caching, fallback |
| Изменения в LLM ответах | 2 | Высокая | Высокое | Гибкие парсеры, версионирование |
| Недооценка NLP сложности | 2 | Средняя | Высокое | MVP с базовым NLP, итерации |
| Performance при масштабе | 3 | Средняя | Среднее | Load testing, optimization early |
| Изменение требований | 1-7 | Средняя | Среднее | Agile, еженедельные синки |
| Нехватка ресурсов | 1-7 | Средняя | Высокое | MVP приоритизация, outsource |

---

## Ресурсы и бюджет

### Команда (Full-time эквиваленты)

| Роль | Фаза 1-2 | Фаза 3-5 | Фаза 6-7 | Total |
|------|----------|----------|----------|-------|
| Frontend Developer | 0 | 1.5 | 1 | 2.5 FTE |
| Backend Developer | 1 | 1 | 1 | 3 FTE |
| Full-stack Developer | 1 | 1 | 1 | 3 FTE |
| ML/NLP Engineer | 0.5 | 0.5 | 0 | 1 FTE |
| DevOps Engineer | 0.5 | 0 | 0.5 | 1 FTE |
| UI/UX Designer | 0.5 | 0.5 | 0 | 1 FTE |
| QA Engineer | 0 | 0 | 1 | 1 FTE |
| Project Manager | 0.5 | 0.5 | 0.5 | 1.5 FTE |
| **Total** | **4** | **5** | **5** | **14 FTE** |

### Infrastructure Costs (месячно)

| Сервис | Tier | Стоимость |
|--------|------|-----------|
| Vercel | Pro | $20/мес |
| Supabase | Pro | $25/мес |
| Railway (FastAPI) | Hobby | $5/мес |
| Redis Cloud | 256MB | $0/мес (free) |
| SendGrid | Free | $0/мес |
| Sentry | Team | $26/мес |
| OpenAI API | Pay-as-you-go | ~$100/мес |
| Google AI | Pay-as-you-go | ~$50/мес |
| **Total** | | **~$226/мес** |

### Примерный бюджет (при аутсорсе)

| Позиция | Стоимость |
|---------|-----------|
| Development (14 FTE × 4 мес × $5000/мес) | $280,000 |
| Infrastructure (4 мес × $226) | $904 |
| Contingency (20%) | $56,000 |
| **Total** | **~$337,000** |

---

## Success Metrics

### MVP (Week 9)
- [ ] **Функциональность**: Все core features работают
- [ ] **Performance**: Page load < 3s, API < 500ms
- [ ] **Uptime**: > 95% (dev environment)
- [ ] **Test Coverage**: > 60%
- [ ] **User Feedback**: Positive feedback от 3+ stakeholders

### Production (Week 15)
- [ ] **Функциональность**: 100% features complete
- [ ] **Performance**: Page load < 2s, API < 200ms
- [ ] **Uptime**: > 99.5%
- [ ] **Test Coverage**: > 80%
- [ ] **Security**: Нет критических уязвимостей
- [ ] **Documentation**: Complete user + dev docs

### Post-Launch (Week 18)
- [ ] **Adoption**: 10+ active users
- [ ] **Data**: 1000+ LLM responses analyzed
- [ ] **Accuracy**: E-E-A-T scoring validated
- [ ] **Impact**: Measurable improvement в представлении

---

## Communication Plan

### Weekly Sync
- **Когда**: Каждый понедельник 10:00
- **Участники**: Вся команда
- **Формат**:
  - Progress update (что сделано)
  - Blockers (что мешает)
  - Plan (что на этой неделе)

### Sprint Planning
- **Когда**: Каждые 2 недели (начало спринта)
- **Участники**: PM + Tech Leads
- **Формат**:
  - Review прошлого спринта
  - Planning следующего спринта
  - Оценка задач

### Demo Sessions
- **Когда**: Конец каждой фазы
- **Участники**: Команда + Stakeholders
- **Формат**:
  - Live demo
  - Q&A
  - Feedback сбор

### Retrospectives
- **Когда**: Конец каждой фазы
- **Участники**: Команда
- **Формат**:
  - What went well
  - What didn't go well
  - Action items

---

## Decision Log

### Key Technical Decisions

| Дата | Решение | Обоснование | Альтернативы |
|------|---------|-------------|--------------|
| Week 0 | Next.js 14 | Industry standard, SSR, API routes | Remix, SvelteKit |
| Week 0 | Supabase | PostgreSQL + Auth + Storage | Firebase, AWS RDS |
| Week 0 | FastAPI | Async, fast, auto-docs | Django, Flask |
| Week 0 | tRPC | Type safety, simple | GraphQL, REST |
| Week 1 | Celery | Proven для Python | BullMQ, Temporal |

---

## Следующие действия

### Immediate (This Week)
1. ✅ Утверждение roadmap
2. ⏳ Формирование команды
3. ⏳ Setup GitHub repo
4. ⏳ Create Jira/Linear workspace
5. ⏳ Schedule kickoff meeting

### Week 1
1. ⏳ Kickoff meeting
2. ⏳ Environment setup
3. ⏳ Team onboarding
4. ⏳ Sprint 1 planning
5. ⏳ Start Фаза 1 tasks

---

## Glossary

- **MVP**: Minimum Viable Product
- **FTE**: Full-Time Equivalent
- **LLM**: Large Language Model
- **E-E-A-T**: Experience, Expertise, Authoritativeness, Trustworthiness
- **NLP**: Natural Language Processing
- **tRPC**: TypeScript Remote Procedure Call
- **RLS**: Row Level Security (Supabase)

---

## Версионирование

| Версия | Дата | Автор | Изменения |
|--------|------|-------|-----------|
| 1.0 | 2024-XX-XX | Claude | Initial roadmap |

---

## Appendix

### Useful Links
- [Project Plan](./PROJECT_PLAN.md)
- [Architecture](./ARCHITECTURE.md)
- [Tech Stack](./TECH_STACK.md)
- GitHub: [link]
- Jira/Linear: [link]
- Figma: [link]

### Contact
- **Project Manager**: [name, email]
- **Tech Lead**: [name, email]
- **Product Owner**: [name, email]
