"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Activity,
  BarChart3,
  BriefcaseBusiness,
  Eye,
  Heart,
  Route,
  Sparkles,
  Target,
} from "lucide-react"
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { ErrorMessage } from "@/components/admin/error-message"
import { Button } from "@/components/ui/button"
import { adminApi } from "@/lib/api/admin"
import type {
  InsightsActivityPoint,
  InsightsJobMetric,
  InsightsJobs,
  InsightsOrientation,
  InsightsOrientationItem,
  InsightsOverview,
  InsightsQuery,
  InsightsTestMetric,
  InsightsWorkStyleProfileItem,
} from "@/types/admin"

type InsightsState = {
  overview: InsightsOverview
  activity: InsightsActivityPoint[]
  tests: InsightsTestMetric[]
  jobs: InsightsJobs
  orientation: InsightsOrientation
}

type PeriodKey = "7d" | "14d" | "30d" | "all"

const periods: Array<{ key: PeriodKey; label: string }> = [
  { key: "7d", label: "7 jours" },
  { key: "14d", label: "14 jours" },
  { key: "30d", label: "30 jours" },
  { key: "all", label: "Tout" },
]

const orientationLabels: Record<string, string> = {
  analysis: "Analyse",
  communication: "Communication",
  planning: "Planification",
  listening: "Écoute",
  pedagogy: "Pédagogie",
  teamwork: "Travail d'équipe",
  problem_solving: "Résolution de problème",
  autonomy: "Autonomie",
  digital: "Digital",
  organization: "Organisation",
  customer_relation: "Relation client",
  adaptability: "Adaptabilité",
  assertiveness: "Assertivité",
  technical_depth: "Approfondissement technique",
  prioritization: "Priorisation",
  public_speaking: "Prise de parole",
  project_management: "Gestion de projet",
  confidence: "Confiance",
  impact: "Impact",
  stability: "Stabilité",
  learning: "Apprentissage",
  hybrid: "Hybride",
  clear_framework: "Cadre clair",
  collaboration: "Collaboration",
  pace: "Rythme",
  structure: "Structure",
  variety: "Variété",
  human_contact: "Contact humain",
  mobility: "Terrain",
}

function getPeriodQuery(period: PeriodKey): InsightsQuery {
  if (period === "all") return { limit: 10 }

  const days = period === "7d" ? 7 : period === "14d" ? 14 : 30
  const from = new Date()
  from.setDate(from.getDate() - days)
  from.setHours(0, 0, 0, 0)

  return { from: from.toISOString(), limit: 10 }
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("fr-FR").format(value)
}

