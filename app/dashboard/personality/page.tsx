import { PersonalityPage } from "@/components/admin/personality/personality-page"
import { PageHeader } from "@/components/layout/page-header"

export default function Page() {
  return (
    <>
      <PageHeader
        title="Personnalité"
        description="Versions du test de personnalité, questions et activation."
      />
      <PersonalityPage />
    </>
  )
}
