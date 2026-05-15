"use client"

import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { ErrorMessage } from "@/components/admin/error-message"
import { selectClassName } from "@/components/admin/form-controls"
import { PaginationControls } from "@/components/admin/pagination-controls"
import { Toolbar } from "@/components/admin/toolbar"
import { UserDetailDialog } from "@/components/admin/users/user-detail-dialog"
import { UserEditDialog } from "@/components/admin/users/user-edit-dialog"
import {
  toUserFormState,
  type UserFormState,
} from "@/components/admin/users/user-form"
import { UsersTable } from "@/components/admin/users/users-table"
import { adminApi } from "@/lib/api/admin"
import type {
  AdminRole,
  AdminUser,
  AdminUserDetail,
  Pagination,
  Subscription,
} from "@/types/admin"

const PAGE_SIZE = 20

export function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [pagination, setPagination] = useState<Pagination>()
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [role, setRole] = useState<"" | AdminRole>("")
  const [subscription, setSubscription] = useState<"" | Subscription>("")
  const [isEmailVerified, setIsEmailVerified] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [form, setForm] = useState<UserFormState | null>(null)
  const [detail, setDetail] = useState<AdminUserDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const query = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      q: search,
      role,
      subscription,
      isEmailVerified,
    }),
    [isEmailVerified, page, role, search, subscription]
  )

  useEffect(() => {
    let ignore = false

    async function loadUsers() {
      setLoading(true)
      setError("")

      try {
        const response = await adminApi.listUsers(query)
        if (ignore) return
        setUsers(response.items)
        setPagination(response.pagination)
      } catch (err) {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Chargement impossible")
          setUsers([])
          setPagination(undefined)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    loadUsers()

    return () => {
      ignore = true
    }
  }, [query])

  function openEditDialog(user: AdminUser) {
    setEditingUser(user)
    setForm(toUserFormState(user))
  }

  async function saveUser() {
    if (!editingUser || !form) return

    setSaving(true)
    setError("")

    try {
      const updatedUser = await adminApi.updateUser(editingUser._id, form)
      setUsers((current) =>
        current.map((user) =>
          user._id === updatedUser._id ? updatedUser : user
        )
      )
      setEditingUser(null)
      setForm(null)
      toast.success("Utilisateur mis à jour")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mise à jour impossible")
      toast.error("Mise à jour impossible")
    } finally {
      setSaving(false)
    }
  }

  function updateSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  async function openDetail(user: AdminUser) {
    setDetailLoading(true)
    setError("")

    try {
      setDetail(await adminApi.getUser(user._id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Détail indisponible")
      toast.error("Détail utilisateur indisponible")
    } finally {
      setDetailLoading(false)
    }
  }

  return (
    <main className="matcha-page">
      <Toolbar
        search={search}
        placeholder="Rechercher par nom ou email..."
        onSearchChange={updateSearch}
      >
        <select
          value={role}
          onChange={(event) => {
            setRole(event.target.value as "" | AdminRole)
            setPage(1)
          }}
          className={selectClassName}
        >
          <option value="">Tous les rôles</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <select
          value={subscription}
          onChange={(event) => {
            setSubscription(event.target.value as "" | Subscription)
            setPage(1)
          }}
          className={selectClassName}
        >
          <option value="">Tous les abonnements</option>
          <option value="free">Free</option>
          <option value="premium">Premium</option>
        </select>
        <select
          value={isEmailVerified}
          onChange={(event) => {
            setIsEmailVerified(event.target.value)
            setPage(1)
          }}
          className={selectClassName}
        >
          <option value="">Tous les emails</option>
          <option value="true">Vérifiés</option>
          <option value="false">Non vérifiés</option>
        </select>
      </Toolbar>

      <ErrorMessage message={error} />

      <UsersTable
        users={users}
        loading={loading}
        detailLoading={detailLoading}
        onEdit={openEditDialog}
        onDetail={openDetail}
      />

      <PaginationControls pagination={pagination} onPageChange={setPage} />

      <UserEditDialog
        user={editingUser}
        form={form}
        saving={saving}
        onClose={() => {
          setEditingUser(null)
          setForm(null)
        }}
        onFormChange={setForm}
        onSave={saveUser}
      />
      <UserDetailDialog detail={detail} onClose={() => setDetail(null)} />
    </main>
  )
}
