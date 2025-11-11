'use client'

import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, TrendingUp, CheckCircle, Calendar, Plus, Flag, Award } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Goals data
const goals = [
  {
    id: '1',
    title: 'Достичь средней оценки 4.5/5.0',
    category: 'Качество',
    target: 4.5,
    current: 4.2,
    progress: 93,
    deadline: '31.03.2025',
    status: 'on_track',
    priority: 'high',
    owner: 'Команда аналитики'
  },
  {
    id: '2',
    title: 'Увеличить количество источников до 400',
    category: 'Охват',
    target: 400,
    current: 342,
    progress: 86,
    deadline: '30.06.2025',
    status: 'on_track',
    priority: 'medium',
    owner: 'Команда данных'
  },
  {
    id: '3',
    title: 'Улучшить E-E-A-T скор до 9.5/10',
    category: 'Качество источников',
    target: 9.5,
    current: 9.0,
    progress: 95,
    deadline: '28.02.2025',
    status: 'ahead',
    priority: 'high',
    owner: 'Команда качества'
  },
  {
    id: '4',
    title: 'Снизить время ответа LLM до 700мс',
    category: 'Производительность',
    target: 700,
    current: 844,
    progress: 83,
    deadline: '31.01.2025',
    status: 'at_risk',
    priority: 'high',
    owner: 'Технический отдел'
  },
  {
    id: '5',
    title: 'Охватить 25 новых тем',
    category: 'Охват',
    target: 25,
    current: 20,
    progress: 80,
    deadline: '30.04.2025',
    status: 'on_track',
    priority: 'medium',
    owner: 'Команда контента'
  },
  {
    id: '6',
    title: 'Позитивная тональность 65%',
    category: 'Тональность',
    target: 65,
    current: 62,
    progress: 95,
    deadline: '31.03.2025',
    status: 'on_track',
    priority: 'medium',
    owner: 'Команда аналитики'
  },
]

const progressData = [
  { month: 'Сен', прогресс: 68 },
  { month: 'Окт', прогресс: 72 },
  { month: 'Ноя', прогресс: 78 },
  { month: 'Дек', прогресс: 83 },
  { month: 'Янв', прогресс: 88 },
  { month: 'Фев', прогресс: 89 },
]

export default function GoalsPage() {
  const getStatusBadge = (status: string) => {
    if (status === 'ahead') {
      return <Badge className="bg-green-50 text-green-700 border-green-200 border">Опережаем</Badge>
    }
    if (status === 'on_track') {
      return <Badge className="bg-blue-50 text-blue-700 border-blue-200 border">В графике</Badge>
    }
    if (status === 'at_risk') {
      return <Badge className="bg-orange-50 text-orange-700 border-orange-200 border">Риск</Badge>
    }
    return <Badge variant="outline">Неизвестно</Badge>
  }

  const getPriorityBadge = (priority: string) => {
    if (priority === 'high') {
      return <Badge variant="destructive">Высокий</Badge>
    }
    if (priority === 'medium') {
      return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200 border">Средний</Badge>
    }
    return <Badge variant="outline">Низкий</Badge>
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 95) return 'from-green-500 to-emerald-500'
    if (progress >= 85) return 'from-blue-500 to-cyan-500'
    if (progress >= 70) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-pink-500'
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
                Цели и KPI
              </h1>
              <p className="text-slate-600 mt-1">
                Отслеживание стратегических целей и ключевых показателей
              </p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all">
              <Plus className="h-4 w-4 inline mr-2" />
              Добавить цель
            </button>
          </div>

          {/* Summary Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Всего целей</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{goals.length}</div>
                <p className="text-xs text-slate-600 mt-1">Активных задач</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">В графике</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {goals.filter(g => g.status === 'on_track' || g.status === 'ahead').length}
                </div>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Идут по плану
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Требуют внимания</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {goals.filter(g => g.status === 'at_risk').length}
                </div>
                <p className="text-xs text-slate-600 mt-1">Под риском</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Средний прогресс</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">
                  {Math.round(goals.reduce((sum, g) => sum + g.progress, 0) / goals.length)}%
                </div>
                <p className="text-xs text-purple-600 mt-1">По всем целям</p>
              </CardContent>
            </Card>
          </section>

          {/* Progress Chart */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Динамика выполнения целей</CardTitle>
                <CardDescription>Средний прогресс по всем целям за последние 6 месяцев</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="прогресс"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      dot={{ fill: '#8b5cf6', r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Goals List */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Активные цели</CardTitle>
                <CardDescription>Список всех целей с текущим прогрессом и сроками</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {goals.map((goal) => (
                    <div
                      key={goal.id}
                      className="p-5 rounded-lg border hover:shadow-md transition-all bg-white group"
                    >
                      <div className="flex items-start justify-between gap-4 mb-4">
                        {/* Left: Goal info */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`p-3 rounded-lg bg-gradient-to-br ${getProgressColor(goal.progress)}`}>
                            <Target className="h-6 w-6 text-white" />
                          </div>

                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">
                                {goal.title}
                              </h3>
                              {getStatusBadge(goal.status)}
                              {getPriorityBadge(goal.priority)}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                              <Badge variant="outline" className="text-xs">
                                <Flag className="h-3 w-3 mr-1" />
                                {goal.category}
                              </Badge>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                До {goal.deadline}
                              </span>
                              <span>Ответственный: {goal.owner}</span>
                            </div>

                            {/* Progress bar */}
                            <div>
                              <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-600">
                                  Текущий: <span className="font-semibold text-slate-900">{goal.current}</span> /
                                  Цель: <span className="font-semibold text-slate-900">{goal.target}</span>
                                </span>
                                <span className="font-semibold text-slate-900">{goal.progress}%</span>
                              </div>
                              <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full bg-gradient-to-r ${getProgressColor(goal.progress)} rounded-full transition-all`}
                                  style={{ width: `${goal.progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Goal Categories */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  Качество
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {goals.filter(g => g.category === 'Качество' || g.category === 'Качество источников').length}
                </div>
                <p className="text-sm text-slate-600">Целей по улучшению качества</p>
                <div className="mt-3">
                  <div className="text-xs text-slate-600 mb-1">Средний прогресс</div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{
                        width: `${Math.round(
                          goals
                            .filter(g => g.category === 'Качество' || g.category === 'Качество источников')
                            .reduce((sum, g) => sum + g.progress, 0) /
                          goals.filter(g => g.category === 'Качество' || g.category === 'Качество источников').length
                        )}%`
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Охват
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {goals.filter(g => g.category === 'Охват').length}
                </div>
                <p className="text-sm text-slate-600">Целей по расширению охвата</p>
                <div className="mt-3">
                  <div className="text-xs text-slate-600 mb-1">Средний прогресс</div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{
                        width: `${Math.round(
                          goals
                            .filter(g => g.category === 'Охват')
                            .reduce((sum, g) => sum + g.progress, 0) /
                          goals.filter(g => g.category === 'Охват').length
                        )}%`
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Другие
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {goals.filter(g => !['Качество', 'Качество источников', 'Охват'].includes(g.category)).length}
                </div>
                <p className="text-sm text-slate-600">Производительность и тональность</p>
                <div className="mt-3">
                  <div className="text-xs text-slate-600 mb-1">Средний прогресс</div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{
                        width: `${Math.round(
                          goals
                            .filter(g => !['Качество', 'Качество источников', 'Охват'].includes(g.category))
                            .reduce((sum, g) => sum + g.progress, 0) /
                          goals.filter(g => !['Качество', 'Качество источников', 'Охват'].includes(g.category)).length
                        )}%`
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}
