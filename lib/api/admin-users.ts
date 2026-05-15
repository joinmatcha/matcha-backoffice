import { request, type QueryValue } from "@/lib/api/client"
import type {
  AdminStats,
  AdminUser,
  AdminUserDetail,
  AdminUserUpdate,
  PaginatedResponse,
} from "@/types/admin"

export const adminUsersApi = {
  listUsers(query?: Record<string, QueryValue>) {
    return request<PaginatedResponse<AdminUser>>("/api/admin/users", { query })
  },

  getStats() {
    return request<AdminStats>("/api/admin/stats")
  },

  getUser(id: string) {
    return request<AdminUserDetail>(`/api/admin/users/${id}`)
  },

  updateUser(id: string, body: AdminUserUpdate) {
    return request<AdminUser>(`/api/admin/users/${id}`, {
      method: "PATCH",
      body,
    })
  },
}
