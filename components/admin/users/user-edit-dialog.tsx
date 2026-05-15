import { Shield } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UserForm, type UserFormState } from "@/components/admin/users/user-form"
import type { AdminUser } from "@/types/admin"

type UserEditDialogProps = {
  user: AdminUser | null
  form: UserFormState | null
  saving: boolean
  onClose: () => void
  onFormChange: (form: UserFormState) => void
  onSave: () => void
}

export function UserEditDialog({
  user,
  form,
  saving,
  onClose,
  onFormChange,
  onSave,
}: UserEditDialogProps) {
  return (
    <Dialog open={!!user && !!form} onOpenChange={(open) => !open && onClose()}>
      {form && (
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="size-4" />
              Modifier utilisateur
            </DialogTitle>
          </DialogHeader>
          <UserForm
            form={form}
            saving={saving}
            onChange={onFormChange}
            onSubmit={onSave}
          />
        </DialogContent>
      )}
    </Dialog>
  )
}
