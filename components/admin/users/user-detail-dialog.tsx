import { Shield } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { AdminUserDetail } from "@/types/admin"

type UserDetailDialogProps = {
  detail: AdminUserDetail | null
  onClose: () => void
}

export function UserDetailDialog({ detail, onClose }: UserDetailDialogProps) {
  const detailName = detail
    ? [detail.user.firstName, detail.user.lastName].filter(Boolean).join(" ") ||
      "Sans nom"
    : ""

  return (
    <Dialog open={!!detail} onOpenChange={(open) => !open && onClose()}>
      {detail && (
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="size-4" />
              {detailName}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-5 lg:grid-cols-[minmax(380px,1fr)_260px]">
            <section className="space-y-4">
              <ProfilePanel detail={detail} />
              <PersonalityTestsPanel detail={detail} />
              <BilansPanel detail={detail} />
            </section>

            <aside className="space-y-3">
              <MetricCard label="Swipes" value={detail.swipes.total} />
              <MetricCard label="Likes" value={detail.swipes.likes} />
              <MetricCard label="Dislikes" value={detail.swipes.dislikes} />
            </aside>
          </div>
        </DialogContent>
      )}
    </Dialog>
  )
}

function ProfilePanel({ detail }: { detail: AdminUserDetail }) {
  return (
    <div className="rounded-2xl bg-accent/45 p-4">
      <h3 className="font-semibold">Profil</h3>
      <dl className="mt-3 grid min-w-0 gap-x-5 gap-y-3 text-sm sm:grid-cols-2">
        <ProfileItem label="Email" value={detail.user.email} wide />
        <ProfileItem label="Rôle" value={detail.user.role} />
        <ProfileItem label="Abonnement" value={detail.user.subscription} />
        <ProfileItem label="Préférence lieu" value={detail.user.locationPref ?? "-"} />
        <ProfileItem
          label="Types de métiers"
          value={detail.user.jobTypes?.join(", ") || "-"}
          wide
        />
        <ProfileItem
          label="Email vérifié"
          value={detail.user.isEmailVerified ? "Oui" : "Non"}
        />
      </dl>
    </div>
  )
}

function ProfileItem({
  label,
  value,
  wide,
}: {
  label: string
  value: string
  wide?: boolean
}) {
  return (
    <div className={wide ? "min-w-0 sm:col-span-2" : "min-w-0"}>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="break-normal text-foreground [overflow-wrap:anywhere]">
        {value}
      </dd>
    </div>
  )
}

function PersonalityTestsPanel({ detail }: { detail: AdminUserDetail }) {
  return (
    <div className="rounded-2xl bg-accent/45 p-4">
      <h3 className="font-semibold">Tests personnalité</h3>
      <div className="mt-3 space-y-3">
        {detail.personalityTests.map((test) => (
          <div key={test.id} className="rounded-xl bg-white/65 p-3 text-sm">
            <p className="font-medium">
              {test.type} · {test.result}
            </p>
            <p className="text-muted-foreground">
              Version {test.templateVersion}
            </p>
          </div>
        ))}
        {detail.personalityTests.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucun test terminé.</p>
        )}
      </div>
    </div>
  )
}

function BilansPanel({ detail }: { detail: AdminUserDetail }) {
  return (
    <div className="rounded-2xl bg-accent/45 p-4">
      <h3 className="font-semibold">Bilans</h3>
      <div className="mt-3 space-y-3">
        {detail.bilans.map((bilan) => (
          <div key={bilan.id} className="rounded-xl bg-white/65 p-3 text-sm">
            <p className="font-medium">
              Version {bilan.version} · {bilan.archetype?.title ?? "Bilan"}
            </p>
            {bilan.profileSummary && (
              <p className="mt-1 text-muted-foreground">
                {bilan.profileSummary}
              </p>
            )}
          </div>
        ))}
        {detail.bilans.length === 0 && (
          <p className="text-sm text-muted-foreground">Aucun bilan généré.</p>
        )}
      </div>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="matcha-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  )
}
