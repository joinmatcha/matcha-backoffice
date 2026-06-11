"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { ErrorMessage } from "@/components/admin/error-message"
import {
  AdminTextarea,
  selectClassName,
} from "@/components/admin/form-controls"
import { PaginationControls } from "@/components/admin/pagination-controls"
import { Toolbar } from "@/components/admin/toolbar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { adminApi } from "@/lib/api/admin"
import type {
  Pagination,
  SupportRequest,
  SupportRequestCategory,
  SupportRequestStatus,
} from "@/types/admin"

const PAGE_SIZE = 20

const statusLabels: Record<SupportRequestStatus, string> = {
  open: "Ouverte",
  in_progress: "En cours",
  resolved: "Résolue",
  closed: "Fermée",
}

const categoryLabels: Record<SupportRequestCategory, string> = {
  account: "Compte",
  privacy: "Données personnelles",
  billing: "Facturation",
  bug: "Bug",
  other: "Autre",
}

const statusBadgeVariant: Record<
  SupportRequestStatus,
  React.ComponentProps<typeof Badge>["variant"]
> = {
  open: "destructive",
  in_progress: "default",
  resolved: "secondary",
  closed: "outline",
}

export function SupportPage() {
  const [requests, setRequests] = useState<SupportRequest[]>([])
  const [pagination, setPagination] = useState<Pagination>()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<"" | SupportRequestStatus>("")
  const [category, setCategory] = useState<"" | SupportRequestCategory>("")
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  const query = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      q: search,
      status,
      category,
    }),
    [category, page, search, status]
  )

  useEffect(() => {
    let ignore = false

    async function loadRequests() {
      setLoading(true)
      setError("")

      try {
        const response = await adminApi.listSupportRequests(query)
        if (ignore) return
        setRequests(response.items)
        setPagination(response.pagination)
        setDrafts((current) => {
          const next = { ...current }
          response.items.forEach((request) => {
            next[request._id] = next[request._id] ?? request.adminNotes ?? ""
          })
          return next
        })
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Chargement impossible")
          setRequests([])
          setPagination(undefined)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadRequests()

    return () => {
      ignore = true
    }
  }, [query])

  function updateSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  async function updateRequest(
    request: SupportRequest,
    payload: Partial<Pick<SupportRequest, "status" | "adminNotes">>
  ) {
    setSavingId(request._id)
    setError("")

    try {
      const updated = await adminApi.updateSupportRequest(request._id, payload)
      setRequests((current) =>
        current.map((item) => (item._id === updated._id ? updated : item))
      )
      setDrafts((current) => ({
        ...current,
        [updated._id]: updated.adminNotes ?? "",
      }))
      toast.success("Demande support mise à jour")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mise à jour impossible")
      toast.error("Mise à jour impossible")
    } finally {
      setSavingId(null)
    }
  }

  return (
    <main className="matcha-page">
      <Toolbar
        search={search}
        placeholder="Rechercher par nom, email, sujet..."
        onSearchChange={updateSearch}
      >
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as "" | SupportRequestStatus)
            setPage(1)
          }}
          className={selectClassName}
        >
          <option value="">Tous les statuts</option>
          {Object.entries(statusLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={category}
          onChange={(event) => {
            setCategory(event.target.value as "" | SupportRequestCategory)
            setPage(1)
          }}
          className={selectClassName}
        >
          <option value="">Toutes les catégories</option>
          {Object.entries(categoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Toolbar>

      <ErrorMessage message={error} />

      <div className="space-y-3">
        {requests.map((request) => (
          <article key={request._id} className="matcha-card space-y-4 p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant={statusBadgeVariant[request.status]}>
                    {statusLabels[request.status]}
                  </Badge>
                  <Badge variant="outline">{categoryLabels[request.category]}</Badge>
                </div>
                <h2 className="text-lg font-semibold text-foreground">
                  {request.subject}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {request.name} · {request.email} ·{" "}
                  {formatDate(request.createdAt)}
                </p>
              </div>
              <select
                value={request.status}
                disabled={savingId === request._id}
                onChange={(event) =>
                  updateRequest(request, {
                    status: event.target.value as SupportRequestStatus,
                  })
                }
                className={selectClassName}
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <p className="whitespace-pre-wrap rounded-xl bg-accent/35 p-4 text-sm leading-6 text-foreground">
              {request.message}
            </p>

            <div className="space-y-2">
              <label
                htmlFor={`notes-${request._id}`}
                className="text-sm font-medium"
              >
                Note interne
              </label>
              <AdminTextarea
                id={`notes-${request._id}`}
                value={drafts[request._id] ?? ""}
                onChange={(event) =>
                  setDrafts((current) => ({
                    ...current,
                    [request._id]: event.target.value,
                  }))
                }
                placeholder="Ajoute une note de suivi pour l’équipe..."
              />
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={savingId === request._id}
                  onClick={() =>
                    updateRequest(request, {
                      adminNotes: drafts[request._id] ?? "",
                    })
                  }
                >
                  Enregistrer la note
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!loading && requests.length === 0 && (
        <div className="matcha-card p-4 text-sm text-muted-foreground">
          Aucune demande support trouvée.
        </div>
      )}
      {loading && (
        <div className="matcha-card p-4 text-sm text-muted-foreground">
          Chargement...
        </div>
      )}

      <PaginationControls pagination={pagination} onPageChange={setPage} />
    </main>
  )
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value))
}
