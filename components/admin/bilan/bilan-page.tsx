"use client"

import { useEffect, useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"
import { bilanDomainLabels } from "@/components/admin/bilan/bilan-constants"
import { BilanDialogs } from "@/components/admin/bilan/bilan-dialogs"
import {
  emptyBilanQuestionForm,
  emptyBilanVersionForm,
  type BilanQuestionForm,
  type BilanVersionForm,
} from "@/components/admin/bilan/bilan-forms"
import {
  BilanQuestionsSection,
  BilanVersionsSection,
} from "@/components/admin/bilan/bilan-sections"
import { ErrorMessage } from "@/components/admin/error-message"
import { selectClassName } from "@/components/admin/form-controls"
import { Toolbar } from "@/components/admin/toolbar"
import { Button } from "@/components/ui/button"
import { adminApi } from "@/lib/api/admin"
import type {
  BilanQuestion,
  BilanQuestionDomain,
  BilanVersion,
  Pagination,
  VersionStatus,
} from "@/types/admin"

const PAGE_SIZE = 20

export function BilanPage() {
  const [versions, setVersions] = useState<BilanVersion[]>([])
  const [questions, setQuestions] = useState<BilanQuestion[]>([])
  const [versionPagination, setVersionPagination] = useState<Pagination>()
  const [questionPagination, setQuestionPagination] = useState<Pagination>()
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<"" | VersionStatus>("")
  const [domain, setDomain] = useState<"" | BilanQuestionDomain>("")
  const [page, setPage] = useState(1)
  const [questionPage, setQuestionPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [mutatingVersion, setMutatingVersion] = useState<number | null>(null)
  const [error, setError] = useState("")
  const [versionDialog, setVersionDialog] = useState<
    "create" | "edit" | "duplicate" | null
  >(null)
  const [selectedVersion, setSelectedVersion] = useState<BilanVersion | null>(null)
  const [questionDialog, setQuestionDialog] = useState<"create" | "edit" | null>(
    null
  )
  const [selectedQuestion, setSelectedQuestion] = useState<BilanQuestion | null>(
    null
  )
  const [versionForm, setVersionForm] =
    useState<BilanVersionForm>(emptyBilanVersionForm)
  const [questionForm, setQuestionForm] =
    useState<BilanQuestionForm>(emptyBilanQuestionForm)

  const versionQuery = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      q: search,
      status,
    }),
    [page, search, status]
  )

  const questionQuery = useMemo(
    () => ({
      page: questionPage,
      limit: PAGE_SIZE,
      q: search,
      domain,
    }),
    [domain, questionPage, search]
  )

  useEffect(() => {
    let ignore = false

    async function loadBilan() {
      setLoading(true)
      setError("")

      try {
        const [versionsResponse, questionsResponse] = await Promise.all([
          adminApi.listBilanVersions(versionQuery),
          adminApi.listBilanQuestions(questionQuery),
        ])

        if (ignore) return
        setVersions(versionsResponse.items)
        setVersionPagination(versionsResponse.pagination)
        setQuestions(questionsResponse.items)
        setQuestionPagination(questionsResponse.pagination)
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Chargement impossible")
          setVersions([])
          setQuestions([])
          setVersionPagination(undefined)
          setQuestionPagination(undefined)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadBilan()

    return () => {
      ignore = true
    }
  }, [questionQuery, versionQuery])

  async function toggleVersion(version: BilanVersion) {
    setMutatingVersion(version.version)
    setError("")

    try {
      const updatedVersion = version.isActive
        ? await adminApi.deactivateBilanVersion(version.version)
        : await adminApi.activateBilanVersion(version.version)

      setVersions((current) =>
        current.map((item) =>
          item.version === updatedVersion.version ? updatedVersion : item
        )
      )

      if (!version.isActive) {
        setVersions((current) =>
          current.map((item) =>
            item.version === updatedVersion.version
              ? updatedVersion
              : { ...item, isActive: false, status: "archived" }
          )
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action impossible")
      toast.error("Action impossible")
    } finally {
      setMutatingVersion(null)
    }
  }

  async function refreshBilan() {
    const [versionsResponse, questionsResponse] = await Promise.all([
      adminApi.listBilanVersions(versionQuery),
      adminApi.listBilanQuestions(questionQuery),
    ])
    setVersions(versionsResponse.items)
    setVersionPagination(versionsResponse.pagination)
    setQuestions(questionsResponse.items)
    setQuestionPagination(questionsResponse.pagination)
  }

  function openCreateVersion() {
    setSelectedVersion(null)
    setVersionForm(emptyBilanVersionForm)
    setVersionDialog("create")
  }

  function openEditVersion(version: BilanVersion) {
    setSelectedVersion(version)
    setVersionForm({
      version: String(version.version),
      title: version.title,
      description: version.description ?? "",
    })
    setVersionDialog("edit")
  }

  function openDuplicateVersion(version: BilanVersion) {
    setSelectedVersion(version)
    setVersionForm({
      version: String(version.version + 1),
      title: `${version.title} copie`,
      description: version.description ?? "",
    })
    setVersionDialog("duplicate")
  }

  function openCreateQuestion() {
    setSelectedQuestion(null)
    setQuestionForm({
      ...emptyBilanQuestionForm,
      version: versions[0]?.version ? String(versions[0].version) : "",
    })
    setQuestionDialog("create")
  }

  function openEditQuestion(question: BilanQuestion) {
    setSelectedQuestion(question)
    setQuestionForm({
      code: question.code,
      domain: question.domain,
      subdomain: question.subdomain ?? "",
      question: question.question,
      type: question.type,
      version: String(question.version),
      isActive: question.isActive,
    })
    setQuestionDialog("edit")
  }

  async function saveVersion() {
    const payload = {
      version: Number(versionForm.version),
      title: versionForm.title,
      description: versionForm.description || undefined,
    }
    setError("")

    try {
      if (versionDialog === "create") {
        await adminApi.createBilanVersion(payload)
        toast.success("Version créée")
      } else if (versionDialog === "duplicate" && selectedVersion) {
        await adminApi.duplicateBilanVersion(selectedVersion.version, payload)
        toast.success("Version dupliquée")
      } else if (versionDialog === "edit" && selectedVersion) {
        await adminApi.updateBilanVersion(selectedVersion.version, {
          title: payload.title,
          description: payload.description,
        })
        toast.success("Version mise à jour")
      }

      setVersionDialog(null)
      await refreshBilan()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action impossible")
      toast.error("Action impossible")
    }
  }

  async function saveQuestion() {
    const payload = {
      code: questionForm.code,
      domain: questionForm.domain,
      subdomain: questionForm.subdomain || null,
      question: questionForm.question,
      type: questionForm.type,
      version: Number(questionForm.version),
      isActive: questionForm.isActive,
    }
    setError("")

    try {
      if (questionDialog === "create") {
        await adminApi.createBilanQuestion(payload)
        toast.success("Question créée")
      } else if (questionDialog === "edit" && selectedQuestion) {
        await adminApi.updateBilanQuestion(selectedQuestion._id, payload)
        toast.success("Question mise à jour")
      }

      setQuestionDialog(null)
      await refreshBilan()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action impossible")
      toast.error("Action impossible")
    }
  }

  function updateSearch(value: string) {
    setSearch(value)
    setPage(1)
    setQuestionPage(1)
  }

  return (
    <main className="matcha-page">
      <Toolbar
        search={search}
        placeholder="Rechercher dans le bilan..."
        onSearchChange={updateSearch}
      >
        <Button onClick={openCreateVersion}>
          <Plus />
          Version
        </Button>
        <Button variant="outline" onClick={openCreateQuestion}>
          <Plus />
          Question
        </Button>
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value as "" | VersionStatus)
            setPage(1)
          }}
          className={selectClassName}
        >
          <option value="">Tous les statuts</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
        <select
          value={domain}
          onChange={(event) => {
            setDomain(event.target.value as "" | BilanQuestionDomain)
            setQuestionPage(1)
          }}
          className={selectClassName}
        >
          <option value="">Tous les domaines</option>
          {Object.entries(bilanDomainLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Toolbar>

      <ErrorMessage message={error} />

      <BilanVersionsSection
        versions={versions}
        loading={loading}
        pagination={versionPagination}
        mutatingVersion={mutatingVersion}
        onPageChange={setPage}
        onEdit={openEditVersion}
        onDuplicate={openDuplicateVersion}
        onToggle={toggleVersion}
      />

      <BilanQuestionsSection
        questions={questions}
        loading={loading}
        pagination={questionPagination}
        onPageChange={setQuestionPage}
        onEdit={openEditQuestion}
      />

      <BilanDialogs
        versionDialog={versionDialog}
        questionDialog={questionDialog}
        versionForm={versionForm}
        questionForm={questionForm}
        setVersionDialog={setVersionDialog}
        setQuestionDialog={setQuestionDialog}
        setVersionForm={setVersionForm}
        setQuestionForm={setQuestionForm}
        onSaveVersion={saveVersion}
        onSaveQuestion={saveQuestion}
      />
    </main>
  )
}
