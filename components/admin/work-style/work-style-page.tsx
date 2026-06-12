"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { ErrorMessage } from "@/components/admin/error-message"
import { AdminTextarea, selectClassName } from "@/components/admin/form-controls"
import { PaginationControls } from "@/components/admin/pagination-controls"
import { StatusBadge } from "@/components/admin/status-badge"
import { Toolbar } from "@/components/admin/toolbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { adminApi } from "@/lib/api/admin"
import type {
  Pagination,
  VersionStatus,
  WorkStyleDimension,
  WorkStyleQuestion,
  WorkStyleVersion,
} from "@/types/admin"

const PAGE_SIZE = 20

const dimensionLabels: Record<WorkStyleDimension, string> = {
  autonomy: "Autonomie",
  collaboration: "Collaboration",
  pace: "Rythme",
  structure: "Structure",
  variety: "Variété",
  human_contact: "Contact humain",
  mobility: "Terrain",
  learning: "Apprentissage",
}

const emptyVersion = { version: "", title: "", summary: "" }
const emptyQuestion = {
  code: "",
  text: "",
  dimension: "autonomy" as WorkStyleDimension,
  polarity: "1",
  order: "",
  version: "",
  isActive: true,
}

export function WorkStylePage() {
  const [versions, setVersions] = useState<WorkStyleVersion[]>([])
  const [questions, setQuestions] = useState<WorkStyleQuestion[]>([])
  const [versionPagination, setVersionPagination] = useState<Pagination>()
  const [questionPagination, setQuestionPagination] = useState<Pagination>()
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<"" | VersionStatus>("")
  const [dimension, setDimension] = useState<"" | WorkStyleDimension>("")
  const [versionPage, setVersionPage] = useState(1)
  const [questionPage, setQuestionPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [mutating, setMutating] = useState("")
  const [versionForm, setVersionForm] = useState(emptyVersion)
  const [questionForm, setQuestionForm] = useState(emptyQuestion)
  const [editingVersion, setEditingVersion] = useState<WorkStyleVersion | null>(
    null
  )
  const [editingQuestion, setEditingQuestion] = useState<WorkStyleQuestion | null>(
    null
  )

  const versionQuery = useMemo(
    () => ({ page: versionPage, limit: PAGE_SIZE, q: search, status }),
    [search, status, versionPage]
  )
  const questionQuery = useMemo(
    () => ({
      page: questionPage,
      limit: PAGE_SIZE,
      q: search,
      dimension,
    }),
    [dimension, questionPage, search]
  )

  async function loadData() {
    setLoading(true)
    setError("")
    try {
      const [versionResponse, questionResponse] = await Promise.all([
        adminApi.listWorkStyleVersions(versionQuery),
        adminApi.listWorkStyleQuestions(questionQuery),
      ])
      setVersions(versionResponse.items)
      setVersionPagination(versionResponse.pagination)
      setQuestions(questionResponse.items)
      setQuestionPagination(questionResponse.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Chargement impossible")
      setVersions([])
      setQuestions([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [versionQuery, questionQuery])

  async function saveVersion() {
    setMutating("version")
    setError("")
    try {
      if (editingVersion) {
        await adminApi.updateWorkStyleVersion(editingVersion.version, {
          title: versionForm.title,
          summary: versionForm.summary || undefined,
        })
        toast.success("Version mise à jour")
      } else {
        await adminApi.createWorkStyleVersion({
          version: Number(versionForm.version),
          title: versionForm.title,
          summary: versionForm.summary || undefined,
        })
        toast.success("Version créée")
      }
      setEditingVersion(null)
      setVersionForm(emptyVersion)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action impossible")
      toast.error("Action impossible")
    } finally {
      setMutating("")
    }
  }

  async function saveQuestion() {
    setMutating("question")
    setError("")
    try {
      const payload = {
        code: questionForm.code,
        text: questionForm.text,
        dimension: questionForm.dimension,
        polarity: Number(questionForm.polarity) as 1 | -1,
        order: Number(questionForm.order || 0),
        version: Number(questionForm.version),
        isActive: questionForm.isActive,
      }
      if (editingQuestion) {
        await adminApi.updateWorkStyleQuestion(editingQuestion._id, payload)
        toast.success("Question mise à jour")
      } else {
        await adminApi.createWorkStyleQuestion(payload)
        toast.success("Question créée")
      }
      setEditingQuestion(null)
      setQuestionForm(emptyQuestion)
      await loadData()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action impossible")
      toast.error("Action impossible")
    } finally {
      setMutating("")
    }
  }

  async function toggleVersion(version: WorkStyleVersion) {
    setMutating(`version-${version.version}`)
    try {
      const updated = version.isActive
        ? await adminApi.deactivateWorkStyleVersion(version.version)
        : await adminApi.activateWorkStyleVersion(version.version)
      setVersions((current) =>
        current.map((item) =>
          item.version === updated.version
            ? updated
            : updated.isActive
              ? { ...item, isActive: false, status: "archived" }
              : item
        )
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action impossible")
      toast.error("Action impossible")
    } finally {
      setMutating("")
    }
  }

  return (
    <main className="matcha-page">
      <Toolbar
        search={search}
        placeholder="Rechercher version ou question..."
        onSearchChange={(value) => {
          setSearch(value)
          setVersionPage(1)
          setQuestionPage(1)
        }}
      >
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value as "" | VersionStatus)}
          className={selectClassName}
        >
          <option value="">Tous les statuts</option>
          <option value="draft">Brouillon</option>
          <option value="active">Actif</option>
          <option value="archived">Archivé</option>
        </select>
        <select
          value={dimension}
          onChange={(event) =>
            setDimension(event.target.value as "" | WorkStyleDimension)
          }
          className={selectClassName}
        >
          <option value="">Tous les axes</option>
          {Object.entries(dimensionLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Toolbar>

      <ErrorMessage message={error} />

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="matcha-card space-y-3 p-5">
          <h2 className="text-sm font-semibold">
            {editingVersion ? "Modifier la version" : "Créer une version"}
          </h2>
          <Input
            value={versionForm.version}
            disabled={!!editingVersion}
            type="number"
            onChange={(event) =>
              setVersionForm({ ...versionForm, version: event.target.value })
            }
            placeholder="Version"
          />
          <Input
            value={versionForm.title}
            onChange={(event) =>
              setVersionForm({ ...versionForm, title: event.target.value })
            }
            placeholder="Titre"
          />
          <AdminTextarea
            value={versionForm.summary}
            onChange={(event) =>
              setVersionForm({ ...versionForm, summary: event.target.value })
            }
            placeholder="Résumé"
          />
          <div className="flex justify-end gap-2">
            {editingVersion && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingVersion(null)
                  setVersionForm(emptyVersion)
                }}
              >
                Annuler
              </Button>
            )}
            <Button disabled={mutating === "version"} onClick={saveVersion}>
              Enregistrer
            </Button>
          </div>
        </div>

        <div className="matcha-card space-y-3 p-5">
          <h2 className="text-sm font-semibold">
            {editingQuestion ? "Modifier la question" : "Créer une question"}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              value={questionForm.code}
              onChange={(event) =>
                setQuestionForm({ ...questionForm, code: event.target.value })
              }
              placeholder="Code"
            />
            <Input
              value={questionForm.version}
              type="number"
              onChange={(event) =>
                setQuestionForm({ ...questionForm, version: event.target.value })
              }
              placeholder="Version"
            />
          </div>
          <AdminTextarea
            value={questionForm.text}
            onChange={(event) =>
              setQuestionForm({ ...questionForm, text: event.target.value })
            }
            placeholder="Question"
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <select
              value={questionForm.dimension}
              onChange={(event) =>
                setQuestionForm({
                  ...questionForm,
                  dimension: event.target.value as WorkStyleDimension,
                })
              }
              className={selectClassName}
            >
              {Object.entries(dimensionLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={questionForm.polarity}
              onChange={(event) =>
                setQuestionForm({ ...questionForm, polarity: event.target.value })
              }
              className={selectClassName}
            >
              <option value="1">Polarité +</option>
              <option value="-1">Polarité -</option>
            </select>
            <Input
              value={questionForm.order}
              type="number"
              onChange={(event) =>
                setQuestionForm({ ...questionForm, order: event.target.value })
              }
              placeholder="Ordre"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={questionForm.isActive}
              onChange={(event) =>
                setQuestionForm({
                  ...questionForm,
                  isActive: event.target.checked,
                })
              }
            />
            Question active
          </label>
          <div className="flex justify-end gap-2">
            {editingQuestion && (
              <Button
                variant="outline"
                onClick={() => {
                  setEditingQuestion(null)
                  setQuestionForm(emptyQuestion)
                }}
              >
                Annuler
              </Button>
            )}
            <Button disabled={mutating === "question"} onClick={saveQuestion}>
              Enregistrer
            </Button>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Versions</h2>
        {versions.map((version) => (
          <div key={version._id} className="matcha-card p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">
                    Version {version.version} · {version.title}
                  </h3>
                  <StatusBadge active={version.isActive} label={version.status} />
                </div>
                {version.summary && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {version.summary}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingVersion(version)
                    setVersionForm({
                      version: String(version.version),
                      title: version.title,
                      summary: version.summary ?? "",
                    })
                  }}
                >
                  Modifier
                </Button>
                <Button
                  size="sm"
                  disabled={mutating === `version-${version.version}`}
                  variant={version.isActive ? "secondary" : "default"}
                  onClick={() => toggleVersion(version)}
                >
                  {version.isActive ? "Désactiver" : "Activer"}
                </Button>
              </div>
            </div>
          </div>
        ))}
        {!loading && versions.length === 0 && (
          <div className="matcha-card p-4 text-sm text-muted-foreground">
            Aucune version trouvée.
          </div>
        )}
        <PaginationControls
          pagination={versionPagination}
          onPageChange={setVersionPage}
        />
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold">Questions</h2>
        <div className="matcha-table">
          <table className="w-full text-sm">
            <thead className="bg-accent/60 text-left text-accent-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Code</th>
                <th className="px-4 py-3 font-medium">Question</th>
                <th className="px-4 py-3 font-medium">Axe</th>
                <th className="px-4 py-3 font-medium">Version</th>
                <th className="px-4 py-3 font-medium">Statut</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((question) => (
                <tr key={question._id} className="border-t border-border/70">
                  <td className="px-4 py-3 font-medium">{question.code}</td>
                  <td className="px-4 py-3">{question.text}</td>
                  <td className="px-4 py-3">
                    {dimensionLabels[question.dimension]}
                  </td>
                  <td className="px-4 py-3">{question.version}</td>
                  <td className="px-4 py-3">
                    <StatusBadge active={question.isActive} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setEditingQuestion(question)
                        setQuestionForm({
                          code: question.code,
                          text: question.text,
                          dimension: question.dimension,
                          polarity: String(question.polarity),
                          order: String(question.order),
                          version: String(question.version),
                          isActive: question.isActive,
                        })
                      }}
                    >
                      Modifier
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {loading && (
            <div className="p-4 text-sm text-muted-foreground">Chargement...</div>
          )}
          {!loading && questions.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground">
              Aucune question trouvée.
            </div>
          )}
        </div>
        <PaginationControls
          pagination={questionPagination}
          onPageChange={setQuestionPage}
        />
      </section>
    </main>
  )
}
