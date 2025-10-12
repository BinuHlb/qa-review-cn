"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatCard {
  title: string
  value: number
  description: string
  icon: LucideIcon
  iconColor?: string
  valueColor?: string
}

interface StatsCardsProps {
  stats: StatCard[]
  className?: string
}

export function StatsCards({ stats, className = "" }: StatsCardsProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 ${className}`}>
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 text-muted-foreground ${stat.iconColor || ''}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.valueColor || ''}`}>
              {stat.value}
            </div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
