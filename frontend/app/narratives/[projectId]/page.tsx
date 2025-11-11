'use client'

import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { narrativeProjects, prompts, projectNarratives, sources, llmSystems } from "@/lib/narrative-data"
import { ArrowLeft, ChevronRight, TrendingUp, TrendingDown, Minus, Target, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useState, useMemo } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export default function ProjectDetailPage() {
  const params = useParams()
  const projectId = params.projectId as string

  const project = narrativeProjects.find(p => p.id === projectId)
  const projectPrompts = prompts.filter(p => p.projectId === projectId)
  const narrativeData = projectNarratives[projectId]

  const [selectedLLMs, setSelectedLLMs] = useState<string[]>(llmSystems.map(s => s.id))

  // Calculate aggregated data based on selected LLMs
  const chartData = useMemo(() => {
    if (!narrativeData) return []
    return [
      { name: 'Позитивные', value: narrativeData.positive, color: '#10b981' },
      { name: 'Негативные', value: narrativeData.negative, color: '#ef4444' },
      { name: 'Нейтральные', value: narrativeData.neutral, color: '#94a3b8' }
    ]
  }, [narrativeData, selectedLLMs])

  const toggleLLM = (llmId: string) => {
    setSelectedLLMs(prev =>
      prev.includes(llmId)
        ? prev.filter(id => id !== llmId)
        : [...prev, llmId]
    )
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-slate-400" />
  }

  // Get top sources for this project
  const projectSources = sources
    .sort((a, b) => b.influence - a.influence)
    .slice(0, 8)

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">Проект не найден</h1>
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
            <span className="text-slate-900 font-medium">{project.title}</span>
          </div>

          {/* Page Header */}
          <div className="flex items-center gap-4">
            <Link href="/narratives">
              <button className="p-2 rounded-lg hover:bg-white/80 transition-all">
                <ArrowLeft className="h-5 w-5 text-slate-600" />
              </button>
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                {project.title}
              </h1>
              <p className="text-slate-600 mt-1">{project.description}</p>
            </div>
          </div>

          {/* Project Info Cards */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Target Narrative */}
            <Card className="border-none">
              <div className={`h-1 bg-gradient-to-r ${project.color}`} />
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-lg">Целевая установка</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700 font-medium">{project.targetNarrative}</p>
              </CardContent>
            </Card>

            {/* Risks */}
            <Card className="border-none">
              <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500" />
              <CardHeader>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <CardTitle className="text-lg">Основные риски</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {project.risks.map((risk, idx) => (
                    <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                      <span className="text-orange-400 mt-1">•</span>
                      <span>{risk}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* LLM Filter and Analytics */}
          <section>
            <Card className="border-none">
              <CardHeader>
                <CardTitle>Аналитика нарративов</CardTitle>
                <CardDescription>
                  Распределение позитивных, негативных и нейтральных нарративов по выбранным LLM системам
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* LLM Filter */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-3 block">
                    Выберите LLM системы для анализа
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {llmSystems.map((llm) => (
                      <Badge
                        key={llm.id}
                        variant={selectedLLMs.includes(llm.id) ? "default" : "outline"}
                        className="px-3 py-1.5 cursor-pointer hover:shadow-md transition-all"
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
                  <p className="text-xs text-slate-500 mt-2">
                    Выбрано: {selectedLLMs.length} из {llmSystems.length}
                  </p>
                </div>

                {/* Pie Chart */}
                <div className="bg-slate-50 rounded-xl p-6">
                  <h3 className="text-sm font-medium text-slate-700 mb-4 text-center">
                    Распределение нарративов
                  </h3>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
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
          </section>

          {/* Prompts Table */}
          <section>
            <Card className="border-none">
              <CardHeader>
                <CardTitle>Промты проекта ({projectPrompts.length})</CardTitle>
                <CardDescription>
                  Все отслеживаемые запросы для данной тематики
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {projectPrompts.map((prompt) => (
                    <Link key={prompt.id} href={`/narratives/${projectId}/prompt/${prompt.id}`}>
                      <div className="p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer group bg-white">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {prompt.text}
                              </h3>
                              {getTrendIcon(prompt.trend)}
                            </div>

                            <p className="text-sm text-slate-600 mb-3">{prompt.description}</p>

                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span>Частота: {prompt.frequency}/день</span>
                              <span>•</span>
                              <span>Тональность: {prompt.sentiment}/5.0</span>
                              <span>•</span>
                              <span>Упоминаний: {prompt.totalMentions.toLocaleString()}</span>
                            </div>
                          </div>

                          <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors flex-shrink-0" />
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Influential Sources */}
          <section>
            <Card className="border-none">
              <CardHeader>
                <CardTitle>Влиятельные источники</CardTitle>
                <CardDescription>
                  Ключевые источники, формирующие нарратив по данной теме
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Источник</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Влияние</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Упоминания</th>
                        <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Тип</th>
                      </tr>
                    </thead>
                    <tbody>
                      {projectSources.map((source) => (
                        <tr key={source.id} className="border-b hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium text-slate-900">{source.name}</div>
                              <div className="text-xs text-slate-500">{source.url}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden max-w-[100px]">
                                <div
                                  className="h-full bg-blue-500 rounded-full"
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
