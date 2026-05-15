import Link from "next/link"
import {
  BriefcaseBusiness,
  ClipboardList,
  Sparkles,
  Users,
} from "lucide-react"
import { PageHeader } from "@/components/layout/page-header"

export default function Page() {
  const cards = [
    {
      title: "Utilisateurs",
      description: "Comptes, rôles, abonnements et vérification email.",
      href: "/dashboard/users",
      icon: Users,
    },
    {
      title: "Métiers",
      description: "Référentiel des fiches métier et statuts de publication.",
      href: "/dashboard/jobs",
      icon: BriefcaseBusiness,
    },
    {
      title: "Personnalité",
      description: "Versions du test, questions et activation.",
      href: "/dashboard/personality",
      icon: Sparkles,
    },
    {
      title: "Bilan",
      description: "Versions et questions du bilan de compétences.",
      href: "/dashboard/bilan",
      icon: ClipboardList,
    },
  ]

  return (
    <>
      <PageHeader
        title="Vue d'ensemble"
        description="Accès rapide aux espaces d'administration Matcha."
      />
      <main className="grid gap-4 p-4 md:grid-cols-2 md:p-6 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="matcha-card p-5 text-card-foreground transition hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_16px_34px_rgba(13,21,32,0.1)]"
          >
            <div className="mb-4 flex size-10 items-center justify-center rounded-2xl bg-accent text-primary">
              <card.icon className="size-5" />
            </div>
            <h2 className="text-lg font-bold">{card.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {card.description}
            </p>
          </Link>
        ))}
      </main>
    </>
  )
}
