"use client"

import { useState, useMemo, useEffect } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { usersMock, type User } from "./data"
import UsersTable from "./users-table"
import UserForm from "./user-form"

const USERS_PER_PAGE = 10

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(usersMock)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const [formFirstName, setFormFirstName] = useState("")
  const [formLastName, setFormLastName] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formRole, setFormRole] = useState<"Admin" | "User">("User")

  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(search.toLowerCase()) ||
        user.lastName.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    )
  }, [users, search])

  useEffect(() => {
    setCurrentPage(1)
  }, [search])

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE)

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  )

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id))
  }

  const openCreateForm = () => {
    setEditingUser(null)
    setFormFirstName("")
    setFormLastName("")
    setFormEmail("")
    setFormRole("User")
    setIsFormOpen(true)
  }

  const openEditForm = (user: User) => {
    setEditingUser(user)
    setFormFirstName(user.firstName)
    setFormLastName(user.lastName)
    setFormEmail(user.email)
    setFormRole(user.role)
    setIsFormOpen(true)
  }

  const handleSaveUser = () => {
    if (!formFirstName || !formEmail) return

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, firstName: formFirstName, lastName: formLastName, email: formEmail, role: formRole }
            : u
        )
      )
    } else {
      const newUser: User = {
        id: Date.now(),
        firstName: formFirstName,
        lastName: formLastName,
        email: formEmail,
        role: formRole,
      }

      setUsers((prev) => [...prev, newUser])
    }

    setIsFormOpen(false)
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <h1 className="text-sm font-medium">Utilisateurs</h1>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">

          <div className="rounded-xl bg-muted/50 p-4 space-y-4">

            <div className="flex justify-between items-center">
              <Input
                placeholder="Rechercher un utilisateur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />

              <Button onClick={openCreateForm}>
                Ajouter
              </Button>
            </div>

            <UsersTable
              users={paginatedUsers}
              onDelete={handleDelete}
              onView={setSelectedUser}
              onEdit={openEditForm}
            />

            {totalPages > 1 && (
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                >
                  Précédent
                </Button>

                <span className="text-sm self-center">
                  Page {currentPage} / {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  Suivant
                </Button>
              </div>
            )}

            {isFormOpen && (
              <UserForm
                open={isFormOpen}
                editingUser={editingUser}

                formFirstName={formFirstName}
                formLastName={formLastName}
                formEmail={formEmail}
                formRole={formRole}

                setFormFirstName={setFormFirstName}
                setFormLastName={setFormLastName}
                setFormEmail={setFormEmail}
                setFormRole={setFormRole}

                onCancel={() => setIsFormOpen(false)}
                onSave={handleSaveUser}
              />
            )}

            {selectedUser && (
              <div className="rounded-lg border bg-background p-4 mt-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-sm font-semibold">
                    Détails utilisateur
                  </h2>

                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setSelectedUser(null)}
                  >
                    Fermer
                  </Button>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <p><strong>Prénom:</strong> {selectedUser.firstName}</p>
                  <p><strong>Nom:</strong> {selectedUser.lastName}</p>
                  <p><strong>Email:</strong> {selectedUser.email}</p>
                  <p><strong>Rôle:</strong> {selectedUser.role}</p>
                </div>
              </div>
            )}

          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}