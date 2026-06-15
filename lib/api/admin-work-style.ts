import { request, type QueryValue } from "@/lib/api/client"
import type {
  PaginatedResponse,
  WorkStyleQuestion,
  WorkStyleQuestionPayload,
  WorkStyleVersion,
  WorkStyleVersionDuplicate,
  WorkStyleVersionPayload,
} from "@/types/admin"

export const adminWorkStyleApi = {
  listWorkStyleVersions(query?: Record<string, QueryValue>) {
    return request<PaginatedResponse<WorkStyleVersion>>(
      "/api/admin/work-style-versions",
      { query }
    )
  },

  createWorkStyleVersion(body: WorkStyleVersionPayload) {
    return request<WorkStyleVersion>("/api/admin/work-style-versions", {
      method: "POST",
      body,
    })
  },

  updateWorkStyleVersion(
    version: number,
    body: Partial<WorkStyleVersionPayload>
  ) {
    return request<WorkStyleVersion>(
      `/api/admin/work-style-versions/${version}`,
      { method: "PATCH", body }
    )
  },

  duplicateWorkStyleVersion(
    version: number,
    body: WorkStyleVersionDuplicate
  ) {
    return request<WorkStyleVersion>(
      `/api/admin/work-style-versions/${version}/duplicate`,
      { method: "POST", body }
    )
  },

  activateWorkStyleVersion(version: number) {
    return request<WorkStyleVersion>(
      `/api/admin/work-style-versions/${version}/activate`,
      { method: "POST" }
    )
  },

  deactivateWorkStyleVersion(version: number) {
    return request<WorkStyleVersion>(
      `/api/admin/work-style-versions/${version}/deactivate`,
      { method: "POST" }
    )
  },

  listWorkStyleQuestions(query?: Record<string, QueryValue>) {
    return request<PaginatedResponse<WorkStyleQuestion>>(
      "/api/admin/work-style-questions",
      { query }
    )
  },

  createWorkStyleQuestion(body: WorkStyleQuestionPayload) {
    return request<WorkStyleQuestion>("/api/admin/work-style-questions", {
      method: "POST",
      body,
    })
  },

  updateWorkStyleQuestion(
    id: string,
    body: Partial<WorkStyleQuestionPayload>
  ) {
    return request<WorkStyleQuestion>(`/api/admin/work-style-questions/${id}`, {
      method: "PATCH",
      body,
    })
  },
}
