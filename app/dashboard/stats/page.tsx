"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function StatsPage() {
  // Cartes stats (mock)
  const stats = [
    { label: "Utilisateurs", value: "1 240", variation: "+12%" },
    { label: "Actifs (7 jours)", value: "312", variation: "+5%" },
    { label: "Matchs", value: "89", variation: "-3%" },
    { label: "Signalements", value: "12", variation: "+8%" },
  ]

  // Données mock graphique
  const activityData = [
    { day: "Lun", value: 40 },
    { day: "Mar", value: 55 },
    { day: "Mer", value: 30 },
    { day: "Jeu", value: 80 },
    { day: "Ven", value: 65 },
    { day: "Sam", value: 90 },
    { day: "Dim", value: 70 },
  ]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <h1 className="text-sm font-medium">Statistiques</h1>
        </header>

        {/* Contenu */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">

          {/* Cartes stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="mt-2 text-2xl font-semibold">{s.value}</p>
                <p
                  className={`text-xs ${
                    s.variation.startsWith("-")
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {s.variation} vs semaine dernière
                </p>
              </div>
            ))}
          </div>

          {/* Bloc Activité avec vrai graphique */}
          <div className="rounded-xl bg-muted/50 p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Activité</p>
              <p className="text-xs text-muted-foreground">
                7 derniers jours
              </p>
            </div>

            <div className="mt-4 h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}