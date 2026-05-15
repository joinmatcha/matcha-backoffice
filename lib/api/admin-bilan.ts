import { request, type QueryValue } from "@/lib/api/client"
import type {
  BilanQuestion,
  BilanQuestionPayload,
  BilanVersion,
  BilanVersionDuplicate,
  BilanVersionPayload,
  PaginatedResponse,
} from "@/types/admin"

export const adminBilanApi = {
  listBilanVersions(query?: Record<string, QueryValue>) {
    return request<PaginatedResponse<BilanVersion>>(
      "/api/admin/bilan-versions",
      { query }
    )
  },

  createBilanVersion(body: BilanVersionPayload) {
    return request<BilanVersion>("/api/admin/bilan-versions", {
      method: "POST",
      body,
    })
  },

  updateBilanVersion(version: number, body: Partial<BilanVersionPayload>) {
    return request<BilanVersion>(`/api/admin/bilan-versions/${version}`, {
      method: "PATCH",
      body,
    })
  },

  duplicateBilanVersion(version: number, body: BilanVersionDuplicate) {
    return request<BilanVersion>(
      `/api/admin/bilan-versions/${version}/duplicate`,
      { method: "POST", body }
    )
  },

  activateBilanVersion(version: number) {
    return request<BilanVersion>(`/api/admin/bilan-versions/${version}/activate`, {
      method: "POST",
    })
  },

  deactivateBilanVersion(version: number) {
    return request<BilanVersion>(
      `/api/admin/bilan-versions/${version}/deactivate`,
      { method: "POST" }
    )
  },

  listBilanQuestions(query?: Record<string, QueryValue>) {
    return request<PaginatedResponse<BilanQuestion>>(
      "/api/admin/bilan-questions",
      { query }
    )
  },

  createBilanQuestion(body: BilanQuestionPayload) {
    return request<BilanQuestion>("/api/admin/bilan-questions", {
      method: "POST",
      body,
    })
  },

  updateBilanQuestion(id: string, body: Partial<BilanQuestionPayload>) {
    return request<BilanQuestion>(`/api/admin/bilan-questions/${id}`, {
      method: "PATCH",
      body,
    })
  },
}
