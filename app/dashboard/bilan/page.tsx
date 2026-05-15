import { BilanPage } from "@/components/admin/bilan/bilan-page"
import { PageHeader } from "@/components/layout/page-header"

export default function Page() {
  return (
    <>
      <PageHeader
        title="Bilan"
        description="Versions et questions du bilan de compétences."
      />
      <BilanPage />
    </>
  )
}
