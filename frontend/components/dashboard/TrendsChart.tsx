'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { mockTrendData } from "@/lib/mock-data"
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

export function TrendsChart() {
  const formattedData = mockTrendData.map(item => ({
    ...item,
    date: format(new Date(item.date), 'd MMM', { locale: ru }),
    тональность: item.sentiment,
    полнота: item.completeness,
    корректность: item.correctness,
  }))

  const legendItems = [
    { name: 'Тональность', color: '#3b82f6' },
    { name: 'Полнота', color: '#10b981' },
    { name: 'Корректность', color: '#f59e0b' }
  ]

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Тренды качества</CardTitle>
        <CardDescription>Оценки тональности, полноты и корректности (шкала 0-5)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={formattedData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-3 shadow-sm">
                      <div className="grid gap-2">
                        <div className="font-semibold">{payload[0].payload.date}</div>
                        {payload.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm text-muted-foreground capitalize">
                              {item.name}:
                            </span>
                            <span className="text-sm font-bold">
                              {typeof item.value === 'number' ? item.value.toFixed(1) : item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Line
              type="monotone"
              dataKey="тональность"
              name="Тональность"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="полнота"
              name="Полнота"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: '#10b981', r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="корректность"
              name="Корректность"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ fill: '#f59e0b', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>

        {/* Custom Legend */}
        <div className="flex items-center justify-center gap-6 pt-2">
          {legendItems.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-slate-600">{item.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
