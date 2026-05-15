"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const API_URL = process.env.NEXT_PUBLIC_API_URL

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setLoading(true)
  setError("")

    try {
      const res = await fetch(`${API_URL}/api/admin/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Email ou mot de passe incorrect")
        return
      }

      localStorage.setItem("token", data.token)

      router.push("/dashboard/users")
    } catch {
      setError("Erreur serveur")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* Titre */}
      <div className="space-y-2 text-center">
        <h2 className="text-xl font-semibold">Connexion Admin</h2>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">

        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          type="submit"
          disabled={loading}
          className="w-full"
        >
          {loading ? "Connexion..." : "Connexion"}
        </Button>

        {error && (
          <p className="text-sm text-red-500 text-center">
            {error}
          </p>
        )}
      </form>

      {/* Liens */}
      <div className="text-sm text-center space-y-2">
        <p>
          Besoin d’un compte ?{" "}
          <span className="text-green-600 cursor-pointer">
            S’inscrire
          </span>
        </p>

        <p>
          Mot de passe oublié ?{" "}
          <span className="text-green-600 cursor-pointer">
            Cliquez ici
          </span>
        </p>
      </div>

    </div>
  )
}