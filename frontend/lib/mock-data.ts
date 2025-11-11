// Mock data for SGEO Dashboard

export interface Topic {
  id: string
  name: string
  priority: number
  status: 'good' | 'warning' | 'critical'
  sentiment: number
  completeness: number
  correctness: number
  category: string
}

export interface LLMScore {
  llm: string
  score: number
}

export interface SourceCitation {
  domain: string
  count: number
  percentage: number
}

export interface TrendData {
  date: string
  sentiment: number
  completeness: number
  correctness: number
}

export interface EEATScore {
  category: string
  score: number
  fullMark: 10
}

export const mockTopics: Topic[] = [
  {
    id: '1',
    name: 'Экономика Казахстана',
    priority: 5,
    status: 'good',
    sentiment: 4.2,
    completeness: 3.8,
    correctness: 4.5,
    category: 'Экономика'
  },
  {
    id: '2',
    name: 'Город Астана',
    priority: 5,
    status: 'good',
    sentiment: 4.5,
    completeness: 4.2,
    correctness: 4.8,
    category: 'География'
  },
  {
    id: '3',
    name: 'Нефтегазовая промышленность',
    priority: 5,
    status: 'warning',
    sentiment: 3.5,
    completeness: 3.2,
    correctness: 4.0,
    category: 'Экономика'
  },
  {
    id: '4',
    name: 'Космодром Байконур',
    priority: 5,
    status: 'good',
    sentiment: 4.7,
    completeness: 4.5,
    correctness: 4.9,
    category: 'География'
  },
  {
    id: '5',
    name: 'Туризм',
    priority: 4,
    status: 'warning',
    sentiment: 3.8,
    completeness: 3.0,
    correctness: 3.5,
    category: 'Туризм'
  },
  {
    id: '6',
    name: 'Казахская культура',
    priority: 4,
    status: 'good',
    sentiment: 4.3,
    completeness: 3.9,
    correctness: 4.2,
    category: 'Культура'
  }
]

export const mockLLMScores: LLMScore[] = [
  { llm: 'ChatGPT', score: 4.2 },
  { llm: 'Bing', score: 3.8 },
  { llm: 'Copilot', score: 3.9 },
  { llm: 'Perplexity', score: 4.5 },
  { llm: 'Gemini', score: 4.1 }
]

export const mockSourceCitations: SourceCitation[] = [
  { domain: 'worldbank.org', count: 145, percentage: 35 },
  { domain: 'gov.kz', count: 120, percentage: 28 },
  { domain: 'wikipedia.org', count: 65, percentage: 15 },
  { domain: 'britannica.com', count: 60, percentage: 15 },
  { domain: 'reuters.com', count: 42, percentage: 10 },
  { domain: 'bbc.com', count: 30, percentage: 7 }
]

export const mockTrendData: TrendData[] = [
  { date: '2024-01-01', sentiment: 3.5, completeness: 3.2, correctness: 3.8 },
  { date: '2024-01-08', sentiment: 3.7, completeness: 3.4, correctness: 4.0 },
  { date: '2024-01-15', sentiment: 3.9, completeness: 3.6, correctness: 4.1 },
  { date: '2024-01-22', sentiment: 4.0, completeness: 3.7, correctness: 4.3 },
  { date: '2024-01-29', sentiment: 4.1, completeness: 3.8, correctness: 4.4 },
  { date: '2024-02-05', sentiment: 4.2, completeness: 3.9, correctness: 4.5 }
]

export const mockEEATData: EEATScore[] = [
  { category: 'Авторство', score: 9.2, fullMark: 10 },
  { category: 'Экспертность', score: 8.8, fullMark: 10 },
  { category: 'Авторитетность', score: 9.5, fullMark: 10 },
  { category: 'Надёжность', score: 9.0, fullMark: 10 },
  { category: 'Безопасность', score: 10.0, fullMark: 10 },
  { category: 'Свежесть', score: 8.5, fullMark: 10 }
]

export const mockAlerts = [
  {
    id: '1',
    severity: 'critical',
    message: 'Снижение цитирования на +10% для темы "Нефтегазовая промышленность"',
    time: '2 часа назад'
  },
  {
    id: '2',
    severity: 'warning',
    message: 'Снижение оценки тональности для темы "Туризм"',
    time: '5 часов назад'
  },
  {
    id: '3',
    severity: 'info',
    message: 'Обнаружен новый источник: economist.com',
    time: '1 день назад'
  }
]

export const mockRecommendations = [
  'Улучшить свежесть контента на архивных страницах',
  'Увеличить количество внешних ссылок от академических учреждений',
  'Добавить больше структурированных данных на ключевые страницы',
  'Оптимизировать мобильную версию для туристических страниц'
]
