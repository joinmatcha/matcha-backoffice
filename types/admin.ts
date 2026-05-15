export type AdminRole = "admin" | "user"
export type Subscription = "free" | "premium"
export type Gender = "male" | "female" | "other" | "undisclosed"
export type LocationPreference = "remote" | "hybrid" | "on-site"
export type VersionStatus = "draft" | "active" | "archived"
export type PersonalityDimension = "EI" | "SN" | "TF" | "JP"
export type BilanQuestionDomain =
  | "experience"
  | "competence"
  | "soft_skill"
  | "value"
  | "work_condition"
  | "interest"
export type BilanQuestionType = "likert_1_5" | "open_text"

export type Pagination = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type PaginatedResponse<T> = {
  items: T[]
  pagination: Pagination
}

export type AdminSessionUser = {
  id: string
  email: string
  firstName?: string
  lastName?: string
  role: AdminRole
}

export type AdminLoginResponse = {
  user: AdminSessionUser
}

export type AdminUser = {
  _id: string
  email: string
  firstName?: string
  lastName?: string
  birthYear?: number | null
  gender?: Gender | null
  subscription: Subscription
  role: AdminRole
  jobTypes?: string[]
  locationPref?: LocationPreference | null
  remote?: boolean | null
  isEmailVerified: boolean
  consentAccepted: boolean
  createdAt: string
  updatedAt: string
}

export type AdminUserUpdate = Partial<
  Pick<
    AdminUser,
    | "email"
    | "firstName"
    | "lastName"
    | "birthYear"
    | "gender"
    | "subscription"
    | "role"
    | "jobTypes"
    | "locationPref"
    | "remote"
    | "isEmailVerified"
  >
>

export type AdminUserDetail = {
  user: AdminUser
  personalityTests: Array<{
    id: string
    templateVersion: string
    type: string
    result: string
    description?: string
    traits?: string[]
    weaknesses?: string[]
    motivationProfile?: string[]
    createdAt?: string
  }>
  bilans: Array<{
    id: string
    version: number
    createdAt?: string
    archetype?: {
      id: string
      title: string
      subtitle: string
      description: string
    }
    profileSummary?: string
    keyStrengths?: string[]
    recommendedJobs?: Array<{
      id: string
      title: string
      description?: string
      sector?: string
      score: number
    }>
  }>
  swipes: {
    likes: number
    dislikes: number
    total: number
  }
}

export type AdminStats = {
  users: {
    total: number
    admins: number
    premium: number
    verified: number
    verificationRate: number
  }
  engagement: {
    personalityTests: number
    bilanResults: number
    totalSwipes: number
    likedSwipes: number
  }
  content: {
    personalityVersions: number
    bilanVersions: number
    activeRomeMetiers: number
    activeRomeAppellations: number
  }
  rome: {
    lastRun: null | {
      id: string
      status: RomeSyncStatus
      createdAt?: string
      finishedAt?: string
    }
  }
}

export type RomeSyncStatus =
  | "queued"
  | "running"
  | "success"
  | "partial_failure"
  | "failed"
  | "cancelled"

export type RomeSyncStep =
  | "queued"
  | "auth"
  | "list_appellations"
  | "fetch_metiers"
  | "fetch_fiches"
  | "write_db"
  | "deactivate_missing"
  | "done"

export type RomeSyncProgress = {
  totalAppellations: number
  uniqueMetiers: number
  fetchedMetiers: number
  fetchedFiches: number
}

export type RomeSyncRunSummary = {
  id: string
  status: RomeSyncStatus
  currentStep?: RomeSyncStep
  currentCode?: string
  createdAt?: string
  startedAt?: string
  finishedAt?: string
  totalAppellations?: number
  uniqueMetiers?: number
  fetchedMetiers?: number
  fetchedFiches?: number
  upsertedMetiers?: number
  updatedMetiers?: number
  deactivatedMetiers?: number
  upsertedAppellations?: number
  updatedAppellations?: number
  deactivatedAppellations?: number
  errors?: Array<{
    code?: string
    step: string
    message: string
    retryable?: boolean
    at: string
  }>
}

export type RomeStatus = {
  isRunning: boolean
  currentRun: null | {
    id: string
    status: RomeSyncStatus
    currentStep: RomeSyncStep
    currentCode?: string
    progress: RomeSyncProgress
  }
  lastSuccessfulRun: null | {
    id: string
    finishedAt?: string
    upsertedMetiers: number
    updatedMetiers: number
    deactivatedMetiers: number
  }
  lastRun: null | {
    id: string
    status: RomeSyncStatus
    createdAt?: string
    finishedAt?: string
  }
  totals: {
    activeMetiers: number
    activeAppellations: number
  }
}

export type RomeSyncStartResponse = {
  syncRunId: string
  status: RomeSyncStatus
}

export type RomeSyncRunsResponse = {
  runs: RomeSyncRunSummary[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export type PersonalityOption = {
  value: number
  label: string
}

export type PersonalityQuestion = {
  id: string
  text: string
  dimension: PersonalityDimension
  options: PersonalityOption[]
  order?: number
  isActive?: boolean
}

export type PersonalityProfile = {
  key: string
  label: string
  description?: string
  strengths?: string[]
  weaknesses?: string[]
  recommendedJobs?: string[]
  isActive?: boolean
}

export type PersonalityVersion = {
  _id: string
  version: string
  title: string
  summary?: string
  isActive: boolean
  status?: VersionStatus
  questions: PersonalityQuestion[]
  profiles: PersonalityProfile[]
}

export type PersonalityVersionPayload = {
  version: string
  title: string
  summary?: string
  isActive?: boolean
  profiles?: PersonalityProfile[]
  questions: PersonalityQuestion[]
}

export type PersonalityVersionUpdate = Partial<PersonalityVersionPayload>

export type PersonalityVersionDuplicate = {
  version: string
  title?: string
  summary?: string
}

export type BilanVersion = {
  _id: string
  version: number
  title: string
  description?: string
  status: VersionStatus
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type BilanVersionPayload = {
  version: number
  title: string
  description?: string
  status?: VersionStatus
  isActive?: boolean
}

export type BilanVersionDuplicate = {
  version: number
  title?: string
  description?: string
}

export type BilanQuestion = {
  _id: string
  code: string
  domain: BilanQuestionDomain
  subdomain?: string | null
  question: string
  type: BilanQuestionType
  version: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type BilanQuestionPayload = {
  code: string
  domain: BilanQuestionDomain
  subdomain?: string | null
  question: string
  type: BilanQuestionType
  version: number
  isActive?: boolean
}