function formatDay(day: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${day}T00:00:00`))
}

function formatFullDay(day: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "long",
  }).format(new Date(`${day}T00:00:00`))
}

function labelFor(value: string) {
  return orientationLabels[value] ?? value.replaceAll("_", " ")
}

function maxCount(items: Array<{ count: number }>) {
  return Math.max(...items.map((item) => item.count), 1)
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType
  title: string
  description?: string
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary">
        <Icon className="size-4" />
      </div>
      <div>
        <h2 className="text-lg font-bold">{title}</h2>
        {description && (
          <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

function KpiCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string
  value: number | string
  description: string
  icon: React.ElementType
}) {
  return (
    <div className="matcha-card p-5">
      <div className="mb-4 flex size-10 items-center justify-center rounded-2xl bg-accent text-primary">
        <Icon className="size-5" />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function BarList({
  items,
  labelKey,
  emptyLabel,
  limit = 6,
}: {
  items: Array<{ count: number } & Record<string, unknown>>
  labelKey: string
  emptyLabel: string
  limit?: number
}) {
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>
  }

  const visibleItems = items.slice(0, limit)
  const max = maxCount(visibleItems)

  return (
    <div className="space-y-3">
      {visibleItems.map((item) => {
        const label = String(item[labelKey] ?? "-")
        const width = `${Math.max((item.count / max) * 100, 4)}%`

        return (
          <div key={`${label}-${item.count}`}>
            <div className="mb-1 flex items-center justify-between gap-3 text-sm">
              <span className="font-medium">{label}</span>
              <span className="text-muted-foreground">{item.count}</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-accent/60">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width }}
              />
            </div>
          </div>
        )
      })}
      {items.length > visibleItems.length && (
        <p className="pt-1 text-xs font-medium text-muted-foreground">
          +{items.length - visibleItems.length} autres signaux
        </p>
      )}
    </div>
  )
}

function ActivityChart({ data }: { data: InsightsActivityPoint[] }) {
  if (data.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aucune activité sur la période.
      </p>
    )
  }

  const totalEvents = data.reduce((sum, item) => sum + item.events, 0)
  const totalCompleted = data.reduce((sum, item) => sum + item.testsCompleted, 0)
  const averageEvents = Math.round(totalEvents / data.length)
  const peak = data.reduce((best, item) =>
    item.events > best.events ? item : best
  )
  const chartData = data.map((item) => ({
    ...item,
    label: formatDay(item.day),
    fullLabel: formatFullDay(item.day),
  }))

  return (
    <div>
      <div className="mb-4 grid gap-2 sm:grid-cols-3">
        <div className="rounded-2xl bg-accent/35 p-3">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Moyenne
          </p>
          <p className="mt-1 text-lg font-bold">{averageEvents}/jour</p>
        </div>
        <div className="rounded-2xl bg-accent/35 p-3">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Pic
          </p>
          <p className="mt-1 text-lg font-bold">
            {peak.events} le {formatDay(peak.day)}
          </p>
        </div>
        <div className="rounded-2xl bg-accent/35 p-3">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            Tests terminés
          </p>
          <p className="mt-1 text-lg font-bold">{totalCompleted}</p>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 12, right: 12, bottom: 0, left: -18 }}
            barCategoryGap="32%"
          >
            <CartesianGrid stroke="var(--border)" strokeDasharray="4 6" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "var(--accent)", opacity: 0.32 }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null

                const item = payload[0]?.payload as {
                  fullLabel: string
                  events: number
                  testsCompleted: number
                  activeUsers: number
                }

                return (
                  <div className="rounded-2xl border border-border bg-white p-3 text-sm shadow-lg">
                    <p className="font-semibold">{item.fullLabel}</p>
                    <p className="mt-2 text-muted-foreground">
                      {item.events} événements collectés
                    </p>
                    <p className="text-muted-foreground">
                      {item.testsCompleted} tests terminés
                    </p>
                    <p className="text-muted-foreground">
                      {item.activeUsers} utilisateurs actifs estimés
                    </p>
                  </div>
                )
              }}
            />
            <Bar
              dataKey="events"
              name="Événements"
              fill="var(--primary)"
              radius={[8, 8, 0, 0]}
            />
            <Line
              type="monotone"
              dataKey="testsCompleted"
              name="Tests terminés"
              stroke="var(--chart-3)"
              strokeWidth={3}
              dot={{ r: 4, fill: "var(--chart-3)", strokeWidth: 0 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function TestFunnel({ tests }: { tests: InsightsTestMetric[] }) {
  if (tests.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Aucun événement de test sur la période.
      </p>
    )
  }

  return (
    <div className="space-y-4">
      {tests.map((test) => (
        <div
          key={test.entityType}
          className="rounded-2xl border border-border/60 bg-white/70 p-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-semibold">{test.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {test.started} démarrages · {test.completed} résultats ·{" "}
                {test.abandoned} abandons
              </p>
            </div>
            <div className="text-right">
              <span className="rounded-full bg-accent px-3 py-1 text-sm font-bold text-primary">
                {test.completionRate}% complété
              </span>
              <p className="mt-2 text-xs font-semibold text-muted-foreground">
                {test.abandonmentRate}% abandon
              </p>
            </div>
          </div>

          <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-red-100">
            <div
              className="h-full bg-primary"
              style={{ width: `${test.completionRate}%` }}
            />
            <div
              className="h-full bg-red-300"
              style={{ width: `${test.abandonmentRate}%` }}
            />
          </div>

          <p className="mt-3 text-sm text-muted-foreground">
            Étape la plus fragile :{" "}
            <span className="font-semibold text-foreground">
              {test.topAbandonStep?.stepId ?? "non identifiée"}
            </span>
          </p>
        </div>
      ))}
    </div>
  )
}

function JobsTable({
  title,
  signal,
  jobs,
  emptyLabel,
}: {
  title: string
  signal: string
  jobs: InsightsJobMetric[]
  emptyLabel: string
}) {
  return (
    <div className="matcha-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{signal}</p>
        </div>
        <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-primary">
          {jobs.length > 0 ? `Top ${jobs.length}` : "Aucun signal"}
        </span>
      </div>
      {jobs.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border/80 bg-accent/25 p-5 text-sm text-muted-foreground">
          {emptyLabel}
        </div>
      ) : (
        <div className="mt-4 overflow-hidden rounded-2xl border border-border/70">
          <table className="w-full text-left text-sm">
            <thead className="bg-accent/50 text-muted-foreground">
              <tr>
                <th className="w-14 px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Métier</th>
                <th className="px-4 py-3 font-medium">Domaine</th>
                <th className="px-4 py-3 text-right font-medium">Volume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 bg-white/70">
              {jobs.map((job, index) => (
                <tr key={job.jobId}>
                  <td className="px-4 py-3 text-muted-foreground">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 font-medium">{job.title}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {job.domain}
                  </td>
                  <td className="px-4 py-3 text-right font-bold">
                    {job.count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function OrientationList({
  title,
  items,
}: {
  title: string
  items: InsightsOrientationItem[]
}) {
  return (
    <div className="rounded-2xl bg-accent/40 p-4">
      <h3 className="text-sm font-bold">{title}</h3>
      <div className="mt-3">
        <BarList
          items={items.map((item) => ({ ...item, label: labelFor(item.key) }))}
          labelKey="label"
          emptyLabel="Aucune donnée."
        />
      </div>
    </div>
  )
}

function WorkStyleProfiles({
  items,
}: {
  items: InsightsWorkStyleProfileItem[]
}) {
  return (
    <div className="rounded-2xl bg-accent/40 p-4">
      <h3 className="text-sm font-bold">Profils Style professionnel</h3>
      <div className="mt-3">
        <BarList
          items={items}
          labelKey="title"
          emptyLabel="Aucun profil disponible."
        />
      </div>
    </div>
  )
}

function ProductDecisionCard({ data }: { data: InsightsState }) {
  const weakestTest = data.tests
    .slice()
    .sort((a, b) => b.abandonmentRate - a.abandonmentRate)[0]
  const gap = data.jobs.recommendationInterestGap[0]
  const topLikedJob = data.jobs.liked[0]
  const topSkill = data.orientation.competenceStrengths[0]
  const topLikedDomain = data.jobs.domains.liked[0]

  return (
    <div className="rounded-[30px] border border-border bg-white p-5 shadow-[0_18px_42px_rgba(13,21,32,0.06)]">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase text-primary">
            Lecture produit
          </p>
          <h2 className="mt-1 text-2xl font-bold">
            Décisions possibles à partir des données
          </h2>
        </div>
        <p className="max-w-xl text-sm text-muted-foreground">
          {data.overview.testsStarted} tests démarrés ·{" "}
          {data.overview.jobViews} fiches vues · {data.overview.likes} likes
          métier
        </p>
      </div>

      <div className="mt-5 grid gap-3 lg:grid-cols-3">
        <div className="rounded-2xl border border-border/70 bg-white/80 p-4 text-sm">
          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
            À surveiller
          </span>
          <p className="mt-3 font-semibold">Parcours test</p>
          <p className="mt-2 leading-6 text-muted-foreground">
            {weakestTest
              ? `${weakestTest.label} a le plus fort abandon : ${weakestTest.abandonmentRate}% (${weakestTest.abandoned}/${weakestTest.started}). Étape principale : ${weakestTest.topAbandonStep?.stepId ?? "non identifiée"}.`
              : "Pas encore assez d'événements pour identifier un point de friction."}
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-white/80 p-4 text-sm">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-700">
            Opportunité
          </span>
          <p className="mt-3 font-semibold">Matching métier</p>
          <p className="mt-2 leading-6 text-muted-foreground">
            {gap
              ? `${gap.title} apparaît dans les recommandations sans générer le même niveau d'intérêt. Volume concerné : ${gap.count}.`
              : topLikedJob
                ? `${topLikedJob.title} est le métier le plus liké sur la période (${topLikedJob.count}).`
                : "Aucun signal métier exploitable sur la période."}
          </p>
        </div>
        <div className="rounded-2xl border border-border/70 bg-white/80 p-4 text-sm">
          <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-primary">
            Signal fort
          </span>
          <p className="mt-3 font-semibold">Orientation</p>
          <p className="mt-2 leading-6 text-muted-foreground">
            {topSkill && topLikedDomain
              ? `${labelFor(topSkill.key)} ressort ${topSkill.count} fois dans les compétences fortes. Domaine le plus liké : ${topLikedDomain.domain} (${topLikedDomain.count}).`
              : topSkill
                ? `${labelFor(topSkill.key)} ressort ${topSkill.count} fois dans les compétences fortes.`
                : "Aucun résultat d'orientation agrégé sur la période."}
          </p>
        </div>
      </div>
    </div>
  )
}

