import { request } from "@/lib/api/client"
import type {
  InsightsActivityPoint,
  InsightsJobs,
  InsightsOrientation,
  InsightsOverview,
  InsightsQuery,
  InsightsTestMetric,
} from "@/types/admin"

export const adminInsightsApi = {
  getInsightsOverview(query?: InsightsQuery) {
    return request<InsightsOverview>("/api/admin/insights/overview", { query })
  },

  getInsightsActivity(query?: InsightsQuery) {
    return request<{ activity: InsightsActivityPoint[] }>(
      "/api/admin/insights/activity",
      { query }
    )
  },

  getInsightsTests(query?: InsightsQuery) {
    return request<{ tests: InsightsTestMetric[] }>("/api/admin/insights/tests", {
      query,
    })
  },

  getInsightsJobs(query?: InsightsQuery) {
    return request<InsightsJobs>("/api/admin/insights/jobs", { query })
  },

  getInsightsOrientation(query?: InsightsQuery) {
    return request<InsightsOrientation>("/api/admin/insights/orientation", {
      query,
    })
  },
}
