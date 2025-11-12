'use client'

import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  narrativeProjects,
  prompts,
  promptNarratives,
  sources,
  llmSystems,
  promptHistoryData
} from "@/lib/narrative-data"
import {
  ArrowLeft,
  ChevronRight,
  Search,
  BarChart3,
  TrendingUp,
  Eye,
  Calendar,
  Filter
} from "lucide-react"
import Link from "next/link"
import { useState, useMemo } from "react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts"

export function generateStaticParams() {
  return prompts.map((prompt) => ({
    projectId: prompt.projectId,
    promptId: prompt.id,
  }))
}

export default function PromptDetailPage({
  params
}: {
  params: { projectId: string; promptId: string }
}) {
  const projectId = params.projectId
  const promptId = params.promptId

  const project = narrativeProjects.find(p => p.id === projectId)
  const prompt = prompts.find(p => p.id === promptId)
  const narrativeData = promptNarratives[promptId]
  const historyData = promptHistoryData[promptId] || []

  const [selectedLLMs, setSelectedLLMs] = useState<string[]>(llmSystems.map(s => s.id))
  const [sourceFilter, setSourceFilter] = useState<'all' | 'ours' | 'theirs'>('all')

  // Pie chart data
  const chartData = useMemo(() => {
    if (!narrativeData) return []
    return [
      { name: 'Позитивные', value: narrativeData.positive, color: '#10b981' },
      { name: 'Негативные', value: narrativeData.negative, color: '#ef4444' },
      { name: 'Нейтральные', value: narrativeData.neutral, color: '#94a3b8' }
    ]
  }, [narrativeData])

  // Sentiment trend line chart data
  const trendData = useMemo(() => {
    const data: { [key: string]: any } = {}

    historyData.forEach(item => {
      if (!data[item.date]) {
        data[item.date] = { date: item.date }
      }
      data[item.date][item.llmSystem] = item.sentiment
    })

    return Object.values(data)
  }, [historyData])

  const toggleLLM = (llmId: string) => {
    setSelectedLLMs(prev =>
      prev.includes(llmId)
        ? prev.filter(id => id !== llmId)
        : [...prev, llmId]
    )
  }

  // Filter sources based on type
  const filteredSources = useMemo(() => {
    return sources
      .filter(s => sourceFilter === 'all' || s.type === sourceFilter)
      .sort((a, b) => b.influence - a.influence)
      .slice(0, 10)
  }, [sourceFilter])

  if (!project || !prompt) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Промт не найден</h1>
          <Link href="/narratives" className="text-blue-600 hover:underline mt-2 inline-block">
            Вернуться к списку проектов
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <Sidebar />

      <div className="ml-64 transition-all duration-300">
        <Header />

        <main className="p-6 space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Link href="/narratives" className="hover:text-blue-600 transition-colors">
              Нарративы
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href={`/narratives/${projectId}`} className="hover:text-blue-600 transition-colors">
              {project.title}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-slate-900 font-medium">Детали промта</span>
          </div>

          {/* Page Header */}
          <div className="flex items-center gap-4">
            <Link href={`/narratives/${projectId}`}>
              <button className="p-2 rounded-lg hover:bg-white/80 transition-all">
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </button>
            </Link>
            <div className="flex-1">
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${project.color} mb-2`}>
                {project.title}
              </div>
              <h1 className="text-2xl font-bold text-slate-900">
                {prompt.text}
              </h1>
              <p className="text-slate-600 mt-1">{prompt.description}</p>
              <div className="flex items-center gap-4 mt-3 text-sm text-slate-500">
                <span>Цель: {prompt.purpose}</span>
                <span>•</span>
                <span>Частота: {prompt.frequency} запросов/день</span>
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Тональность
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{prompt.sentiment}/5.0</div>
                <p className="text-xs text-slate-600 mt-1">Средняя оценка</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Упоминания
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {prompt.totalMentions.toLocaleString()}
                </div>
                <p className="text-xs text-slate-600 mt-1">В ответах LLM</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Google
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {prompt.googleResults.toLocaleString()}
                </div>
                <p className="text-xs text-slate-600 mt-1">Результатов поиска</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600 flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Yandex
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {prompt.yandexResults.toLocaleString()}
                </div>
                <p className="text-xs text-slate-600 mt-1">Результатов поиска</p>
              </CardContent>
            </Card>
          </section>

          {/* Charts Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Narrative Distribution Pie Chart */}
            <Card className="border-none">
              <CardHeader>
                <CardTitle>Распределение нарративов</CardTitle>
                <CardDescription>
                  Анализ тональности ответов по выбранным LLM системам
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* LLM Filter */}
                <div>
                  <label className="text-xs font-medium text-slate-700 mb-2 block">
                    Фильтр LLM систем
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {llmSystems.map((llm) => (
                      <Badge
                        key={llm.id}
                        variant={selectedLLMs.includes(llm.id) ? "default" : "outline"}
                        className="px-2 py-1 cursor-pointer text-xs"
                        onClick={() => toggleLLM(llm.id)}
                        style={{
                          backgroundColor: selectedLLMs.includes(llm.id) ? llm.color : 'transparent',
                          borderColor: llm.color,
                          color: selectedLLMs.includes(llm.id) ? 'white' : llm.color
                        }}
                      >
                        {llm.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Sentiment Trend Line Chart */}
            <Card className="border-none">
              <CardHeader>
                <CardTitle>Динамика тональности</CardTitle>
                <CardDescription>
                  Изменение индекса позитивности во времени
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 rounded-xl p-4">
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={trendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Legend />
                      {llmSystems.map((llm) => (
                        <Line
                          key={llm.id}
                          type="monotone"
                          dataKey={llm.name}
                          stroke={llm.color}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Prompt History Table */}
          <section>
            <Card className="border-none">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-slate-600" />
                  <CardTitle>История запросов</CardTitle>
                </div>
                <CardDescription>
                  Все проведенные замеры по данному промту
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Дата</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">LLM Система</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Тональность</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Нарратив</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyData.map((item) => {
                        const llm = llmSystems.find(l => l.name === item.llmSystem)
                        return (
                          <tr key={item.id} className="border-b hover:bg-slate-50 transition-colors">
                            <td className="py-3 px-4 text-sm text-slate-700">
                              {new Date(item.date).toLocaleDateString('ru-RU')}
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                style={{
                                  backgroundColor: llm?.color,
                                  color: 'white'
                                }}
                              >
                                {item.llmSystem}
                              </Badge>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[100px]">
                                  <div
                                    className="h-full bg-blue-500 rounded-full"
                                    style={{ width: `${(item.sentiment / 5) * 100}%` }}
                                  />
                                </div>
                                <span className="text-sm font-medium text-slate-700">{item.sentiment}/5.0</span>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <Badge
                                variant="outline"
                                className={
                                  item.narrative === 'positive'
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : item.narrative === 'negative'
                                    ? 'bg-red-50 text-red-700 border-red-200'
                                    : 'bg-slate-50 text-slate-700 border-slate-200'
                                }
                              >
                                {item.narrative === 'positive' ? 'Позитивный' : item.narrative === 'negative' ? 'Негативный' : 'Нейтральный'}
                              </Badge>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Sources and Actors */}
          <section>
            <Card className="border-none">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-5 w-5 text-slate-600" />
                      <CardTitle>Источники и акторы</CardTitle>
                    </div>
                    <CardDescription className="mt-1">
                      Ключевые источники, влияющие на формирование ответов
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-slate-600" />
                    <select
                      value={sourceFilter}
                      onChange={(e) => setSourceFilter(e.target.value as any)}
                      className="px-3 py-1.5 text-sm rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="all">Все источники</option>
                      <option value="ours">Наши</option>
                      <option value="theirs">Внешние</option>
                    </select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Источник</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Влияние</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Упоминания</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Происхождение</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSources.map((source) => (
                        <tr key={source.id} className="border-b hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-slate-900">{source.name}</div>
                              <div className="text-xs text-slate-500">{source.url}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[120px]">
                                <div
                                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                  style={{ width: `${source.influence}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium text-slate-700">{source.influence}</span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-slate-700">
                            {source.mentions.toLocaleString()}
                          </td>
                          <td className="py-3 px-4">
                            <Badge
                              variant="outline"
                              className={
                                source.type === 'ours'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : source.type === 'theirs'
                                  ? 'bg-orange-50 text-orange-700 border-orange-200'
                                  : 'bg-slate-50 text-slate-700 border-slate-200'
                              }
                            >
                              {source.type === 'ours' ? 'Наши' : source.type === 'theirs' ? 'Внешние' : 'Нейтральные'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}
