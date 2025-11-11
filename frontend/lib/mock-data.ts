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
    name: 'Kazakhstan Economy',
    priority: 5,
    status: 'good',
    sentiment: 4.2,
    completeness: 3.8,
    correctness: 4.5,
    category: 'Economy'
  },
  {
    id: '2',
    name: 'Astana City',
    priority: 5,
    status: 'good',
    sentiment: 4.5,
    completeness: 4.2,
    correctness: 4.8,
    category: 'Geography'
  },
  {
    id: '3',
    name: 'Oil & Gas Industry',
    priority: 5,
    status: 'warning',
    sentiment: 3.5,
    completeness: 3.2,
    correctness: 4.0,
    category: 'Economy'
  },
  {
    id: '4',
    name: 'Baikonur Cosmodrome',
    priority: 5,
    status: 'good',
    sentiment: 4.7,
    completeness: 4.5,
    correctness: 4.9,
    category: 'Geography'
  },
  {
    id: '5',
    name: 'Tourism',
    priority: 4,
    status: 'warning',
    sentiment: 3.8,
    completeness: 3.0,
    correctness: 3.5,
    category: 'Tourism'
  },
  {
    id: '6',
    name: 'Kazakh Culture',
    priority: 4,
    status: 'good',
    sentiment: 4.3,
    completeness: 3.9,
    correctness: 4.2,
    category: 'Culture'
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
  { category: 'Authorship', score: 9.2, fullMark: 10 },
  { category: 'Expertise', score: 8.8, fullMark: 10 },
  { category: 'Authority', score: 9.5, fullMark: 10 },
  { category: 'Trust', score: 9.0, fullMark: 10 },
  { category: 'Security', score: 10.0, fullMark: 10 },
  { category: 'Freshness', score: 8.5, fullMark: 10 }
]

export const mockAlerts = [
  {
    id: '1',
    severity: 'critical',
    message: 'Out-of-citation rate +10% for "Oil & Gas Industry" topic',
    time: '2 hours ago'
  },
  {
    id: '2',
    severity: 'warning',
    message: 'Sentiment score decreased for "Tourism" topic',
    time: '5 hours ago'
  },
  {
    id: '3',
    severity: 'info',
    message: 'New source detected: economist.com',
    time: '1 day ago'
  }
]

export const mockRecommendations = [
  'Improve content freshness on archived pages',
  'Increase external backlinks from academic institutions',
  'Add more structured data to key landing pages',
  'Optimize mobile experience for tourism pages'
]
