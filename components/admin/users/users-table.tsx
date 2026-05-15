import { Check, Eye, X } from "lucide-react"
import { EmptyState } from "@/components/admin/empty-state"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import type { AdminUser } from "@/types/admin"

type UsersTableProps = {
  users: AdminUser[]
  loading: boolean
  detailLoading: boolean
  onEdit: (user: AdminUser) => void
  onDetail: (user: AdminUser) => void
}

export function UsersTable({
  users,
  loading,
  detailLoading,
  onEdit,
  onDetail,
}: UsersTableProps) {
  return (
    <div className="matcha-table">
      <table className="w-full text-sm">
        <thead className="bg-accent/60 text-left text-accent-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Utilisateur</th>
            <th className="px-4 py-3 font-medium">Rôle</th>
            <th className="px-4 py-3 font-medium">Abonnement</th>
            <th className="px-4 py-3 font-medium">Email vérifié</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="border-t border-border/70">
              <td className="px-4 py-3">
                <div className="font-medium">{getUserName(user)}</div>
                <div className="text-muted-foreground">{user.email}</div>
              </td>
              <td className="px-4 py-3">
                <StatusBadge active={user.role === "admin"} label={user.role} />
              </td>
              <td className="px-4 py-3">{user.subscription}</td>
              <td className="px-4 py-3">
                <EmailVerified verified={user.isEmailVerified} />
              </td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={detailLoading}
                    onClick={() => onDetail(user)}
                  >
                    <Eye />
                    Voir
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => onEdit(user)}>
                    Modifier
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!loading && users.length === 0 && (
        <div className="p-4">
          <EmptyState label="Aucun utilisateur trouvé." />
        </div>
      )}
      {loading && (
        <div className="p-4 text-sm text-muted-foreground">Chargement...</div>
      )}
    </div>
  )
}

function getUserName(user: AdminUser) {
  return [user.firstName, user.lastName].filter(Boolean).join(" ") || "Sans nom"
}

function EmailVerified({ verified }: { verified: boolean }) {
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1 text-green-700">
        <Check className="size-4" />
        Oui
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 text-muted-foreground">
      <X className="size-4" />
      Non
    </span>
  )
}
