'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { mockLLMScores } from "@/lib/mock-data"

const COLORS = {
  ChatGPT: '#10a37f',
  Bing: '#008272',
  Copilot: '#0078d4',
  Perplexity: '#6366f1',
  Gemini: '#4285f4'
}

export function LLMComparison() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Сравнение производительности LLM</CardTitle>
        <CardDescription>Средние оценки качества по всем темам</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockLLMScores} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 5]} />
            <YAxis dataKey="llm" type="category" width={80} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-bold">{payload[0].payload.llm}</span>
                        <span className="text-sm text-muted-foreground">
                          Оценка: <span className="font-bold text-foreground">{payload[0].value}/5.0</span>
                        </span>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="score" radius={[0, 4, 4, 0]}>
              {mockLLMScores.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[entry.llm as keyof typeof COLORS]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
