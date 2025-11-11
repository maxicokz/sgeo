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
        <CardTitle>Overall E-E-A-T Score</CardTitle>
        <CardDescription>Source quality assessment across key metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <div className="relative h-32 w-32">
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
              <div className="space-y-2">
                {mockEEATData.map((item) => (
                  <div key={item.category} className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-24">{item.category}:</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(item.score / item.fullMark) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-12 text-right">
                      {item.score.toFixed(1)}/10
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={mockEEATData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={90} domain={[0, 10]} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
