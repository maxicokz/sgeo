'use client'

import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { narrativeProjects } from "@/lib/narrative-data"
import { ArrowRight, Target, AlertTriangle, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function NarrativesPage() {
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
                Дашборд тематического анализа нарративов
              </h1>
              <p className="text-slate-600 mt-1">
                Системный мониторинг и анализ тематических нарративов в среде ИИ и поисковых систем
              </p>
            </div>
          </div>

          {/* Overview Stats */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Активных проектов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">5</div>
                <p className="text-xs text-slate-600 mt-1">Ключевых тематических направлений</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Отслеживаемых промтов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">13</div>
                <p className="text-xs text-slate-600 mt-1">По всем тематикам</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">LLM систем</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">6</div>
                <p className="text-xs text-slate-600 mt-1">GPT-4, Gemini, Claude, DeepSeek, LLaMA, Yi</p>
              </CardContent>
            </Card>
          </section>

          {/* Projects List */}
          <section>
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-slate-900">Тематические проекты</h2>
              <p className="text-sm text-slate-600 mt-1">
                Выберите проект для просмотра детальной аналитики нарративов
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {narrativeProjects.map((project, index) => (
                <Link key={project.id} href={`/narratives/${project.id}`}>
                  <Card className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-none overflow-hidden">
                    {/* Gradient top bar */}
                    <div className={`h-2 bg-gradient-to-r ${project.color}`} />

                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${project.color} flex items-center justify-center text-white font-bold text-lg`}>
                              {index + 1}
                            </div>
                            <div>
                              <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                                {project.title}
                              </CardTitle>
                              <CardDescription className="mt-1">
                                {project.description}
                              </CardDescription>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="h-6 w-6 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Target Narrative */}
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-100">
                        <Target className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-medium text-green-700 uppercase tracking-wide mb-1">
                            Целевая установка
                          </div>
                          <div className="text-sm text-green-900 font-medium">
                            {project.targetNarrative}
                          </div>
                        </div>
                      </div>

                      {/* Risks */}
                      {project.risks.length > 0 && (
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-orange-50 border border-orange-100">
                          <AlertTriangle className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-xs font-medium text-orange-700 uppercase tracking-wide mb-2">
                              Основные риски
                            </div>
                            <ul className="space-y-1">
                              {project.risks.map((risk, idx) => (
                                <li key={idx} className="text-sm text-orange-900 flex items-start gap-2">
                                  <span className="text-orange-400 mt-1">•</span>
                                  <span>{risk}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}

                      {/* Action Button */}
                      <div className="pt-2">
                        <button className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 text-slate-700 font-medium hover:from-blue-50 hover:to-purple-50 hover:border-blue-300 transition-all group-hover:shadow-md flex items-center justify-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Перейти к аналитике проекта
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>

          {/* About Section */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>О дашборде</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none text-slate-600">
                <p>
                  Дашборд представляет собой аналитическую платформу для системного мониторинга и анализа тематических
                  нарративов в среде искусственного интеллекта и поисковых систем. Основная цель — визуализировать,
                  как те или иные темы и запросы (&quot;промты&quot;) отражаются в ответах крупных языковых моделей
                  (GPT-4, Gemini, Claude, DeepSeek, LLaMA и др.) и в информационном пространстве, а также выявлять
                  риски и возможности коммуникационного позиционирования.
                </p>
                <p className="mt-3">
                  <strong>Структура анализа:</strong>
                </p>
                <ul className="mt-2 space-y-1">
                  <li>Главная страница — список из пяти ключевых тем-проектов</li>
                  <li>Внутренняя страница темы — аналитическая панель по конкретной теме с пайчартом, фильтрами и таблицами</li>
                  <li>Внутренняя страница промта — детализированный анализ конкретного запроса с динамикой и метриками</li>
                </ul>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}
