"use client"

import { useEffect, useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { EmptyState } from "@/components/admin/empty-state"
import { ErrorMessage } from "@/components/admin/error-message"
import { selectClassName } from "@/components/admin/form-controls"
import { PaginationControls } from "@/components/admin/pagination-controls"
import {
  emptyPersonalityQuestion,
  emptyPersonalityVersion,
  type PersonalityQuestionForm,
  type PersonalityVersionForm,
} from "@/components/admin/personality/personality-forms"
import { PersonalityDialogs } from "@/components/admin/personality/personality-dialogs"
import { toPersonalityQuestionPayload } from "@/components/admin/personality/personality-mappers"
import { PersonalityVersionCard } from "@/components/admin/personality/personality-version-card"
import { Toolbar } from "@/components/admin/toolbar"
import { Button } from "@/components/ui/button"
import { adminApi } from "@/lib/api/admin"
import type {
  Pagination,
  PersonalityVersion,
} from "@/types/admin"

const PAGE_SIZE = 20

export function PersonalityPage() {
  const [versions, setVersions] = useState<PersonalityVersion[]>([])
  const [pagination, setPagination] = useState<Pagination>()
  const [search, setSearch] = useState("")
  const [active, setActive] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [mutatingId, setMutatingId] = useState("")
  const [error, setError] = useState("")
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<PersonalityVersion | null>(null)
  const [duplicating, setDuplicating] = useState<PersonalityVersion | null>(null)
  const [questionTarget, setQuestionTarget] = useState<PersonalityVersion | null>(null)
  const [versionForm, setVersionForm] =
    useState<PersonalityVersionForm>(emptyPersonalityVersion)
  const [questionForm, setQuestionForm] =
    useState<PersonalityQuestionForm>(emptyPersonalityQuestion)

  const query = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      q: search,
      isActive: active,
    }),
    [active, page, search]
  )

  useEffect(() => {
    let ignore = false

    async function loadVersions() {
      setLoading(true)
      setError("")

      try {
        const response = await adminApi.listPersonalityVersions(query)
        if (ignore) return
        setVersions(response.items)
        setPagination(response.pagination)
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Chargement impossible")
          setVersions([])
          setPagination(undefined)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadVersions()

    return () => {
      ignore = true
    }
  }, [query])

  async function toggleVersion(version: PersonalityVersion) {
    setMutatingId(version._id)
    setError("")

    try {
      const updatedVersion = version.isActive
        ? await adminApi.deactivatePersonalityVersion(version._id)
        : await adminApi.activatePersonalityVersion(version._id)

      setVersions((current) =>
        current.map((item) =>
          item._id === updatedVersion._id ? updatedVersion : item
        )
      )

      if (!version.isActive) {
        setVersions((current) =>
          current.map((item) =>
            item._id === updatedVersion._id
              ? updatedVersion
              : { ...item, isActive: false, status: "archived" }
          )
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action impossible")
      toast.error("Action impossible")
    } finally {
      setMutatingId("")
    }
  }

  async function refreshVersions() {
    const response = await adminApi.listPersonalityVersions(query)
    setVersions(response.items)
    setPagination(response.pagination)
  }

  function openCreateDialog() {
    setCreating(true)
    setVersionForm(emptyPersonalityVersion)
    setQuestionForm(emptyPersonalityQuestion)
  }

  function openEditDialog(version: PersonalityVersion) {
    setEditing(version)
    setVersionForm({
      version: version.version,
      title: version.title,
      summary: version.summary ?? "",
    })
  }

  function openDuplicateDialog(version: PersonalityVersion) {
    setDuplicating(version)
    setVersionForm({
      version: `${version.version}-copy`,
      title: `${version.title} copie`,
      summary: version.summary ?? "",
    })
  }

  async function createVersion() {
    setMutatingId("create")
    setError("")

    try {
      await adminApi.createPersonalityVersion({
        version: versionForm.version,
        title: versionForm.title,
        summary: versionForm.summary || undefined,
        questions: [toPersonalityQuestionPayload(questionForm)],
        profiles: [],
      })
      toast.success("Version créée")
      setCreating(false)
      await refreshVersions()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Création impossible")
      toast.error("Création impossible")
    } finally {
      setMutatingId("")
    }
  }

  async function updateVersion() {
    if (!editing) return
    setMutatingId(editing._id)
    setError("")

    try {
      const updated = await adminApi.updatePersonalityVersion(editing._id, {
        title: versionForm.title,
        summary: versionForm.summary || undefined,
      })
      setVersions((current) =>
        current.map((item) => (item._id === updated._id ? updated : item))
      )
      toast.success("Version mise à jour")
      setEditing(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mise à jour impossible")
      toast.error("Mise à jour impossible")
    } finally {
      setMutatingId("")
    }
  }

  async function duplicateVersion() {
    if (!duplicating) return
    setMutatingId(duplicating._id)
    setError("")

    try {
      await adminApi.duplicatePersonalityVersion(duplicating._id, {
        version: versionForm.version,
        title: versionForm.title,
        summary: versionForm.summary || undefined,
      })
      toast.success("Version dupliquée")
      setDuplicating(null)
      await refreshVersions()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Duplication impossible")
      toast.error("Duplication impossible")
    } finally {
      setMutatingId("")
    }
  }

  async function addQuestion() {
    if (!questionTarget) return
    setMutatingId(questionTarget._id)
    setError("")

    try {
      const updated = await adminApi.addPersonalityQuestion(
        questionTarget._id,
        toPersonalityQuestionPayload(questionForm)
      )
      setVersions((current) =>
        current.map((item) => (item._id === updated._id ? updated : item))
      )
      toast.success("Question ajoutée")
      setQuestionTarget(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ajout impossible")
      toast.error("Ajout impossible")
    } finally {
      setMutatingId("")
    }
  }

  async function deleteQuestion(version: PersonalityVersion, questionId: string) {
    if (!confirm(`Supprimer la question ${questionId} ?`)) return
    setMutatingId(version._id)
    setError("")

    try {
      const updated = await adminApi.deletePersonalityQuestion(
        version._id,
        questionId
      )
      setVersions((current) =>
        current.map((item) => (item._id === updated._id ? updated : item))
      )
      toast.success("Question supprimée")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible")
      toast.error("Suppression impossible")
    } finally {
      setMutatingId("")
    }
  }

  function resetPage() {
    setPage(1)
  }

  return (
    <main className="matcha-page">
      <Toolbar
        search={search}
        placeholder="Rechercher une version..."
        onSearchChange={(value) => {
          setSearch(value)
          resetPage()
        }}
      >
        <Button onClick={openCreateDialog}>
          <Plus />
          Nouvelle version
        </Button>
        <select
          value={active}
          onChange={(event) => {
            setActive(event.target.value)
            resetPage()
          }}
          className={selectClassName}
        >
          <option value="">Tous les statuts</option>
          <option value="true">Actives</option>
          <option value="false">Inactives</option>
        </select>
      </Toolbar>

      <ErrorMessage message={error} />

      <div className="grid gap-3">
        {versions.map((version) => (
          <PersonalityVersionCard
            key={version._id}
            version={version}
            mutatingId={mutatingId}
            onEdit={openEditDialog}
            onDuplicate={openDuplicateDialog}
            onAddQuestion={(target) => {
              setQuestionTarget(target)
              setQuestionForm(emptyPersonalityQuestion)
            }}
            onToggle={toggleVersion}
            onDeleteQuestion={deleteQuestion}
          />
        ))}
      </div>

      {!loading && versions.length === 0 && (
        <EmptyState label="Aucune version de test de personnalité trouvée." />
      )}
      {loading && (
        <div className="text-sm text-muted-foreground">Chargement...</div>
      )}

      <PaginationControls pagination={pagination} onPageChange={setPage} />

      <PersonalityDialogs
        creating={creating}
        editing={editing}
        duplicating={duplicating}
        questionTarget={questionTarget}
        mutatingId={mutatingId}
        versionForm={versionForm}
        questionForm={questionForm}
        setCreating={setCreating}
        setEditing={setEditing}
        setDuplicating={setDuplicating}
        setQuestionTarget={setQuestionTarget}
        setVersionForm={setVersionForm}
        setQuestionForm={setQuestionForm}
        onCreateVersion={createVersion}
        onUpdateVersion={updateVersion}
        onDuplicateVersion={duplicateVersion}
        onAddQuestion={addQuestion}
      />
    </main>
  )
}
