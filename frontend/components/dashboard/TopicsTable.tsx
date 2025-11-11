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

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Priority Topics</CardTitle>
        <CardDescription>Monitoring status across 20 key topics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium text-sm">Topic</th>
                <th className="text-left py-3 px-4 font-medium text-sm">Category</th>
                <th className="text-center py-3 px-4 font-medium text-sm">Priority</th>
                <th className="text-center py-3 px-4 font-medium text-sm">Sentiment</th>
                <th className="text-center py-3 px-4 font-medium text-sm">Completeness</th>
                <th className="text-center py-3 px-4 font-medium text-sm">Correctness</th>
                <th className="text-center py-3 px-4 font-medium text-sm">Status</th>
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
                        <span className="capitalize">{topic.status}</span>
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
