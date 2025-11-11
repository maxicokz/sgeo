'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { mockRecommendations } from "@/lib/mock-data"
import { Lightbulb, CheckCircle2 } from "lucide-react"

export function RecommendationsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          Рекомендации
        </CardTitle>
        <CardDescription>AI-рекомендации для улучшения показателей</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockRecommendations.map((recommendation, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer group"
            >
              <CheckCircle2 className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors mt-0.5" />
              <p className="text-sm flex-1">{recommendation}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
