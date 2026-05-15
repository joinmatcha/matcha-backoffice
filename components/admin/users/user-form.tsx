import { selectClassName } from "@/components/admin/form-controls"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { AdminRole, AdminUser, Subscription } from "@/types/admin"

export type UserFormState = {
  firstName: string
  lastName: string
  email: string
  role: AdminRole
  subscription: Subscription
  isEmailVerified: boolean
}

export function toUserFormState(user: AdminUser): UserFormState {
  return {
    firstName: user.firstName ?? "",
    lastName: user.lastName ?? "",
    email: user.email,
    role: user.role,
    subscription: user.subscription,
    isEmailVerified: user.isEmailVerified,
  }
}

type UserFormProps = {
  form: UserFormState
  saving: boolean
  onChange: (form: UserFormState) => void
  onSubmit: () => void
}

export function UserForm({ form, saving, onChange, onSubmit }: UserFormProps) {
  return (
    <div className="space-y-3">
      <Input
        value={form.firstName}
        onChange={(event) => onChange({ ...form, firstName: event.target.value })}
        placeholder="Prénom"
      />
      <Input
        value={form.lastName}
        onChange={(event) => onChange({ ...form, lastName: event.target.value })}
        placeholder="Nom"
      />
      <Input
        value={form.email}
        type="email"
        onChange={(event) => onChange({ ...form, email: event.target.value })}
        placeholder="Email"
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <select
          value={form.role}
          onChange={(event) =>
            onChange({ ...form, role: event.target.value as AdminRole })
          }
          className={selectClassName}
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={form.subscription}
          onChange={(event) =>
            onChange({
              ...form,
              subscription: event.target.value as Subscription,
            })
          }
          className={selectClassName}
        >
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={form.isEmailVerified}
          onChange={(event) =>
            onChange({ ...form, isEmailVerified: event.target.checked })
          }
        />
        Email vérifié
      </label>
      <Button className="w-full" disabled={saving} onClick={onSubmit}>
        {saving ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </div>
  )
}
