'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Database, Globe, Target } from "lucide-react"

interface StatCardProps {
  title: string
  value: string
  change: string
  changeType: 'positive' | 'negative' | 'neutral'
  icon: React.ReactNode
}

function StatCard({ title, value, change, changeType, icon }: StatCardProps) {
  const changeColor = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-muted-foreground'
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${changeColor[changeType]} flex items-center gap-1 mt-1`}>
          {changeType === 'positive' && <TrendingUp className="h-3 w-3" />}
          {change}
        </p>
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
      />
      <StatCard
        title="Отслеживаемых тем"
        value="20"
        change="6 категорий"
        changeType="neutral"
        icon={<Database className="h-4 w-4" />}
      />
      <StatCard
        title="LLM систем"
        value="5"
        change="500 запросов/день"
        changeType="neutral"
        icon={<Globe className="h-4 w-4" />}
      />
      <StatCard
        title="Качество источников"
        value="92/100"
        change="+5 за месяц"
        changeType="positive"
        icon={<Target className="h-4 w-4" />}
      />
    </>
  )
}
