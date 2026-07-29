export type AdminRole = "admin" | "user"
export type Subscription = "free" | "premium"
export type Gender = "male" | "female" | "other" | "undisclosed"
export type LocationPreference = "remote" | "hybrid" | "on-site"
export type VersionStatus = "draft" | "active" | "archived"
export type SupportRequestCategory =
  | "account"
  | "privacy"
  | "billing"
  | "bug"
  | "other"
export type SupportRequestStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "closed"
export type PersonalityDimension = "EI" | "SN" | "TF" | "JP"
export type BilanQuestionDomain =
  | "competence"
  | "soft_skill"
  | "value"
  | "work_condition"
  | "interest"
export type BilanQuestionType = "likert_1_5"
export type WorkStyleDimension =
  | "autonomy"
  | "collaboration"
  | "pace"
  | "structure"
  | "variety"
  | "human_contact"
  | "mobility"
  | "learning"

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
    suggestedSectors?: string[]
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
    recommendedSectors?: string[]
  }>
  recommendationProfile: null | {
    unlocked: boolean
    completedSources: string[]
    missingSources: string[]
    sectors: Array<{
      key: string
      label: string
      weight: number
      sources: string[]
    }>
    matchedJobs: Array<{
      id: string
      code: string
      title: string
      sector?: string
      score: number
      reasons: string[]
    }>
    recalculatedAt?: string
  }
  swipes: {
    likes: number
    dislikes: number
    total: number
  }
}

export type SupportRequest = {
  _id: string
  user: string
  email: string
  name: string
  category: SupportRequestCategory
  subject: string
  message: string
  status: SupportRequestStatus
  adminNotes?: string
  handledBy?: string
  handledAt?: string
  createdAt: string
  updatedAt: string
}

export type SupportRequestUpdate = Partial<
  Pick<SupportRequest, "status" | "adminNotes">
>

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
  suggestedSectors?: string[]
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

export type WorkStyleProfile = {
  key: string
  title: string
  description: string
  strengths: string[]
  cautions: string[]
  advice: string[]
  preferredAxes: WorkStyleDimension[]
}

export type WorkStyleVersion = {
  _id: string
  version: number
  title: string
  summary?: string
  status: VersionStatus
  isActive: boolean
  profiles: WorkStyleProfile[]
  createdAt: string
  updatedAt: string
}

export type WorkStyleVersionPayload = {
  version: number
  title: string
  summary?: string
  status?: VersionStatus
  isActive?: boolean
  profiles?: WorkStyleProfile[]
}

export type WorkStyleVersionDuplicate = {
  version: number
  title?: string
  summary?: string
}

export type WorkStyleQuestion = {
  _id: string
  code: string
  text: string
  dimension: WorkStyleDimension
  polarity: 1 | -1
  order: number
  version: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export type WorkStyleQuestionPayload = {
  code: string
  text: string
  dimension: WorkStyleDimension
  polarity?: 1 | -1
  order?: number
  version: number
  isActive?: boolean
}

export type InsightsQuery = {
  from?: string
  to?: string
  limit?: number
  userEmail?: string
}

export type InsightsOverview = {
  totalEvents: number
  activeUsers: number
  testsStarted: number
  testsCompleted: number
  completionRate: number
  jobViews: number
  likes: number
  dislikes: number
}

export type InsightsActivityPoint = {
  day: string
  events: number
  activeUsers: number
  testsCompleted: number
}

export type InsightsTestMetric = {
  entityType: "personality" | "bilan" | "work_style"
  label: string
  started: number
  completed: number
  abandoned: number
  completionRate: number
  abandonmentRate: number
  topAbandonStep: null | {
    stepId: string | null
    count: number
  }
}

export type InsightsJobMetric = {
  jobId: string
  title: string
  domain: string
  count: number
}

export type InsightsDomainMetric = {
  domain: string
  count: number
}

export type InsightsJobs = {
  matched: InsightsJobMetric[]
  viewed: InsightsJobMetric[]
  liked: InsightsJobMetric[]
  disliked: InsightsJobMetric[]
  domains: {
    matched: InsightsDomainMetric[]
    liked: InsightsDomainMetric[]
  }
  matchInterestGap: InsightsJobMetric[]
}

export type InsightsOrientationItem = {
  key: string
  count: number
}

export type InsightsWorkStyleProfileItem = InsightsOrientationItem & {
  title: string
}

export type InsightsOrientation = {
  competenceStrengths: InsightsOrientationItem[]
  competenceToImprove: InsightsOrientationItem[]
  softSkillStrengths: InsightsOrientationItem[]
  values: InsightsOrientationItem[]
  workConditions: InsightsOrientationItem[]
  workStyleAxes: InsightsOrientationItem[]
  workStyleProfiles: InsightsWorkStyleProfileItem[]
}
