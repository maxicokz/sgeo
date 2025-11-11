'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts'
import { mockEEATData } from "@/lib/mock-data"

export function EEATScoreCard() {
  const overallScore = Math.round(
    mockEEATData.reduce((acc, item) => acc + item.score, 0) / mockEEATData.length * 10
  )

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="text-base sm:text-xl">E-E-A-T Скор</CardTitle>
        <CardDescription>Оценка качества источников по ключевым метрикам</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-4">
              <div className="relative h-32 w-32 flex-shrink-0">
                <svg className="h-full w-full -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 56}`}
                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - overallScore / 100)}`}
                    className="text-primary"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-3xl font-bold">{overallScore}</span>
                </div>
              </div>
              <div className="space-y-2 flex-1 min-w-0">
                {mockEEATData.map((item) => (
                  <div key={item.category} className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-20 flex-shrink-0 truncate">{item.category}:</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden min-w-0">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(item.score / item.fullMark) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right flex-shrink-0">
                      {item.score.toFixed(1)}/10
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0 space-y-4">
            <ResponsiveContainer width="100%" height={320}>
              <RadarChart data={mockEEATData}>
                <PolarGrid />
                <PolarAngleAxis
                  dataKey="category"
                  tick={{ fontSize: 12 }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 10]} />
                <Radar
                  name="Оценка"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>

            {/* Custom Legend */}
            <div className="flex items-center justify-center pt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-blue-500" />
                <span className="text-sm text-slate-600">Оценка</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
