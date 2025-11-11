'use client'

import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Calendar, Eye, Plus, BarChart3, TrendingUp, Clock } from "lucide-react"

// Reports data
const reports = [
  {
    id: '1',
    title: 'Еженедельный отчёт по всем темам',
    period: '01.01.2025 - 07.01.2025',
    type: 'weekly',
    status: 'completed',
    createdAt: '07.01.2025',
    author: 'Система',
    size: '2.4 MB',
    format: 'PDF',
    topics: 20,
    insights: 15,
    downloads: 12
  },
  {
    id: '2',
    title: 'Месячный анализ экономических тем',
    period: 'Декабрь 2024',
    type: 'monthly',
    status: 'completed',
    createdAt: '31.12.2024',
    author: 'Система',
    size: '5.1 MB',
    format: 'PDF',
    topics: 5,
    insights: 28,
    downloads: 24
  },
  {
    id: '3',
    title: 'Сравнительный анализ LLM систем',
    period: 'Q4 2024',
    type: 'quarterly',
    status: 'completed',
    createdAt: '28.12.2024',
    author: 'Admin',
    size: '8.7 MB',
    format: 'PDF',
    topics: 20,
    insights: 45,
    downloads: 38
  },
  {
    id: '4',
    title: 'Отчёт по источникам данных',
    period: '15.12.2024 - 15.01.2025',
    type: 'custom',
    status: 'generating',
    createdAt: '15.01.2025',
    author: 'Система',
    size: '-',
    format: 'PDF',
    topics: 20,
    insights: 0,
    downloads: 0
  },
  {
    id: '5',
    title: 'Анализ тональности упоминаний',
    period: 'Ноябрь 2024',
    type: 'monthly',
    status: 'completed',
    createdAt: '30.11.2024',
    author: 'Система',
    size: '3.8 MB',
    format: 'PDF',
    topics: 20,
    insights: 22,
    downloads: 18
  },
  {
    id: '6',
    title: 'Еженедельный отчёт по культурным темам',
    period: '25.12.2024 - 31.12.2024',
    type: 'weekly',
    status: 'completed',
    createdAt: '31.12.2024',
    author: 'Система',
    size: '1.9 MB',
    format: 'PDF',
    topics: 4,
    insights: 8,
    downloads: 7
  },
]

const reportTemplates = [
  {
    id: '1',
    name: 'Еженедельный обзор',
    description: 'Краткий отчёт по всем темам за неделю',
    frequency: 'Еженедельно',
    icon: Calendar
  },
  {
    id: '2',
    name: 'Месячный анализ',
    description: 'Подробный анализ показателей за месяц',
    frequency: 'Ежемесячно',
    icon: BarChart3
  },
  {
    id: '3',
    name: 'Квартальный отчёт',
    description: 'Стратегический обзор за квартал',
    frequency: 'Ежеквартально',
    icon: TrendingUp
  },
  {
    id: '4',
    name: 'Пользовательский',
    description: 'Настраиваемый отчёт по выбранным параметрам',
    frequency: 'По запросу',
    icon: FileText
  },
]

