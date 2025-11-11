import { StatsCards } from "@/components/dashboard/StatsCards"
import { EEATScoreCard } from "@/components/dashboard/EEATScoreCard"
import { TopSourcesChart } from "@/components/dashboard/TopSourcesChart"
import { TrendsChart } from "@/components/dashboard/TrendsChart"
import { LLMComparison } from "@/components/dashboard/LLMComparison"
import { TopicsTable } from "@/components/dashboard/TopicsTable"
import { AlertsPanel } from "@/components/dashboard/AlertsPanel"
import { RecommendationsCard } from "@/components/dashboard/RecommendationsCard"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { TrendingUp, AlertCircle, Sparkles } from "lucide-react"

export default function DashboardPage() {
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
                Панель управления
              </h1>
              <p className="text-slate-600 mt-1">
                Мониторинг представления Казахстана в LLM системах
              </p>
            </div>
            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-lg border border-slate-200 hover:bg-white transition-all shadow-sm">
                Экспорт
              </button>
              <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-lg transition-all">
                <Sparkles className="h-4 w-4 inline mr-2" />
                Новый анализ
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCards />
            </div>
          </section>

          {/* Quick Insights */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Улучшение за неделю</p>
                  <p className="text-3xl font-bold mt-1">+12.5%</p>
                  <p className="text-blue-100 text-sm mt-2">Средний показатель качества</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <TrendingUp className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Активных источников</p>
                  <p className="text-3xl font-bold mt-1">342</p>
                  <p className="text-purple-100 text-sm mt-2">Прошло проверку E-E-A-T</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Sparkles className="h-6 w-6" />
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-orange-100 text-sm">Требует внимания</p>
                  <p className="text-3xl font-bold mt-1">3</p>
                  <p className="text-orange-100 text-sm mt-2">Критических проблем</p>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <AlertCircle className="h-6 w-6" />
                </div>
              </div>
            </div>
          </section>

          {/* E-E-A-T Score and Top Sources */}
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <EEATScoreCard />
              <TopSourcesChart />
            </div>
          </section>

          {/* Trends and LLM Comparison */}
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <TrendsChart />
              <LLMComparison />
            </div>
          </section>

          {/* Topics Table */}
          <section>
            <TopicsTable />
          </section>

          {/* Alerts and Recommendations */}
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <AlertsPanel />
              <RecommendationsCard />
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
