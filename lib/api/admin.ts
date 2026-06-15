export { ApiError } from "@/lib/api/client"
import { adminAuthApi } from "@/lib/api/admin-auth"
import { adminBilanApi } from "@/lib/api/admin-bilan"
import { adminPersonalityApi } from "@/lib/api/admin-personality"
import { adminRomeApi } from "@/lib/api/admin-rome"
import { adminSupportApi } from "@/lib/api/admin-support"
import { adminUsersApi } from "@/lib/api/admin-users"
import { adminWorkStyleApi } from "@/lib/api/admin-work-style"

export const adminApi = {
  ...adminAuthApi,
  ...adminUsersApi,
  ...adminRomeApi,
  ...adminPersonalityApi,
  ...adminBilanApi,
  ...adminSupportApi,
  ...adminWorkStyleApi,
}
