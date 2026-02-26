"use client"

import { useState, useMemo, useEffect } from "react"

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { usersMock, type User } from "./data"

const USERS_PER_PAGE = 10

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(usersMock)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Filtrage
  const filteredUsers = useMemo(() => {
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    )
  }, [users, search])

  // Reset page si recherche change
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

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          <h1 className="text-sm font-medium">Utilisateurs</h1>
        </header>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="rounded-xl bg-muted/50 p-4 space-y-4">

            {/* Search + Add */}
            <div className="flex justify-between items-center">
              <Input
                placeholder="Rechercher un utilisateur..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-sm"
              />
              <Button>Ajouter</Button>
            </div>

            {/* Table */}
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b">
                  <th className="pb-2">Nom</th>
                  <th className="pb-2">Email</th>
                  <th className="pb-2">Rôle</th>
                  <th className="pb-2">Actions</th>
                </tr>
              </thead>

              <tbody>
                {paginatedUsers.length > 0 ? (
                  paginatedUsers.map((user) => (
                    <tr key={user.id} className="border-b">
                      <td className="py-2">{user.name}</td>
                      <td>{user.email}</td>
                      <td>
                        <Badge
                          variant={
                            user.role === "Admin"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {user.role}
                        </Badge>
                      </td>
                      <td className="space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedUser(user)}
                        >
                          Voir
                        </Button>

                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            console.log("Edit user:", user)
                          }
                        >
                          Edit
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(user.id)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-6 text-center text-muted-foreground"
                    >
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Pagination */}
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

            {/* View Panel */}
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
                  <p><strong>Nom:</strong> {selectedUser.name}</p>
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