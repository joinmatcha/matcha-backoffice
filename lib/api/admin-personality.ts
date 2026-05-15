import { request, type QueryValue } from "@/lib/api/client"
import type {
  PaginatedResponse,
  PersonalityQuestion,
  PersonalityVersion,
  PersonalityVersionDuplicate,
  PersonalityVersionPayload,
  PersonalityVersionUpdate,
} from "@/types/admin"

export const adminPersonalityApi = {
  listPersonalityVersions(query?: Record<string, QueryValue>) {
    return request<PaginatedResponse<PersonalityVersion>>(
      "/api/admin/personality-versions",
      { query }
    )
  },

  createPersonalityVersion(body: PersonalityVersionPayload) {
    return request<PersonalityVersion>("/api/admin/personality-versions", {
      method: "POST",
      body,
    })
  },

  updatePersonalityVersion(id: string, body: PersonalityVersionUpdate) {
    return request<PersonalityVersion>(`/api/admin/personality-versions/${id}`, {
      method: "PATCH",
      body,
    })
  },

  duplicatePersonalityVersion(id: string, body: PersonalityVersionDuplicate) {
    return request<PersonalityVersion>(
      `/api/admin/personality-versions/${id}/duplicate`,
      { method: "POST", body }
    )
  },

  activatePersonalityVersion(id: string) {
    return request<PersonalityVersion>(
      `/api/admin/personality-versions/${id}/activate`,
      { method: "POST" }
    )
  },

  deactivatePersonalityVersion(id: string) {
    return request<PersonalityVersion>(
      `/api/admin/personality-versions/${id}/deactivate`,
      { method: "POST" }
    )
  },

  addPersonalityQuestion(id: string, body: PersonalityQuestion) {
    return request<PersonalityVersion>(
      `/api/admin/personality-versions/${id}/questions`,
      { method: "POST", body }
    )
  },

  updatePersonalityQuestion(
    id: string,
    questionId: string,
    body: Partial<PersonalityQuestion>
  ) {
    return request<PersonalityVersion>(
      `/api/admin/personality-versions/${id}/questions/${questionId}`,
      { method: "PATCH", body }
    )
  },

  deletePersonalityQuestion(id: string, questionId: string) {
    return request<PersonalityVersion>(
      `/api/admin/personality-versions/${id}/questions/${questionId}`,
      { method: "DELETE" }
    )
  },
}