export function InsightsPage() {
  const [period, setPeriod] = useState<PeriodKey>("14d")
  const [data, setData] = useState<InsightsState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const query = useMemo(() => getPeriodQuery(period), [period])
  const headerSummary = data
    ? `${data.overview.activeUsers} utilisateurs actifs estimés · ${data.overview.testsStarted} tests démarrés · ${data.overview.jobViews} fiches métier vues`
    : "Chargement des données produit..."

  useEffect(() => {
    let ignore = false

    async function loadInsights() {
      setLoading(true)
      setError("")

      try {
        const [overview, activity, tests, jobs, orientation] = await Promise.all([
          adminApi.getInsightsOverview(query),
          adminApi.getInsightsActivity(query),
          adminApi.getInsightsTests(query),
          adminApi.getInsightsJobs(query),
          adminApi.getInsightsOrientation(query),
        ])

        if (!ignore) {
          setData({
            overview,
            activity: activity.activity,
            tests: tests.tests,
            jobs,
            orientation,
          })
        }
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Chargement impossible")
          setData(null)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadInsights()

    return () => {
      ignore = true
    }
  }, [query])

  return (
    <main className="matcha-page">
      <section className="overflow-hidden rounded-[34px] border border-primary/15 bg-gradient-to-br from-primary via-[#2a7f68] to-[#1d4f44] p-6 text-primary-foreground shadow-[0_24px_70px_rgba(18,73,61,0.22)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="inline-flex items-center rounded-full bg-white/14 px-3 py-1 text-xs font-bold uppercase text-white/85">
              Pilotage produit
            </div>
            <h1 className="mt-4 text-4xl font-bold tracking-tight">
              Matcha Insights
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/78">
              {headerSummary}
            </p>
          </div>

          <div className="rounded-3xl border border-white/14 bg-white/10 p-3">
            <p className="mb-2 px-1 text-xs font-semibold uppercase text-white/70">
              Période analysée
            </p>
            <div className="flex flex-wrap gap-2">
              {periods.map((item) => (
                <Button
                  key={item.key}
                  type="button"
                  variant="ghost"
                  className={
                    period === item.key
                      ? "bg-white text-primary hover:bg-white/90 hover:text-primary"
                      : "text-white/82 hover:bg-white/12 hover:text-white"
                  }
                  onClick={() => setPeriod(item.key)}
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ErrorMessage message={error} />

      {loading && (
        <div className="text-sm text-muted-foreground">Chargement...</div>
      )}

      {data && (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              label="Événements"
              value={formatNumber(data.overview.totalEvents)}
              description={`${data.overview.activeUsers} utilisateurs actifs estimés`}
              icon={Activity}
            />
            <KpiCard
              label="Complétion globale"
              value={`${data.overview.completionRate}%`}
              description={`${data.overview.testsCompleted}/${data.overview.testsStarted} tests terminés`}
              icon={Target}
            />
            <KpiCard
              label="Fiches vues"
              value={formatNumber(data.overview.jobViews)}
              description="Consultations de métiers sur la période"
              icon={Eye}
            />
            <KpiCard
              label="Intérêt métier"
              value={formatNumber(data.overview.likes)}
              description={`${data.overview.dislikes} dislikes enregistrés`}
              icon={Heart}
            />
          </section>

          <section>
            <ProductDecisionCard data={data} />
          </section>

          <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <div className="matcha-card p-5">
              <SectionHeader
                icon={BarChart3}
                title="Activité utilisateur"
                description={`${data.overview.totalEvents} événements collectés sur ${data.activity.length} jours affichés.`}
              />
              <ActivityChart data={data.activity} />
            </div>

            <div className="matcha-card p-5">
              <SectionHeader
                icon={Route}
                title="Tests et abandons"
                description={`${data.overview.testsCompleted}/${data.overview.testsStarted} tests terminés, soit ${data.overview.completionRate}% de complétion.`}
              />
              <TestFunnel tests={data.tests} />
            </div>
          </section>

          <section className="grid items-start gap-4 xl:grid-cols-2">
            <JobsTable
              title="Top métiers likés"
              signal={
                data.jobs.liked[0]
                  ? `${data.jobs.liked[0].title} arrive en tête avec ${data.jobs.liked[0].count} likes.`
                  : "Aucun like métier sur la période."
              }
              jobs={data.jobs.liked}
              emptyLabel="Aucun métier liké."
            />
            <JobsTable
              title="Recommandés mais peu transformés"
              signal={
                data.jobs.recommendationInterestGap[0]
                  ? `${data.jobs.recommendationInterestGap[0].title} concentre l'écart le plus visible.`
                  : "Aucun écart recommandation/intérêt détecté."
              }
              jobs={data.jobs.recommendationInterestGap}
              emptyLabel="Aucun écart marqué sur la période."
            />
          </section>

          <section className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="matcha-card p-5">
              <SectionHeader
                icon={BriefcaseBusiness}
                title="Domaines métier"
                description={
                  data.jobs.domains.liked[0]
                    ? `${data.jobs.domains.liked[0].domain} est le domaine le plus liké (${data.jobs.domains.liked[0].count}).`
                    : "Aucun domaine liké sur la période."
                }
              />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
                <div>
                  <h3 className="mb-3 text-sm font-bold">Recommandés</h3>
                  <BarList
                    items={data.jobs.domains.matched}
                    labelKey="domain"
                    emptyLabel="Aucun domaine recommandé."
                  />
                </div>
                <div>
                  <h3 className="mb-3 text-sm font-bold">Likés</h3>
                  <BarList
                    items={data.jobs.domains.liked}
                    labelKey="domain"
                    emptyLabel="Aucun domaine liké."
                  />
                </div>
              </div>
            </div>

            <div className="matcha-card p-5">
              <SectionHeader
                icon={Sparkles}
                title="Insights orientation"
                description={
                  data.orientation.competenceStrengths[0]
                    ? `${labelFor(data.orientation.competenceStrengths[0].key)} est la compétence forte la plus fréquente (${data.orientation.competenceStrengths[0].count}).`
                    : "Aucun signal d'orientation agrégé sur la période."
                }
              />
              <div className="grid gap-4 lg:grid-cols-2">
                <OrientationList
                  title="Compétences fortes"
                  items={data.orientation.competenceStrengths}
                />
                <OrientationList
                  title="Axes à renforcer"
                  items={data.orientation.competenceToImprove}
                />
                <OrientationList
                  title="Valeurs fréquentes"
                  items={data.orientation.values}
                />
                <OrientationList
                  title="Soft skills fortes"
                  items={data.orientation.softSkillStrengths}
                />
                <OrientationList
                  title="Conditions recherchées"
                  items={data.orientation.workConditions}
                />
                <OrientationList
                  title="Axes Style professionnel"
                  items={data.orientation.workStyleAxes}
                />
                <WorkStyleProfiles items={data.orientation.workStyleProfiles} />
              </div>
            </div>
          </section>

        </>
      )}
    </main>
  )
}
