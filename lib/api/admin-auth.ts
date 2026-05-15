import { request } from "@/lib/api/client"
import type { AdminLoginResponse } from "@/types/admin"

export const adminAuthApi = {
  login(email: string, password: string) {
    return request<AdminLoginResponse>("/api/admin/auth/login", {
      method: "POST",
      body: { email, password },
    })
  },

  logout() {
    return request<{ message?: string }>("/api/admin/auth/logout", {
      method: "POST",
    })
  },
}
