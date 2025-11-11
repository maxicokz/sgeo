'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockTopics } from "@/lib/mock-data"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

export function TopicsTable() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'success'
      case 'warning':
        return 'warning'
      case 'critical':
        return 'danger'
      default:
        return 'default'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'good':
        return <TrendingUp className="h-4 w-4" />
      case 'warning':
        return <Minus className="h-4 w-4" />
      case 'critical':
        return <TrendingDown className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'good':
        return 'Отлично'
      case 'warning':
        return 'Внимание'
      case 'critical':
        return 'Критично'
      default:
        return status
    }
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Приоритетные темы</CardTitle>
        <CardDescription>Статус мониторинга по 20 ключевым темам</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-sm">Тема</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Категория</th>
                <th className="text-center py-3 px-4 font-medium text-sm">Приоритет</th>
                <th className="text-center py-3 px-4 font-medium text-sm">Тональность</th>
                <th className="text-center py-3 px-4 font-medium text-sm">Полнота</th>
                <th className="text-center py-3 px-4 font-medium text-sm">Корректность</th>
                <th className="text-center py-3 px-4 font-medium text-sm">Статус</th>
              </tr>
            </thead>
            <tbody>
              {mockTopics.map((topic) => (
                <tr key={topic.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-medium">{topic.name}</div>
                  </td>
                  <td className="py-3 px-4">
                    <Badge variant="outline">{topic.category}</Badge>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex justify-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-2 w-2 rounded-full ${
                            i < topic.priority ? 'bg-primary' : 'bg-muted'
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-medium">{topic.sentiment.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm">/5.0</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-medium">{topic.completeness.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm">/5.0</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-medium">{topic.correctness.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm">/5.0</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-center gap-1">
                      <Badge variant={getStatusColor(topic.status)} className="gap-1">
                        {getStatusIcon(topic.status)}
                        <span>{getStatusText(topic.status)}</span>
                      </Badge>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
