# SGEO Dashboard - Мониторинг и Аналитика LLM

## О проекте

Система мониторинга и аналитики SGEO — это интерактивное веб-приложение для отслеживания и оптимизации представления информации о Казахстане и партнёрах в системах искусственного интеллекта (ChatGPT, Bing, Copilot, Perplexity, Gemini).

## Основная цель

Обеспечить контроль качества и корректности информации о Казахстане в ответах больших языковых моделей (LLM) через систему непрерывного мониторинга, анализа и оптимизации контента.

## Ключевые возможности

- **Мониторинг 5 LLM-систем**: ChatGPT, Bing, Copilot, Perplexity, Gemini
- **20 приоритетных тем** с автоматическим сбором данных
- **NLP-анализ** контента (тональность, полнота, корректность)
- **E-E-A-T скоринг** источников (0-100)
- **Автоматические отчёты** в PDF
- **Интерактивная визуализация** данных
- **Система алертов** для критических изменений

## Технологический стек

- **Frontend**: Next.js 14, React, TypeScript, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes, tRPC
- **Database**: PostgreSQL (Supabase)
- **Analytics**: Python (FastAPI) для NLP-анализа
- **PDF Generation**: Puppeteer/React-PDF
- **Deployment**: Vercel/Docker

## Структура проекта

```
sgeo/
├── docs/              # Документация
├── frontend/          # Next.js приложение
├── backend/           # Python FastAPI для аналитики
├── database/          # Схемы и миграции БД
├── scripts/           # Скрипты автоматизации
└── tests/             # Тесты
```

## Документация

- [План разработки](./docs/PROJECT_PLAN.md)
- [Архитектура](./docs/ARCHITECTURE.md)
- [Дорожная карта](./docs/ROADMAP.md)
- [Технический стек](./docs/TECH_STACK.md)

## Быстрый старт

```bash
# Клонирование репозитория
git clone <repository-url>
cd sgeo

# Установка зависимостей
npm install

# Настройка окружения
cp .env.example .env.local

# Запуск в режиме разработки
npm run dev
```

## Лицензия

Proprietary - All rights reserved

## Контакты

Для вопросов и предложений: [contact info]
