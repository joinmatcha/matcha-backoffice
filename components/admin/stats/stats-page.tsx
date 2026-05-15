"use client"

import { useEffect, useState } from "react"
import {
  BadgeCheck,
  BriefcaseBusiness,
  ClipboardList,
  Heart,
  Shield,
  Sparkles,
  Users,
} from "lucide-react"
import { ErrorMessage } from "@/components/admin/error-message"
import { StatusBadge } from "@/components/admin/status-badge"
import { adminApi } from "@/lib/api/admin"
import type { AdminStats } from "@/types/admin"

type StatCardProps = {
  label: string
  value: number | string
  description?: string
  icon: React.ElementType
}

function StatCard({ label, value, description, icon: Icon }: StatCardProps) {
  return (
    <div className="matcha-card p-5">
      <div className="mb-4 flex size-10 items-center justify-center rounded-2xl bg-accent text-primary">
        <Icon className="size-5" />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  )
}

function formatDate(value?: string) {
  if (!value) return "-"
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}

export function StatsPage() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let ignore = false

    async function loadStats() {
      setLoading(true)
      setError("")

      try {
        const response = await adminApi.getStats()
        if (!ignore) setStats(response)
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Chargement impossible")
          setStats(null)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadStats()

    return () => {
      ignore = true
    }
  }, [])

  return (
    <main className="matcha-page">
      <ErrorMessage message={error} />

      {stats && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Utilisateurs"
              value={stats.users.total}
              description={`${stats.users.verified} vérifiés · ${stats.users.verificationRate}%`}
              icon={Users}
            />
            <StatCard
              label="Admins"
              value={stats.users.admins}
              description={`${stats.users.premium} comptes premium`}
              icon={Shield}
            />
            <StatCard
              label="Tests personnalité"
              value={stats.engagement.personalityTests}
              description={`${stats.engagement.bilanResults} bilans générés`}
              icon={Sparkles}
            />
            <StatCard
              label="Swipes"
              value={stats.engagement.totalSwipes}
              description={`${stats.engagement.likedSwipes} likes`}
              icon={Heart}
            />
          </section>

          <section className="grid gap-4 lg:grid-cols-[1fr_360px]">
            <div className="matcha-card p-5">
              <h2 className="text-lg font-bold">Contenu administrable</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-accent/50 p-4">
                  <ClipboardList className="mb-3 size-5 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Versions bilan
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    {stats.content.bilanVersions}
                  </p>
                </div>
                <div className="rounded-2xl bg-accent/50 p-4">
                  <Sparkles className="mb-3 size-5 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Versions personnalité
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    {stats.content.personalityVersions}
                  </p>
                </div>
                <div className="rounded-2xl bg-accent/50 p-4">
                  <BriefcaseBusiness className="mb-3 size-5 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Métiers ROME actifs
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    {stats.content.activeRomeMetiers}
                  </p>
                </div>
                <div className="rounded-2xl bg-accent/50 p-4">
                  <BadgeCheck className="mb-3 size-5 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Appellations actives
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    {stats.content.activeRomeAppellations}
                  </p>
                </div>
              </div>
            </div>

            <div className="matcha-card p-5">
              <h2 className="text-lg font-bold">Dernier import ROME</h2>
              {stats.rome.lastRun ? (
                <div className="mt-4 space-y-3 text-sm">
                  <StatusBadge
                    active={stats.rome.lastRun.status === "success"}
                    label={stats.rome.lastRun.status}
                  />
                  <p className="text-muted-foreground">
                    Créé le {formatDate(stats.rome.lastRun.createdAt)}
                  </p>
                  <p className="text-muted-foreground">
                    Terminé le {formatDate(stats.rome.lastRun.finishedAt)}
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">
                  Aucun import ROME lancé.
                </p>
              )}
            </div>
          </section>
        </>
      )}

      {loading && (
        <div className="text-sm text-muted-foreground">Chargement...</div>
      )}
    </main>
  )
}
