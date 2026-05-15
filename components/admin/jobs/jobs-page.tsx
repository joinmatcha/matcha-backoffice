"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { DownloadCloud, RefreshCw } from "lucide-react"
import { EmptyState } from "@/components/admin/empty-state"
import { ErrorMessage } from "@/components/admin/error-message"
import { PaginationControls } from "@/components/admin/pagination-controls"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import { adminApi } from "@/lib/api/admin"
import type {
  Pagination,
  RomeStatus,
  RomeSyncRunSummary,
  RomeSyncStatus,
  RomeSyncStep,
} from "@/types/admin"

const PAGE_SIZE = 10

const stepLabels: Record<RomeSyncStep, string> = {
  queued: "En attente",
  auth: "Authentification",
  list_appellations: "Liste des appellations",
  fetch_metiers: "Téléchargement des métiers",
  fetch_fiches: "Téléchargement des fiches",
  write_db: "Écriture base de données",
  deactivate_missing: "Désactivation des métiers absents",
  done: "Terminé",
}

const statusLabels: Record<RomeSyncStatus, string> = {
  queued: "En attente",
  running: "En cours",
  success: "Succès",
  partial_failure: "Succès partiel",
  failed: "Échec",
  cancelled: "Annulé",
}

function formatDate(value?: string) {
  if (!value) return "-"
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value))
}

function getProgressPercent(status?: RomeStatus) {
  const progress = status?.currentRun?.progress
  if (!progress?.uniqueMetiers) return status?.isRunning ? 3 : 0
  return Math.min(
    100,
    Math.round((progress.fetchedMetiers / progress.uniqueMetiers) * 100)
  )
}

export function JobsPage() {
  const [status, setStatus] = useState<RomeStatus | null>(null)
  const [runs, setRuns] = useState<RomeSyncRunSummary[]>([])
  const [pagination, setPagination] = useState<Pagination>()
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState("")

  const progressPercent = useMemo(() => getProgressPercent(status ?? undefined), [status])

  const loadRomeState = useCallback(async (targetPage: number, silent = false) => {
    if (!silent) setLoading(true)
    setError("")

    try {
      const [statusResponse, runsResponse] = await Promise.all([
        adminApi.getRomeStatus(),
        adminApi.listRomeSyncRuns({ page: targetPage, limit: PAGE_SIZE }),
      ])

      setStatus(statusResponse)
      setRuns(runsResponse.runs)
      setPagination({
        page: runsResponse.pagination.page,
        limit: runsResponse.pagination.limit,
        total: runsResponse.pagination.total,
        totalPages: runsResponse.pagination.pages,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chargement impossible")
      setStatus(null)
      setRuns([])
      setPagination(undefined)
    } finally {
      if (!silent) setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      loadRomeState(page)
    }, 0)

    return () => window.clearTimeout(timeout)
  }, [loadRomeState, page])

  useEffect(() => {
    if (!status?.isRunning) return

    const interval = window.setInterval(() => {
      loadRomeState(page, true)
    }, 2500)

    return () => window.clearInterval(interval)
  }, [loadRomeState, page, status?.isRunning])

  async function startSync() {
    setStarting(true)
    setError("")

    try {
      await adminApi.startRomeSync()
      await loadRomeState(1)
      setPage(1)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lancement impossible")
    } finally {
      setStarting(false)
    }
  }

  return (
    <main className="matcha-page">
      <ErrorMessage message={error} />

      <section className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <div className="matcha-card p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="font-semibold">Import ROME France Travail</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Synchronise le référentiel local des métiers et appellations.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => loadRomeState(page)}
                disabled={loading}
              >
                <RefreshCw />
                Actualiser
              </Button>
              <Button
                onClick={startSync}
                disabled={starting || status?.isRunning}
              >
                <DownloadCloud />
                {status?.isRunning ? "Import en cours" : "Lancer l'import"}
              </Button>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>
                {status?.currentRun
                  ? stepLabels[status.currentRun.currentStep]
                  : "Aucun import en cours"}
              </span>
              <span className="font-medium">{progressPercent}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            {status?.currentRun && (
              <p className="text-sm text-muted-foreground">
                {status.currentRun.progress.fetchedMetiers} /{" "}
                {status.currentRun.progress.uniqueMetiers || "?"} métiers ·{" "}
                {status.currentRun.progress.fetchedFiches} fiches · code courant{" "}
                {status.currentRun.currentCode || "-"}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <div className="matcha-card p-5">
            <p className="text-sm text-muted-foreground">Métiers actifs</p>
            <p className="mt-2 text-3xl font-semibold">
              {status?.totals.activeMetiers ?? "-"}
            </p>
          </div>
          <div className="matcha-card p-5">
            <p className="text-sm text-muted-foreground">Appellations actives</p>
            <p className="mt-2 text-3xl font-semibold">
              {status?.totals.activeAppellations ?? "-"}
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <div>
          <h2 className="text-sm font-semibold">Historique des imports</h2>
          {status?.lastSuccessfulRun && (
            <p className="mt-1 text-sm text-muted-foreground">
              Dernier succès le {formatDate(status.lastSuccessfulRun.finishedAt)}
            </p>
          )}
        </div>

        <div className="matcha-table">
          <table className="w-full text-sm">
            <thead className="bg-accent/60 text-left text-accent-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 font-medium">Étape</th>
                <th className="px-4 py-3 font-medium">Progression</th>
                <th className="px-4 py-3 font-medium">Écritures</th>
              </tr>
            </thead>
            <tbody>
              {runs.map((run) => (
                <tr key={run.id} className="border-t border-border/70">
                  <td className="px-4 py-3">{formatDate(run.createdAt)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      active={run.status === "success" || run.status === "running"}
                      label={statusLabels[run.status]}
                    />
                  </td>
                  <td className="px-4 py-3">
                    {run.currentStep ? stepLabels[run.currentStep] : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {run.fetchedMetiers ?? 0} / {run.uniqueMetiers ?? 0} métiers
                  </td>
                  <td className="px-4 py-3">
                    +{run.upsertedMetiers ?? 0} · ~{run.updatedMetiers ?? 0} · -
                    {run.deactivatedMetiers ?? 0}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!loading && runs.length === 0 && (
            <div className="p-4">
              <EmptyState label="Aucun import ROME trouvé." />
            </div>
          )}
          {loading && (
            <div className="p-4 text-sm text-muted-foreground">
              Chargement...
            </div>
          )}
        </div>

        <PaginationControls pagination={pagination} onPageChange={setPage} />
      </section>
    </main>
  )
}
