# SGEO Dashboard - Features Overview

## Компоненты Dashboard

### 1. Stats Cards (Карточки статистики)
**Расположение**: Верхняя часть dashboard

**Метрики**:
- **Average Sentiment**: Средняя тональность (4.2/5.0)
- **Topics Monitored**: Количество отслеживаемых тем (20)
- **LLM Systems**: Количество LLM систем (5)
- **Source Quality**: Качество источников (92/100)

**Особенности**:
- Цветовая индикация изменений (зелёный = рост, красный = падение)
- Сравнение с предыдущим периодом

---

### 2. E-E-A-T Score Card (Карточка E-E-A-T оценки)
**Расположение**: Левая часть, крупный блок

**Компоненты**:
- **Круговая диаграмма**: Общий скор (0-100)
- **Radar Chart**: Детализация по категориям
- **Progress Bars**: Оценки по каждой метрике

**Метрики E-E-A-T**:
- Authorship (Авторство): 9.2/10
- Expertise (Экспертность): 8.8/10
- Authority (Авторитетность): 9.5/10
- Trust (Надёжность): 9.0/10
- Security (Безопасность): 10.0/10
- Freshness (Свежесть): 8.5/10

**Интерактивность**:
- Hover для детальной информации
- Клик для drill-down по источнику

---

### 3. Top Cited Sources Chart (График топ источников)
**Расположение**: Правая часть от E-E-A-T

**Тип**: Horizontal Bar Chart

**Данные**:
- worldbank.org: 145 цитирований (35%)
- gov.kz: 120 цитирований (28%)
- wikipedia.org: 65 цитирований (15%)
- britannica.com: 60 цитирований (15%)
- reuters.com: 42 цитирования (10%)
- bbc.com: 30 цитирований (7%)

**Особенности**:
- Разные цвета для каждого источника
- Tooltip с подробной информацией
- Сортировка по количеству цитирований

---

### 4. Trends Chart (График трендов)
**Расположение**: Большой блок под E-E-A-T

**Тип**: Multi-line Chart

**Линии**:
- **Sentiment** (синяя): Тональность
- **Completeness** (зелёная): Полнота
- **Correctness** (оранжевая): Корректность

**Период**: Последние 6 недель

**Особенности**:
- Анимированные линии
- Интерактивный tooltip
- Zoom и pan (будущая функция)

---

### 5. LLM Comparison (Сравнение LLM)
**Расположение**: Справа от Trends Chart

**Тип**: Horizontal Bar Chart

**Данные**:
- ChatGPT: 4.2/5.0
- Bing: 3.8/5.0
- Copilot: 3.9/5.0
- Perplexity: 4.5/5.0 (лучший результат)
- Gemini: 4.1/5.0

**Особенности**:
- Уникальные цвета для каждой LLM
- Сортировка по скору
- Фильтр по периоду (будущая функция)

---

### 6. Topics Table (Таблица тем)
**Расположение**: Широкий блок под графиками

**Колонки**:
- Topic (Название темы)
- Category (Категория)
- Priority (Приоритет 1-5)
- Sentiment (Тональность)
- Completeness (Полнота)
- Correctness (Корректность)
- Status (Статус: 🟢 Good, 🟡 Warning, 🔴 Critical)

**Темы (примеры)**:
1. Kazakhstan Economy - ⭐⭐⭐⭐⭐ - 🟢 Good
2. Astana City - ⭐⭐⭐⭐⭐ - 🟢 Good
3. Oil & Gas Industry - ⭐⭐⭐⭐⭐ - 🟡 Warning
4. Baikonur Cosmodrome - ⭐⭐⭐⭐⭐ - 🟢 Good
5. Tourism - ⭐⭐⭐⭐ - 🟡 Warning
6. Kazakh Culture - ⭐⭐⭐⭐ - 🟢 Good

**Особенности**:
- Сортировка по любой колонке
- Фильтрация по статусу/категории
- Hover для дополнительной информации
- Клик для перехода на детальную страницу темы

---

### 7. Alerts Panel (Панель уведомлений)
**Расположение**: Нижняя левая часть

**Типы алертов**:
- 🔴 **Critical**: Критические проблемы
- 🟡 **Warning**: Предупреждения
- 🔵 **Info**: Информационные уведомления

**Примеры**:
- "Out-of-citation rate +10% for 'Oil & Gas Industry' topic"
- "Sentiment score decreased for 'Tourism' topic"
- "New source detected: economist.com"

**Особенности**:
- Real-time обновления (будущая функция)
- Фильтр по severity
- Mark as read

---

### 8. Recommendations Card (Карточка рекомендаций)
**Расположение**: Нижняя правая часть

**Тип**: AI-powered suggestions

**Примеры рекомендаций**:
- "Improve content freshness on archived pages"
- "Increase external backlinks from academic institutions"
- "Add more structured data to key landing pages"
- "Optimize mobile experience for tourism pages"

**Особенности**:
- Приоритизация рекомендаций
- Клик для создания задачи
- Отметка как выполнено

---

## Цветовая схема

### Primary Colors
- **Primary**: #3b82f6 (синий)
- **Success**: #10b981 (зелёный)
- **Warning**: #f59e0b (оранжевый)
- **Danger**: #ef4444 (красный)

### Status Colors
- **Good**: Зелёный (#10b981)
- **Warning**: Жёлтый (#f59e0b)
- **Critical**: Красный (#ef4444)

### LLM Colors
- **ChatGPT**: #10a37f
- **Bing**: #008272
- **Copilot**: #0078d4
- **Perplexity**: #6366f1
- **Gemini**: #4285f4

---

## Интерактивные функции

### Реализовано
- ✅ Hover tooltips на графиках
- ✅ Responsive design (desktop/tablet/mobile)
- ✅ Smooth animations
- ✅ Цветовая индикация статусов

### В планах
- ⏳ Real-time data updates (WebSocket)
- ⏳ Drill-down на детальные страницы
- ⏳ Фильтрация и поиск
- ⏳ Export в PDF/Excel
- ⏳ Customizable dashboard layout
- ⏳ Dark mode toggle
- ⏳ Date range picker для графиков

---

## Технические особенности

### Performance
- **Code splitting**: Lazy loading компонентов
- **Memoization**: React.memo для оптимизации
- **Virtualization**: Для больших списков (будущая функция)

### Accessibility
- **Keyboard navigation**: Поддержка Tab/Enter
- **ARIA labels**: Для screen readers
- **Color contrast**: WCAG 2.1 Level AA

### Responsive Breakpoints
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px
- **Large Desktop**: > 1440px

---

## Mock Data

Для демонстрации используются mock данные из `lib/mock-data.ts`:
- 6 топиков для примера (из 20)
- 5 LLM систем
- 6 топ источников
- 6 недель трендов
- 3 алерта
- 4 рекомендации

В production все данные будут загружаться из API (tRPC).

---

## Следующие шаги для разработки

1. **API Integration**: Подключить tRPC для реальных данных
2. **Detail Pages**: Создать детальные страницы для тем и источников
3. **Filters**: Добавить фильтрацию и поиск
4. **Export**: Реализовать экспорт в PDF/Excel
5. **Real-time**: WebSocket для live updates
6. **Auth**: Добавить аутентификацию и role-based access
7. **Settings**: Страница настроек dashboard
8. **Notifications**: Push notifications для алертов
