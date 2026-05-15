import { request, type QueryValue } from "@/lib/api/client"
import type {
  RomeStatus,
  RomeSyncRunsResponse,
  RomeSyncStartResponse,
} from "@/types/admin"

export const adminRomeApi = {
  getRomeStatus() {
    return request<RomeStatus>("/api/admin/rome/status")
  },

  startRomeSync() {
    return request<RomeSyncStartResponse>("/api/admin/rome/sync", {
      method: "POST",
    })
  },

  listRomeSyncRuns(query?: Record<string, QueryValue>) {
    return request<RomeSyncRunsResponse>("/api/admin/rome/sync-runs", { query })
  },
}
