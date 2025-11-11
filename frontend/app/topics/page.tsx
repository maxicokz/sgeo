'use client'

import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Plus, ChevronRight, Star, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { useState } from "react"

// Extended topics data - all 20 priority topics
const allTopics = [
  // Экономика (5)
  { id: '1', name: 'Экономика Казахстана', category: 'Экономика', priority: 5, status: 'good', sentiment: 4.2, completeness: 3.8, correctness: 4.5, trend: 'up' },
  { id: '2', name: 'Нефтегазовая промышленность', category: 'Экономика', priority: 5, status: 'warning', sentiment: 3.5, completeness: 3.2, correctness: 4.0, trend: 'down' },
  { id: '3', name: 'Инвестиционный климат', category: 'Экономика', priority: 4, status: 'good', sentiment: 4.0, completeness: 3.7, correctness: 4.3, trend: 'up' },
  { id: '4', name: 'Финансовый сектор', category: 'Экономика', priority: 4, status: 'good', sentiment: 4.1, completeness: 3.9, correctness: 4.4, trend: 'up' },
  { id: '5', name: 'Сельское хозяйство', category: 'Экономика', priority: 3, status: 'warning', sentiment: 3.6, completeness: 3.3, correctness: 3.8, trend: 'neutral' },

  // География (4)
  { id: '6', name: 'Город Астана', category: 'География', priority: 5, status: 'good', sentiment: 4.5, completeness: 4.2, correctness: 4.8, trend: 'up' },
  { id: '7', name: 'Космодром Байконур', category: 'География', priority: 5, status: 'good', sentiment: 4.7, completeness: 4.5, correctness: 4.9, trend: 'up' },
  { id: '8', name: 'Каспийское море', category: 'География', priority: 4, status: 'good', sentiment: 4.3, completeness: 4.0, correctness: 4.6, trend: 'neutral' },
  { id: '9', name: 'Алматы', category: 'География', priority: 4, status: 'good', sentiment: 4.4, completeness: 4.1, correctness: 4.7, trend: 'up' },

  // Культура (4)
  { id: '10', name: 'Казахская культура', category: 'Культура', priority: 4, status: 'good', sentiment: 4.3, completeness: 3.9, correctness: 4.2, trend: 'up' },
  { id: '11', name: 'Традиционная музыка', category: 'Культура', priority: 3, status: 'warning', sentiment: 3.7, completeness: 3.4, correctness: 3.9, trend: 'neutral' },
  { id: '12', name: 'Национальная кухня', category: 'Культура', priority: 3, status: 'good', sentiment: 4.0, completeness: 3.8, correctness: 4.1, trend: 'up' },
  { id: '13', name: 'Казахский язык', category: 'Культура', priority: 4, status: 'good', sentiment: 4.2, completeness: 3.9, correctness: 4.3, trend: 'up' },

  // Туризм (3)
  { id: '14', name: 'Туризм в Казахстане', category: 'Туризм', priority: 4, status: 'warning', sentiment: 3.8, completeness: 3.0, correctness: 3.5, trend: 'up' },
  { id: '15', name: 'Природные достопримечательности', category: 'Туризм', priority: 3, status: 'warning', sentiment: 3.9, completeness: 3.5, correctness: 3.7, trend: 'neutral' },
  { id: '16', name: 'Культурное наследие ЮНЕСКО', category: 'Туризм', priority: 3, status: 'good', sentiment: 4.1, completeness: 3.8, correctness: 4.0, trend: 'up' },

  // Политика (2)
  { id: '17', name: 'Политическая система', category: 'Политика', priority: 4, status: 'good', sentiment: 4.0, completeness: 3.8, correctness: 4.2, trend: 'neutral' },
  { id: '18', name: 'Международные отношения', category: 'Политика', priority: 4, status: 'good', sentiment: 4.2, completeness: 4.0, correctness: 4.4, trend: 'up' },

  // Образование (2)
  { id: '19', name: 'Система образования', category: 'Образование', priority: 3, status: 'good', sentiment: 3.9, completeness: 3.6, correctness: 4.0, trend: 'up' },
  { id: '20', name: 'Университеты Казахстана', category: 'Образование', priority: 3, status: 'warning', sentiment: 3.7, completeness: 3.4, correctness: 3.8, trend: 'neutral' },
]

const categories = ['Все', 'Экономика', 'География', 'Культура', 'Туризм', 'Политика', 'Образование']
const statuses = ['Все', 'Отлично', 'Внимание', 'Критично']

