import { JobsPage } from "@/components/admin/jobs/jobs-page"
import { PageHeader } from "@/components/layout/page-header"

export default function Page() {
  return (
    <>
      <PageHeader
        title="Référentiel ROME"
        description="Import et suivi du référentiel métiers France Travail."
      />
      <JobsPage />
    </>
  )
}
