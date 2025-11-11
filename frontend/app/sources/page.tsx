'use client'

import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Globe, Shield, TrendingUp, Award, ExternalLink, Star, CheckCircle } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

// Extended sources data
const sources = [
  {
    id: '1',
    domain: 'worldbank.org',
    name: 'World Bank',
    citations: 145,
    percentage: 35,
    eeatScore: 9.8,
    reliability: 'Очень высокая',
    category: 'Международные организации',
    lastUpdate: '2 дня назад',
    trend: 'up',
    verified: true
  },
  {
    id: '2',
    domain: 'gov.kz',
    name: 'Правительство Казахстана',
    citations: 120,
    percentage: 28,
    eeatScore: 9.5,
    reliability: 'Очень высокая',
    category: 'Государственные',
    lastUpdate: '1 день назад',
    trend: 'up',
    verified: true
  },
  {
    id: '3',
    domain: 'wikipedia.org',
    name: 'Wikipedia',
    citations: 65,
    percentage: 15,
    eeatScore: 7.5,
    reliability: 'Средняя',
    category: 'Энциклопедии',
    lastUpdate: '3 часа назад',
    trend: 'neutral',
    verified: true
  },
  {
    id: '4',
    domain: 'britannica.com',
    name: 'Encyclopaedia Britannica',
    citations: 60,
    percentage: 15,
    eeatScore: 9.2,
    reliability: 'Высокая',
    category: 'Энциклопедии',
    lastUpdate: '5 дней назад',
    trend: 'neutral',
    verified: true
  },
  {
    id: '5',
    domain: 'reuters.com',
    name: 'Reuters',
    citations: 42,
    percentage: 10,
    eeatScore: 8.9,
    reliability: 'Высокая',
    category: 'Новостные агентства',
    lastUpdate: '12 часов назад',
    trend: 'up',
    verified: true
  },
  {
    id: '6',
    domain: 'bbc.com',
    name: 'BBC',
    citations: 30,
    percentage: 7,
    eeatScore: 8.7,
    reliability: 'Высокая',
    category: 'Новостные агентства',
    lastUpdate: '1 день назад',
    trend: 'neutral',
    verified: true
  },
  {
    id: '7',
    domain: 'economist.com',
    name: 'The Economist',
    citations: 28,
    percentage: 6,
    eeatScore: 9.0,
    reliability: 'Высокая',
    category: 'Экономические издания',
    lastUpdate: '3 дня назад',
    trend: 'up',
    verified: true
  },
  {
    id: '8',
    domain: 'imf.org',
    name: 'IMF',
    citations: 25,
    percentage: 6,
    eeatScore: 9.6,
    reliability: 'Очень высокая',
    category: 'Международные организации',
    lastUpdate: '1 неделя назад',
    trend: 'neutral',
    verified: true
  },
]

const citationTrend = [
  { month: 'Янв', цитирования: 320 },
  { month: 'Фев', цитирования: 350 },
  { month: 'Мар', цитирования: 380 },
  { month: 'Апр', цитирования: 410 },
  { month: 'Май', цитирования: 450 },
  { month: 'Июн', цитирования: 515 },
]

const categoryData = [
  { category: 'Межд. орг.', count: 170 },
  { category: 'Гос.', count: 120 },
  { category: 'Новости', count: 72 },
  { category: 'Энциклоп.', count: 125 },
  { category: 'Эконом.', count: 28 },
]

export default function SourcesPage() {
  const getReliabilityColor = (reliability: string) => {
    if (reliability === 'Очень высокая') return 'bg-green-50 text-green-700 border-green-200'
    if (reliability === 'Высокая') return 'bg-blue-50 text-blue-700 border-blue-200'
    return 'bg-yellow-50 text-yellow-700 border-yellow-200'
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
                Источники данных
              </h1>
              <p className="text-slate-600 mt-1">
                Мониторинг и оценка качества источников информации
              </p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all">
              <Globe className="h-4 w-4 inline mr-2" />
              Добавить источник
            </button>
          </div>

          {/* Statistics Cards */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Всего источников</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">342</div>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +15 за месяц
                </p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Средний E-E-A-T скор</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">9.0/10</div>
                <p className="text-xs text-slate-600 mt-1">Высокое качество</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-purple-500 to-pink-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Всего цитирований</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">515</div>
                <p className="text-xs text-purple-600 mt-1">За последний месяц</p>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border-none">
              <div className="h-1 bg-gradient-to-r from-orange-500 to-red-500" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">Верифицировано</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">98%</div>
                <p className="text-xs text-slate-600 mt-1">336 из 342 источников</p>
              </CardContent>
            </Card>
          </section>

          {/* Charts */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Динамика цитирований</CardTitle>
                <CardDescription>Рост количества цитирований по месяцам</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={citationTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="цитирования" stroke="#3b82f6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Распределение по категориям</CardTitle>
                <CardDescription>Количество источников в каждой категории</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </section>

          {/* Sources List */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle>Топ источников</CardTitle>
                <CardDescription>Наиболее цитируемые источники с высоким E-E-A-T скором</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sources.map((source, index) => (
                    <div
                      key={source.id}
                      className="p-4 rounded-lg border hover:shadow-md transition-all bg-white group cursor-pointer"
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Left: Source info */}
                        <div className="flex items-start gap-4 flex-1">
                          {/* Rank */}
                          <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white font-bold text-lg">
                            {index + 1}
                          </div>

                          {/* Details */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                {source.name}
                              </h3>
                              {source.verified && (
                                <CheckCircle className="h-4 w-4 text-blue-600" />
                              )}
                              <a
                                href={`https://${source.domain}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 hover:text-blue-600"
                              >
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </div>

                            <div className="flex items-center gap-3 text-sm text-slate-600 mb-2">
                              <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded">
                                {source.domain}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {source.category}
                              </Badge>
                              <span className="text-xs">Обновлено: {source.lastUpdate}</span>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-slate-600">Цитирования:</span>
                                <span className="font-semibold text-slate-900 ml-2">
                                  {source.citations} ({source.percentage}%)
                                </span>
                              </div>
                              <div>
                                <span className="text-slate-600">E-E-A-T скор:</span>
                                <div className="inline-flex items-center ml-2">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                                  <span className="font-semibold text-slate-900">{source.eeatScore}/10</span>
                                </div>
                              </div>
                              <div>
                                <Badge className={`${getReliabilityColor(source.reliability)} border`}>
                                  <Shield className="h-3 w-3 mr-1" />
                                  {source.reliability}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right: Progress bar */}
                        <div className="w-32">
                          <div className="text-xs text-slate-600 mb-1">Охват</div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                              style={{ width: `${source.percentage}%` }}
                            />
                          </div>
                          <div className="text-xs text-slate-600 mt-1 text-right">{source.percentage}%</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Quality Metrics */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-600" />
                  Высокое качество
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600 mb-2">284</div>
                <p className="text-sm text-slate-600">Источников с E-E-A-T скором {">"} 8.0</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-600" />
                  Географический охват
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-blue-600 mb-2">45</div>
                <p className="text-sm text-slate-600">Стран представлены в источниках</p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Рост за месяц
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-purple-600 mb-2">+4.6%</div>
                <p className="text-sm text-slate-600">Увеличение количества цитирований</p>
              </CardContent>
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}