export default function TopicsPage() {
  const [selectedCategory, setSelectedCategory] = useState('Все')
  const [selectedStatus, setSelectedStatus] = useState('Все')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTopics = allTopics.filter(topic => {
    const matchesCategory = selectedCategory === 'Все' || topic.category === selectedCategory
    const matchesStatus = selectedStatus === 'Все' ||
      (selectedStatus === 'Отлично' && topic.status === 'good') ||
      (selectedStatus === 'Внимание' && topic.status === 'warning') ||
      (selectedStatus === 'Критично' && topic.status === 'critical')
    const matchesSearch = topic.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesStatus && matchesSearch
  })

  const getStatusBadge = (status: string) => {
    const styles = {
      good: 'bg-green-50 text-green-700 border-green-200',
      warning: 'bg-orange-50 text-orange-700 border-orange-200',
      critical: 'bg-red-50 text-red-700 border-red-200'
    }
    const labels = {
      good: 'Отлично',
      warning: 'Внимание',
      critical: 'Критично'
    }
    return { style: styles[status as keyof typeof styles], label: labels[status as keyof typeof labels] }
  }

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <TrendingUp className="h-4 w-4 text-green-600" />
    if (trend === 'down') return <TrendingDown className="h-4 w-4 text-red-600" />
    return <Minus className="h-4 w-4 text-slate-400" />
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
                Темы мониторинга
              </h1>
              <p className="text-slate-600 mt-1">
                Управление и отслеживание 20 приоритетных тем
              </p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all">
              <Plus className="h-4 w-4 inline mr-2" />
              Добавить тему
            </button>
          </div>

          {/* Statistics Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Всего тем</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">20</div>
                <p className="text-xs text-slate-600 mt-1">6 категорий</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Отлично</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {allTopics.filter(t => t.status === 'good').length}
                </div>
                <p className="text-xs text-slate-600 mt-1">Высокое качество</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Требует внимания</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">
                  {allTopics.filter(t => t.status === 'warning').length}
                </div>
                <p className="text-xs text-slate-600 mt-1">Требуют улучшения</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Средняя оценка</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">4.1/5.0</div>
                <p className="text-xs text-slate-600 mt-1">По всем темам</p>
              </CardContent>
            </Card>
          </section>

          {/* Filters */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Фильтры и поиск</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Поиск по названию темы..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Category filters */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Категория</label>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        className="px-3 py-1.5 cursor-pointer"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Status filters */}
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 block">Статус</label>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map((status) => (
                      <Badge
                        key={status}
                        variant={selectedStatus === status ? "default" : "outline"}
                        className="px-3 py-1.5 cursor-pointer"
                        onClick={() => setSelectedStatus(status)}
                      >
                        {status}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Topics List */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Список тем ({filteredTopics.length})</CardTitle>
                <CardDescription>Все отслеживаемые темы с текущими показателями</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredTopics.map((topic) => {
                    const statusBadge = getStatusBadge(topic.status)
                    return (
                      <div
                        key={topic.id}
                        className="p-4 rounded-lg border hover:shadow-md transition-all cursor-pointer group bg-white"
                      >
                        <div className="flex items-start justify-between gap-4">
                          {/* Left: Topic info */}
                          <div className="flex items-start gap-3 flex-1">
                            <div className="flex flex-col items-center gap-1 pt-1">
                              {[...Array(topic.priority)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                  {topic.name}
                                </h3>
                                {getTrendIcon(topic.trend)}
                              </div>

                              <div className="flex items-center gap-4 text-sm text-slate-600">
                                <span className="flex items-center gap-1">
                                  <Badge variant="outline" className="text-xs">{topic.category}</Badge>
                                </span>
                                <span>Тональность: {topic.sentiment}/5.0</span>
                                <span>Полнота: {topic.completeness}/5.0</span>
                                <span>Корректность: {topic.correctness}/5.0</span>
                              </div>
                            </div>
                          </div>

                          {/* Right: Status and action */}
                          <div className="flex items-center gap-3">
                            <Badge className={`${statusBadge.style} border`}>
                              {statusBadge.label}
                            </Badge>
                            <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                          </div>
                        </div>

                        {/* Progress bars */}
                        <div className="grid grid-cols-3 gap-3 mt-3">
                          <div>
                            <div className="flex justify-between text-xs text-slate-600 mb-1">
                              <span>Тональность</span>
                              <span>{Math.round(topic.sentiment * 20)}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-blue-500 rounded-full transition-all"
                                style={{ width: `${topic.sentiment * 20}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs text-slate-600 mb-1">
                              <span>Полнота</span>
                              <span>{Math.round(topic.completeness * 20)}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-purple-500 rounded-full transition-all"
                                style={{ width: `${topic.completeness * 20}%` }}
                              />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs text-slate-600 mb-1">
                              <span>Корректность</span>
                              <span>{Math.round(topic.correctness * 20)}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 rounded-full transition-all"
                                style={{ width: `${topic.correctness * 20}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}
