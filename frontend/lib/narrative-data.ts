// Mock data for Narrative Dashboard

export interface NarrativeProject {
  id: string
  title: string
  description: string
  targetNarrative: string
  risks: string[]
  color: string
}

export interface Prompt {
  id: string
  projectId: string
  text: string
  description: string
  frequency: number
  purpose: string
  sentiment: number
  totalMentions: number
  googleResults: number
  yandexResults: number
  trend: 'up' | 'down' | 'neutral'
}

export interface NarrativeData {
  positive: number
  negative: number
  neutral: number
}

export interface Source {
  id: string
  name: string
  url: string
  influence: number
  mentions: number
  type: 'ours' | 'theirs' | 'neutral'
}

export interface PromptHistory {
  id: string
  date: string
  llmSystem: string
  sentiment: number
  narrative: string
}

// 5 ключевых тем-проектов
export const narrativeProjects: NarrativeProject[] = [
  {
    id: 'tokaev-image',
    title: 'Имидж Президента Токаева',
    description: 'Формирование устойчивого восприятия Токаева как реформатора, модернизатора и независимого лидера',
    targetNarrative: 'Реформатор, модернизатор и независимый лидер',
    risks: [
      'Ассоциация с Назарбаевской эпохой',
      'Soft authoritarianism',
      'Недостаточная независимость'
    ],
    color: 'from-blue-500 to-cyan-600'
  },
  {
    id: 'january-events',
    title: 'Январские события 2022 года',
    description: 'Переосмысление нарратива: "террористическая атака и реформы после января", снижение негативных интерпретаций',
    targetNarrative: 'Террористическая атака, за которой последовали реформы',
    risks: [
      'Восприятие как жестокого подавления протестов',
      'Обвинения в авторитаризме',
      'Негативное освещение в западных СМИ'
    ],
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 'ideology-law',
    title: 'Идеология, закон и порядок',
    description: 'Развитие нарратива о сильном, справедливом и реформирующем государстве, укрепление доверия к институтам',
    targetNarrative: 'Сильное, справедливое и реформирующееся государство',
    risks: [
      'Восприятие как авторитарного режима',
      'Недоверие к судебной системе',
      'Слабость правовых институтов'
    ],
    color: 'from-purple-500 to-pink-600'
  },
  {
    id: 'digital-kazakhstan',
    title: 'Цифровой Казахстан',
    description: 'Освещение технологических реформ, инициатив МЦРИАП, Astana Hub и GovTech',
    targetNarrative: 'Лидер цифровой трансформации в Центральной Азии',
    risks: [
      'Недостаточная известность инициатив',
      'Отставание от региональных конкурентов',
      'Проблемы с внедрением технологий'
    ],
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'nuclear-energy',
    title: 'АЭС и ядерная энергетика',
    description: 'Формирование сбалансированного дискурса о безопасности, экологичности и перспективах атомной энергетики',
    targetNarrative: 'Безопасный и экологичный путь к энергонезависимости',
    risks: [
      'Страхи населения перед радиацией',
      'Негативный опыт СССР (Семипалатинск)',
      'Экологические опасения'
    ],
    color: 'from-indigo-500 to-blue-600'
  }
]

