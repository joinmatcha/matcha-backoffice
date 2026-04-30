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

import { User } from "@/app/types/user"
import UsersTable from "./users-table"
import UserForm from "./user-form"

const USERS_PER_PAGE = 10

export default function UsersPage() {
  // ⚠️ TEMP TOKEN - remove when auth is implemented
  const TOKEN = process.env.NEXT_PUBLIC_API_TOKEN 
  const API_URL = process.env.NEXT_PUBLIC_API_URL
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const [formFirstName, setFormFirstName] = useState("")
  const [formLastName, setFormLastName] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formRole, setFormRole] = useState<"admin" | "user">("user")

  useEffect(() => {
  const fetchUsers = async () => {

    if (!API_URL || !TOKEN) {
      console.error("API_URL ou TOKEN manquant")
      setLoading(false)
      return
    }

    try {
      const res = await fetch(`${API_URL}/api/admin/users`, {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      })

      console.log("STATUS:", res.status)

      const data = await res.json()
      console.log("DATA:", data)

      //Gérer les erreurs HTTP avant tentative d'accès à data.items pour éviter les erreurs de type "Cannot read properties of undefined"
      if (!res.ok) {
        console.error("Erreur API:", res.status, data)
        setUsers([])
        return
      }
      // Vérifier que data.items existe et est un tableau
      if (!data.items || !Array.isArray(data.items)) {
        console.error("Format API invalide", data)
        setUsers([])
        return
      }
      // Cas normal
      setUsers(data.items)
    } catch (error) {
      console.error("Erreur:", error)
    } finally {
      setLoading(false)
    }
  }

  fetchUsers()
  }, [])


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

  const openEditForm = (user: User) => {
    setEditingUser(user)
    setFormFirstName(user.firstName)
    setFormLastName(user.lastName)
    setFormEmail(user.email)
    setFormRole(user.role === "admin" ? "admin" : "user")
    setIsFormOpen(true)
  }

 const handleSaveUser = async () => {
  if (!editingUser) return

  try {
    const res = await fetch(
      `${API_URL}/api/admin/users/${editingUser._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${TOKEN}`,
        },
        body: JSON.stringify({
          firstName: formFirstName,
          lastName: formLastName,
          email: formEmail,
          role: formRole === "admin" ? "admin" : "user",
        }),
      }
    )

    const updatedUser = await res.json()

    setUsers((prev) =>
      prev.map((u) =>
        u._id === updatedUser._id ? updatedUser : u
      )
    )

    setIsFormOpen(false)
  } catch (error) {
    console.error("Erreur update:", error)
  }
}

  if (loading) {
    return <div className="p-4">Chargement...</div>
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
            </div>

            <UsersTable
              users={paginatedUsers}
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
          </div>
        
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
