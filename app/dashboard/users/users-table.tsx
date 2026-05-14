import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { User } from "@/app/types/user"

type Props = {
  users: User[]
  onEdit: (user: User) => void
}

export default function UsersTable({ users, onEdit }: Props) {
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
          <tr key={user._id} className="border-b hover:bg-muted/95 transition-colors">
            <td className="py-3">{user.firstName}</td>
            <td className="py-3">{user.lastName}</td>
            <td className="py-3">{user.email}</td>

            <td className="py-3">
              <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                {user.role}
              </Badge>
            </td>

            <td className="space-x-2">

              <Button
                size="sm"
                className="!bg-[#334155] text-white hover:bg-[#7ab77a]"
                onClick={() => onEdit(user)}
              >
                Modifier
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}