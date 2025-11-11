'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { mockSourceCitations } from "@/lib/mock-data"

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4']

export function TopSourcesChart() {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Top Cited Sources</CardTitle>
        <CardDescription>Most frequently referenced domains across LLM responses</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mockSourceCitations}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="domain" />
            <YAxis />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border bg-background p-2 shadow-sm">
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Domain
                          </span>
                          <span className="font-bold text-muted-foreground">
                            {payload[0].payload.domain}
                          </span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[0.70rem] uppercase text-muted-foreground">
                            Citations
                          </span>
                          <span className="font-bold">
                            {payload[0].value} ({payload[0].payload.percentage}%)
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                }
                return null
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {mockSourceCitations.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
