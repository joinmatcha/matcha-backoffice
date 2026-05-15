import { StatsPage } from "@/components/admin/stats/stats-page"
import { PageHeader } from "@/components/layout/page-header"

export default function Page() {
  return (
    <>
      <PageHeader
        title="Statistiques"
        description="Indicateurs simples issus des routes admin."
      />
      <StatsPage />
    </>
  )
}
