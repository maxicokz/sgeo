'use client'

import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, Zap, CheckCircle, Clock, TrendingUp, Star, BarChart3 } from "lucide-react"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts'

// LLM Systems data
const llmSystems = [
  {
    id: '1',
    name: 'ChatGPT',
    provider: 'OpenAI',
    status: 'active',
    color: '#10b981',
    requests: 1247,
    avgScore: 4.2,
    responseTime: 850,
    accuracy: 85,
    completeness: 88,
    freshness: 80,
    sources: 82,
    lastCheck: '5 минут назад',
    uptime: 99.8
  },
  {
    id: '2',
    name: 'Perplexity',
    provider: 'Perplexity AI',
    status: 'active',
    color: '#3b82f6',
    requests: 1102,
    avgScore: 4.5,
    responseTime: 720,
    accuracy: 92,
    completeness: 90,
    freshness: 95,
    sources: 98,
    lastCheck: '3 минуты назад',
    uptime: 99.9
  },
  {
    id: '3',
    name: 'Gemini',
    provider: 'Google',
    status: 'active',
    color: '#f59e0b',
    requests: 986,
    avgScore: 4.1,
    responseTime: 680,
    accuracy: 88,
    completeness: 82,
    freshness: 87,
    sources: 90,
    lastCheck: '2 минуты назад',
    uptime: 99.7
  },
  {
    id: '4',
    name: 'Copilot',
    provider: 'Microsoft',
    status: 'active',
    color: '#8b5cf6',
    requests: 891,
    avgScore: 3.9,
    responseTime: 920,
    accuracy: 82,
    completeness: 76,
    freshness: 83,
    sources: 85,
    lastCheck: '8 минут назад',
    uptime: 99.5
  },
  {
    id: '5',
    name: 'Bing',
    provider: 'Microsoft',
    status: 'active',
    color: '#06b6d4',
    requests: 754,
    avgScore: 3.8,
    responseTime: 1050,
    accuracy: 78,
    completeness: 72,
    freshness: 85,
    sources: 88,
    lastCheck: '10 минут назад',
    uptime: 99.6
  },
]

const performanceComparison = [
  { metric: 'Скорость', ChatGPT: 90, Bing: 75, Copilot: 80, Perplexity: 95, Gemini: 85 },
  { metric: 'Точность', ChatGPT: 85, Bing: 78, Copilot: 82, Perplexity: 92, Gemini: 88 },
  { metric: 'Полнота', ChatGPT: 88, Bing: 72, Copilot: 76, Perplexity: 90, Gemini: 82 },
  { metric: 'Свежесть', ChatGPT: 80, Bing: 85, Copilot: 83, Perplexity: 95, Gemini: 87 },
  { metric: 'Источники', ChatGPT: 82, Bing: 88, Copilot: 85, Perplexity: 98, Gemini: 90 },
]

const requestsOverTime = [
  { day: 'Пн', ChatGPT: 1100, Perplexity: 980, Gemini: 850, Copilot: 780, Bing: 650 },
  { day: 'Вт', ChatGPT: 1150, Perplexity: 1020, Gemini: 890, Copilot: 810, Bing: 680 },
  { day: 'Ср', ChatGPT: 1180, Perplexity: 1050, Gemini: 920, Copilot: 840, Bing: 710 },
  { day: 'Чт', ChatGPT: 1200, Perplexity: 1080, Gemini: 950, Copilot: 870, Bing: 730 },
  { day: 'Пт', ChatGPT: 1230, Perplexity: 1100, Gemini: 980, Copilot: 890, Bing: 750 },
  { day: 'Сб', ChatGPT: 1247, Perplexity: 1102, Gemini: 986, Copilot: 891, Bing: 754 },
]

