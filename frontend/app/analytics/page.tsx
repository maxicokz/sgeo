'use client'

import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { TrendingUp, TrendingDown, Activity, BarChart3, PieChartIcon, Target } from "lucide-react"

// Extended mock data for analytics
const performanceData = [
  { month: 'Янв', качество: 3.5, охват: 65, вовлечённость: 45 },
  { month: 'Фев', качество: 3.7, охват: 68, вовлечённость: 48 },
  { month: 'Мар', качество: 3.9, охват: 72, вовлечённость: 52 },
  { month: 'Апр', качество: 4.0, охват: 75, вовлечённость: 55 },
  { month: 'Май', качество: 4.1, охват: 78, вовлечённость: 58 },
  { month: 'Июн', качество: 4.2, охват: 82, вовлечённость: 62 },
]

const categoryDistribution = [
  { name: 'Экономика', value: 35, color: '#3b82f6' },
  { name: 'География', value: 25, color: '#8b5cf6' },
  { name: 'Культура', value: 20, color: '#f59e0b' },
  { name: 'Туризм', value: 12, color: '#10b981' },
  { name: 'Политика', value: 8, color: '#ef4444' },
]

const llmPerformance = [
  { metric: 'Скорость', ChatGPT: 90, Bing: 75, Copilot: 80, Perplexity: 95, Gemini: 85 },
  { metric: 'Точность', ChatGPT: 85, Bing: 78, Copilot: 82, Perplexity: 92, Gemini: 88 },
  { metric: 'Полнота', ChatGPT: 88, Bing: 72, Copilot: 76, Perplexity: 90, Gemini: 82 },
  { metric: 'Свежесть', ChatGPT: 80, Bing: 85, Copilot: 83, Perplexity: 95, Gemini: 87 },
  { metric: 'Источники', ChatGPT: 82, Bing: 88, Copilot: 85, Perplexity: 98, Gemini: 90 },
]

const sentimentTrend = [
  { week: 'Нед 1', позитивный: 45, нейтральный: 40, негативный: 15 },
  { week: 'Нед 2', позитивный: 48, нейтральный: 38, негативный: 14 },
  { week: 'Нед 3', позитивный: 52, нейтральный: 35, негативный: 13 },
  { week: 'Нед 4', позитивный: 55, нейтральный: 33, негативный: 12 },
  { week: 'Нед 5', позитивный: 58, нейтральный: 30, негативный: 12 },
  { week: 'Нед 6', позитивный: 62, нейтральный: 28, негативный: 10 },
]

const topicComparison = [
  { topic: 'Экономика', оценка: 4.2 },
  { topic: 'Астана', оценка: 4.5 },
  { topic: 'Байконур', оценка: 4.7 },
  { topic: 'Культура', оценка: 4.3 },
  { topic: 'Туризм', оценка: 3.8 },
  { topic: 'Нефтегаз', оценка: 3.5 },
]

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <Sidebar />

      <div className="ml-64 transition-all duration-300">
        <Header />

        <main className="p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                Аналитика
              </h1>
              <p className="text-slate-600 mt-1">
                Детальный анализ показателей и трендов
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-white transition-all shadow-sm">
                Экспорт отчёта
              </button>
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all">
                <BarChart3 className="h-4 w-4 inline mr-2" />
                Настроить метрики
              </button>
            </div>
          </div>

          {/* Key Metrics Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Рост качества</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">+24.5%</div>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-xs text-green-600 font-medium">За последние 6 месяцев</span>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Средняя оценка</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">4.2/5.0</div>
                <div className="flex items-center gap-2 mt-2">
                  <Activity className="h-4 w-4 text-blue-600" />
                  <span className="text-xs text-blue-600 font-medium">По всем LLM системам</span>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Охват тем</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">82%</div>
                <div className="flex items-center gap-2 mt-2">
                  <Target className="h-4 w-4 text-purple-600" />
                  <span className="text-xs text-purple-600 font-medium">20 из 20 тем активны</span>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Вовлечённость</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">62%</div>
                <div className="flex items-center gap-2 mt-2">
                  <TrendingUp className="h-4 w-4 text-orange-600" />
                  <span className="text-xs text-orange-600 font-medium">+8% от прошлого месяца</span>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Performance Trends */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Динамика показателей</CardTitle>
                <CardDescription>Изменение ключевых метрик за 6 месяцев</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <defs>
                      <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorCoverage" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="качество" stroke="#3b82f6" fillOpacity={1} fill="url(#colorQuality)" />
                    <Area type="monotone" dataKey="охват" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorCoverage)" />
                    <Area type="monotone" dataKey="вовлечённость" stroke="#10b981" fillOpacity={1} fill="url(#colorEngagement)" />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Распределение по категориям</CardTitle>
                <CardDescription>Процентное соотношение тем по направлениям</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name} ${value}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* LLM Performance Radar */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Многомерный анализ LLM систем</CardTitle>
                <CardDescription>Сравнение производительности по 5 ключевым метрикам</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={llmPerformance}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="ChatGPT" dataKey="ChatGPT" stroke="#10b981" fill="#10b981" fillOpacity={0.5} />
                    <Radar name="Perplexity" dataKey="Perplexity" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.5} />
                    <Radar name="Gemini" dataKey="Gemini" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.5} />
                    <Legend />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Sentiment Analysis */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Анализ тональности</CardTitle>
                <CardDescription>Динамика тональности упоминаний Казахстана</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={sentimentTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="позитивный" stackId="a" fill="#10b981" />
                    <Bar dataKey="нейтральный" stackId="a" fill="#94a3b8" />
                    <Bar dataKey="негативный" stackId="a" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Рейтинг тем</CardTitle>
                <CardDescription>Топ тем по средней оценке качества</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topicComparison} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 5]} />
                    <YAxis dataKey="topic" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="оценка" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Insights Cards */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Ключевой инсайт</h3>
              <p className="text-blue-100 text-sm">
                Perplexity показывает лучшие результаты по свежести данных (+15% от среднего)
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Тренд месяца</h3>
              <p className="text-purple-100 text-sm">
                Позитивная тональность выросла на 17% благодаря улучшению экономических показателей
              </p>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Прогноз</h3>
              <p className="text-green-100 text-sm">
                При текущей динамике общий рейтинг достигнет 4.5/5.0 к концу квартала
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
