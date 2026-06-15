import { ApiError } from "@/lib/api/client"
import type { AdminLoginResponse } from "@/types/admin"

export const adminAuthApi = {
  async login(email: string, password: string) {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    })
    const data = await response.json().catch(() => null)
    if (!response.ok) {
      throw new ApiError(data?.message || "Erreur API", response.status)
    }
    return data as AdminLoginResponse
  },

  async logout() {
    const response = await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    })
    const data = await response.json().catch(() => null)
    if (!response.ok) {
      throw new ApiError(data?.message || "Erreur API", response.status)
    }
    return data as { message?: string }
  },
}