export default function ReportsPage() {
  const getStatusBadge = (status: string) => {
    if (status === 'completed') {
      return <Badge className="bg-green-50 text-green-700 border-green-200 border">Готов</Badge>
    }
    if (status === 'generating') {
      return <Badge className="bg-blue-50 text-blue-700 border-blue-200 border">Создаётся</Badge>
    }
    return <Badge variant="outline">Неизвестно</Badge>
  }

  const getTypeBadge = (type: string) => {
    const types = {
      weekly: { label: 'Еженедельный', color: 'bg-blue-50 text-blue-700 border-blue-200' },
      monthly: { label: 'Месячный', color: 'bg-purple-50 text-purple-700 border-purple-200' },
      quarterly: { label: 'Квартальный', color: 'bg-orange-50 text-orange-700 border-orange-200' },
      custom: { label: 'Пользовательский', color: 'bg-slate-50 text-slate-700 border-slate-200' }
    }
    const typeInfo = types[type as keyof typeof types] || types.custom
    return <Badge className={`${typeInfo.color} border`}>{typeInfo.label}</Badge>
  }

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
                Отчёты
              </h1>
              <p className="text-slate-600 mt-1">
                Создание и управление аналитическими отчётами
              </p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all">
              <Plus className="h-4 w-4 inline mr-2" />
              Создать отчёт
            </button>
          </div>

          {/* Statistics */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Всего отчётов</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{reports.length}</div>
                <p className="text-xs text-slate-600 mt-1">За всё время</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Завершено</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {reports.filter(r => r.status === 'completed').length}
                </div>
                <p className="text-xs text-slate-600 mt-1">Доступно для скачивания</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Скачиваний</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {reports.reduce((sum, r) => sum + r.downloads, 0)}
                </div>
                <p className="text-xs text-slate-600 mt-1">Всего загрузок</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">В процессе</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {reports.filter(r => r.status === 'generating').length}
                </div>
                <p className="text-xs text-slate-600 mt-1">Создаётся</p>
              </CardContent>
            </Card>
          </section>

          {/* Report Templates */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Шаблоны отчётов</CardTitle>
                <CardDescription>Быстрое создание отчётов по готовым шаблонам</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {reportTemplates.map((template) => {
                    const Icon = template.icon
                    return (
                      <div
                        key={template.id}
                        className="p-4 rounded-lg border hover:shadow-md transition-all bg-white cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            <Icon className="h-5 w-5" />
                          </div>
                          <Badge variant="outline" className="text-xs">{template.frequency}</Badge>
                        </div>
                        <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {template.name}
                        </h3>
                        <p className="text-sm text-slate-600">{template.description}</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Reports List */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>История отчётов</CardTitle>
                <CardDescription>Все созданные отчёты с возможностью скачивания</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 rounded-lg border hover:shadow-md transition-all bg-white group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Left: Report info */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="p-3 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200">
                            <FileText className="h-6 w-6 text-slate-700" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {report.title}
                              </h3>
                              {getStatusBadge(report.status)}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                              {getTypeBadge(report.type)}
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {report.period}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {report.createdAt}
                              </span>
                            </div>

                            <div className="grid grid-cols-5 gap-4 text-sm">
                              <div>
                                <span className="text-slate-600">Автор:</span>
                                <span className="ml-2 font-medium text-slate-900">{report.author}</span>
                              </div>
                              <div>
                                <span className="text-slate-600">Тем:</span>
                                <span className="ml-2 font-medium text-slate-900">{report.topics}</span>
                              </div>
                              <div>
                                <span className="text-slate-600">Инсайтов:</span>
                                <span className="ml-2 font-medium text-slate-900">{report.insights}</span>
                              </div>
                              <div>
                                <span className="text-slate-600">Размер:</span>
                                <span className="ml-2 font-medium text-slate-900">{report.size}</span>
                              </div>
                              <div>
                                <span className="text-slate-600">Скачиваний:</span>
                                <span className="ml-2 font-medium text-slate-900">{report.downloads}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        {report.status === 'completed' && (
                          <div className="flex gap-2">
                            <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                              <Eye className="h-4 w-4 text-slate-600" />
                            </button>
                            <button className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors">
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                        {report.status === 'generating' && (
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent" />
                            Создаётся...
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Quick Actions */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg cursor-pointer hover:shadow-xl transition-all">
              <FileText className="h-8 w-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Еженедельный отчёт</h3>
              <p className="text-blue-100 text-sm mb-4">Создать отчёт за последнюю неделю</p>
              <button className="px-4 py-2 rounded-lg bg-white text-blue-600 font-medium hover:bg-blue-50 transition-colors">
                Создать
              </button>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg cursor-pointer hover:shadow-xl transition-all">
              <BarChart3 className="h-8 w-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Месячный анализ</h3>
              <p className="text-purple-100 text-sm mb-4">Подробный отчёт за месяц</p>
              <button className="px-4 py-2 rounded-lg bg-white text-purple-600 font-medium hover:bg-purple-50 transition-colors">
                Создать
              </button>
            </div>

            <div className="p-6 rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg cursor-pointer hover:shadow-xl transition-all">
              <TrendingUp className="h-8 w-8 mb-3" />
              <h3 className="text-lg font-semibold mb-2">Пользовательский</h3>
              <p className="text-green-100 text-sm mb-4">Настроить параметры отчёта</p>
              <button className="px-4 py-2 rounded-lg bg-white text-green-600 font-medium hover:bg-green-50 transition-colors">
                Настроить
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
