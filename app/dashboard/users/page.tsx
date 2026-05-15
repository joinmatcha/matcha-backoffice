import { UsersPage } from "@/components/admin/users/users-page"
import { PageHeader } from "@/components/layout/page-header"

export default function Page() {
  return (
    <>
      <PageHeader
        title="Utilisateurs"
        description="Gestion des comptes, rôles et abonnements."
      />
      <UsersPage />
    </>
  )
}
