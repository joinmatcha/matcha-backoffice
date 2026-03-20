"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

import { User } from "./data"

type Props = {
  open: boolean
  editingUser: User | null
  formFirstName: string
  formLastName: string
  formEmail: string
  formRole: "Admin" | "User"
  setFormFirstName: (v: string) => void
  setFormLastName: (v: string) => void
  setFormEmail: (v: string) => void
  setFormRole: (v: "Admin" | "User") => void
  onSave: () => void
  onCancel: () => void
}

export default function UserForm({
  open,
  editingUser,
  formFirstName,
  formLastName,
  formEmail,
  formRole,
  setFormFirstName,
  setFormLastName,
  setFormEmail,
  setFormRole,
  onSave,
  onCancel,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent className="sm:max-w-[420px]">

        <DialogHeader>
          <DialogTitle>
            {editingUser ? "Modifier utilisateur" : "Ajouter utilisateur"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">

          <Input
            placeholder="Prénom"
            value={formFirstName}
            onChange={(e) => setFormFirstName(e.target.value)}
          />

          <Input
            placeholder="Nom"
            value={formLastName}
            onChange={(e) => setFormLastName(e.target.value)}
          />

          <Input
            placeholder="Email"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
          />

          <select
            className="border rounded-md p-2 text-sm w-full"
            value={formRole}
            onChange={(e) =>
              setFormRole(e.target.value as "Admin" | "User")
            }
          >
            <option value="User">User</option>
            <option value="Admin">Admin</option>
          </select>

        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={onCancel}>
            Annuler
          </Button>

          <Button onClick={onSave}>
            Sauvegarder
          </Button>
        </DialogFooter>

      </DialogContent>
    </Dialog>
  )
}