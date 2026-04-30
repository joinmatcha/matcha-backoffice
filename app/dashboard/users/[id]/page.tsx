"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { resultsMock } from "../results"
import type { User } from "../../../types/user"

export default function UserDetailPage() {
  const params = useParams()
  const userId = Number(params.id)

  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // ✅ FETCH BACKEND (user)
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:5000/users/${userId}`)

        if (!res.ok) {
          throw new Error("Erreur API user")
        }

        const data = await res.json()

        // ⚠️ ADAPTATION SI BACKEND = name au lieu de firstName/lastName
        const [firstName = "", lastName = ""] = data.name
          ? data.name.split(" ")
          : [data.firstName, data.lastName]

        setUser({
          ...data,
          firstName,
          lastName,
        })
      } catch (error) {
        console.error("Erreur fetch user:", error)
      } finally {
        setLoading(false)
      }
    }

    if (userId) {
      fetchUser()
    }
  }, [userId])

  // ✅ MOCK résultats (pas d’API)
  const result = resultsMock.find((r) => r.userId === userId)

  if (loading) {
    return <p className="p-6">Chargement...</p>
  }

  if (!user) {
    return <p className="p-6">Utilisateur introuvable</p>
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-xl font-semibold">
        {user.firstName} {user.lastName}
      </h1>

      {/* Infos user (BACKEND) */}
      <div className="rounded-lg border p-4">
        <p>Email: {user.email}</p>
        <p>Rôle: {user.role}</p>
      </div>

      {/* Résultats (MOCK) */}
      {result ? (
        <div className="rounded-lg border p-4 space-y-2">
          <h2 className="font-medium">Résultat du test</h2>
          <p>Score: {result.score}</p>
          <p>Niveau: {result.level}</p>

          <div>
            <p className="font-medium">Forces</p>
            <ul className="list-disc ml-4">
              {result.strengths.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-medium">Faiblesses</p>
            <ul className="list-disc ml-4">
              {result.weaknesses.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <p>Aucun résultat disponible</p>
      )}
    </div>
  )
}