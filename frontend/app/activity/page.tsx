'use client'

import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle2, AlertCircle, TrendingUp, Database, FileText, RefreshCw, Users, Shield } from "lucide-react"

// Activity data
const recentActivities = [
  {
    id: '1',
    type: 'analysis',
    title: 'Завершён анализ темы "Экономика Казахстана"',
    description: 'Обработано 500 запросов из 5 LLM систем',
    timestamp: '5 минут назад',
    status: 'success',
    icon: CheckCircle2,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
  {
    id: '2',
    type: 'update',
    title: 'Обновление источников данных',
    description: 'Добавлено 15 новых источников из категории Культура',
    timestamp: '1 час назад',
    status: 'success',
    icon: Database,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  {
    id: '3',
    type: 'warning',
    title: 'Снижение качества ответов',
    description: 'Тема "Нефтегазовая промышленность" - оценка упала до 3.5/5.0',
    timestamp: '2 часа назад',
    status: 'warning',
    icon: AlertCircle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  {
    id: '4',
    type: 'report',
    title: 'Сформирован еженедельный отчёт',
    description: 'Отчёт по всем темам за период 01.01 - 07.01',
    timestamp: '3 часа назад',
    status: 'success',
    icon: FileText,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  {
    id: '5',
    type: 'analysis',
    title: 'Запущен глубокий анализ',
    description: 'Анализ тональности для категории География',
    timestamp: '5 часов назад',
    status: 'success',
    icon: TrendingUp,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50'
  },
  {
    id: '6',
    type: 'system',
    title: 'Обновление API подключений',
    description: 'Успешно обновлены ключи для Perplexity и Gemini',
    timestamp: '6 часов назад',
    status: 'success',
    icon: RefreshCw,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50'
  },
  {
    id: '7',
    type: 'user',
    title: 'Новый пользователь добавлен',
    description: 'admin@sgeo.kz получил доступ к системе',
    timestamp: '1 день назад',
    status: 'info',
    icon: Users,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50'
  },
  {
    id: '8',
    type: 'security',
    title: 'Проверка безопасности пройдена',
    description: 'Все источники прошли валидацию E-E-A-T',
    timestamp: '1 день назад',
    status: 'success',
    icon: Shield,
    color: 'text-green-600',
    bgColor: 'bg-green-50'
  },
]

const systemStats = [
  { label: 'Запросов сегодня', value: '1,247', change: '+12%', trend: 'up' },
  { label: 'Обработано тем', value: '20', change: '100%', trend: 'neutral' },
  { label: 'Обновлений источников', value: '15', change: '+5', trend: 'up' },
  { label: 'Сформировано отчётов', value: '8', change: '+2', trend: 'up' },
]

export default function ActivityPage() {
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
                Активность
              </h1>
              <p className="text-slate-600 mt-1">
                История событий и системных обновлений
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-white transition-all shadow-sm">
                <Clock className="h-4 w-4 inline mr-2" />
                Фильтры
              </button>
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all">
                <RefreshCw className="h-4 w-4 inline mr-2" />
                Обновить
              </button>
            </div>
          </div>

          {/* System Statistics */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemStats.map((stat, index) => (
              <Card key={index} className="overflow-hidden border-none">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600">{stat.label}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-slate-900">{stat.value}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={stat.trend === 'up' ? 'default' : 'secondary'} className="text-xs">
                      {stat.change}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          {/* Activity Timeline */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Лента активности</CardTitle>
                <CardDescription>Последние события и обновления системы</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => {
                    const Icon = activity.icon
                    return (
                      <div
                        key={activity.id}
                        className="flex items-start gap-4 p-4 rounded-lg border hover:bg-slate-50/50 transition-colors group"
                      >
                        {/* Timeline connector */}
                        <div className="relative flex flex-col items-center">
                          <div className={`p-2 rounded-lg ${activity.bgColor}`}>
                            <Icon className={`h-5 w-5 ${activity.color}`} />
                          </div>
                          {index < recentActivities.length - 1 && (
                            <div className="w-0.5 h-12 bg-slate-200 mt-2" />
                          )}
                        </div>

                        {/* Activity content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {activity.title}
                              </h3>
                              <p className="text-sm text-slate-600 mt-1">{activity.description}</p>
                            </div>
                            <Badge variant="outline" className="text-xs whitespace-nowrap">
                              {activity.timestamp}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Recent Changes Summary */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-lg">Успешно завершено</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600 mb-2">15</div>
                <p className="text-sm text-slate-600">Анализов и обновлений за последние 24 часа</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <CardTitle className="text-lg">Требует внимания</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-orange-600 mb-2">3</div>
                <p className="text-sm text-slate-600">Предупреждений по качеству ответов</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-lg">В процессе</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600 mb-2">2</div>
                <p className="text-sm text-slate-600">Активных задач по анализу данных</p>
              </CardContent>
            </Card>
          </section>

          {/* Activity Types Filter */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Фильтр по типам событий</CardTitle>
                <CardDescription>Выберите типы активности для отображения</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge className="px-3 py-1.5 cursor-pointer hover:bg-primary/90">Все события</Badge>
                  <Badge variant="outline" className="px-3 py-1.5 cursor-pointer hover:bg-slate-100">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Анализы
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1.5 cursor-pointer hover:bg-slate-100">
                    <Database className="h-3 w-3 mr-1" />
                    Обновления
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1.5 cursor-pointer hover:bg-slate-100">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    Предупреждения
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1.5 cursor-pointer hover:bg-slate-100">
                    <FileText className="h-3 w-3 mr-1" />
                    Отчёты
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1.5 cursor-pointer hover:bg-slate-100">
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Система
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1.5 cursor-pointer hover:bg-slate-100">
                    <Shield className="h-3 w-3 mr-1" />
                    Безопасность
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}
