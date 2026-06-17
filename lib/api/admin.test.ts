import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { adminApi, ApiError } from "@/lib/api/admin"

describe("adminApi", () => {
  const originalEnv = { ...process.env }

  beforeEach(() => {
    vi.restoreAllMocks()
    process.env = {
      ...originalEnv,
      NEXT_PUBLIC_API_PROTOCOL: "http",
      NEXT_PUBLIC_API_HOST: "localhost",
      NEXT_PUBLIC_API_PORT: "3000",
      NEXT_PUBLIC_API_URL: "",
    }
  })

  afterEach(() => {
    process.env = originalEnv
    vi.unstubAllGlobals()
  })

  it("builds requests from API env vars and sends cookies", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ user: { id: "1", email: "admin@test.dev" } }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    )

    vi.stubGlobal("fetch", fetchMock)

    await adminApi.login("admin@test.dev", "secret")

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          email: "admin@test.dev",
          password: "secret",
        }),
      })
    )
  })

  it("keeps only non-empty query params", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ items: [], pagination: {} }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    )

    vi.stubGlobal("fetch", fetchMock)

    await adminApi.listUsers({
      page: 2,
      search: "lea",
      role: "",
      active: null,
      verified: undefined,
    })

    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:3000/api/admin/users?page=2&search=lea",
      expect.any(Object)
    )
  })

  it("throws a typed ApiError when the API rejects the request", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: "Accès refusé" }), {
          status: 403,
          headers: { "Content-Type": "application/json" },
        })
      )
    )

    await expect(adminApi.listUsers()).rejects.toMatchObject({
      message: "Accès refusé",
      status: 403,
    } satisfies Partial<ApiError>)
  })

  it("fails early when the API base URL is missing", async () => {
    process.env.NEXT_PUBLIC_API_HOST = ""
    process.env.NEXT_PUBLIC_API_PORT = ""

    await expect(adminApi.listUsers()).rejects.toThrow("Configuration API manquante")
  })

  it("calls each admin endpoint with the expected method", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({}), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    )
    vi.stubGlobal("fetch", fetchMock)

    const cases: Array<{
      call: () => Promise<unknown>
      url: string
      method?: string
    }> = [
      {
        call: () => adminApi.logout(),
        url: "/api/auth/logout",
        method: "POST",
      },
      {
        call: () => adminApi.getStats(),
        url: "http://localhost:3000/api/admin/stats",
      },
      {
        call: () => adminApi.getInsightsOverview({ limit: 5 }),
        url: "http://localhost:3000/api/admin/insights/overview?limit=5",
      },
      {
        call: () => adminApi.getInsightsActivity({ from: "2026-06-01" }),
        url: "http://localhost:3000/api/admin/insights/activity?from=2026-06-01",
      },
      {
        call: () => adminApi.getInsightsTests(),
        url: "http://localhost:3000/api/admin/insights/tests",
      },
      {
        call: () => adminApi.getInsightsJobs({ limit: 3 }),
        url: "http://localhost:3000/api/admin/insights/jobs?limit=3",
      },
      {
        call: () => adminApi.getInsightsOrientation(),
        url: "http://localhost:3000/api/admin/insights/orientation",
      },
      {
        call: () => adminApi.getUser("u1"),
        url: "http://localhost:3000/api/admin/users/u1",
      },
      {
        call: () => adminApi.updateUser("u1", { role: "admin" }),
        url: "http://localhost:3000/api/admin/users/u1",
        method: "PATCH",
      },
      {
        call: () => adminApi.getRomeStatus(),
        url: "http://localhost:3000/api/admin/rome/status",
      },
      {
        call: () => adminApi.startRomeSync(),
        url: "http://localhost:3000/api/admin/rome/sync",
        method: "POST",
      },
      {
        call: () => adminApi.listRomeSyncRuns({ page: 2 }),
        url: "http://localhost:3000/api/admin/rome/sync-runs?page=2",
      },
      {
        call: () => adminApi.listPersonalityVersions({ page: 1 }),
        url: "http://localhost:3000/api/admin/personality-versions?page=1",
      },
      {
        call: () =>
          adminApi.createPersonalityVersion({
            version: "v1",
            title: "Version 1",
            questions: [],
          }),
        url: "http://localhost:3000/api/admin/personality-versions",
        method: "POST",
      },
      {
        call: () => adminApi.updatePersonalityVersion("p1", { title: "v2" }),
        url: "http://localhost:3000/api/admin/personality-versions/p1",
        method: "PATCH",
      },
      {
        call: () =>
          adminApi.duplicatePersonalityVersion("p1", {
            version: "v2",
            title: "Version 2",
          }),
        url: "http://localhost:3000/api/admin/personality-versions/p1/duplicate",
        method: "POST",
      },
      {
        call: () => adminApi.activatePersonalityVersion("p1"),
        url: "http://localhost:3000/api/admin/personality-versions/p1/activate",
        method: "POST",
      },
      {
        call: () => adminApi.deactivatePersonalityVersion("p1"),
        url: "http://localhost:3000/api/admin/personality-versions/p1/deactivate",
        method: "POST",
      },
      {
        call: () =>
          adminApi.addPersonalityQuestion("p1", {
            id: "q1",
            text: "Question",
            dimension: "EI",
            options: [],
          }),
        url: "http://localhost:3000/api/admin/personality-versions/p1/questions",
        method: "POST",
      },
      {
        call: () =>
          adminApi.updatePersonalityQuestion("p1", "q1", { text: "Question 2" }),
        url: "http://localhost:3000/api/admin/personality-versions/p1/questions/q1",
        method: "PATCH",
      },
      {
        call: () => adminApi.deletePersonalityQuestion("p1", "q1"),
        url: "http://localhost:3000/api/admin/personality-versions/p1/questions/q1",
        method: "DELETE",
      },
      {
        call: () => adminApi.listBilanVersions({ status: "active" }),
        url: "http://localhost:3000/api/admin/bilan-versions?status=active",
      },
      {
        call: () =>
          adminApi.createBilanVersion({ version: 1, title: "Bilan 1" }),
        url: "http://localhost:3000/api/admin/bilan-versions",
        method: "POST",
      },
      {
        call: () => adminApi.updateBilanVersion(1, { title: "Bilan 2" }),
        url: "http://localhost:3000/api/admin/bilan-versions/1",
        method: "PATCH",
      },
      {
        call: () => adminApi.duplicateBilanVersion(1, { version: 2 }),
        url: "http://localhost:3000/api/admin/bilan-versions/1/duplicate",
        method: "POST",
      },
      {
        call: () => adminApi.activateBilanVersion(1),
        url: "http://localhost:3000/api/admin/bilan-versions/1/activate",
        method: "POST",
      },
      {
        call: () => adminApi.deactivateBilanVersion(1),
        url: "http://localhost:3000/api/admin/bilan-versions/1/deactivate",
        method: "POST",
      },
      {
        call: () => adminApi.listBilanQuestions({ domain: "experience" }),
        url: "http://localhost:3000/api/admin/bilan-questions?domain=experience",
      },
      {
        call: () =>
          adminApi.createBilanQuestion({
            code: "EXP_1",
            domain: "experience",
            question: "Question",
            type: "likert_1_5",
            version: 1,
          }),
        url: "http://localhost:3000/api/admin/bilan-questions",
        method: "POST",
      },
      {
        call: () => adminApi.updateBilanQuestion("bq1", { question: "Question 2" }),
        url: "http://localhost:3000/api/admin/bilan-questions/bq1",
        method: "PATCH",
      },
      {
        call: () => adminApi.listSupportRequests({ status: "open", q: "rgpd" }),
        url: "http://localhost:3000/api/admin/support-requests?status=open&q=rgpd",
      },
      {
        call: () =>
          adminApi.updateSupportRequest("sr1", {
            status: "resolved",
            adminNotes: "Traité",
          }),
        url: "http://localhost:3000/api/admin/support-requests/sr1",
        method: "PATCH",
      },
      {
        call: () => adminApi.listWorkStyleVersions({ status: "active" }),
        url: "http://localhost:3000/api/admin/work-style-versions?status=active",
      },
      {
        call: () =>
          adminApi.createWorkStyleVersion({
            version: 1,
            title: "Style V1",
          }),
        url: "http://localhost:3000/api/admin/work-style-versions",
        method: "POST",
      },
      {
        call: () => adminApi.updateWorkStyleVersion(1, { title: "Style V2" }),
        url: "http://localhost:3000/api/admin/work-style-versions/1",
        method: "PATCH",
      },
      {
        call: () => adminApi.duplicateWorkStyleVersion(1, { version: 2 }),
        url: "http://localhost:3000/api/admin/work-style-versions/1/duplicate",
        method: "POST",
      },
      {
        call: () => adminApi.activateWorkStyleVersion(1),
        url: "http://localhost:3000/api/admin/work-style-versions/1/activate",
        method: "POST",
      },
      {
        call: () => adminApi.deactivateWorkStyleVersion(1),
        url: "http://localhost:3000/api/admin/work-style-versions/1/deactivate",
        method: "POST",
      },
      {
        call: () => adminApi.listWorkStyleQuestions({ dimension: "autonomy" }),
        url: "http://localhost:3000/api/admin/work-style-questions?dimension=autonomy",
      },
      {
        call: () =>
          adminApi.createWorkStyleQuestion({
            code: "AUT_1",
            text: "Question",
            dimension: "autonomy",
            version: 1,
          }),
        url: "http://localhost:3000/api/admin/work-style-questions",
        method: "POST",
      },
      {
        call: () => adminApi.updateWorkStyleQuestion("wq1", { text: "Question 2" }),
        url: "http://localhost:3000/api/admin/work-style-questions/wq1",
        method: "PATCH",
      },
    ]

    for (const testCase of cases) {
      fetchMock.mockClear()
      await testCase.call()

      expect(fetchMock).toHaveBeenCalledWith(
        testCase.url,
        expect.objectContaining({
          method: testCase.method ?? "GET",
          credentials: "include",
        })
      )
    }
  })
})
