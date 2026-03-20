import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User } from "./data"

type Props = {
  users: User[]
  onDelete: (id: number) => void
  onView: (user: User) => void
  onEdit: (user: User) => void
}

export default function UsersTable({
  users,
  onDelete,
  onView,
  onEdit,
}: Props) {
  const router = useRouter()

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left border-b">
          <th className="pb-2">Prénom</th>
          <th className="pb-2">Nom</th>
          <th className="pb-2">Email</th>
          <th className="pb-2">Rôle</th>
          <th className="pb-2">Actions</th>
        </tr>
      </thead>

      <tbody>
        {users.map((user) => (
          <tr key={user.id} className="border-b">
            <td className="py-2">{user.firstName}</td>
            <td className="py-2">{user.lastName}</td>
            <td>{user.email}</td>

            <td>
              <Badge
                variant={user.role === "Admin" ? "default" : "secondary"}
              >
                {user.role}
              </Badge>
            </td>

            <td className="space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => router.push(`/dashboard/users/${user.id}`)}
              >
                Voir résultats
              </Button>

              <Button
                size="sm"
                variant="secondary"
                onClick={() => onEdit(user)}
              >
                Edit
              </Button>

              <Button
                size="sm"
                variant="destructive"
                onClick={() => onDelete(user.id)}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}