export default function LLMSystemsPage() {
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
                LLM Системы
              </h1>
              <p className="text-slate-600 mt-1">
                Мониторинг и сравнение производительности 5 основных LLM систем
              </p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all">
              <Activity className="h-4 w-4 inline mr-2" />
              Тестировать все
            </button>
          </div>

          {/* Overview Stats */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Активных систем</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">5/5</div>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Все системы в норме
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Запросов за сегодня</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">4,980</div>
                <p className="text-xs text-blue-600 mt-1">По всем системам</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Средняя оценка</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">4.1/5.0</div>
                <p className="text-xs text-purple-600 mt-1">Общий рейтинг качества</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Время ответа</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">844мс</div>
                <p className="text-xs text-slate-600 mt-1">Среднее по всем системам</p>
              </CardContent>
            </Card>
          </section>

          {/* LLM Systems Cards */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Статус LLM систем</CardTitle>
                <CardDescription>Детальная информация о производительности каждой системы</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {llmSystems.map((system) => (
                    <div
                      key={system.id}
                      className="p-5 rounded-lg border hover:shadow-md transition-all bg-white group"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        {/* Left: System info */}
                        <div className="flex items-start gap-4 flex-1">
                          <div
                            className="w-16 h-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl"
                            style={{ background: `linear-gradient(135deg, ${system.color}, ${system.color}dd)` }}
                          >
                            {system.name[0]}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-bold text-lg text-slate-900">{system.name}</h3>
                              <Badge className="bg-green-50 text-green-700 border-green-200 border">
                                <Activity className="h-3 w-3 mr-1" />
                                Активна
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 mb-3">{system.provider}</p>

                            <div className="grid grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-slate-600 block mb-1">Запросов</span>
                                <span className="font-semibold text-slate-900 text-base">{system.requests.toLocaleString()}</span>
                              </div>
                              <div>
                                <span className="text-slate-600 block mb-1">Средняя оценка</span>
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="font-semibold text-slate-900 text-base">{system.avgScore}/5.0</span>
                                </div>
                              </div>
                              <div>
                                <span className="text-slate-600 block mb-1">Время ответа</span>
                                <div className="flex items-center gap-1">
                                  <Zap className="h-4 w-4 text-orange-500" />
                                  <span className="font-semibold text-slate-900 text-base">{system.responseTime}мс</span>
                                </div>
                              </div>
                              <div>
                                <span className="text-slate-600 block mb-1">Uptime</span>
                                <span className="font-semibold text-green-600 text-base">{system.uptime}%</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right: Last check */}
                        <div className="text-xs text-slate-500 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {system.lastCheck}
                        </div>
                      </div>

                      {/* Performance bars */}
                      <div className="grid grid-cols-4 gap-3 pt-4 border-t">
                        <div>
                          <div className="flex justify-between text-xs text-slate-600 mb-1">
                            <span>Точность</span>
                            <span>{system.accuracy}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${system.accuracy}%`, backgroundColor: system.color }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-slate-600 mb-1">
                            <span>Полнота</span>
                            <span>{system.completeness}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${system.completeness}%`, backgroundColor: system.color }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-slate-600 mb-1">
                            <span>Свежесть</span>
                            <span>{system.freshness}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${system.freshness}%`, backgroundColor: system.color }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs text-slate-600 mb-1">
                            <span>Источники</span>
                            <span>{system.sources}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{ width: `${system.sources}%`, backgroundColor: system.color }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Charts */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Многомерное сравнение</CardTitle>
                <CardDescription>Производительность по 5 ключевым метрикам</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <RadarChart data={performanceComparison}>
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

            <Card>
              <CardHeader>
                <CardTitle>Динамика запросов</CardTitle>
                <CardDescription>Количество запросов по дням недели</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <LineChart data={requestsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="ChatGPT" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="Perplexity" stroke="#3b82f6" strokeWidth={2} />
                    <Line type="monotone" dataKey="Gemini" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="Copilot" stroke="#8b5cf6" strokeWidth={2} />
                    <Line type="monotone" dataKey="Bing" stroke="#06b6d4" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Insights */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  Лидер по точности
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 mb-1">Perplexity</div>
                <p className="text-sm text-slate-600">92% точности ответов - лучший результат</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="h-5 w-5 text-green-600" />
                  Самый быстрый
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600 mb-1">Gemini</div>
                <p className="text-sm text-slate-600">680мс среднее время ответа</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Наиболее используемый
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600 mb-1">ChatGPT</div>
                <p className="text-sm text-slate-600">1,247 запросов за сегодня</p>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}
