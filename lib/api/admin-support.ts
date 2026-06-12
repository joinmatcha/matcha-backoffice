import { request, type QueryValue } from "@/lib/api/client"
import type {
  PaginatedResponse,
  SupportRequest,
  SupportRequestUpdate,
} from "@/types/admin"

export const adminSupportApi = {
  listSupportRequests(query?: Record<string, QueryValue>) {
    return request<PaginatedResponse<SupportRequest>>(
      "/api/admin/support-requests",
      { query }
    )
  },

  updateSupportRequest(id: string, body: SupportRequestUpdate) {
    return request<SupportRequest>(`/api/admin/support-requests/${id}`, {
      method: "PATCH",
      body,
    })
  },
}
