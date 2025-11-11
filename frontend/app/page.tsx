import { StatsCards } from "@/components/dashboard/StatsCards"
import { EEATScoreCard } from "@/components/dashboard/EEATScoreCard"
import { TopSourcesChart } from "@/components/dashboard/TopSourcesChart"
import { TrendsChart } from "@/components/dashboard/TrendsChart"
import { LLMComparison } from "@/components/dashboard/LLMComparison"
import { TopicsTable } from "@/components/dashboard/TopicsTable"
import { AlertsPanel } from "@/components/dashboard/AlertsPanel"
import { RecommendationsCard } from "@/components/dashboard/RecommendationsCard"
import { BarChart3, Menu } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-2xl font-bold">SGEO Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  LLM Monitoring & Analytics Platform
                </p>
              </div>
            </div>
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCards />
          </div>
        </section>

        {/* E-E-A-T Score and Top Sources */}
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <EEATScoreCard />
            <TopSourcesChart />
          </div>
        </section>

        {/* Trends and LLM Comparison */}
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <TrendsChart />
            <LLMComparison />
          </div>
        </section>

        {/* Topics Table */}
        <section className="mb-8">
          <TopicsTable />
        </section>

        {/* Alerts and Recommendations */}
        <section className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AlertsPanel />
            <RecommendationsCard />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>© 2024 SGEO Dashboard. All rights reserved.</p>
            <p>Last updated: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
