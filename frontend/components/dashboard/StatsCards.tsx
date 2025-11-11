'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Database, Globe, Target } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: React.ReactNode
  gradient: string
}

function StatCard({ title, value, change, changeType, icon, gradient }: StatCardProps) {
  const changeColor = {
    positive: 'text-green-600 bg-green-50',
    negative: 'text-red-600 bg-red-50',
    neutral: 'text-slate-600 bg-slate-50'
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-none">
      <div className={`h-1 bg-gradient-to-r ${gradient}`} />
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
        <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} bg-opacity-10`}>
          <div className="text-white">{icon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold text-slate-900">{value}</div>
        <div className="flex items-center gap-2 mt-2">
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${changeColor[changeType]}`}>
            {changeType === 'positive' && '↑ '}
            {change}
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsCards() {
  return (
    <>
      <StatCard
        title="Средняя тональность"
        value="4.2/5.0"
        change="+0.3 за неделю"
        changeType="positive"
        icon={<TrendingUp className="h-4 w-4" />}
        gradient="from-blue-500 to-cyan-500"
      />
      <StatCard
        title="Отслеживаемых тем"
        value="20"
        change="6 категорий"
        changeType="neutral"
        icon={<Database className="h-4 w-4" />}
        gradient="from-purple-500 to-pink-500"
      />
      <StatCard
        title="LLM систем"
        value="5"
        change="500 запросов/день"
        changeType="neutral"
        icon={<Globe className="h-4 w-4" />}
        gradient="from-orange-500 to-red-500"
      />
      <StatCard
        title="Качество источников"
        value="92/100"
        change="+5 за месяц"
        changeType="positive"
        icon={<Target className="h-4 w-4" />}
        gradient="from-green-500 to-emerald-500"
      />
    </>
  )
}
