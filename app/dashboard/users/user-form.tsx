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

import type { User } from "../../types/user"

type Props = {
  open: boolean
  editingUser: User | null
  formFirstName: string
  formLastName: string
  formEmail: string
  formRole: "admin" | "user"
  setFormFirstName: (v: string) => void
  setFormLastName: (v: string) => void
  setFormEmail: (v: string) => void
  setFormRole: (v: "admin" | "user") => void
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
            Modifier utilisateur
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
              setFormRole(e.target.value as "admin" | "user")
            }
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
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