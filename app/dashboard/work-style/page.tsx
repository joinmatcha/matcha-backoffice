import { WorkStylePage } from "@/components/admin/work-style/work-style-page"
import { PageHeader } from "@/components/layout/page-header"

export default function Page() {
  return (
    <>
      <PageHeader
        title="Style professionnel"
        description="Versions et questions du test Style professionnel."
      />
      <WorkStylePage />
    </>
  )
}