// Промты для каждого проекта
export const prompts: Prompt[] = [
  // Tokaev Image
  {
    id: 'tokaev-1',
    projectId: 'tokaev-image',
    text: 'Как описывается лидерство Токаева в международных СМИ?',
    description: 'Оценка восприятия реформаторского образа в англоязычных источниках',
    frequency: 45,
    purpose: 'Анализ международного восприятия',
    sentiment: 4.2,
    totalMentions: 2847,
    googleResults: 15200,
    yandexResults: 8900,
    trend: 'up'
  },
  {
    id: 'tokaev-2',
    projectId: 'tokaev-image',
    text: 'Какие реформы провел президент Токаев?',
    description: 'Отслеживание упоминания ключевых реформ',
    frequency: 67,
    purpose: 'Мониторинг видимости реформ',
    sentiment: 4.5,
    totalMentions: 4521,
    googleResults: 23400,
    yandexResults: 12800,
    trend: 'up'
  },
  {
    id: 'tokaev-3',
    projectId: 'tokaev-image',
    text: 'Отношения Токаева с Назарбаевым',
    description: 'Мониторинг нарратива о независимости',
    frequency: 52,
    purpose: 'Контроль негативных ассоциаций',
    sentiment: 3.1,
    totalMentions: 3214,
    googleResults: 18700,
    yandexResults: 9500,
    trend: 'neutral'
  },

  // January Events
  {
    id: 'january-1',
    projectId: 'january-events',
    text: 'Что произошло в Казахстане в январе 2022?',
    description: 'Базовый промт для оценки доминирующего нарратива',
    frequency: 89,
    purpose: 'Главный индикатор восприятия',
    sentiment: 2.8,
    totalMentions: 8934,
    googleResults: 45600,
    yandexResults: 28300,
    trend: 'down'
  },
  {
    id: 'january-2',
    projectId: 'january-events',
    text: 'Реформы после январских событий в Казахстане',
    description: 'Отслеживание позитивных последствий',
    frequency: 34,
    purpose: 'Продвижение позитивного нарратива',
    sentiment: 3.9,
    totalMentions: 1876,
    googleResults: 12400,
    yandexResults: 7200,
    trend: 'up'
  },

  // Ideology & Law
  {
    id: 'ideology-1',
    projectId: 'ideology-law',
    text: 'Судебная система Казахстана',
    description: 'Оценка доверия к правовым институтам',
    frequency: 41,
    purpose: 'Мониторинг восприятия справедливости',
    sentiment: 3.4,
    totalMentions: 2156,
    googleResults: 16800,
    yandexResults: 9800,
    trend: 'neutral'
  },
  {
    id: 'ideology-2',
    projectId: 'ideology-law',
    text: 'Антикоррупционная политика Казахстана',
    description: 'Восприятие борьбы с коррупцией',
    frequency: 56,
    purpose: 'Оценка реформаторского имиджа',
    sentiment: 3.7,
    totalMentions: 3421,
    googleResults: 21300,
    yandexResults: 13500,
    trend: 'up'
  },

  // Digital Kazakhstan
  {
    id: 'digital-1',
    projectId: 'digital-kazakhstan',
    text: 'Astana Hub технологический парк',
    description: 'Видимость флагманского проекта',
    frequency: 38,
    purpose: 'Продвижение цифровой повестки',
    sentiment: 4.3,
    totalMentions: 1543,
    googleResults: 8900,
    yandexResults: 4200,
    trend: 'up'
  },
  {
    id: 'digital-2',
    projectId: 'digital-kazakhstan',
    text: 'Цифровизация государственных услуг в Казахстане',
    description: 'Оценка GovTech инициатив',
    frequency: 47,
    purpose: 'Мониторинг технологического имиджа',
    sentiment: 4.1,
    totalMentions: 2234,
    googleResults: 14200,
    yandexResults: 8700,
    trend: 'up'
  },

  // Nuclear Energy
  {
    id: 'nuclear-1',
    projectId: 'nuclear-energy',
    text: 'Строительство АЭС в Казахстане',
    description: 'Базовый нарратив о ядерной энергетике',
    frequency: 72,
    purpose: 'Главный индикатор общественного мнения',
    sentiment: 3.2,
    totalMentions: 5621,
    googleResults: 34500,
    yandexResults: 19800,
    trend: 'neutral'
  },
  {
    id: 'nuclear-2',
    projectId: 'nuclear-energy',
    text: 'Безопасность атомной энергетики Казахстан',
    description: 'Мониторинг опасений и рисков',
    frequency: 58,
    purpose: 'Контроль негативных настроений',
    sentiment: 2.9,
    totalMentions: 4123,
    googleResults: 27800,
    yandexResults: 15300,
    trend: 'down'
  },
  {
    id: 'nuclear-3',
    projectId: 'nuclear-energy',
    text: 'Семипалатинский полигон и память',
    description: 'Исторический контекст и его влияние',
    frequency: 29,
    purpose: 'Понимание исторических барьеров',
    sentiment: 2.4,
    totalMentions: 2876,
    googleResults: 19200,
    yandexResults: 11400,
    trend: 'neutral'
  }
]

// Нарративные данные по проектам (агрегированные)
export const projectNarratives: Record<string, NarrativeData> = {
  'tokaev-image': {
    positive: 58,
    negative: 22,
    neutral: 20
  },
  'january-events': {
    positive: 28,
    negative: 51,
    neutral: 21
  },
  'ideology-law': {
    positive: 45,
    negative: 32,
    neutral: 23
  },
  'digital-kazakhstan': {
    positive: 67,
    negative: 15,
    neutral: 18
  },
  'nuclear-energy': {
    positive: 35,
    negative: 42,
    neutral: 23
  }
}

// Нарративные данные по промтам
export const promptNarratives: Record<string, NarrativeData> = {
  'tokaev-1': { positive: 62, negative: 18, neutral: 20 },
  'tokaev-2': { positive: 71, negative: 12, neutral: 17 },
  'tokaev-3': { positive: 31, negative: 45, neutral: 24 },
  'january-1': { positive: 22, negative: 58, neutral: 20 },
  'january-2': { positive: 65, negative: 18, neutral: 17 },
  'ideology-1': { positive: 38, negative: 38, neutral: 24 },
  'ideology-2': { positive: 52, negative: 26, neutral: 22 },
  'digital-1': { positive: 71, negative: 12, neutral: 17 },
  'digital-2': { positive: 68, negative: 14, neutral: 18 },
  'nuclear-1': { positive: 34, negative: 43, neutral: 23 },
  'nuclear-2': { positive: 28, negative: 52, neutral: 20 },
  'nuclear-3': { positive: 18, negative: 64, neutral: 18 }
}

// Источники влияния
export const sources: Source[] = [
  // Global sources
  { id: '1', name: 'Wikipedia', url: 'wikipedia.org', influence: 95, mentions: 8234, type: 'neutral' },
  { id: '2', name: 'BBC News', url: 'bbc.com', influence: 88, mentions: 3421, type: 'theirs' },
  { id: '3', name: 'Reuters', url: 'reuters.com', influence: 86, mentions: 2987, type: 'theirs' },
  { id: '4', name: 'The Guardian', url: 'theguardian.com', influence: 82, mentions: 1876, type: 'theirs' },

  // Kazakhstan sources
  { id: '5', name: 'Akorda.kz', url: 'akorda.kz', influence: 79, mentions: 5432, type: 'ours' },
  { id: '6', name: 'Inform.kz', url: 'inform.kz', influence: 72, mentions: 4123, type: 'ours' },
  { id: '7', name: 'Kazpravda.kz', url: 'kazpravda.kz', influence: 68, mentions: 3214, type: 'ours' },

  // Regional sources
  { id: '8', name: 'TASS', url: 'tass.ru', influence: 75, mentions: 2765, type: 'neutral' },
  { id: '9', name: 'Eurasianet', url: 'eurasianet.org', influence: 71, mentions: 1987, type: 'theirs' },
  { id: '10', name: 'Radio Free Europe', url: 'rferl.org', influence: 69, mentions: 1654, type: 'theirs' },

  // Tech sources
  { id: '11', name: 'Astana Hub', url: 'astanahub.com', influence: 64, mentions: 987, type: 'ours' },
  { id: '12', name: 'TechCrunch', url: 'techcrunch.com', influence: 78, mentions: 654, type: 'neutral' },
]

// История запросов (для детальной страницы промта)
export const promptHistoryData: Record<string, PromptHistory[]> = {
  'tokaev-1': [
    { id: '1', date: '2024-01-15', llmSystem: 'GPT-4', sentiment: 4.1, narrative: 'positive' },
    { id: '2', date: '2024-01-15', llmSystem: 'Gemini', sentiment: 4.3, narrative: 'positive' },
    { id: '3', date: '2024-01-15', llmSystem: 'Claude', sentiment: 4.2, narrative: 'positive' },
    { id: '4', date: '2024-01-22', llmSystem: 'GPT-4', sentiment: 4.2, narrative: 'positive' },
    { id: '5', date: '2024-01-22', llmSystem: 'DeepSeek', sentiment: 3.9, narrative: 'neutral' },
  ],
  'nuclear-1': [
    { id: '1', date: '2024-01-10', llmSystem: 'GPT-4', sentiment: 3.1, narrative: 'neutral' },
    { id: '2', date: '2024-01-10', llmSystem: 'Gemini', sentiment: 3.3, narrative: 'neutral' },
    { id: '3', date: '2024-01-17', llmSystem: 'Claude', sentiment: 3.2, narrative: 'neutral' },
    { id: '4', date: '2024-01-17', llmSystem: 'Yi', sentiment: 2.9, narrative: 'negative' },
  ]
}

// LLM системы
export const llmSystems = [
  { id: 'gpt4', name: 'GPT-4', color: '#10b981' },
  { id: 'gemini', name: 'Gemini', color: '#3b82f6' },
  { id: 'claude', name: 'Claude', color: '#8b5cf6' },
  { id: 'deepseek', name: 'DeepSeek', color: '#f59e0b' },
  { id: 'llama', name: 'LLaMA', color: '#ec4899' },
  { id: 'yi', name: 'Yi', color: '#06b6d4' }
]
